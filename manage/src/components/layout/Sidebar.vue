<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="sidebarCollapsed"
    background-color="#1890FF"
    text-color="#fff"
    active-text-color="#fff"
    router
    class="sidebar-menu"
  >
    <template v-for="route in menuRoutes" :key="route.path">
      <el-menu-item :index="route.path" v-if="!route.meta?.hidden">
        <el-icon>
          <component :is="route.meta?.icon" />
        </el-icon>
        <template #title>{{ route.meta?.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)

const menuRoutes = computed(() => {
  const layoutRoute = router.getRoutes().find(r => r.name === 'Layout')
  return layoutRoute?.children || []
})

const activeMenu = computed(() => route.path)
</script>

<style scoped lang="scss">
.sidebar-menu {
  border-right: none;
  height: 100%;
  
  :deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
    
    &.is-active {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
  }
  
  :deep(.el-icon) {
    margin-right: $spacing-sm;
  }
}
</style>
