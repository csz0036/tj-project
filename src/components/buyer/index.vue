<template>
	<section id="buyerListWrap">
    <div class = 'mui-scroll-wrapper Muimargin' id="pullrefresh">
      <div class = 'mui-scroll'>
        <div class="mui-table-view-chevron">
          <article class="partnerList">
            <header class="partnerInfo">
              <div class="partnerPic">
                <img v-lazy="goodsInfo.headImg">
              </div>
              <div class="partnerText">
                <!-- <p class="pt-title">{{goodsInfo.companyName}}<i class="icon_edit"></i></p> -->
                <p class="pt-title">{{goodsInfo.companyName}}</p>
                <p class="pt-subTitle">{{goodsInfo.companyAddress}}</p>
                <p class="pt-x">
                  <span class="pt-papers" v-if="goodsInfo.rank > 0">认证车商</span>
                  <star v-if="goodsInfo.rank > 0" :size="24" :score="goodsInfo.rank"></star>
                </p>
              </div>
            </header>
            <button type="button" class="partnerBtn" v-if="showHeadBut == 1" @click="editFn(goodsInfo.id)">编辑</button>
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
      showHeadBut: localStorage.getItem('userInfo'),
      isNoData: false, // 没数据时为true
      id: '',
      goodsList: [],
      goodsInfo: {},
      page: 1, // 页码
      pageInt: 10,
      pagesize: 10, // 一页条数
      totalCount: '', // 总条数
      showBtn: false // 是否展示按钮组件
    }
  },
  props: {},
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
    _initListData (id) {
      let self = this
      // var data = {};
      // var ids = 0;
      // if(self.$route.query.id){
      //   ids = parseInt(self.$route.query.id)+0;
      //   console.log(ids)
      // }
      var data = {
        sessionKey: localStorage.getItem('sessionKey'),
        id: id,
        pageNo: self.page,
        pageSize: self.pagesize
      }
      // console.log('sdfsdf:',data)
      if (!self.isNoData) {
        req.get('/shopCtrl/v1/getShop', data).then(res => {
          // console.log('登录成功---', res);
          if (res.data.code === 200) {
            var d = res.data.data.productList
            if (d && d.length) {
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
      } else {
        mui('#pullrefresh').pullRefresh().endPullupToRefresh()
      }
    },
    pulldownRefresh () { // 下拉刷新
      let self = this
      setTimeout(() => {
        self.goodsList = []
        self.page = 1
        self.count = 0
        self._initListData(self.id)
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh()
      }, 500)
    },
    pullupRefresh () { // 上拉加载更多
      this._initListData(self.id)
    },

    // back () {
    //   this.$router.push({
    //     path: '/home'
    //   })
    // },
    toRestaurant (ea) {
      var _th = this
      _th.$router.push({
        path: '/buyer_detail',
        query: {
          id: ea
        }
      })
    }
  },
  filters: {},
  computed: {},
  created () {
  },
  mounted () {
    let self = this
    // console.log(self.$route.query.id)
    self.id = self.$route.query.id ? self.$route.query.id : ''
    self._initListData(self.id)
    // self.id = self.getQueryString('id');
    // console.log(self.getQueryString('id'))
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
      // self._initListData();
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
#buyerListWrap{
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
  // #pullrefresh{
  //   margin-top: pxr(80);
  // }

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
