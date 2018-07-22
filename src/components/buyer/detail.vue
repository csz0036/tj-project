<template>
<transition name="shift">
	<section class="mui-scroll-wrapper" id="buyerDetailWrap" v-show="pageShow" ref="goodsDetailRef">
    <div class="mui-scroll">
        <!-- 商品图片 -->
        <mt-swipe :auto="2000">
          <mt-swipe-item v-for="item in base.imgs" :key="item.id">
              <img :src="item.url"/>
          </mt-swipe-item>
        </mt-swipe>
        <!-- 商品简介 -->
        <div class="title-content">
          <div class="name">{{base.zhBrandName}}{{base.modelName}}{{base.categoryName}}{{base.outDate}}年{{base.hoursDesc}}小时<span class="red">(编号:{{base.id}})</span></div>
          <div class="city">{{base.province}} {{base.city}}</div>
          <div class="icon-wrap" v-if="isiconW">
            <i v-for="item in iconW" :class="{'act':(item=='急售')?true:''}">{{item}}</i>
          </div>
          <div class="detail">
            <div class="price">{{base.sellPrice}}<i>万</i></div>
            <div class="time">{{base.publishTime}}</div>
          </div>
        </div>

        <article class="partnerList">
            <header class="partnerInfo">
              <div class="partnerPic">
                <img v-lazy="goodsInfo.headImg">
              </div>
              <div class="partnerText">
                <p class="pt-title" v-if="goodsInfo.type == 2">{{goodsInfo.bossName}}</p>
                <p class="pt-title" v-if="goodsInfo.type == 1">{{goodsInfo.companyName}}</p>
                <p class="pt-subTitle">{{goodsInfo.companyAddress}}</p>
                <p class="pt-x">
                  <span class="pt-papers" v-if="goodsInfo.companyName">认证车商</span>
                  <span class="pt-papers" v-if="goodsInfo.bossName">认证机械师</span>
                  <star v-if="goodsInfo.rank > 0" :size="24" :score="goodsInfo.rank"></star>
                </p>
              </div>
            </header>
            <div class="btn-wrap" style="display:none;">
              <div class="m-btn" @click="goIndex(goodsInfo.shopId)">全部设备（{{totalCount}}）</div>
              <div class="m-btn zx-btn ml30" @click="phoneCall(base.telephone,base.id)">咨询底价</div>
            </div>
          </article>
        <!-- 机况描述 -->

        <div class="condition mb24" v-if="base.productName">
          <div class="m-tit">机况描述</div>
          <div class="m-des">
            {{base.productName}}
          </div>
        </div>

        <div class="condition">
          <div class="m-pic">
            <div v-for="item in base.imgs">
              <img v-lazy="item.url">
            </div>
          </div>
        </div>
        <!-- 本店在售设备 -->
        <div class="car-list" style="display:none">
            <ul>
                <!-- <goods-list-item v-for="item in goodsList"
                  :key="item.name"
                  :data="item"
                  @toRestaurant="toRestaurant(item)"></goods-list-item> -->
            </ul>
          </div>

    </div>
    <div class="btn-wrap-bottom">
      <div class="m-btn" @click="phoneCall(base.telephone,base.id)">咨询底价</div>
    </div>
  </section>
