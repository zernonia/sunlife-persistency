import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import { useCookies, useJwt } from '@vueuse/integrations'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/details/:product',
    name: 'Details',
    component: () => import('../views/Details.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

interface CookieJWT {
  iat: number;
  displayName: string;
  username: string;
}

router.beforeEach((to, from, next) => {
  if(to.name == 'Login') {
    next()
  } else {
    const cookies = useCookies(['jwt'])
    const jwt = cookies.getAll()?.jwt
    
    if(jwt) {
      const { payload } = useJwt(jwt)
      const { username } = payload.value as CookieJWT

      if(username) {
        next()
      }
      else {
        router.push({ name: 'Login'})
      }
    } else {
      router.push({ name: 'Login'})
    }
  }
})

export default router
