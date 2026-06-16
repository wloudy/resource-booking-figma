import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      meta: { title: 'Вход' },
    },
    {
      path: '/app',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          redirect: { name: 'space' },
        },
        {
          path: 'apparatus',
          redirect: { name: 'space' },
        },
        {
          path: 'people',
          name: 'people',
          component: () => import('../views/PeopleView.vue'),
          meta: { title: 'Люди' },
        },
        {
          path: 'space',
          name: 'space',
          component: () => import('../views/SpaceView.vue'),
          meta: { title: 'Пространство' },
        },
        {
          path: ':pathMatch(.*)*',
          name: 'not-found',
          component: () => import('../views/NotFoundView.vue'),
          meta: { title: 'Страница не найдена' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const title = to.meta.title || 'Resource Booking'
  document.title = `${title} • СБР`
})

export default router
