<template>
  <div class="rank-list-container">
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="search-form-content">
        <el-form-item label="排行榜类型">
          <el-select v-model="searchForm.rankType" placeholder="请选择类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="星星榜" value="stars" />
            <el-option label="关卡榜" value="levels" />
            <el-option label="答题榜" value="questions" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-select v-model="searchForm.timeRange" placeholder="请选择时间范围" clearable>
            <el-option label="全部" value="" />
            <el-option label="今日" value="today" />
            <el-option label="本周" value="week" />
            <el-option label="本月" value="month" />
            <el-option label="全部时间" value="all" />
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
          <el-button type="success" @click="handleRefresh" :loading="refreshing">刷新数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="my-rank-card" v-if="myRank">
      <div class="rank-info">
        <div class="rank-label">我的排名</div>
        <div class="rank-value" :class="getRankClass(myRank.rank)">
          {{ myRank.rank }}
        </div>
      </div>
      <div class="rank-value-info">
        <div class="value-label">{{ getValueLabel(searchForm.rankType) }}</div>
        <div class="value-number">{{ myRank.value }}</div>
      </div>
    </div>
    
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column label="排名" width="100">
        <template #default="{ row }">
          <div class="rank-badge" :class="getRankClass(row.rank)">
            <el-icon v-if="row.rank <= 3" class="trophy-icon">
              <Trophy />
            </el-icon>
            <span>{{ row.rank }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="200">
        <template #default="{ row }">
          <div class="user-cell">
            <el-avatar :src="row.avatar" :size="40" />
            <div class="user-info">
              <div class="nickname">{{ row.nickname }}</div>
              <div class="region">{{ row.province }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="数值" width="150">
        <template #default="{ row }">
          <span class="value-number">{{ row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalStars" label="总星星" width="120">
        <template #default="{ row }">
          <span style="color: #FAAD14">{{ row.totalStars }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="levelCount" label="关卡数" width="100" />
      <el-table-column prop="totalQuestions" label="答题数" width="100" />
      <el-table-column prop="correctRate" label="正确率" width="100">
        <template #default="{ row }">
          {{ formatPercent(row.correctRate) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleViewDetail(row)">详情</el-button>
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
    
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="800px">
      <div v-if="currentUser" class="user-detail">
        <div class="detail-header">
          <el-avatar :src="currentUser.avatar" :size="80" />
          <div class="header-info">
            <h3 class="nickname">{{ currentUser.nickname }}</h3>
            <div class="info-item">
              <span class="label">用户ID：</span>
              <span class="value">{{ currentUser.userId }}</span>
            </div>
            <div class="info-item">
              <span class="label">省份：</span>
              <span class="value">{{ currentUser.province }}</span>
            </div>
          </div>
        </div>
        
        <el-divider />
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">排名</div>
            <div class="stat-value" :class="getRankClass(currentUser.rank)">
              {{ currentUser.rank }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">总星星</div>
            <div class="stat-value">{{ currentUser.totalStars }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">关卡数</div>
            <div class="stat-value">{{ currentUser.levelCount }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">答题数</div>
            <div class="stat-value">{{ currentUser.totalQuestions }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">正确率</div>
            <div class="stat-value">{{ formatPercent(currentUser.correctRate) }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">金币数</div>
            <div class="stat-value">{{ currentUser.coins }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { rankApi } from '@/api/rank'
import { formatPercent } from '@/utils/format'

const loading = ref(false)
const refreshing = ref(false)
const detailDialogVisible = ref(false)
const tableData = ref<any[]>([])
const myRank = ref<any>(null)
const currentUser = ref<any>(null)

const searchForm = reactive({
  rankType: 'stars',
  timeRange: 'all',
  region: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const regions = ['北京', '上海', '广东', '江苏', '浙江', '四川', '湖北', '湖南', '山东', '河南']

const loadRankList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      rankType: searchForm.rankType || undefined,
      timeRange: searchForm.timeRange || undefined,
      region: searchForm.region || undefined
    }
    const result = await rankApi.getList(params)
    tableData.value = result.list
    pagination.total = result.total
    myRank.value = result.myRank
  } catch (error) {
    console.error('加载排行榜失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadRankList()
}

const handleReset = () => {
  searchForm.rankType = 'stars'
  searchForm.timeRange = 'all'
  searchForm.region = ''
  pagination.page = 1
  loadRankList()
}

const handleRefresh = async () => {
  refreshing.value = true
  try {
    await loadRankList()
    ElMessage.success('刷新成功')
  } catch (error) {
    console.error('刷新失败:', error)
    ElMessage.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

const handleViewDetail = (row: any) => {
  currentUser.value = row
  detailDialogVisible.value = true
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-1'
  if (rank === 2) return 'rank-2'
  if (rank === 3) return 'rank-3'
  return ''
}

const getValueLabel = (rankType: string) => {
  const map: any = {
    stars: '星星数',
    levels: '关卡数',
    questions: '答题数'
  }
  return map[rankType] || '数值'
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadRankList()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadRankList()
}

onMounted(() => {
  loadRankList()
})
</script>

<style scoped lang="scss">
.rank-list-container {
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
  
  .my-rank-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    
    .rank-info {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      
      .rank-label {
        font-size: $font-size-sm;
        opacity: 0.9;
      }
      
      .rank-value {
        font-size: 36px;
        font-weight: bold;
      }
    }
    
    .rank-value-info {
      text-align: right;
      
      .value-label {
        font-size: $font-size-sm;
        opacity: 0.9;
      }
      
      .value-number {
        font-size: 28px;
        font-weight: bold;
      }
    }
  }
  
  .rank-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    font-weight: 500;
    
    &.rank-1 {
      color: #FFD700;
      font-size: 20px;
      
      .trophy-icon {
        font-size: 24px;
      }
    }
    
    &.rank-2 {
      color: #C0C0C0;
      font-size: 18px;
      
      .trophy-icon {
        font-size: 22px;
      }
    }
    
    &.rank-3 {
      color: #CD7F32;
      font-size: 16px;
      
      .trophy-icon {
        font-size: 20px;
      }
    }
  }
  
  .user-cell {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    
    .user-info {
      .nickname {
        font-size: $font-size-sm;
        font-weight: 500;
        color: $text-primary;
        margin-bottom: 2px;
      }
      
      .region {
        font-size: $font-size-xs;
        color: $text-secondary;
      }
    }
  }
  
  .value-number {
    font-size: 18px;
    font-weight: 500;
    color: $primary-color;
  }
  
  .pagination {
    margin-top: $spacing-lg;
    display: flex;
    justify-content: flex-end;
  }
  
  .user-detail {
    .detail-header {
      display: flex;
      gap: $spacing-lg;
      
      .header-info {
        flex: 1;
        
        .nickname {
          font-size: $font-size-lg;
          font-weight: 500;
          color: $text-primary;
          margin: 0 0 $spacing-md 0;
        }
        
        .info-item {
          margin-bottom: $spacing-xs;
          
          .label {
            color: $text-secondary;
            margin-right: $spacing-xs;
          }
          
          .value {
            color: $text-primary;
            font-weight: 500;
          }
        }
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-md;
      
      .stat-item {
        text-align: center;
        padding: $spacing-md;
        background: $background-color;
        border-radius: $radius-sm;
        
        .stat-label {
          font-size: $font-size-sm;
          color: $text-secondary;
          margin-bottom: $spacing-xs;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 500;
          color: $text-primary;
          
          &.rank-1 {
            color: #FFD700;
          }
          
          &.rank-2 {
            color: #C0C0C0;
          }
          
          &.rank-3 {
            color: #CD7F32;
          }
        }
      }
    }
  }
}
</style>
