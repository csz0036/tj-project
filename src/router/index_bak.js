import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// import Index from '@/components/index/index'
// import Find from '@/components/find/find'
// import Order from '@/components/order/order'
// import Mine from '@/components/mine/mine'
// import RestaurantDetail from '@/components/index/restaurant-detail/restaurant-detail'
// import RestaurantList from '@/components/index/restaurant-list/restaurant-list'
// import Goods from '@/components/index/restaurant-detail/goods/goods'
// import Ratings from '@/components/index/restaurant-detail/ratings/ratings'
// import Seller from '@/components/index/restaurant-detail/seller/seller'
// import login from '@/components/login/login'

Vue.use(Router)

// 路由懒加载
const Index = (resolve) => {
  import('@/components/index/index').then((module) => {
    resolve(module)
  })
}

const login = (resolve) => {
  import('@/components/login/login').then((module) => {
    resolve(module)
  })
}
const Home = (resolve) => {
  import('@/components/home/home').then((module) => {
    resolve(module)
  })
}
const CarDealerIndex = (resolve) => {
  import('@/components/cardealer/index').then((module) => {
    resolve(module)
  })
}
const CarDealerDetail = (resolve) => {
  import('@/components/cardealer/detail').then((module) => {
    resolve(module)
  })
}
const buyerIndex = (resolve) => {
  import('@/components/buyer/index').then((module) => {
    resolve(module)
  })
}
const buyerDetail = (resolve) => {
  import('@/components/buyer/detail').then((module) => {
    resolve(module)
  })
}
const machineIndex = (resolve) => {
  import('@/components/machine/index').then((module) => {
    resolve(module)
  })
}
const carSourceIndex = (resolve) => {
  import('@/components/carsource/index').then((module) => {
    resolve(module)
  })
}
const findCarIndex = (resolve) => {
  import('@/components/carsource/find').then((module) => {
    resolve(module)
  })
}

const MerchantProve = (resolve) => {
	import('@/components/merchantProve/merchantProve').then((module) => {
	  resolve(module)
	})
}
const AddMerchant = (resolve) => {
	import('@/components/merchantProve/addMerchant').then((module) => {
	  resolve(module)
	})
}
const Publish = (resolve) => {
	import('@/components/publish/publish').then((module) => {
	  resolve(module)
	})
}

const Clear = (resolve) => {
	import('@/components/common/clearItem').then((module) => {
	  resolve(module)
	})
}
const FirstType = (resolve) => {
	import('@/components/publish/firstType').then((module) => {
	  resolve(module)
	})
}
const router = new Router({
  routes: [
    // 根路径
    {
      path: '/',
      redirect: '/home',
      component: Home,
      meta: {title: '合伙人首页', isShowHead: false, isShowFoot: true}
    },
    // 合伙人首页
    {
      path: '/home',
      component: Home,
      meta: {title: '合伙人首页', isShowHead: false, isShowFoot: true}
    },
    // 信息商认证
    {
      path: '/merchantProve',
      component: MerchantProve,
      meta: {title: '信息商认证', isShowHead: false, isShowFoot: false}
    },
    // 车商认证
    {
      path: '/addMerchant',
      component: AddMerchant,
      meta: {title: '车商认证', isShowHead: false, isShowFoot: false}
    },
    // 发布车源
    {
      path: '/publish',
      component: Publish,
      meta: {title: '发布车源', isShowHead: true, isShowFoot: false},
      children: [
        {
          path: '/firstType',
          component: FirstType,
          meta: {title: '机型', isShowHead: true, isShowFoot: false, isShowBack: false}
        }

      ]
    },
    // 车商首页
    {
      path: '/cardealer_index',
      component: CarDealerIndex,
      meta: {title: '车商首页', isShowHead: false, isShowFoot: false, isShowBack: false, isShowIcon: false, iconR: '.icon_share'}
    },
    // 车商详情页
    {
      path: '/cardealer_detail',
      component: CarDealerDetail,
      meta: {title: '设备详情页', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 买家首页
    {
      path: '/buyer_index',
      component: buyerIndex,
      meta: {title: '买家首页', isShowHead: false, isShowFoot: false, isShowBack: false, isShowIcon: false, iconR: '.icon_share'}
    },
    // 买家详情页
    {
      path: '/buyer_detail',
      component: buyerDetail,
      meta: {title: '买家详情页', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 机械师首页
    {
      path: '/machine_index',
      component: machineIndex,
      meta: {title: '机械师首页', isShowHead: false, isShowFoot: true, isShowBack: false, isShowIcon: false, isShowSearchBut: true}
    },
    // 车源管理
    {
      path: '/carsource_index',
      component: carSourceIndex,
      meta: {title: '车源管理', isShowHead: false, isShowFoot: false, isShowBack: false, isShowIcon: false}
    },
    // 找车源
    {
      path: '/findcar_index',
      component: findCarIndex,
      meta: {title: '找车源', isShowHead: false, isShowFoot: true, isShowBack: false, isShowIcon: false, isShowSearchBut: true}
    },
    // 登录
    {
      path: '/login/',
      component: login,
      meta: {title: '登录注册', isShowHead: false, isShowFoot: false}

    },
    // 清除loc
    {
      path: '/clear',
      component: Clear
    },

    {
      path: '/index',
      component: Index,
   		meta: {title: '会员', isShowHead: false, isShowFoot: false, isShowBack: false}
    }
  ]
})
router.afterEach(function (to, from) {
  var toL = to.path.split('/').length
  var fromL = from.path.split('/').length
  var trans
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
