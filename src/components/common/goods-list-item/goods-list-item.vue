<!-- 商家列表 组件 -->

<template>
  <li v-if="isrmove">
    <a href="JavaScript:;" @click="toRestaurant(data)">
        <div class="goods-tit" v-if="carBtn && data.shopModel">{{data.shopModel.companyName}}</div>
        <div class="goods-tit" v-if="!carBtn && data.userName">{{data.userName}}</div>
        <div class="goods-bd">
          <div class="list-lt">
              <img v-lazy="data.headImg">
              <div class="down-icon off" v-if="data.sellStatus == 1 || isDis">
                  已售
                </div>
          </div>
          <div class="pd-info">
              <h2>{{ data.productName }}</h2>
              <div class="taimAddrWrap">
                  <span class="pd-time">{{ data.outDate+'年' }}<i>|</i>{{ data.hoursDesc + '小时' }}<i>|</i></span><span class="adr_t">{{ data.province + data.district }}</span>
              </div>
              <div class="index-icon" v-if="data.signDesc != ''">
                <i v-for="(item, index) in Array.from(new Set(data.signDesc.split(',')))" :key="index" :class="{'act':(item=='急售')?true:''}" v-if="index<3">{{item}}</i>
              </div>
              <div class="price-icon">
                  <div class="price">
                      {{ data.sellPrice }}<i>万</i>
                  </div>
              </div>
          </div>
        </div>
    </a>
    <div class="btn-wrap" v-if="editBtn">
      <button type="button"  :class="{'m-btn':true,dis:isDis}" @click="markSoleFn(data.id)" v-if="data.sellStatus != 1">标记已售</button>
      <button type="button" class="m-btn m-edit" @click="editFn(data.id)">编辑</button>
      <button type="button" class="m-btn m-share" @click="shareleFn(data.id)">分享</button>
    </div>
    <div class="btn-wrap" v-if="carBtn">
      <button type="button" :class="{'m-btn':true,dis:isAddDis}" @click="addFn(data.id, data.shopId)" v-if="addBtn">添加到我的店</button>
      <button type="button" class="m-btn" @click="removeFn(data.shopProductId)" v-if="removeBtn">移除</button>
      <button type="button" class="m-btn m-edit" @click="linkFn(data.telephone)">联系卖家</button>
      <button type="button" class="m-btn m-share" @click="shareleFn(data.id)">分享</button>
    </div>
  </li>
</template>
<style lang="scss" scoped>
@import '~static/common/common.scss';
@import '~static/common/carList.scss';
</style>
<script>
import Star from '@/components/common/star/star'
import req from '../../../api/config'
import { MessageBox } from 'mint-ui'
export default {
  components: {
  },
  data () {
    return {
      isDis: false,
      isAddDis: false,
      isrmove: true
      // signDesc:'有合格证,产权清晰,个人车源,随时看车'
    }
  },
  props: {
    editBtn: {
      type: Boolean
    },
    carBtn: {
      type: Boolean
    },
    removeBtn: {
      type: Boolean
    },
    addBtn: {
      type: Boolean
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {},
  methods: {
    editFn (id) {
      alert(id)
      // var _th = this;
      // _th.$router.push({
      //   path: '/buyer_detail',
      //   query: {
      //       id: id
      //   }
      // })
    },
    shareleFn (id) {
      var _th = this

      var userInfo = JSON.parse(localStorage.getItem('userData'))

      alert(id)
    },
    addFn (id, shopId) {
      var _th = this
      // alert(id)
      req.get('/informationCtrl/v1/addProduct', {
        sessionKey: localStorage.getItem('sessionKey'),
        productId: id,
        shopId: shopId
      }).then(res => {
        _th.isAddDis = true
      })
    },
    linkFn (tel) {
      window.location.href = 'tel:' + tel
    },
    removeFn (id) {
      var _th = this
      // alert(id)
      req.get('/informationCtrl/v1/removeProduct', {
        sessionKey: localStorage.getItem('sessionKey'),
        id: id
      }).then(res => {
        _th.isrmove = false
      })
    },
    markSoleFn (id) {
      MessageBox.confirm('确定标记已售?').then(action => {
        this.isDis = true
        req.get('/productCtrl/v1/updateSellStatus', {
          sessionKey: localStorage.getItem('sessionKey'),
          id: id
        }).then(res => {
          console.log('成功---', res)
        })
      })
      // this.$emit('markSoleFn', id)
    },
    toRestaurant (data) {
      this.$emit('toRestaurant', data.id)
    }
  },
  filters: {},
  computed: {},
  created () {
    $('.car-list').on('tap', 'a', function () {
      $(this).click()
    })
  },
  mounted () {},
  destroyed () {}
}
</script>
