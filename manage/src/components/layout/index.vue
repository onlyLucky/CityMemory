<template>
  <div class="layout-container">
    <el-container>
      <el-aside :width="sidebarCollapsed ? '64px' : '200px'" class="layout-aside">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header class="layout-header">
          <Header />
        </el-header>
        <el-main class="layout-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)

</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
  
  .el-container {
    height: 100%;
  }
  
  .layout-aside {
    background-color: $primary-color;
    transition: width 0.3s;
    overflow-x: hidden;
  }
  
  .layout-header {
    background-color: #fff;
    border-bottom: 1px solid $border-color;
    height: 60px;
    padding: 0 $spacing-md;
    display: flex;
    align-items: center;
  }
  
  .layout-main {
    background-color: $background-color;
    padding: $spacing-lg;
    overflow-y: auto;
  }
}
</style>
