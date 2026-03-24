<template>
  <div class="feedback-list-container">
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="search-form-content">
        <el-form-item label="反馈类型">
          <el-select v-model="searchForm.feedbackType" placeholder="请选择类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="建议" value="suggestion" />
            <el-option label="bug" value="bug" />
            <el-option label="投诉" value="complaint" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="已处理" value="processed" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="searchForm.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="id" label="反馈ID" width="120" />
      <el-table-column label="用户" width="150">
        <template #default="{ row }">
          <div class="user-cell">
            <el-avatar :src="row.avatar" :size="32" />
            <span class="nickname">{{ row.nickname }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="feedbackType" label="反馈类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getFeedbackTypeTag(row.feedbackType)">
            {{ getFeedbackTypeText(row.feedbackType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="反馈内容" min-width="200">
        <template #default="{ row }">
          <div class="content-cell">{{ row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处理状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTag(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="提交时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'pending'"
            type="primary"
            link
            @click="handleProcess(row)"
          >
            处理
          </el-button>
          <el-button
            v-if="row.status === 'processed'"
            type="primary"
            link
            @click="handleReply(row)"
          >
            回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      class="pagination"
    />
    
    <el-dialog v-model="dialogVisible" title="处理反馈" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="处理状态">
          <el-select v-model="form.status">
            <el-option label="已处理" value="processed" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input
            v-model="form.reply"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { feedbackApi } from '@/api/feedback'
import { formatDate } from '@/utils/format'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const tableData = ref<any[]>([])
const currentFeedback = ref<any>(null)

const searchForm = reactive({
  feedbackType: '',
  status: '',
  nickname: ''
})

const form = reactive({
  id: '',
  status: 'processed',
  reply: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const loadFeedbackList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      feedbackType: searchForm.feedbackType || undefined,
      status: searchForm.status || undefined,
      nickname: searchForm.nickname || undefined
    }
    const result = await feedbackApi.getList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    console.error('加载反馈列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadFeedbackList()
}

const handleReset = () => {
  searchForm.feedbackType = ''
  searchForm.status = ''
  searchForm.nickname = ''
  pagination.page = 1
  loadFeedbackList()
}

const handleProcess = (row: any) => {
  currentFeedback.value = row
  form.id = row.id
  form.status = 'processed'
  form.reply = row.reply || ''
  dialogVisible.value = true
}

const handleReply = (row: any) => {
  currentFeedback.value = row
  form.id = row.id
  form.status = row.status
  form.reply = row.reply || ''
  dialogVisible.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    await feedbackApi.update({
      id: form.id,
      status: form.status,
      reply: form.reply
    })
    ElMessage.success('处理成功')
    dialogVisible.value = false
    loadFeedbackList()
  } catch (error) {
    console.error('处理失败:', error)
    ElMessage.error('处理失败')
  } finally {
    submitting.value = false
  }
}

const getFeedbackTypeText = (type: string) => {
  const map: any = {
    suggestion: '建议',
    bug: 'bug',
    complaint: '投诉',
    other: '其他'
  }
  return map[type] || type
}

const getFeedbackTypeTag = (type: string) => {
  const map: any = {
    suggestion: 'info',
    bug: 'danger',
    complaint: 'warning',
    other: ''
  }
  return map[type] || ''
}

const getStatusText = (status: string) => {
  const map: any = {
    pending: '待处理',
    processed: '已处理',
    closed: '已关闭'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: any = {
    pending: 'warning',
    processed: 'success',
    closed: 'info'
  }
  return map[status] || ''
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadFeedbackList()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadFeedbackList()
}

onMounted(() => {
  loadFeedbackList()
})
</script>

<style scoped lang="scss">
.feedback-list-container {
  padding: $spacing-lg;
  
  .search-form {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .search-form-content {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  
  .user-cell {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    .nickname {
      font-size: $font-size-sm;
      color: $text-primary;
    }
  }
  
  .content-cell {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .pagination {
    margin-top: $spacing-lg;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
