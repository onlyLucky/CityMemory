<template>
  <div class="user-detail-container">
    <div class="detail-header">
      <el-button type="primary" link @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
    </div>
    
    <div v-loading="loading" class="detail-content">
      <div class="user-info-card">
        <div class="avatar-section">
          <el-avatar :src="userInfo?.avatar" :size="100" />
        </div>
        <div class="info-section">
          <h2 class="user-name">{{ userInfo?.nickname }}</h2>
          <div class="info-item">
            <span class="label">用户ID：</span>
            <span class="value">{{ userInfo?.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">省份：</span>
            <span class="value">{{ userInfo?.province }}</span>
          </div>
          <div class="info-item">
            <span class="label">注册时间：</span>
            <span class="value">{{ formatDate(userInfo?.createdAt) }}</span>
          </div>
        </div>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon" style="background-color: #FAAD14">
            <el-icon :size="24"><Star /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">总星星数</div>
            <div class="stat-value">{{ formatStars(userInfo?.totalStars || 0) }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background-color: #409EFF">
            <el-icon :size="24"><Location /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">关卡数</div>
            <div class="stat-value">{{ userInfo?.levelCount || 0 }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background-color: #67C23A">
            <el-icon :size="24"><Coin /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">金币数</div>
            <div class="stat-value">{{ userInfo?.coins || 0 }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background-color: #E6A23C">
            <el-icon :size="24"><Ticket /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">闯关门票</div>
            <div class="stat-value">{{ userInfo?.adventureTickets || 0 }}/{{ userInfo?.adventureTickets || 0 }}</div>
          </div>
        </div>
      </div>
      
      <div class="statistics-section">
        <h3 class="section-title">答题统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">总答题数</span>
            <span class="stat-value">{{ userDetail?.statistics?.totalQuestions || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">平均正确率</span>
            <span class="stat-value">{{ formatPercent(userDetail?.statistics?.correctRate || 0) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">平均用时</span>
            <span class="stat-value">{{ userDetail?.statistics?.avgTime?.toFixed(1) || 0 }}秒</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最高星级</span>
            <span class="stat-value">{{ userDetail?.statistics?.maxStars || 0 }}星</span>
          </div>
        </div>
      </div>
      
      <div class="progress-section">
        <h3 class="section-title">关卡进度</h3>
        <el-table :data="levelProgress" stripe style="width: 100%">
          <el-table-column prop="levelName" label="关卡名称" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.status === 'completed'" type="success">已通关</el-tag>
              <el-tag v-else-if="row.status === 'in-progress'" type="warning">进行中</el-tag>
              <el-tag v-else type="info">未开始</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="stars" label="星级" width="150">
            <template #default="{ row }">
              <el-rate v-model="row.stars" disabled show-score />
            </template>
          </el-table-column>
          <el-table-column prop="completedTime" label="通关时间" width="180">
            <template #default="{ row }">
              {{ row.completedTime ? formatDate(row.completedTime) : '-' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div class="logs-section">
        <h3 class="section-title">最近登录记录</h3>
        <el-table :data="loginLogs" stripe style="width: 100%">
          <el-table-column prop="loginTime" label="登录时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.loginTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="device" label="设备" width="120" />
          <el-table-column prop="ipAddress" label="IP地址" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userApi } from '@/api/user'
import { formatDate, formatPercent, formatStars } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const userInfo = ref<any>(null)
const userDetail = ref<any>(null)
const levelProgress = ref<any[]>([])
const loginLogs = ref<any[]>([])

const loadUserDetail = async () => {
  loading.value = true
  try {
    const detail = await userApi.getDetail(route.params.id as string)
    userInfo.value = detail
    userDetail.value = detail
    
    levelProgress.value = Object.entries(detail.progress?.levelStars || {}).map(([levelId, stars]) => ({
      levelId,
      levelName: levelId,
      stars,
      status: detail.progress?.completedLevels?.includes(levelId) ? 'completed' : 'pending',
      completedTime: null
    }))
    
    loginLogs.value = detail.loginLogs || []
  } catch (error) {
    console.error('加载用户详情失败:', error)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push('/user')
}

onMounted(() => {
  loadUserDetail()
})
</script>

<style scoped lang="scss">
.user-detail-container {
  padding: $spacing-lg;
  
  .detail-header {
    margin-bottom: $spacing-lg;
  }
  
  .detail-content {
    .user-info-card {
      background: #fff;
      border-radius: $radius-md;
      padding: $spacing-xl;
      margin-bottom: $spacing-lg;
      display: flex;
      gap: $spacing-xl;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .avatar-section {
        flex-shrink: 0;
      }
      
      .info-section {
        flex: 1;
        
        .user-name {
          font-size: $font-size-xl;
          font-weight: 500;
          color: $text-primary;
          margin-bottom: $spacing-md;
        }
        
        .info-item {
          margin-bottom: $spacing-sm;
          
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
  }
  
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
    
    .stat-card {
      background: #fff;
      border-radius: $radius-md;
      padding: $spacing-lg;
      display: flex;
      align-items: center;
      gap: $spacing-md;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      
      .stat-content {
        flex: 1;
        
        .stat-label {
          font-size: $font-size-sm;
          color: $text-secondary;
          margin-bottom: $spacing-xs;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 500;
          color: $text-primary;
        }
      }
    }
  }
  
  .statistics-section,
  .progress-section,
  .logs-section {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .section-title {
      font-size: $font-size-md;
      font-weight: 500;
      color: $text-primary;
      margin: 0 0 $spacing-md 0;
    }
  }
  
  .statistics-section {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $spacing-md;
      
      .stat-item {
        text-align: center;
        padding: $spacing-md;
        background: $background-color;
        border-radius: $radius-sm;
        
        .stat-label {
          display: block;
          font-size: $font-size-sm;
          color: $text-secondary;
          margin-bottom: $spacing-xs;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: 500;
          color: $primary-color;
        }
      }
    }
  }
}
</style>
