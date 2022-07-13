import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomePage.vue'
import MainBit from '../views/DashboardView.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/',
    name: 'home',
    component: MainBit
  },
  {
    path: '/map',
    name: 'map',
    component: MainBit
  }, 
  {
    path: '/saved',
    name: 'saved',
    component: MainBit
  }, 
  {
    path: '/calendar',
    name: 'calendar',
    component: MainBit
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
