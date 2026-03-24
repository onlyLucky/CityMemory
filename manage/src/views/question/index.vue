<template>
  <div class="question-list-container">
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
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已发布" value="published" />
            <el-option label="已下架" value="unpublished" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增题目</el-button>
          <el-button type="warning" @click="handleImport">批量导入</el-button>
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
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTag(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button
            v-if="row.status === 'pending'"
            type="success"
            link
            @click="handleAudit(row)"
          >
            审核
          </el-button>
          <el-button
            v-if="row.status === 'published'"
            type="warning"
            link
            @click="handleUnpublish(row)"
          >
            下架
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="table-footer">
      <el-button type="primary" @click="handleBatchPublish" :loading="batchPublishing">
        批量发布
      </el-button>
      <el-button type="danger" @click="handleBatchDelete" :loading="batchDeleting">
        批量删除
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
    
    <el-dialog v-model="importDialogVisible" title="批量导入题目" width="600px">
      <el-upload
        drag
        :auto-upload="false"
        :on-change="handleFileChange"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            仅支持 .xlsx/.xls 文件，请下载模板后填写
          </div>
        </template>
      </el-upload>
      <div class="download-template">
        <el-button type="primary" link @click="handleDownloadTemplate">
          <el-icon><Download /></el-icon>
          下载导入模板
        </el-button>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit" :loading="importing">确定导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { questionApi } from '@/api/question'
import { formatDate } from '@/utils/format'

const router = useRouter()

const loading = ref(false)
const batchPublishing = ref(false)
const batchDeleting = ref(false)
const importing = ref(false)
const importDialogVisible = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])
const importFile = ref<File | null>(null)

const searchForm = reactive({
  questionType: '',
  difficulty: '',
  region: '',
  status: '',
  keyword: ''
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
      status: searchForm.status || undefined,
      keyword: searchForm.keyword || undefined
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
  searchForm.status = ''
  searchForm.keyword = ''
  pagination.page = 1
  loadQuestionList()
}

const handleAdd = () => {
  router.push('/question/edit')
}

const handleEdit = (row: any) => {
  router.push(`/question/edit/${row.id}`)
}

const handleAudit = (row: any) => {
  router.push(`/question-audit`)
}

const handleUnpublish = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要下架该题目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await questionApi.update({ id: row.id, status: 'unpublished' })
    ElMessage.success('下架成功')
    loadQuestionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('下架失败:', error)
      ElMessage.error('下架失败')
    }
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该题目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await questionApi.delete(row.id)
    ElMessage.success('删除成功')
    loadQuestionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleBatchPublish = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要发布的题目')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要发布选中的 ${selectedRows.value.length} 道题目吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    batchPublishing.value = true
    const ids = selectedRows.value.map(row => row.id)
    await questionApi.batchPublish(ids)
    ElMessage.success('批量发布成功')
    loadQuestionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量发布失败:', error)
      ElMessage.error('批量发布失败')
    }
  } finally {
    batchPublishing.value = false
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的题目')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 道题目吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    batchDeleting.value = true
    const ids = selectedRows.value.map(row => row.id)
    await Promise.all(ids.map(id => questionApi.delete(id)))
    ElMessage.success('批量删除成功')
    loadQuestionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  } finally {
    batchDeleting.value = false
  }
}

const handleImport = () => {
  importDialogVisible.value = true
}

const handleFileChange = (file: any) => {
  importFile.value = file.raw
}

const handleDownloadTemplate = () => {
  ElMessage.info('模板下载功能开发中')
}

const handleImportSubmit = async () => {
  if (!importFile.value) {
    ElMessage.warning('请先选择要导入的文件')
    return
  }
  
  importing.value = true
  try {
    await questionApi.import(importFile.value)
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    loadQuestionList()
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
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

const getStatusText = (status: string) => {
  const map: any = {
    pending: '待审核',
    published: '已发布',
    unpublished: '已下架'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: any = {
    pending: 'warning',
    published: 'success',
    unpublished: 'info'
  }
  return map[status] || ''
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
.question-list-container {
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
  
  .download-template {
    margin-top: $spacing-md;
    text-align: center;
  }
}
</style>
