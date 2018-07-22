<!-- 首页 -->

<template>
	<div class = 'mui-scroll-wrapper' id="welcomeBg">
      <div class="time">{{ timeObj }}S</div>
	</div>
</template>

<script>
// 数据请求
import req from '../../api/config'
import { setTimeout, setInterval, clearInterval } from 'timers'
export default {
  components: {

  },
  data () {
    return {
      timeObj: 3
    }
  },
  props: {},
  watch: {},
  methods: {
    time () {
      var _th = this
      var setT = setInterval(function () {
        _th.timeObj > 0 ? (_th.timeObj = _th.timeObj - 1) : clearInterval(setT)
      }, 1000)
    },
    getUserType () {
      req.get('/bizUserCtrl/v1/getUser', {
        sessionKey: localStorage.getItem('sessionKey')
      }).then(result => {
        if (result.data.code == 200) {
          localStorage.setItem('userInfo', result.data.data.user.type)
          localStorage.setItem('userData', JSON.stringify(result.data.data.user))
          switch (result.data.data.user.type) {
            case 1:
              setTimeout(() => {
                location.href = 'http://' + location.host + '#/cardealer_index'
                // this.$router.push({ path:'/cardealer_index' })
              }, 3000)
              break
            case 2:
              setTimeout(() => {
                location.href = 'http://' + location.host + '#/machine_index'
                // this.$router.push({ path:'/machine_index' })
              }, 3000)
              break
            case 3:
              setTimeout(() => {
                location.href = 'http://' + location.host + '#/home'
                // this.$router.push({ path:'/home' })
              }, 3000)
              break
          }
        }
      })
    }
  },
  filters: {},
  computed: {},
  created () {
    this.time()
    if (req.getRequest('code')) {
      if (localStorage.getItem('sessionKey')) {
        // 有session 之前登录过
        this.getUserType()
      } else {
        req.get('/webchatCtrl/v1/wechatUseInfoAndSave', {
          code: req.getRequest('code'),
          state: req.getRequest('state')
        }).then(result => {
          localStorage.setItem('sessionKey', result.data.data.sessionKey)
          this.getUserType()
        })
      }
    } else {
      req.get('/webchatCtrl/v1/getWechatAuthCode', {
        redirectUrl: window.location.href
      }).then(result => {
        // console.log('微信---', result);
        window.location.href = result.data.data.codeUrl
      })
    }
  },
  mounted () {
  },
  destroyed () {}
}
</script>

<style lang="scss" scoped>
@import '~static/common/common.scss';
@import '~@/assets/scss/mixin.scss';
#welcomeBg{
  background: #fff;
  &:after{
    position: absolute;
    left: 50%;
    bottom: pxr(92);
    content: '';
    width: pxr(381);
    height: pxr(94);
    margin-left: pxr(-190);
    background: url(img/welcome.jpg) no-repeat center bottom;
    background-size:  auto pxr(94);
  }
  .time{
    font-size: pxr(38);
    color: #000;
    position: absolute;
    top: pxr(30);
    right: pxr(30);
  }
}
</style>
