import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/layout/index.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '数据看板', icon: 'DataAnalysis' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'user/detail/:id',
        name: 'UserDetail',
        component: () => import('@/views/user/detail.vue'),
        meta: { title: '用户详情', hidden: true }
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('@/views/feedback/index.vue'),
        meta: { title: '用户反馈', icon: 'ChatDotRound' }
      },
      {
        path: 'level',
        name: 'Level',
        component: () => import('@/views/level/index.vue'),
        meta: { title: '关卡管理', icon: 'Location' }
      },
      {
        path: 'question',
        name: 'Question',
        component: () => import('@/views/question/index.vue'),
        meta: { title: '题目管理', icon: 'QuestionFilled' }
      },
      {
        path: 'question/edit/:id?',
        name: 'QuestionEdit',
        component: () => import('@/views/question/edit.vue'),
        meta: { title: '题目编辑', hidden: true }
      },
      {
        path: 'question-audit',
        name: 'QuestionAudit',
        component: () => import('@/views/question/audit.vue'),
        meta: { title: '题目审核', icon: 'DocumentChecked' }
      },
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('@/views/shop/index.vue'),
        meta: { title: '商店管理', icon: 'ShoppingBag' }
      },
      {
        path: 'rank',
        name: 'Rank',
        component: () => import('@/views/rank/index.vue'),
        meta: { title: '排行榜', icon: 'Trophy' }
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/system/index.vue'),
        meta: { title: '系统管理', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
