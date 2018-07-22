<template>
	<section id="cardealerListWrap">
    <div class = 'mui-scroll-wrapper Muimargin' id="pullrefresh">
      <div class = 'mui-scroll'>
        <div class="mui-table-view-chevron">
          <div class="search">
            <form>
              <input type="search" placeholder="输入搜索的内容（车商名称or设备型号）" @keydown="search($event)" v-model="keyword">
            </form>
          </div>
          <div class="car-list">
            <ul>
                <goods-list-item v-for="item in goodsList"
                  :key="item.name"
                  :carBtn="showBtn"
                  :addBtn="showBtn"
                  :data="item"
                  @toRestaurant="toRestaurant(item.id)"></goods-list-item>
            </ul>
          </div>
          <!-- <div class="isNoData" v-show="isNoData">已经没数据了~</div> -->
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
      keyword: '',
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
    search (ev) {
      if (ev.keyCode == 13) {
        var self = this
        self.goodsList = []
        self.page = 1
        self.pagesize = 10
        this._initListData()
      }
    },
    _initListData () {
      let self = this
      // if(!self.isNoData){
      req.get('/productCtrl/v1/searchProducts', {
        sessionKey: localStorage.getItem('sessionKey'),
        keyWords: self.keyword,
        pageNo: self.page,
        pageSize: self.pagesize
      }).then(res => {
        // console.log('登录成功---', res);
        // console.log(res.data.code )
        if (res.data.code === 200) {
          var d = res.data.data.productList
          if (res.data.data.totalCount == 0) {
            self.goodsList = []
            self.page = 1
            self.pagesize = 10
            self.keyword = ''
            return
          }

          if (d.length) {
            // console.log(d.length)
            for (var i = 0; i < d.length; i++) {
              self.goodsList.push(d[i])
            }
          } else {
            self.goodsList = []
            self.page = 1
            self.pagesize = 10
            self.isNoData = true
          }

          self.page += 1
          self.pagesize += 10
          self.keyword = ''
          self.totalCount = Math.ceil(res.data.data.totalCount / self.pageInt)
          mui('#pullrefresh').pullRefresh().endPullupToRefresh(self.page >= self.totalCount)
        }
      })
      // }else{
      //   mui('#pullrefresh').pullRefresh().endPullupToRefresh();
      // }
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
      // alert(id)

      req.get('/productCtrl/v1/updateSellStatus', {
        sessionKey: localStorage.getItem('sessionKey'),
        id: ea
      }).then(res => {
        console.log('成功---', res)
      })
    },
    toRestaurant (ea) { // 跳转详情页
      var shopInfo = JSON.parse(localStorage.getItem('userData'))
      var shopId = shopInfo.shopId
      this.$router.push({
        path: '/cardealer_detail',
        query: {
          id: ea,
          shopId: shopId
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

#cardealerListWrap{
  .search{
    background: #fff;
    padding: pxr(30) pxr(30) pxr(10);
    position: relative;
    &:before{
      position: absolute;
      top: 50%;
      margin-top: pxr(13);
      left: pxr(62);
      transform: translateY(-50%);
      width: pxr(28);
      height: pxr(28);
      content: '';
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAS1BMVEUAAACfpbCiprKksLWfpbCepLCeprGfpbCfpbCkrLWfpLCepa+fpa+fpbCfpbChpLKgp7SlrbipqbefpLCfpbGgpbGfpLCfpbCepK/+D23GAAAAGHRSTlMAwz4OidqMoXwb9/OwrXZMJRUSt1hbWuae/j4jAAABAElEQVQ4y72U27KDIAxFuUi9Ha9Vu/7/S890Wie2gsBL9xODixhCstVR81Zq17ZOl9usrjRoDtJDEDQ7KLDxk7fX196M1o6mf527eUB7B5pikp2paIC7PZEO6OrPzboD3Df7jFmpk6pn3HOei/Jo+c7XSExfXKNEGjoVUAf6UHlo6hBaNzBIUMnHW28JOwNTGJ2AvR9WOeaVhvW9LKG/Qnso5ZS5Qo381cF4hY7g3ssW7BVqoc1AMxLIuFZ+sbb4E2wZD5vRLvlNGG/tjIHJHsP4cOt0y3gUiUakH1Ck2Zv9Q9iYaQobseIgq+Z1N/hVDF7YoH7CLulsoRJVlbXK0D9jXB3YQ81KRwAAAABJRU5ErkJggg==) no-repeat;
      background-size: pxr(28) auto;
      z-index: 22;
    }
    input{
      text-align: left;
      position: relative;
      line-height: 21px;
      width: 100%;
      height: pxr(64);
      margin-bottom: 0;
      padding: 0 0 0 pxr(76);
      border: none;
      border-radius: pxr(30);
      background: #F5F8FA;
      box-shadow: inset 0 1px 3px 0 rgba(248,248,248,0.50);
      border-radius: 30px;
      font-size: pxr(28);
      color: #9EA4AF;
    }
  }
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
  background-color: #F9F9F9;

}

</style>
