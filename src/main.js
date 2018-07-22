// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 将全局样式文件写在 main.js
// import '@/assets/scss/reset.scss'
// import '@/assets/ali-fonts/iconfont.css'
// import '@/assets/scss/iconfont.scss'
// import '../static/css/mui.css'

// 全局引入 mui.js
// import '../static/js/mui'

// Mint UI
import Mint from 'mint-ui'
// import 'mint-ui/lib/style.css'

// 图片懒加载
import VueLazyload from 'vue-lazyload'
// 定义全局加载组件
import {Vwaiting, Cwaiting} from 'static/js/showWating.js'

Vue.config.productionTip = false
Vue.use(Mint)
Vue.use(VueLazyload, {
  loading: require('static/loading-bars.svg')
  // loading: require('@/assets/img/logo.png')
})
window.app = Object.assign({}, {Vwaiting, Cwaiting})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
