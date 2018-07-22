<!-- 评星 组件 -->

<template>
  <div class="popupComponents" v-if="pop">
      <div class="popupType">
        <div class="imgType"><img :src="img" /></div>
        <div class="textType">{{text}}</div>
        <div class="butType">
            <div class="bt" v-if="but == 'home'">
                <p @click="goMerchantProve">车商认证</p>
                <p @click="goAddMerchant">信息商认证</p>
            </div>
            <div class="bt" v-if="but == 'add'">
                <p @click="goHome">返回首页</p>
                <p @click="clearForm" class="add">继续添加</p>
            </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {}
  },
  props: {
    // 显示
    pop: {
      type: Boolean
    },
    // 按钮
    but: {
      type: String
    },
    // 内容
    text: {
      type: String
    },
    // 图片
    img: {
      type: String
    }
  },
  watch: {},
  methods: {
    goMerchantProve () {
      this.pop = false
      this.$router.push('/merchantProve/')
    },
    goAddMerchant () {
      this.pop = false
      this.$router.push('/addMerchant/')
    },
    goHome () {
      this.pop = false
      this.$router.push('/home/')
    },
    clearForm () {
      this.pop = false
      location.reload()
    }
  },
  filters: {},
  computed: {

  },
  created () {},
  mounted () {},
  destroyed () {}
}
</script>

<style lang="scss" scoped>
@import '~static/common/common.scss';
.popupComponents{
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 200;
    background-color: rgba(0, 0, 0, .7);
    top: 0;
    left: 0;
    .popupType{
        width: 6rem;
        height: 5rem;
        background-color: #fff;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: .05rem;
        transform: translate3d(-50%, -50% ,0);
        .imgType{
            padding: .4rem 0;
            box-sizing: border-box;
            img{
                margin: 0 auto;
                width: 1.62rem;
                display: block;
            }
        }
        .textType{
            font-size: .28rem;
            color: #000;
            margin: .2rem 0;
        }
        .butType{
            margin-top: .5rem;
            .bt{
                display: flex;
                justify-content: center;
                p{
                    width: 2rem;
                    height: .7rem;
                    line-height: .7rem;
                    border-radius: .05rem;
                    background-color: #f5f8fa;
                    color: #959698;
                    font-size: .26rem;
                    margin: 0 .2rem;
                    &.add{
                        color: #fff;
                        background-color: #f6534a;
                    }
                }
            }

        }
    }
}
</style>
