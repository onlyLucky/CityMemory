<template>
  <div class="user-list-container">
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="search-form-content">
        <el-form-item label="昵称">
          <el-input v-model="searchForm.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="省份">
          <el-select v-model="searchForm.province" placeholder="请选择省份" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="province in provinces" :key="province" :label="province" :value="province" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="星星数">
          <el-input-number v-model="searchForm.minStars" :min="0" placeholder="最小" controls-position="right" />
          <span style="margin: 0 8px">-</span>
          <el-input-number v-model="searchForm.maxStars" :min="0" placeholder="最大" controls-position="right" />
        </el-form-item>
        <el-form-item label="关卡数">
          <el-input-number v-model="searchForm.minLevels" :min="0" placeholder="最小" controls-position="right" />
          <span style="margin: 0 8px">-</span>
          <el-input-number v-model="searchForm.maxLevels" :min="0" placeholder="最大" controls-position="right" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="用户ID" width="120" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="province" label="省份" width="100" />
        <el-table-column prop="totalStars" label="星星数" width="100" sortable>
          <template #default="{ row }">
            <span style="color: #FAAD14">{{ formatStars(row.totalStars) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="levelCount" label="关卡数" width="100" sortable />
        <el-table-column prop="coins" label="金币数" width="100" />
        <el-table-column prop="createdAt" label="注册时间" width="180" sortable>
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="table-footer">
        <el-button type="primary" @click="handleExport" :loading="exporting">导出数据</el-button>
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'
import { formatDate, formatStars } from '@/utils/format'

const router = useRouter()

const loading = ref(false)
const exporting = ref(false)
const tableData = ref<any[]>([])
const searchForm = reactive({
  nickname: '',
  province: '',
  dateRange: null as any,
  minStars: undefined as number | undefined,
  maxStars: undefined as number | undefined,
  minLevels: undefined as number | undefined,
  maxLevels: undefined as number | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const provinces = ['北京', '上海', '广东', '江苏', '浙江', '四川', '湖北', '湖南', '山东', '河南']

const loadUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      nickname: searchForm.nickname || undefined,
      province: searchForm.province || undefined,
      minStars: searchForm.minStars,
      maxStars: searchForm.maxStars,
      minLevels: searchForm.minLevels,
      maxLevels: searchForm.maxLevels
    }
    const result = await userApi.getList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    console.error('加载用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadUserList()
}

const handleReset = () => {
  searchForm.nickname = ''
  searchForm.province = ''
  searchForm.dateRange = null
  searchForm.minStars = undefined
  searchForm.maxStars = undefined
  searchForm.minLevels = undefined
  searchForm.maxLevels = undefined
  pagination.page = 1
  loadUserList()
}

const handleViewDetail = (id: string) => {
  router.push(`/user/detail/${id}`)
}

const handleExport = async () => {
  exporting.value = true
  try {
    const params = {
      page: 1,
      pageSize: 10000,
      nickname: searchForm.nickname || undefined,
      province: searchForm.province || undefined,
      minStars: searchForm.minStars,
      maxStars: searchForm.maxStars,
      minLevels: searchForm.minLevels,
      maxLevels: searchForm.maxLevels
    }
    const blob = await userApi.exportData(params)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `用户数据_${new Date().getTime()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

const handleSortChange = ({ prop, order }: any) => {
  console.log('排序:', prop, order)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadUserList()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadUserList()
}

onMounted(() => {
  loadUserList()
})
</script>

<style scoped lang="scss">
.user-list-container {
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
  
  .table-container {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .table-footer {
      margin-top: $spacing-md;
      text-align: right;
    }
  }
  
  .pagination {
    margin-top: $spacing-lg;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
