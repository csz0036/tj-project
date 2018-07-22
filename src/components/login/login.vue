<!-- 登录 组件 -->

<template>
  <div class="login">
    <section class="loginHeadPic">
        <img src="../../../static/images/login.png" >
    </section>
    <div class="loginFrom">
      <p class="lf-p">
        <input type="tel" class="logInput" placeholder="输入手机号" v-model="mobile" @change="regexTel"/>
      </p>
      <!-- <p class="lf-p">
        <input type="tel" class="logInput" placeholder="输入图片验证码"/><img :src="getImageData" />
      </p> -->
      <p class="lf-p">
        <input type="tel" v-model="yzm" class="logInput" placeholder="短信验证码"/>
        <span class='getCode' @click="getMsgCode" v-if="getYZMBut">获取验证码</span>
        <span class='getCode num' v-else></span>

      </p>
      <span class="logSubim" @click="loginBut">登录</span>
    </div>
    <p class="fotT">开通账户  新注册用户  请联系区域负责人</p>
    <p class="fotT">贵州  13590010000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重庆  139391001231</p>

   <!--
 -->

  </div>
</template>

<script>
import { Toast } from 'mint-ui'
// 数据请求
import req from '../../api/config'
export default {
  data () {
    return {
      popupVisible: false,
      getYZMBut: true, // 显示验证码按钮
      getImageData: '',
      mobile: '', // 手机号
      type: 1, // type：1(注冊绑定手机号)
      yzm: '' // 验证码
    }
  },
  props: {},
  watch: {},
  methods: {
    loginBut () {
      let _ = this
      // this.popupVisible = true;
      req.get('/bizUserCtrl/v1/login', {
        mobile: _.mobile,
        vcode: _.yzm,
        sessionKey: localStorage.getItem('sessionKey')
      }).then(result => {
        // console.log('登录成功---', result);
        if (result.data.code == 200) {
          // $store.commit('switch_dialog')
          // this.$store.dispatch('updateSessionKeyStatus',result.data.data.sessionKey);
          localStorage.setItem('userData', JSON.stringify(result.data.data.user))
          /**
               * 1：车商      ---->  车商首页
               * 2：信息商    ---->  信息商首页
               * 3：合伙人    ---->  合伙人首页
               */
          localStorage.setItem('userInfo', result.data.data.type)
          if (result.data.data.type == 1) {
            _.$router.push('/cardealer_index/')
          } else if (result.data.data.type == 2) {
            _.$router.push('/machine_index/')
          } else if (result.data.data.type == 3) {
            _.$router.push('/home/')
          } else {
            _.$router.push('/buyer_index/')
          }
        }
      })
    },
    regexTel () {
      let reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (!reg.test(this.mobile) && this.mobile.length < 1) {
        Toast({
          message: '无效手机号码',
          position: 'bottom',
          duration: 3000
        })
        return false
      } else {
        return true
      }
    },
    getMsgCode () {
      let ds = 60, daitv, _ = this
      if (!this.regexTel()) {
        return
      }
      clearInterval(daitv)
      daitv = setInterval(() => {
        this.getYZMBut = false
        --ds
        if (ds <= 0) {
          this.getYZMBut = true
          clearInterval(daitv)
          $('.getCode').text('获取验证码')
        } else {
          $('.getCode').text(ds + 's')
        }
      }, 1000)
      req.get('/messageCtrl/v1/sendMsg', {
        mobile: this.mobile,
        type: this.type
      }).then(result => {
        // console.log('短信验证码---', result.data);
        // _.yzm = result.data
      })
    }
  },
  filters: {},
  computed: {},
  created () {
    if (req.getRequest('code')) {
      req.get('/webchatCtrl/v1/wechatUseInfoAndSave', {
        code: req.getRequest('code'),
        state: req.getRequest('state')
      }).then(result => {
        localStorage.setItem('sessionKey', result.data.data.sessionKey)
      })
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

  }
}
</script>

<style lang="scss">
@import '~static/common/common.scss';
.loginHeadPic{
  background: linear-gradient(to bottom, #FB8875 0%,#F75463  100%);
  height: 5.4rem;
  text-align: center;
  img{
    display: inline-block;
    width: 3.94rem;
    height: 2.34rem;
    position: relative;
    top: 50%;
    transform: translateY(-50%)
  }
}
.loginFrom{
  width: 6.8rem;
  position: relative;
  margin: 0 auto;
  top: -.8rem;
  background-color: #fff;
  box-sizing: border-box;
  padding: .6rem .55rem;
  .lf-p{
    border-bottom: pxr(1) solid #BABABA;
    margin-bottom:.5rem;
    @extend .dis-flex;
    align-items: center;
    i,span,input{display: block;}
    .logInput{
      border: none;
      font-size: .28rem;
      @extend .flex-1;
      margin-bottom: 0;
    }
    .getCode{
      background: linear-gradient(to bottom, #FB8674 0%,#F75764  100%);
      padding: 0 .25rem;
      color: #fff;
      border-radius: .2rem;
      height: .46rem;
      line-height: .46rem;
      font-size: .24rem;
      width: 1.7rem;
      text-align: center;
      &.num{
        background: #ccc;
      }
    }
  }
  .logSubim{
    background: linear-gradient(to bottom, #FB8674 0%,#F75764  100%);
    color: #fff;
    height: 1rem;
    line-height: 1rem;
    font-size: .34rem;
    width: 4.8rem;
    display: block;
    border-radius: .5rem;
    text-align: center;
    margin: 1.15rem auto .55rem;
  }
}
.fotT{
  text-align: center;
  display: none;
  font-size: .26rem;
  color: #CACACA;
  margin-bottom: .25rem
}
.sPopup{
  width: 80vw;
  height: 100vh;
}
</style>
