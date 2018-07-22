<template>

	<section id="machineListWrap">
    <div class = 'mui-scroll-wrapper Muimargin' id="pullrefresh">
      <div class = 'mui-scroll'>
        <div class="mui-table-view-chevron">
          <article class="partnerList">
            <header class="partnerInfo" @click="editHead(goodsInfo.id)">
              <div class="partnerPic">
                <img v-lazy="goodsInfo.headImg">
              </div>
              <div class="partnerText">
                <!-- <p class="pt-title">{{goodsInfo.companyName}}<i class="icon_edit"></i></p> -->
                <p class="pt-title">{{goodsInfo.bossName}}</p>
                <p class="pt-subTitle">{{goodsInfo.companyAddress}}</p>
                <p class="pt-x">
                  <span class="pt-papers" v-if="goodsInfo.rank > 0">认证机械师</span>
                  <star v-if="goodsInfo.rank > 0" :size="24" :score="goodsInfo.rank"></star>
                </p>
              </div>
            </header>
            <div class="btn-wrap">
              <button type="button" class="m-btn zx-btn" @click="pubFn()">发布设备</button>
              <button type="button" class="m-btn ml30" @click="manageFn(goodsInfo.id)">车源管理</button>
            </div>

          </article>
          <div class="car-list">
            <ul>
                <goods-list-item v-for="item in goodsList"
                  :key="item.name"
                  :editBtn="showBtn"
                  :data="item"
                  @toRestaurant="toRestaurant(item.id)"></goods-list-item>
            </ul>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>
<script>
import goodsListItem from '@/components/common/goods-list-item/goods-list-item'
import Star from '@/components/common/star/star'
import mui from 'static/js/mui'

