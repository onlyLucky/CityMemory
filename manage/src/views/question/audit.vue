<template>
  <div class="question-audit-container">
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="search-form-content">
        <el-form-item label="题目类型">
          <el-select v-model="searchForm.questionType" placeholder="请选择类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="boolean" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="searchForm.difficulty" placeholder="请选择难度" clearable>
            <el-option label="全部" value="" />
            <el-option label="简单" :value="1" />
            <el-option label="中等" :value="2" />
            <el-option label="困难" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域">
          <el-select v-model="searchForm.region" placeholder="请选择区域" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="region in regions" :key="region" :label="region" :value="region" />
          </el-select>
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
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="题目ID" width="120" />
      <el-table-column prop="questionType" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getQuestionTypeTag(row.questionType)">
            {{ getQuestionTypeText(row.questionType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="题目内容" min-width="250">
        <template #default="{ row }">
          <div class="content-cell">{{ row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="difficulty" label="难度" width="80">
        <template #default="{ row }">
          <el-tag :type="getDifficultyTag(row.difficulty)">
            {{ getDifficultyText(row.difficulty) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="region" label="区域" width="100" />
      <el-table-column prop="createdAt" label="提交时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAudit(row)">审核</el-button>
          <el-button type="danger" link @click="handleReject(row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="table-footer">
      <el-button type="success" @click="handleBatchApprove" :loading="batchApproving">
        批量通过
      </el-button>
      <el-button type="danger" @click="handleBatchReject" :loading="batchRejecting">
        批量驳回
      </el-button>
    </div>
    
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
    
    <el-dialog v-model="auditDialogVisible" title="审核题目" width="800px">
      <div class="audit-content">
        <div class="question-detail">
          <div class="detail-item">
            <span class="label">题目类型：</span>
            <span class="value">{{ getQuestionTypeText(currentQuestion?.questionType) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">难度：</span>
            <span class="value">{{ getDifficultyText(currentQuestion?.difficulty) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">区域：</span>
            <span class="value">{{ currentQuestion?.region }}</span>
          </div>
          <div class="detail-item">
            <span class="label">题目内容：</span>
            <div class="value content">{{ currentQuestion?.content }}</div>
          </div>
          <div v-if="currentQuestion?.image" class="detail-item">
            <span class="label">题目图片：</span>
            <el-image :src="currentQuestion.image" style="width: 200px" :preview-src-list="[currentQuestion.image]" />
          </div>
          <div v-if="currentQuestion?.questionType !== 'boolean'" class="detail-item">
            <span class="label">选项：</span>
            <div class="value options">
              <div v-for="(option, index) in currentQuestion?.options" :key="index" class="option">
                <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
                <span class="option-content">{{ option.content }}</span>
                <el-tag v-if="option.isCorrect" type="success" size="small">正确答案</el-tag>
              </div>
            </div>
          </div>
          <div v-if="currentQuestion?.questionType === 'boolean'" class="detail-item">
            <span class="label">正确答案：</span>
            <span class="value">{{ currentQuestion?.isCorrect ? '正确' : '错误' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">答案解析：</span>
            <div class="value content">{{ currentQuestion?.explanation || '无' }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleRejectSubmit" :loading="submitting">驳回</el-button>
        <el-button type="success" @click="handleApproveSubmit" :loading="submitting">通过</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { questionApi } from '@/api/question'
import { formatDate } from '@/utils/format'

const loading = ref(false)
const batchApproving = ref(false)
const batchRejecting = ref(false)
const submitting = ref(false)
const auditDialogVisible = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])
const currentQuestion = ref<any>(null)

const searchForm = reactive({
  questionType: '',
  difficulty: '',
  region: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const regions = ['北京', '上海', '广东', '江苏', '浙江', '四川', '湖北', '湖南', '山东', '河南']

const loadQuestionList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      questionType: searchForm.questionType || undefined,
      difficulty: searchForm.difficulty ? parseInt(searchForm.difficulty) : undefined,
      region: searchForm.region || undefined,
      status: 'pending'
    }
    const result = await questionApi.getList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    console.error('加载题目列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadQuestionList()
}

const handleReset = () => {
  searchForm.questionType = ''
  searchForm.difficulty = ''
  searchForm.region = ''
  pagination.page = 1
  loadQuestionList()
}

const handleAudit = (row: any) => {
  currentQuestion.value = row
  auditDialogVisible.value = true
}

const handleReject = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要驳回该题目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await questionApi.update({ id: row.id, status: 'rejected' })
    ElMessage.success('驳回成功')
    loadQuestionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('驳回失败:', error)
      ElMessage.error('驳回失败')
    }
  }
}

const handleBatchApprove = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要通过的题目')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要通过选中的 ${selectedRows.value.length} 道题目吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    batchApproving.value = true
    const ids = selectedRows.value.map(row => row.id)
    await questionApi.batchPublish(ids)
    ElMessage.success('批量通过成功')
    loadQuestionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量通过失败:', error)
      ElMessage.error('批量通过失败')
    }
  } finally {
    batchApproving.value = false
  }
}

const handleBatchReject = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要驳回的题目')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要驳回选中的 ${selectedRows.value.length} 道题目吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    batchRejecting.value = true
    const ids = selectedRows.value.map(row => row.id)
    await Promise.all(ids.map(id => questionApi.update({ id, status: 'rejected' })))
    ElMessage.success('批量驳回成功')
    loadQuestionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量驳回失败:', error)
      ElMessage.error('批量驳回失败')
    }
  } finally {
    batchRejecting.value = false
  }
}

const handleApproveSubmit = async () => {
  submitting.value = true
  try {
    await questionApi.update({ id: currentQuestion.value.id, status: 'published' })
    ElMessage.success('审核通过')
    auditDialogVisible.value = false
    loadQuestionList()
  } catch (error) {
    console.error('审核失败:', error)
    ElMessage.error('审核失败')
  } finally {
    submitting.value = false
  }
}

const handleRejectSubmit = async () => {
  submitting.value = true
  try {
    await questionApi.update({ id: currentQuestion.value.id, status: 'rejected' })
    ElMessage.success('已驳回')
    auditDialogVisible.value = false
    loadQuestionList()
  } catch (error) {
    console.error('驳回失败:', error)
    ElMessage.error('驳回失败')
  } finally {
    submitting.value = false
  }
}

const getQuestionTypeText = (type: string) => {
  const map: any = {
    single: '单选题',
    multiple: '多选题',
    boolean: '判断题'
  }
  return map[type] || type
}

const getQuestionTypeTag = (type: string) => {
  const map: any = {
    single: 'primary',
    multiple: 'success',
    boolean: 'warning'
  }
  return map[type] || ''
}

const getDifficultyText = (difficulty: number) => {
  const map: any = {
    1: '简单',
    2: '中等',
    3: '困难'
  }
  return map[difficulty] || difficulty
}

const getDifficultyTag = (difficulty: number) => {
  const map: any = {
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return map[difficulty] || ''
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadQuestionList()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadQuestionList()
}

onMounted(() => {
  loadQuestionList()
})
</script>

<style scoped lang="scss">
.question-audit-container {
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
  
  .content-cell {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .table-footer {
    margin-top: $spacing-md;
    text-align: right;
  }
  
  .pagination {
    margin-top: $spacing-lg;
    display: flex;
    justify-content: flex-end;
  }
  
  .audit-content {
    .question-detail {
      .detail-item {
        margin-bottom: $spacing-md;
        
        .label {
          font-weight: 500;
          color: $text-primary;
          margin-right: $spacing-sm;
        }
        
        .value {
          color: $text-secondary;
          
          &.content {
            display: block;
            margin-top: $spacing-xs;
            padding: $spacing-sm;
            background: $background-color;
            border-radius: $radius-sm;
          }
          
          &.options {
            .option {
              display: flex;
              align-items: center;
              gap: $spacing-sm;
              padding: $spacing-xs 0;
              
              .option-label {
                font-weight: 500;
              }
              
              .option-content {
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>
