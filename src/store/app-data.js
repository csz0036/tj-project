/**
 * 时间：2018-05-06
 * app临时数据管理
 */
export default {
  state: {
    navbarTitle: '首页', // app的导航页标题
    isShowHead: false, // 是否显示app 的导航栏
    isShowFoot: false, // 是否显示foot栏
    isShowBack: false, // 是否显示返回按钮
    isConnectionHub: false, // 是否连接hubs
    locationInfo: {},
    sessionKey: '',
    isShowSearchBut: false,
    goDetailId: ''
  },
  mutations: {
    /**
		 *
		 * 1、mutations 中的方法是不分组件的 , 假如你在 dialog_stroe.js 文件中的定义了switch_dialog 方法 , 在其他文件中的一个 switch_dialog 方法 , 那么$store.commit('switch_dialog') 会执行所有的 switch_dialog 方法。
		 * 2、mutations里的操作必须是同步的。
		 * 3、可以直接操作mutations只是官方推荐 , 不要在 mutationss 里执行异步操作而已。
		 */
    updateGoDetailId (state, goDetailId) {
      console.log(111, goDetailId)
      state.goDetailId = goDetailId
    },
    updateLocationInfo (state, locationInfo) {
      state.locationInfo = locationInfo
    },
    updateNavbarTitle (state, navbarTitle) {
      state.navbarTitle = navbarTitle
    },
    updateNavbarStatus (state, {isShowHead = true, isShowFoot = true, isShowBack = true} = {}) {
      if (state.isShowHead != isShowHead) {
        state.isShowHead = isShowHead
      }
      if (state.isShowFoot != isShowFoot) {
        state.isShowFoot = isShowFoot
      }
      if (state.isShowBack != isShowBack) {
        state.isShowBack = isShowBack
      }
    },
    updateConnectionHubStatus (state, isConnectionHub) {
      state.isConnectionHub = isConnectionHub
    },
    updateSessionKeyStatus (state, sk) {	// 这里的state对应着上面这个state
      state.sessionKey = sk
    },
    updateisShowSearchButBut (state, ib) {
      state.isShowSearchBut = ib
    }
  },
  actions: {
    /**
		 * 会来触发会比较好维护 , 那么需要执行多个 mutations 就需要用 action 了
		 */
    updateSessionKeyStatus ({commit}, sk) { // 这里的context和我们使用的$store拥有相同的对象和方法
      commit('updateSessionKeyStatus', sk)
      // 你还可以在这里触发其他的mutations方法
    },
    updateLocationInfo ({commit}, locationInfo) {
      commit('updateLocationInfo', locationInfo)
    },
    updateNavbarTitle ({commit}, navbarTitle) {
      commit('updateNavbarTitle', navbarTitle)
    },
    updateNavbarStatus ({commit}, navbarStatusObject) {
      commit('updateNavbarStatus', navbarStatusObject)
    },
    updateConnectionHubStatus ({commit}, isConnectionHub) {
      commit('updateConnectionHubStatus', isConnectionHub)
    },
    updateisShowSearchButBut ({commit}, isShowSearchBut) {
      commit('updateisShowSearchButBut', isShowSearchBut)
    },
    updateGoDetailId ({commit}, updateGoDetailId) {
      console.log(222, updateGoDetailId)
      commit('updateGoDetailId', updateGoDetailId)
    }

  }
}
