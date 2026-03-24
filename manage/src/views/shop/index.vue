<template>
  <div class="shop-list-container">
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="search-form-content">
        <el-form-item label="物品类型">
          <el-select v-model="searchForm.itemType" placeholder="请选择类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="闯关门票" value="ticket" />
            <el-option label="道具" value="prop" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入物品名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增物品</el-button>
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
      <el-table-column prop="id" label="物品ID" width="120" />
      <el-table-column label="物品图片" width="80">
        <template #default="{ row }">
          <el-image :src="row.image" style="width: 40px; height: 40px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="物品名称" min-width="150" />
      <el-table-column prop="itemType" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getItemTypeTag(row.itemType)">
            {{ getItemTypeText(row.itemType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100">
        <template #default="{ row }">
          <span style="color: #FAAD14">{{ row.price }} 金币</span>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="sold" label="已售" width="100" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '上架' : '下架' }}
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
            v-if="row.status === 1"
            type="warning"
            link
            @click="handleToggleStatus(row)"
          >
            下架
          </el-button>
          <el-button
            v-else
            type="success"
            link
            @click="handleToggleStatus(row)"
          >
            上架
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
    
    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑物品' : '新增物品'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="物品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入物品名称" />
        </el-form-item>
        <el-form-item label="物品类型" prop="itemType">
          <el-select v-model="form.itemType" placeholder="请选择物品类型" style="width: 100%">
            <el-option label="闯关门票" value="ticket" />
            <el-option label="道具" value="prop" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :max="10000" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="物品图片" prop="image">
          <el-upload
            v-model:file-list="imageList"
            :auto-upload="false"
            list-type="picture-card"
            :limit="1"
            :on-preview="handlePicturePreview"
            :on-remove="handleRemoveImage"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="previewVisible" title="图片预览">
            <img :src="previewImage" style="width: 100%" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="物品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入物品描述"
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
import { shopApi } from '@/api/shop'
import { formatDate } from '@/utils/format'

const loading = ref(false)
const submitting = ref(false)
const editDialogVisible = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const isEdit = ref(false)
const tableData = ref<any[]>([])
const imageList = ref<any[]>([])
const formRef = ref()

const searchForm = reactive({
  itemType: '',
  status: '',
  keyword: ''
})

const form = reactive({
  id: '',
  name: '',
  itemType: 'ticket',
  price: 100,
  stock: 100,
  image: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
  itemType: [{ required: true, message: '请选择物品类型', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const loadShopList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      itemType: searchForm.itemType || undefined,
      status: searchForm.status !== '' ? parseInt(searchForm.status) : undefined,
      keyword: searchForm.keyword || undefined
    }
    const result = await shopApi.getList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    console.error('加载商店列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadShopList()
}

const handleReset = () => {
  searchForm.itemType = ''
  searchForm.status = ''
  searchForm.keyword = ''
  pagination.page = 1
  loadShopList()
}

const handleAdd = () => {
  isEdit.value = false
  form.id = ''
  form.name = ''
  form.itemType = 'ticket'
  form.price = 100
  form.stock = 100
  form.image = ''
  form.description = ''
  imageList.value = []
  editDialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.itemType = row.itemType
  form.price = row.price
  form.stock = row.stock
  form.image = row.image || ''
  form.description = row.description || ''
  
  if (form.image) {
    imageList.value = [{ name: 'image', url: form.image }]
  } else {
    imageList.value = []
  }
  
  editDialogVisible.value = true
}

const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '上架' : '下架'
  
  try {
    await ElMessageBox.confirm(`确定要${action}该物品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await shopApi.update({ id: row.id, status: newStatus })
    ElMessage.success(`${action}成功`)
    loadShopList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${action}失败:`, error)
      ElMessage.error(`${action}失败`)
    }
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该物品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await shopApi.delete(row.id)
    ElMessage.success('删除成功')
    loadShopList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handlePicturePreview = (file: any) => {
  previewImage.value = file.url
  previewVisible.value = true
}

const handleRemoveImage = () => {
  form.image = ''
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = {
          ...form,
          image: imageList.value[0]?.url || ''
        }
        
        if (isEdit.value) {
          await shopApi.update(data)
          ElMessage.success('保存成功')
        } else {
          await shopApi.create(data)
          ElMessage.success('创建成功')
        }
        
        editDialogVisible.value = false
        loadShopList()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const getItemTypeText = (type: string) => {
  const map: any = {
    ticket: '闯关门票',
    prop: '道具'
  }
  return map[type] || type
}

const getItemTypeTag = (type: string) => {
  const map: any = {
    ticket: 'primary',
    prop: 'success'
  }
  return map[type] || ''
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadShopList()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadShopList()
}

onMounted(() => {
  loadShopList()
})
</script>

<style scoped lang="scss">
.shop-list-container {
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
