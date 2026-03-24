<template>
  <div class="header-container">
    <div class="header-left">
      <el-icon class="collapse-icon" @click="appStore.toggleSidebar">
        <Expand v-if="appStore.sidebarCollapsed" />
        <Fold v-else />
      </el-icon>
      <span class="app-title">{{ appTitle }}</span>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :src="userStore.userAvatar" :size="32" />
          <span class="username">{{ userStore.userName }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人信息
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const appTitle = import.meta.env.VITE_APP_TITLE || '城迹运营后台'

const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      router.push('/login')
    }).catch(() => {})
  } else if (command === 'profile') {
  }
}
</script>

<style scoped lang="scss">
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    
    .collapse-icon {
      font-size: 20px;
      cursor: pointer;
      color: $text-primary;
      
      &:hover {
        color: $primary-color;
      }
    }
    
    .app-title {
      font-size: $font-size-lg;
      font-weight: 500;
      color: $text-primary;
    }
  }
  
  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      cursor: pointer;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-md;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: $background-color;
      }
      
      .username {
        font-size: $font-size-sm;
        color: $text-primary;
      }
      
      .dropdown-icon {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
}
</style>