</transition>
</template>
<script>
import goodsListItem from '@/components/common/goods-list-item/goods-list-item'
import Star from '@/components/common/star/star'
import mui from 'static/js/mui'
import req from '../../api/config'
export default {
  components: {
    goodsListItem,
    Star
  },
  data () {
    return {
      // 该页是否显示
      id: '',
      pid: '',
      base: [],
      totalCount: 0,
      goodsList: [],
      goodsInfo: {},
      pageShow: true,
      iconW: [],
      isiconW: true
    }
  },
  created () {
    // 初始化列表数据
    if (!localStorage.getItem('reloadPage')) {
      localStorage.setItem('reloadPage', 1)
      location.reload(true)
    }
  },
  mounted () {
    var _th = this
    _th.id = this.$route.query.id
    mui('.mui-scroll-wrapper').scroll({
      deceleration: 0.0005, // flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
      indicators: false // 是否显示滚动条
    })
    _th.initDetail(_th.id)
  },
  methods: {
    phoneCall (t, id) {
      req.get('/productCallCtrl/v1/add', {
        productId: id,
        mobile: t,
        sessionKey: localStorage.getItem('sessionKey')
      }).then(res => {
        if (res.data.code === 200) {
          window.location.href = 'tel:' + t
        }
      })
    },
    goIndex (id) {
      var _th = this
      _th.$router.push({
        path: '/buyer_index',
        query: {
          id: id
        }
      })
    },
    initDetail (id) {
      var _th = this
      var userId = this.$route.query.userId || ''

      req.get('/productCtrl/v1/getProductDetail', {
        id: id,
        userId: userId
      }).then(res => {
        // console.log("成功---", res);
        if (res.data.code === 200) {
          _th.base = res.data.data
          _th.base.signDesc == '' ? _th.isiconW = false : ''
          _th.iconW = Array.from(new Set(_th.base.signDesc.split(',')))
          req.get('/webchatCtrl/v1/getJsSdkSignature', {
            url: window.location.href
          }).then(result => {
            // 微信分享
            wx.config({
              debug: false,
              appId: result.data.data.config.appId,
              timestamp: result.data.data.config.timestamp,
              nonceStr: result.data.data.config.noncestr,
              signature: result.data.data.config.signature,
              jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'hideMenuItems'
              ]
            })
            wx.ready(function () {
              //  批量隐藏菜单项
              wx.hideMenuItems({
                menuList: [
                  'menuItem:editTag', // 编辑标签
                  'menuItem:delete', // 删除
                  'menuItem:copyUrl', // 复制链接
                  'menuItem:originPage', // 原网页
                  'menuItem:readMode', // 阅读模式
                  'menuItem:openWithQQBrowser', // 在QQ浏览器中打开
                  'menuItem:openWithSafari', // 在Safari中打开
                  'menuItem:share:email', // 邮件
                  'menuItem:share:qq', // 分享到QQ
                  'menuItem:share:QZone' // 分享到 QQ 空间
                ],
                success: function (res) {
                  // alert('hideMenuItems,success'+JSON.parse(res));
                },
                fail: function (res) {
                  // alert('hideMenuItems,fail'+JSON.parse(res));
                }
              })
              // 分享接口
              var shopInfo = JSON.parse(localStorage.getItem('userData'))
              var shopType = shopInfo.type
              var linkUrl = window.location.href
              if (shopType == 2) {
                linkUrl = linkUrl.split('?')[0] + '?' + linkUrl.split('?')[1]
                linkUrl = linkUrl + '?userId=' + shopInfo.id + '&id=' + id
              }
              var shareData = {
                title: `【售】${_th.base.zhBrandName}${_th.base.modelName}${_th.base.categoryName} ${_th.base.outDate}年 ${_th.base.hoursDesc}小时`,
                desc: _th.base.signDesc,
                link: linkUrl,
                imgUrl: _th.base.imgs[0].url + '!260X260',
                trigger: function (res) {
                  // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                  // alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                  // alert('已分享');
                },
                cancel: function (res) {
                  // 取消时的回调函数
                  // alert('已取消');
                },
                fail: function (res) {
                  // 接口调用失败时执行的回调函数。
                  // alert('fail::::'+JSON.stringify(res));
                }
              }

              // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
              wx.onMenuShareAppMessage(shareData)
              // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
              wx.onMenuShareTimeline(shareData)
            })
            wx.error(function (res) {
              // window.location.href = window.location.href;
              req.get('/productCtrl/v1/getProductDetail', {
                id: id,
                userId: userId
              }).then(res => {
                // console.log("成功---", res);
                if (res.data.code === 200) {
                  _th.base = res.data.data
                }
              })
            })
          })

          _th._initListData(_th.base.shopId)
        }
      })
    },
    _initListData (id) {
      let self = this
      var data = {
        sessionKey: localStorage.getItem('sessionKey'),
        id: id,
        // shopId:shopId,
        pageNo: 0, // 传0只显示shopInfo   传1都展示
        // sellStatus:0,
        pageSize: 5
      }
      req.get('/shopCtrl/v1/getShop', data).then(res1 => {
        // console.log("登录成功---", res);
        // console.log(res.data.code )
        if (res1.status === 200) {
          // var d = res.data.data.productList;
          // if (d.length) {
          //   for (var i = 0; i < d.length; i++) {
          //     self.goodsList.push(d[i]);
          //   }
          // } else {
          //   self.isNoData = true;
          // }
          self.goodsInfo = res1.data.data.shopInfo
          self.totalCount = res1.data.data.totalCount
        }
      })
    }
  }
}
</script>
<style scoped  lang="scss">
@import "~static/common/common.scss";

