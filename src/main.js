// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  { ToastPlugin } from 'vux'
import { WechatPlugin } from 'vux'
import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(ToastPlugin)
const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.config.productionTip = false

// console.log(Vue.wechat);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
