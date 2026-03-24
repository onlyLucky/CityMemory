<template>
  <div class="system-container">
    <el-tabs v-model="activeTab" class="system-tabs">
      <el-tab-pane label="管理员管理" name="admin">
        <div class="admin-management">
          <div class="table-header">
            <el-button type="primary" @click="handleAddAdmin">新增管理员</el-button>
          </div>
          
          <el-table :data="adminList" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="用户名" width="150" />
            <el-table-column prop="nickname" label="昵称" width="150" />
            <el-table-column prop="role" label="角色" width="120">
              <template #default="{ row }">
                <el-tag :type="row.role === 'super' ? 'danger' : 'primary'">
                  {{ row.role === 'super' ? '超级管理员' : '普通管理员' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'">
                  {{ row.status === 1 ? '启用' : '禁用' }}
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
                <el-button type="primary" link @click="handleEditAdmin(row)">编辑</el-button>
                <el-button
                  v-if="row.status === 1"
                  type="warning"
                  link
                  @click="handleToggleAdminStatus(row)"
                >
                  禁用
                </el-button>
                <el-button
                  v-else
                  type="success"
                  link
                  @click="handleToggleAdminStatus(row)"
                >
                  启用
                </el-button>
                <el-button type="danger" link @click="handleDeleteAdmin(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="系统配置" name="config">
        <div class="config-management">
          <el-form :model="configForm" label-width="150px" class="config-form">
            <el-divider content-position="left">基础配置</el-divider>
            
            <el-form-item label="系统名称">
              <el-input v-model="configForm.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            
            <el-form-item label="系统Logo">
              <el-upload
                v-model:file-list="logoList"
                :auto-upload="false"
                list-type="picture-card"
                :limit="1"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            
            <el-form-item label="系统描述">
              <el-input
                v-model="configForm.systemDescription"
                type="textarea"
                :rows="4"
                placeholder="请输入系统描述"
              />
            </el-form-item>
            
            <el-divider content-position="left">游戏配置</el-divider>
            
            <el-form-item label="初始星星数">
              <el-input-number v-model="configForm.initialStars" :min="0" :max="1000" />
            </el-form-item>
            
            <el-form-item label="初始金币数">
              <el-input-number v-model="configForm.initialCoins" :min="0" :max="10000" />
            </el-form-item>
            
            <el-form-item label="每日签到奖励">
              <el-input-number v-model="configForm.dailyCheckinReward" :min="0" :max="100" />
            </el-form-item>
            
            <el-form-item label="关卡奖励系数">
              <el-input-number v-model="configForm.levelRewardMultiplier" :min="1" :max="10" :step="0.1" />
            </el-form-item>
            
            <el-divider content-position="left">其他配置</el-divider>
            
            <el-form-item label="维护模式">
              <el-switch v-model="configForm.maintenanceMode" />
            </el-form-item>
            
            <el-form-item label="维护公告">
              <el-input
                v-model="configForm.maintenanceNotice"
                type="textarea"
                :rows="4"
                placeholder="请输入维护公告"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveConfig" :loading="saving">
                保存配置
              </el-button>
              <el-button @click="handleResetConfig">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="操作日志" name="log">
        <div class="log-management">
          <div class="search-form">
            <el-form :inline="true" :model="logSearchForm">
              <el-form-item label="操作人">
                <el-input v-model="logSearchForm.operator" placeholder="请输入操作人" clearable />
              </el-form-item>
              <el-form-item label="操作类型">
                <el-select v-model="logSearchForm.operationType" placeholder="请选择类型" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="新增" value="create" />
                  <el-option label="修改" value="update" />
                  <el-option label="删除" value="delete" />
                  <el-option label="登录" value="login" />
                  <el-option label="登出" value="logout" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="logSearchForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearchLogs" :loading="loading">搜索</el-button>
                <el-button @click="handleResetLogs">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <el-table :data="logList" stripe style="width: 100%">
            <el-table-column prop="id" label="日志ID" width="120" />
            <el-table-column prop="operator" label="操作人" width="120" />
            <el-table-column prop="operationType" label="操作类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getOperationTypeTag(row.operationType)">
                  {{ getOperationTypeText(row.operationType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="module" label="操作模块" width="120" />
            <el-table-column prop="description" label="操作描述" min-width="200" />
            <el-table-column prop="ip" label="IP地址" width="140" />
            <el-table-column prop="createdAt" label="操作时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
          
          <el-pagination
            v-model:current-page="logPagination.page"
            v-model:page-size="logPagination.pageSize"
            :page-sizes="[20, 50, 100]"
            :total="logPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleLogSizeChange"
            @current-change="handleLogPageChange"
            class="pagination"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <el-dialog v-model="adminDialogVisible" :title="isEditAdmin ? '编辑管理员' : '新增管理员'" width="500px">
      <el-form ref="adminFormRef" :model="adminForm" :rules="adminRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adminForm.username" placeholder="请输入用户名" :disabled="isEditAdmin" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="adminForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEditAdmin">
          <el-input v-model="adminForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="adminForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="超级管理员" value="super" />
            <el-option label="普通管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-checkbox-group v-model="adminForm.permissions">
            <el-checkbox label="user">用户管理</el-checkbox>
            <el-checkbox label="question">题目管理</el-checkbox>
            <el-checkbox label="level">关卡管理</el-checkbox>
            <el-checkbox label="shop">商店管理</el-checkbox>
            <el-checkbox label="rank">排行榜管理</el-checkbox>
            <el-checkbox label="system">系统管理</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adminDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAdmin" :loading="savingAdmin">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'

const activeTab = ref('admin')
const loading = ref(false)
const saving = ref(false)
const savingAdmin = ref(false)
const adminDialogVisible = ref(false)
const isEditAdmin = ref(false)
const adminFormRef = ref()

const adminList = ref<any[]>([])
const logList = ref<any[]>([])
const logoList = ref<any[]>([])

const adminForm = reactive({
  id: '',
  username: '',
  nickname: '',
  password: '',
  role: 'admin',
  permissions: [] as string[]
})

const adminRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  permissions: [{ required: true, message: '请选择权限', trigger: 'change' }]
}

const configForm = reactive({
  systemName: '城迹运营后台',
  systemLogo: '',
  systemDescription: '城迹游戏运营管理后台',
  initialStars: 10,
  initialCoins: 100,
  dailyCheckinReward: 10,
  levelRewardMultiplier: 1.5,
  maintenanceMode: false,
  maintenanceNotice: ''
})

const logSearchForm = reactive({
  operator: '',
  operationType: '',
  dateRange: null as any
})

const logPagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const loadAdminList = () => {
  adminList.value = [
    {
      id: 1,
      username: 'admin',
      nickname: '超级管理员',
      role: 'super',
      status: 1,
      createdAt: '2026-01-01 00:00:00'
    },
    {
      id: 2,
      username: 'operator1',
      nickname: '运营人员1',
      role: 'admin',
      status: 1,
      createdAt: '2026-01-15 00:00:00'
    }
  ]
}

const loadLogList = async () => {
  loading.value = true
  try {
    logList.value = [
      {
        id: 1,
        operator: 'admin',
        operationType: 'create',
        module: '用户管理',
        description: '新增用户',
        ip: '192.168.1.1',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        operator: 'admin',
        operationType: 'update',
        module: '题目管理',
        description: '修改题目',
        ip: '192.168.1.1',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
    logPagination.total = 100
  } catch (error) {
    console.error('加载日志失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAddAdmin = () => {
  isEditAdmin.value = false
  adminForm.id = ''
  adminForm.username = ''
  adminForm.nickname = ''
  adminForm.password = ''
  adminForm.role = 'admin'
  adminForm.permissions = []
  adminDialogVisible.value = true
}

const handleEditAdmin = (row: any) => {
  isEditAdmin.value = true
  adminForm.id = row.id
  adminForm.username = row.username
  adminForm.nickname = row.nickname
  adminForm.role = row.role
  adminForm.permissions = []
  adminDialogVisible.value = true
}

const handleSaveAdmin = async () => {
  if (!adminFormRef.value) return
  
  await adminFormRef.value.validate(async (valid) => {
    if (valid) {
      savingAdmin.value = true
      try {
        if (isEditAdmin.value) {
          ElMessage.success('保存成功')
        } else {
          ElMessage.success('创建成功')
        }
        adminDialogVisible.value = false
        loadAdminList()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        savingAdmin.value = false
      }
    }
  })
}

const handleToggleAdminStatus = async (row: any) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'
  
  try {
    await ElMessageBox.confirm(`确定要${action}该管理员吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success(`${action}成功`)
    loadAdminList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${action}失败:`, error)
      ElMessage.error(`${action}失败`)
    }
  }
}

const handleDeleteAdmin = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该管理员吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('删除成功')
    loadAdminList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleSaveConfig = async () => {
  saving.value = true
  try {
    ElMessage.success('保存配置成功')
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('保存配置失败')
  } finally {
    saving.value = false
  }
}

const handleResetConfig = () => {
  ElMessage.info('重置配置')
}

const handleSearchLogs = () => {
  logPagination.page = 1
  loadLogList()
}

const handleResetLogs = () => {
  logSearchForm.operator = ''
  logSearchForm.operationType = ''
  logSearchForm.dateRange = null
  logPagination.page = 1
  loadLogList()
}

const getOperationTypeText = (type: string) => {
  const map: any = {
    create: '新增',
    update: '修改',
    delete: '删除',
    login: '登录',
    logout: '登出'
  }
  return map[type] || type
}

const getOperationTypeTag = (type: string) => {
  const map: any = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    login: 'info',
    logout: 'info'
  }
  return map[type] || ''
}

const handleLogSizeChange = (size: number) => {
  logPagination.pageSize = size
  logPagination.page = 1
  loadLogList()
}

const handleLogPageChange = (page: number) => {
  logPagination.page = page
  loadLogList()
}

onMounted(() => {
  loadAdminList()
  loadLogList()
})
</script>

<style scoped lang="scss">
.system-container {
  padding: $spacing-lg;
  
  .system-tabs {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    :deep(.el-tabs__content) {
      padding: $spacing-md 0;
    }
  }
  
  .table-header {
    margin-bottom: $spacing-md;
    text-align: right;
  }
  
  .config-form {
    max-width: 800px;
  }
  
  .search-form {
    margin-bottom: $spacing-md;
    
    .el-form-item {
      margin-bottom: 0;
    }
  }
  
  .pagination {
    margin-top: $spacing-lg;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
