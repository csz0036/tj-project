
<template>
  <div id="contentCenter">
    <router-view  v-if="isRouterAlive"></router-view>

    <template v-if="$store.state.appData.isShowFoot">
        <nav class="mui-bar mui-bar-tab " id="footBar">
          <a class="mui-tab-item" @tap="gohome" style="width:100px">首页</a>
          <a class="mui-tab-item" @tap="goFindcar" v-if="$store.state.appData.isShowSearchBut">搜索车源</a>
          <a class="mui-tab-item" href="#Popover_2"  v-if="!$store.state.appData.isShowSearchBut">认证</a>
        </nav>
        <div id="Popover_2" class="mui-popover mui-bar-popover">
          <div class="mui-popover-arrow"></div>
          <ul class="mui-table-view">
            <!-- <li class="mui-table-view-cell"><router-link to="/merchantProve">信息商认证</router-link></li>
            <li class="mui-table-view-cell"><router-link to="/addMerchant">车商认证</router-link></li> -->
            <li class="mui-table-view-cell" @tap="goMerchantProve">信息商认证</li>
            <li class="mui-table-view-cell" @tap="goAddMerchant">车商认证</li>
          </ul>
        </div>
    </template>
  </div>
</template>

<script>
import mui from 'static/js/mui'
import $ from 'static/js/zepto.min'
import store from './store'
export default {
  components: {},
  name: 'app',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,

      title: '标题',
      footerMenu: [{
        icon: 'icon-home-normal',
        iconActive: 'icon-home-press',
        name: '首页',
        router: '/home'
      },
      {
        icon: 'icon-More-normal',
        iconActive: 'icon-More-press',
        name: '会员',
        router: '/index'
      },
      {
        icon: 'icon-youhuijuan-xianxing',
        iconActive: 'icon-youhuijuan-copy',
        name: '找车源',
        router: '/findCar'
      },
      {
        icon: 'icon-Username',
        iconActive: 'icon-Username-press',
        name: '我的',
        router: '/mine'
      }
      ]
    }
  },
  created () {
  	var that = this
  	// console.log('sk',this.$store.state.appData.isShowSearchBut)

  	// 初始化等待框
  	mui.plusReady(function () {
  		plus.nativeUI.showWaiting('初始化')
  	}
  	)
  	// setTimeout(function(){
  		mui.plusReady(function () {
  			plus.nativeUI.closeWaiting()
  		}
  	)
  		// that.$router.push('/home')
  	// },1000)
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    goMerchantProve () {
      this.$router.push({
        path: '/merchantProve',
        _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
      })
    },
    goAddMerchant () {
      this.$router.push({
        path: '/addMerchant',
        _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
      })
    },
    gohome () {
      if (this.$store.state.appData.isShowSearchBut) {
        this.$router.push({
          path: '/machine_index/'
        })
      } else {
        this.$router.push({
          path: '/home/'
        })
      }
    },
    goFindcar () {
      this.$router.push({
        path: '/findcar_index/'
      })
    },
    goTo (item) {
      console.log(item, this.$store.state.routerStatus.transition)
    	this.$router.push(item.router)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../static/common/common.scss';
@import '../static/css/muihead.css';

/*公共header*/
#headId{
  background-color: #fff;
  height:.8rem;
  line-height:.8rem;
  a,.mui-title {
    color: #343A3D;
    font-size: .34rem;
    height:.8rem;
    line-height:.8rem;
  }
  a{
    padding: 0 .2rem
  }
}

/*body{
  background-color:white;
}*/
.mint-tab-item-icon {
  width: .48rem;
  height: .48rem;
  margin: 0 auto .05rem
}
/*.routerview{
	margin-top: 45px;
}*/
.fade-enter-active {
    -webkit-transition: all .2s linear;
    transition: all .2s linear;
    opacity: 1
}

.fade-enter, .fade-leave-active {
    opacity: 0;
}
/*过渡动画*/
/*下一页*/
.next-enter-active {
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
    opacity: 1;
    position: fixed;
    width:100vw;
}

.next-enter, .next-leave-active {
    opacity: 0;
    -webkit-transform: translate3d(50%, 0, 0);
    transform: translate3d(50%, 0, 0);
}

.next-leave-active {
    opacity: 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
/*上一页*/
.prev-enter-active {
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
    width:100vw;
}

.prev-enter, .prev-leave-active {
    opacity: 0;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
}

.prev-active {
    opacity: 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
.mui-bar.mui-bar-tab .mui-tab-item.mui-active {
  color: #FF5E52;
}
.mui-bar-nav + div{
  margin-top: .3rem;
}
#footBar{z-index: 100; display: flex; align-items: center;}
#footBar > a{flex: 1; line-height: 50px;}
/*弃用mui的icon改用自己的iconfont*/
.icon-left-j{
	line-height:.3rem
}

#contentCenter{width: 100vw; height: 100vh;}
</style>
