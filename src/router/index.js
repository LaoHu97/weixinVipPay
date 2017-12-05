import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('@/views/Index')
const Error = () => import('@/views/Error')
const Commer = () => import('@/views/Commer')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/err',
      name: 'error',
      component: Error
    },
    {
      path: '/commer',
      name: 'commer',
      component: Commer
    }
  ]
})
