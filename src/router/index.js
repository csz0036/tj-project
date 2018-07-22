import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    // 根路径
    {
      path: '/',
      redirect: '/home',
      component: resolve => require(['@/components/home/home'], resolve),
      meta: {title: '合伙人首页', isShowHead: false, isShowFoot: true}
    },
    // 合伙人首页
    {
      path: '/home',
      component: resolve => require(['@/components/home/home'], resolve),
      meta: {title: '合伙人首页', isShowHead: false, isShowFoot: true}
    },
    // 信息商认证
    {
      path: '/merchantProve',
      component: resolve => require(['@/components/merchantProve/merchantProve'], resolve),
      meta: {title: '信息商认证', isShowHead: false, isShowFoot: false}
    },
    // 车商认证
    {
      path: '/addMerchant',
      component: resolve => require(['@/components/merchantProve/addMerchant'], resolve),
      meta: {title: '车商认证', isShowHead: false, isShowFoot: false}
    },
    // 发布车源
    {
      path: '/publish',
      component: resolve => require(['@/components/publish/publish'], resolve),
      meta: {title: '发布车源', isShowHead: true, isShowFoot: false},
      children: [
        {
          path: '/firstType',
          component: resolve => require(['@/components/publish/firstType'], resolve),
          meta: {title: '机型', isShowHead: true, isShowFoot: false, isShowBack: false}
        }

      ]
    },
    // 车商首页
    {
      path: '/cardealer_index',
      component: resolve => require(['@/components/cardealer/index'], resolve),
      meta: {title: '车商首页', isShowHead: false, isShowFoot: false, isShowBack: false, isShowIcon: false, iconR: '.icon_share'}
    },
    // 车商详情页
    {
      path: '/cardealer_detail',
      component: resolve => require(['@/components/cardealer/detail'], resolve),
      meta: {title: '设备详情页', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 买家首页
    {
      path: '/buyer_index',
      component: resolve => require(['@/components/buyer/index'], resolve),
      meta: {title: '买家首页', isShowHead: false, isShowFoot: false, isShowBack: false, isShowIcon: false, iconR: '.icon_share'}
    },
    // 买家详情页
    {
      path: '/buyer_detail',
      component: resolve => require(['@/components/buyer/detail'], resolve),
      meta: {title: '买家详情页', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 机械师首页
    {
      path: '/machine_index',
      component: resolve => require(['@/components/machine/index'], resolve),
      meta: {title: '机械师首页', isShowHead: false, isShowFoot: true, isShowBack: false, isShowIcon: false, isShowSearchBut: true}
    },
    // 车源管理
    {
      path: '/carsource_index',
      component: resolve => require(['@/components/carsource/index'], resolve),
      meta: {title: '车源管理', isShowHead: false, isShowFoot: false, isShowBack: false, isShowIcon: false}
    },
    // 找车源
    {
      path: '/findcar_index',
      component: resolve => require(['@/components/carsource/find'], resolve),
      meta: {title: '找车源', isShowHead: false, isShowFoot: true, isShowBack: false, isShowIcon: false, isShowSearchBut: true}
    },
    // 登录
    {
      path: '/login/',
      component: resolve => require(['@/components/login/login'], resolve),
      meta: {title: '登录注册', isShowHead: false, isShowFoot: false}

    },
    // 清除loc
    {
      path: '/clear',
      component: resolve => require(['@/components/common/clearItem'], resolve)
    },

    {
      path: '/index',
      component: resolve => require(['@/components/index/index'], resolve),
   		meta: {title: '会员', isShowHead: false, isShowFoot: false, isShowBack: false}
    }
  ]
})
router.afterEach(function (to, from) {
  var toL = to.path.split('/').length
  var fromL = from.path.split('/').length
  var trans
  if (to.path != '/buyer_detail' && to.path != '/cardealer_detail' && to.path != '/publish' && to.path != '/addMerchant' && to.path != '/merchantProve') {
    localStorage.removeItem('reloadPage')
    // console.log('这里-删除')
  }
  // console.log('to.path',to.path)
  if (toL == fromL) {
    trans = 'fade'
  } else {
    trans = toL > fromL ? 'next' : 'prev'
  }
  if (to.meta.title) {
    store.dispatch('updateNavbarTitle', to.meta.title)
    store.dispatch('updateisShowSearchButBut', to.meta.isShowSearchBut)
    // 过渡效果
    store.dispatch('updateTransition', trans)
    store.dispatch('updateNavbarStatus', {isShowHead: to.meta.isShowHead, isShowFoot: to.meta.isShowFoot, isShowBack: to.meta.isShowBack})
    // document.title = "天机-" + to.meta.title || "";
    document.title = to.meta.title || ''
  }
})
export default router