#buyerDetailWrap {
  position: fixed;
  line-height: 1.4;
  @import "~static/common/headerInfo.scss";
  .mb24 {
    margin-bottom: pxr(24);
  }
  .star {
    display: inline-block;
    margin-left: pxr(20);
  }

  .btn-wrap-bottom {
    position: fixed;
    z-index: 9999;
    left: 0;
    right: 0;
    bottom: 0;
    padding: pxr(30);
    background: #fff;
    @extend .dis-flex;
    .m-btn {
      height: 100%;
      width: 100%;
      background: #fe534a;
      color: #fff;
      font-size: pxr(34);
      line-height: pxr(80);
      text-align: center;
      border-radius: pxr(8);
    }
    .m-edit {
      width: pxr(411);
      height: pxr(80);
      @extend .flex-1;
      background: #02ba6f;
      margin-left: pxr(30);
    }
  }
  .mui-scroll {
    // padding-top: pxr(80);
    padding-bottom: pxr(108);
  }
  // position: fixed;
  // left: 0;

  // bottom: 48px;
  // width: 100%;
  // z-index: 30;
  // transform: translate3d(0, 0, 0);
  // overflow: hidden;
  &.shift-enter-active,
  &.shift-leave-active {
    transition: all 0.2s linear;
  }
  &.shift-enter,
  &.shift-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .condition {
    background: #fff;
    padding: pxr(30);
    .m-tit {
      font-size: pxr(30);
      color: #606060;
      margin-bottom: pxr(20);
    }
    .m-des {
      font-size: pxr(26);
      color: #959698;
      line-height: 1.4;
      margin-bottom: pxr(30);
    }
    .m-pic {
      img {
        width: 100%;
        margin-bottom: pxr(24);
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .car-list {
    background-color: #fff;
    margin-top: pxr(24);
    padding-bottom: pxr(100);
  }
  // 商品图片
  .mint-swipe {
    // 制作一个宽高相等的容器
    position: relative;
    width: 100%;
    height: pxr(520);
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  //
  .title-content {
    min-height: pxr(228);
    padding: pxr(30);
    background: #fff;
    margin-bottom: pxr(24);
    .detail {
      position: relative;
      margin-top: pxr(20);
      .price {
        @extend .flex-1;
        font-size: pxr(36);
        color: #ff3333;
        i {
          font-size: pxr(24);
        }
      }
      .time {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        font-size: pxr(28);
        color: #959698;
      }
    }
    .name {
      font-size: pxr(34);
      color: #343a3d;
      margin-bottom: pxr(10);
      span{
        font-size: pxr(30);
        color: #FF3333;

      }
    }
    .city {
      font-size: pxr(28);
      color: #606060;
    }
    .icon-wrap{
      transform: translate3d(0,0,0);
      margin-top: pxr(8);
      // @extend .dis-flex;
      i{
        font-size: pxr(24);
        margin:0 pxr(10) pxr(5) 0;
        word-break: break-all;
        display: inline-block;
        color: #028ce6;
        border: 1px solid #a8d7f6;
        border-radius: 2px;
        line-height: 1;
        padding: pxr(3) pxr(10);
        &.act{
          color: #fe534a;
          border-color: #fe534a;
        }
      }
    }
  }
}
</style>
