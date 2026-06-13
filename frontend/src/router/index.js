import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/', component: () => import('../views/Patients.vue'), meta: { requiresAuth: true } },
  { path: '/patients', component: () => import('../views/Patients.vue'), meta: { requiresAuth: true } },
  { path: '/clinical/:id', component: () => import('../views/ClinicalWorkspace.vue'), meta: { requiresAuth: true } },
  { path: '/invoice/:id', component: () => import('../views/InvoiceDetail.vue'), meta: { requiresAuth: true } },
  { path: '/users', component: () => import('../views/Users.vue'), meta: { requiresAuth: true } },
  { path: '/roles', component: () => import('../views/Roles.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