// 数据请求
import req from '../../api/config'
export default {
  components: {
    goodsListItem,
    Star
  },
  data () {
    return {
      isNoData: false, // 没数据时为true
      goodsList: [],
      goodsInfo: {},
      page: 1, // 页码
      pageInt: 10,
      pagesize: 10, // 一页条数
      totalCount: '', // 总条数
      showBtn: true // 是否展示按钮组件
    }
  },
  props: {},
  watch: {},
  methods: {
    editHead (id) {
      this.$router.push({
        path: '/buyer_index',
        query: {
          id: id
        }
      })
    },
    pubFn () {
      var shopInfo = JSON.parse(localStorage.getItem('userData'))
      var shopId = shopInfo.shopId
      this.$router.push({
        path: '/publish',
        query: {
          shopId: shopId
        }
      })
    },
    manageFn (id) {
      /* this.$router.push({
        path: '/buyer_index',
        query: {
            id: id
        }
      }) */
      this.$router.push({
        path: '/carsource_index/',
        query: {
          id: id
        }
      })
    },
    _initListData () {
      let self = this
      var pra = {}
      if (self.$route.query.id) {
        pra = {
          sessionKey: localStorage.getItem('sessionKey'),
          pageNo: self.page,
          pageSize: self.pagesize,
          id: this.$route.query.id
        }
      } else {
        pra = {
          sessionKey: localStorage.getItem('sessionKey'),
          pageNo: self.page,
          pageSize: self.pagesize
        }
      }
      req.get('/shopCtrl/v1/getShop', pra).then(res => {
        // console.log('登录成功---', res);
        // console.log(res.data.code )
        if (res.data.code === 200) {
          var d = res.data.data.productList
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
              var shareName = ''
              if (shopType == 1) {
                shareName = res.data.data.shopInfo.companyName
              } else {
                shareName = res.data.data.shopInfo.bossName
              }
              var linkUrl = window.location.href
              // if(shopType == 2){
              //   linkUrl = linkUrl.split('?')[0]+'?'+linkUrl.split('?')[1];
              //   linkUrl = linkUrl+'?userId=' + shopInfo.id + '&id='+ id;
              // }
              var shareData = {
                title: `${shareName}的档口刚刚上新，快点开看看！`,
                desc: '我是天机工程机械平台认证店铺',
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
          if (d.length) {
            for (var i = 0; i < d.length; i++) {
              self.goodsList.push(d[i])
            }
          } else {
            self.isNoData = true
          }

          if (self.page == 1) {
            self.goodsInfo = res.data.data.shopInfo
          }
          self.page += 1
          self.pagesize += 10
          self.totalCount = Math.ceil(res.data.data.totalCount / self.pageInt)
          mui('#pullrefresh').pullRefresh().endPullupToRefresh(self.page >= self.totalCount)
        }
      })
    },
    pulldownRefresh () { // 下拉刷新
      let self = this
      setTimeout(() => {
        self.goodsList = []
        self.page = 1
        self.pagesize = 10
        self.isNoData = false
        self._initListData()
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh()
      }, 500)
    },
    pullupRefresh () { // 上拉加载更多
      this._initListData()
    },
    markSoleFn (id) { // 标记已售
      req.get('/productCtrl/v1/updateSellStatus', {
        sessionKey: localStorage.getItem('sessionKey'),
        id: ea
      }).then(res => {
        console.log('成功---', res)
      })
    },
    toRestaurant (ea) { // 跳转详情页
      // alert(ea)
      this.$router.push({
        path: '/cardealer_detail',
        query: {
          id: ea
        }
      })
    }
  },
  filters: {},
  computed: {},
  created () {
    // 初始化列表数据
    this._initListData()
  },
  mounted () {
    let self = this
    mui.ready(function () {
      mui.init({
        pullRefresh: {
          container: '#pullrefresh', // 待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
          down: {
            height: 50, // 可选,默认50.触发下拉刷新拖动距离,
            auto: false, // 可选,默认false.首次加载自动下拉刷新一次
            contentdown: '下拉可以刷新', // 可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: '释放立即刷新', // 可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: '正在刷新...', // 可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: self.pulldownRefresh
          },
          up: {
            height: 50, // 可选.默认50.触发上拉加载拖动距离
            auto: false, // 可选,默认false.自动上拉加载一次
            contentrefresh: '正在加载...', // 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: '没有更多数据了', // 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: self.pullupRefresh
          }
        }
      })
    })
  }
}
</script>
<style scoped  lang="scss">
@import '~static/common/common.scss';
@import '~@/assets/scss/mixin.scss';
.icon-share{
	display: inline-block;
    width: pxr(33);
    height: pxr(33);
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABCCAMAAAAsagstAAAAeFBMVEX///9KSlOFhYvw8PHFxchZWWH7+/vu7u+WlptSUltOTlefn6RcXGRUVF1ycnllZW339/fn5+nl5efBwcSsrLGjo6h4eH/i4uTNzdCHh41eXmbf3+DY2Nq4uLvz8/Ts7O2QkJZiYmrJycyLi5HT09bPz9HOztCZmZ61Pv3HAAABm0lEQVRYw+3Y23KCMBAG4F2UEM4CBUHw2NP7v2HHLDPQGBIy6VWH70pl/F0g6m5gwlre5CH+4icxAzUGCwKeolIMSrusVn9AHeKCBFTKO+JZVVCGaJU0+IgYfYGsPyFZe3afkTiU9nJFUpD5igf3sd4rzLEMSdRV5QFWOfoo5BeYqZF4Baz3EaHQsFml4117AysVkvfpJW4dRN7kO8JSOjWwRiVMy6qli12APW+8UY95cgdal/Mtuye+DEk4wFMjnlSgEdwi1PLFGeXicakJ2qdoQMuK1oBmQZ5xhYwB0CNY9MBVPGPSzsd1vk1JNyTevg92Woak6/jzMYCRISmmwwM4J3nSt9Q1ab8lbUlbkmMSixPqG5yT4vGf0z0pGfsr9yQUtqQtaUv6D0n67vB6fFo4eqCOCMjUsdorqVsFYuqizaNLA2Do7M068VYOztNGQZ1j6z4BeXTB2V9NZdxtUpyCwsBxei08JLXLRH0oqy6a5hXVlG/vFKh3HuyDeuVuiL0s0OzQWAhrZrlrpJZyuaDXnSyjMG94+1rPDypdFRwIZTaSAAAAAElFTkSuQmCC) no-repeat center center;
    background-size: cover
  }
.mui-scroll-wrapper.Muimargin{
  position: fixed;
	@include muiMargin(0px);
}

#machineListWrap{
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // left: 0;
  // right: 0;
  //     overflow: hidden;
  @import '~static/common/headerInfo.scss';
  .mui-pull-bottom-pocket{
    height: pxr(200) !important;
    .mui-pull{
      color: #9EA4AF;
      position: static;
      text-align: center;
      line-height: pxr(200);
      .mui-icon{
        font-size: pxr(28)
      }
      .mui-pull-caption{
        font-size: pxr(28)
      }
    }
  }
  #pullrefresh{
    padding-bottom: pxr(100);
  }

  .car-list {
    background-color: #fff;
  }
  .star{
    display: inline-block;
    margin-left: pxr(20);
  }
  background-color: #F9F9F9;

}

</style>
