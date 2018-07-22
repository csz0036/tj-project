<template>
	<section id="cardealerListWrap">
    <div class = 'mui-scroll-wrapper Muimargin' id="pullrefresh">
      <div class = 'mui-scroll'>
        <div class="mui-table-view-chevron">
          <div v-if="isNoData">
            <div class="no-data">
              暂时没有车源数据哟~<br/>
              <button class="m-btn" @click="findCar">找车源</button>
            </div>
          </div>
          <div class="car-list">
            <ul v-if="goodsList.length">
                <goods-list-item v-for="item in goodsList"
                  :key="item.name"
                  :carBtn="showBtn"
                  :removeBtn="showBtn"
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
    findCar () {
      this.$router.push({
        path: '/findcar_index'
      })
    },
    _initListData () {
      let self = this
      req.get('/informationCtrl/v1/getShopProducts', {
        sessionKey: localStorage.getItem('sessionKey'),
        pageNo: self.page,
        pageSize: self.pagesize
      }).then(res => {
        // console.log('登录成功---', res);
        // console.log(res.data.code )
        if (res.data.code === 200) {
          var d = res.data.data.productList
          if (d.length) {
            for (var i = 0; i < d.length; i++) {
              self.goodsList.push(d[i])
            }
          } else {
            self.isNoData = true
          }

          if (self.page == 1) {
            self.goodsInfo = res.data.data.shopInfo
            // rank>0认证车商，rank=几就显示几颗星
          }
          self.page += 1
          self.pagesize += 10
          self.totalCount = Math.ceil(
            res.data.data.totalCount / self.pageInt
          )
          mui('#pullrefresh').pullRefresh().endPullupToRefresh(self.page >= self.totalCount)
        }
      })
    },
    toRestaurant (ea) {
      // 跳转详情页
      // alert(ea)
      var shopInfo = JSON.parse(localStorage.getItem('userData'))
      var shopId = shopInfo.shopId
      this.$router.push({
        path: '/cardealer_detail?id=' + ea + '&shopId=' + shopId
        // query: {
        //   id: ea,
        //   shopId: shopId
        // }
      })
    }
  },
  pulldownRefresh () {
    // 下拉刷新
    let self = this
    setTimeout(() => {
      self.goodsList = []
      self.page = 1
      self.pagesize = 10
      self.isNoData = false
      self._initListData()
      mui('#pullrefresh')
        .pullRefresh()
        .endPulldownToRefresh()
    }, 500)
  },
  pullupRefresh () {
    // 上拉加载更多
    this._initListData()
  },
  markSoleFn (id) {
    // 标记已售
    // alert(id)

    req.get('/productCtrl/v1/updateSellStatus', {
      sessionKey: localStorage.getItem('sessionKey'),
      id: ea
    }).then(res => {
      console.log('成功---', res)
    })
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
@import "~static/common/common.scss";
@import "~@/assets/scss/mixin.scss";
.icon-share {
  display: inline-block;
  width: pxr(33);
  height: pxr(33);
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABCCAMAAAAsagstAAAAeFBMVEX///9KSlOFhYvw8PHFxchZWWH7+/vu7u+WlptSUltOTlefn6RcXGRUVF1ycnllZW339/fn5+nl5efBwcSsrLGjo6h4eH/i4uTNzdCHh41eXmbf3+DY2Nq4uLvz8/Ts7O2QkJZiYmrJycyLi5HT09bPz9HOztCZmZ61Pv3HAAABm0lEQVRYw+3Y23KCMBAG4F2UEM4CBUHw2NP7v2HHLDPQGBIy6VWH70pl/F0g6m5gwlre5CH+4icxAzUGCwKeolIMSrusVn9AHeKCBFTKO+JZVVCGaJU0+IgYfYGsPyFZe3afkTiU9nJFUpD5igf3sd4rzLEMSdRV5QFWOfoo5BeYqZF4Baz3EaHQsFml4117AysVkvfpJW4dRN7kO8JSOjWwRiVMy6qli12APW+8UY95cgdal/Mtuye+DEk4wFMjnlSgEdwi1PLFGeXicakJ2qdoQMuK1oBmQZ5xhYwB0CNY9MBVPGPSzsd1vk1JNyTevg92Woak6/jzMYCRISmmwwM4J3nSt9Q1ab8lbUlbkmMSixPqG5yT4vGf0z0pGfsr9yQUtqQtaUv6D0n67vB6fFo4eqCOCMjUsdorqVsFYuqizaNLA2Do7M068VYOztNGQZ1j6z4BeXTB2V9NZdxtUpyCwsBxei08JLXLRH0oqy6a5hXVlG/vFKh3HuyDeuVuiL0s0OzQWAhrZrlrpJZyuaDXnSyjMG94+1rPDypdFRwIZTaSAAAAAElFTkSuQmCC);
  background-size: cover;
}
.mui-scroll-wrapper.Muimargin {
  position: fixed;
  @include muiMargin(0px);
}

#cardealerListWrap {
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // left: 0;
  // right: 0;
  //     overflow: hidden;
  @import "~static/common/headerInfo.scss";
  .no-data{background: #f9f9f9;
    margin-top: pxr(323);
    text-align: center;
    background: url(img/ndata.png) no-repeat center top;
    background-size: pxr(170) auto;
    padding-top: pxr(160);
    color: #9fa1a2;
    .m-btn{
      width: pxr(200);
      height: pxr(80);
      outline: none;
      border: none;
      line-height: pxr(80);
      border-radius: 5px;
      color: #fff;
      background: #fe534a;
      margin: pxr(30) auto 0;
    }
  }
  .mui-pull-bottom-pocket {
    height: pxr(200) !important;
    .mui-pull {
      color: #9ea4af;
      position: static;
      text-align: center;
      line-height: pxr(200);
      .mui-icon {
        font-size: pxr(28);
      }
      .mui-pull-caption {
        font-size: pxr(28);
      }
    }
  }
  // #pullrefresh{
  //   margin-top: pxr(80);
  // }

  .car-list {
    background-color: #fff;
  }
  .star {
    display: inline-block;
    margin-left: pxr(20);
  }
  background-color: #f9f9f9;
}
</style>
