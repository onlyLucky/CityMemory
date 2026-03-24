<template>
  <div class="level-list-container">
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="search-form-content">
        <el-form-item label="区域">
          <el-select v-model="searchForm.region" placeholder="请选择区域" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="region in regions" :key="region" :label="region" :value="region" />
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
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="已下架" value="unpublished" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关卡名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增关卡</el-button>
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
      <el-table-column prop="id" label="关卡ID" width="120" />
      <el-table-column prop="name" label="关卡名称" min-width="200" />
      <el-table-column prop="region" label="区域" width="100" />
      <el-table-column prop="difficulty" label="难度" width="80">
        <template #default="{ row }">
          <el-tag :type="getDifficultyTag(row.difficulty)">
            {{ getDifficultyText(row.difficulty) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="questionCount" label="题目数量" width="100" />
      <el-table-column prop="starReward" label="星星奖励" width="100">
        <template #default="{ row }">
          <span style="color: #FAAD14">{{ row.starReward }}</span>
        </template>
      </el-table-column>
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
    
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑关卡' : '新增关卡'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="关卡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入关卡名称" />
        </el-form-item>
        <el-form-item label="区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择区域" style="width: 100%">
            <el-option v-for="region in regions" :key="region" :label="region" :value="region" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" placeholder="请选择难度" style="width: 100%">
            <el-option label="简单" :value="1" />
            <el-option label="中等" :value="2" />
            <el-option label="困难" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="星星奖励" prop="starReward">
          <el-input-number v-model="form.starReward" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="关卡描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入关卡描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { levelApi } from '@/api/level'
import { formatDate } from '@/utils/format'

const loading = ref(false)
const submitting = ref(false)
const editDialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<any[]>([])
const formRef = ref()

const searchForm = reactive({
  region: '',
  difficulty: '',
  status: '',
  keyword: ''
})

const form = reactive({
  id: '',
  name: '',
  region: '',
  difficulty: 1,
  starReward: 10,
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入关卡名称', trigger: 'blur' }],
  region: [{ required: true, message: '请选择区域', trigger: 'change' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
  starReward: [{ required: true, message: '请输入星星奖励', trigger: 'blur' }]
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const regions = ['北京', '上海', '广东', '江苏', '浙江', '四川', '湖北', '湖南', '山东', '河南']

const loadLevelList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      region: searchForm.region || undefined,
      difficulty: searchForm.difficulty ? parseInt(searchForm.difficulty) : undefined,
      status: searchForm.status || undefined,
      keyword: searchForm.keyword || undefined
    }
    const result = await levelApi.getList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    console.error('加载关卡列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadLevelList()
}

const handleReset = () => {
  searchForm.region = ''
  searchForm.difficulty = ''
  searchForm.status = ''
  searchForm.keyword = ''
  pagination.page = 1
  loadLevelList()
}

const handleAdd = () => {
  isEdit.value = false
  form.id = ''
  form.name = ''
  form.region = ''
  form.difficulty = 1
  form.starReward = 10
  form.description = ''
  editDialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.region = row.region
  form.difficulty = row.difficulty
  form.starReward = row.starReward
  form.description = row.description || ''
  editDialogVisible.value = true
}

const handleUnpublish = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要下架该关卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await levelApi.update({ id: row.id, status: 'unpublished' })
    ElMessage.success('下架成功')
    loadLevelList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('下架失败:', error)
      ElMessage.error('下架失败')
    }
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该关卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await levelApi.delete(row.id)
    ElMessage.success('删除成功')
    loadLevelList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (isEdit.value) {
          await levelApi.update(form)
          ElMessage.success('保存成功')
        } else {
          await levelApi.create(form)
          ElMessage.success('创建成功')
        }
        editDialogVisible.value = false
        loadLevelList()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        submitting.value = false
      }
    }
  })
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
    published: '已发布',
    unpublished: '已下架'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: any = {
    published: 'success',
    unpublished: 'info'
  }
  return map[status] || ''
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadLevelList()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadLevelList()
}

onMounted(() => {
  loadLevelList()
})
</script>

<style scoped lang="scss">
.level-list-container {
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
  
  .pagination {
    margin-top: $spacing-lg;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
