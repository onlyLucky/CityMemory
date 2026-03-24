<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="page-title">数据看板</h2>
      <el-radio-group v-model="dateRange" @change="handleDateRangeChange">
        <el-radio-button label="7">近7天</el-radio-button>
        <el-radio-button label="30">近30天</el-radio-button>
      </el-radio-group>
    </div>
    
    <div class="overview-cards">
      <div class="card">
        <div class="card-icon" style="background-color: #409EFF">
          <el-icon :size="24"><User /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-label">今日新增</div>
          <div class="card-value">{{ overview.todayNewUsers }}</div>
          <div class="card-trend" :class="{ up: true }">
            <el-icon><Top /></el-icon>
            12%
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-icon" style="background-color: #67C23A">
          <el-icon :size="24"><UserFilled /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-label">累计用户</div>
          <div class="card-value">{{ formatNumber(overview.totalUsers) }}</div>
          <div class="card-trend" :class="{ up: true }">
            <el-icon><Top /></el-icon>
            5%
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-icon" style="background-color: #E6A23C">
          <el-icon :size="24"><DataLine /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-label">今日活跃</div>
          <div class="card-value">{{ overview.todayActiveUsers }}</div>
          <div class="card-trend" :class="{ up: true }">
            <el-icon><Top /></el-icon>
            8%
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-icon" style="background-color: #F56C6C">
          <el-icon :size="24"><Document /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-label">日答题数</div>
          <div class="card-value">{{ formatNumber(overview.todayQuestions) }}</div>
          <div class="card-trend" :class="{ up: true }">
            <el-icon><Top /></el-icon>
            15%
          </div>
        </div>
      </div>
    </div>
    
    <div class="charts-container">
      <div class="chart-card">
        <h3 class="chart-title">用户增长趋势</h3>
        <div ref="userTrendChartRef" class="chart"></div>
      </div>
      
      <div class="chart-card">
        <h3 class="chart-title">答题数据统计</h3>
        <div ref="questionChartRef" class="chart"></div>
      </div>
    </div>
    
    <div class="chart-card full-width">
      <h3 class="chart-title">区域答题分布</h3>
      <div ref="distributionChartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { dashboardApi } from '@/api/dashboard'
import { formatNumber } from '@/utils/format'

const dateRange = ref('7')
const overview = ref({
  todayNewUsers: 0,
  totalUsers: 0,
  todayActiveUsers: 0,
  todayQuestions: 0,
  yesterdayRetentionRate: 0,
  weekRetentionRate: 0
})

const userTrendChartRef = ref<HTMLElement>()
const questionChartRef = ref<HTMLElement>()
const distributionChartRef = ref<HTMLElement>()

let userTrendChart: echarts.ECharts | null = null
let questionChart: echarts.ECharts | null = null
let distributionChart: echarts.ECharts | null = null

const loadOverview = async () => {
  const data = await dashboardApi.getOverview()
  overview.value = data
}

const loadTrend = async () => {
  const data = await dashboardApi.getTrend(parseInt(dateRange.value))
  initUserTrendChart(data)
  initQuestionChart(data)
}

const loadDistribution = async () => {
  const data = await dashboardApi.getDistribution()
  initDistributionChart(data)
}

const initUserTrendChart = (data: any[]) => {
  if (!userTrendChartRef.value) return
  
  userTrendChart = echarts.init(userTrendChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增用户', '活跃用户']
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        data: data.map(item => item.newUsers),
        smooth: true
      },
      {
        name: '活跃用户',
        type: 'line',
        data: data.map(item => item.activeUsers),
        smooth: true
      }
    ]
  }
  
  userTrendChart.setOption(option)
}

const initQuestionChart = (data: any[]) => {
  if (!questionChartRef.value) return
  
  questionChart = echarts.init(questionChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '答题数',
        type: 'bar',
        data: data.map(item => item.questions),
        itemStyle: {
          color: '#1890FF'
        }
      }
    ]
  }
  
  questionChart.setOption(option)
}

const initDistributionChart = (data: any[]) => {
  if (!distributionChartRef.value) return
  
  distributionChart = echarts.init(distributionChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '区域答题分布',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({
          value: item.count,
          name: item.region
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: '{b}: {d}%'
        }
      }
    ]
  }
  
  distributionChart.setOption(option)
}

const handleDateRangeChange = () => {
  loadTrend()
}

const resizeCharts = () => {
  userTrendChart?.resize()
  questionChart?.resize()
  distributionChart?.resize()
}

onMounted(() => {
  loadOverview()
  loadTrend()
  loadDistribution()
  
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  userTrendChart?.dispose()
  questionChart?.dispose()
  distributionChart?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: $spacing-lg;
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;
    
    .page-title {
      font-size: $font-size-xl;
      font-weight: 500;
      color: $text-primary;
      margin: 0;
    }
  }
  
  .overview-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
    
    .card {
      background: #fff;
      border-radius: $radius-md;
      padding: $spacing-lg;
      display: flex;
      align-items: center;
      gap: $spacing-md;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      
      .card-content {
        flex: 1;
        
        .card-label {
          font-size: $font-size-sm;
          color: $text-secondary;
          margin-bottom: $spacing-xs;
        }
        
        .card-value {
          font-size: 24px;
          font-weight: 500;
          color: $text-primary;
          margin-bottom: $spacing-xs;
        }
        
        .card-trend {
          font-size: $font-size-sm;
          display: flex;
          align-items: center;
          gap: 4px;
          
          &.up {
            color: $success-color;
          }
          
          &.down {
            color: $error-color;
          }
        }
      }
    }
  }
  
  .charts-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
    
    .chart-card {
      background: #fff;
      border-radius: $radius-md;
      padding: $spacing-lg;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      &.full-width {
        grid-column: span 2;
      }
      
      .chart-title {
        font-size: $font-size-md;
        font-weight: 500;
        color: $text-primary;
        margin: 0 0 $spacing-md 0;
      }
      
      .chart {
        width: 100%;
        height: 300px;
      }
    }
  }
}
</style>
