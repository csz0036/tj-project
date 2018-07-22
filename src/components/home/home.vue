<template>
	<section id="partnerListWrap"
    v-infinite-scroll="pullupRefresh"
    infinite-scroll-disabled='loading'
    infinite-scroll-distance="10"
  >
    <!-- <div class="mui-scroll-wrapper Muimargin" id="partnerListWrap">
	<div class="mui-scroll"> -->
    <article class="partnerList" v-for="item in partnerListData" :data-id="item.id" >
        <header class="partnerInfo" @click="goCardealerIndex(item.id ,item.companyName)">
            <div class="partnerPic"><img :src="item.headImg" /></div>
            <div class="partnerText">
              <p class="pt-title" v-if="item.companyName">{{item.companyName}}</p>
              <p class="pt-title" v-else>{{item.bossName}}</p>
              <p class="pt-subTitle">{{item.companyAddress}}</p>
              <p class="pt-x" v-if="item.rank > 0">
                  <span class="pt-papers" v-if="item.companyName">认证车商</span>
                  <span class="pt-papers" v-else>认证机械师</span>
                  <star :size="24" :score="item.rank"></star>
              </p>
            </div>
        </header>
        <footer class="partnerBut">
            <p @click="goAddMerchant">编辑资料</p>
            <p><a :href="'tel:' + item.telephone">联系电话</a></p>
            <p>查看设备({{item.productNum}})</p>
            <p @click="goPubish(item.id)">发布设备</p>
        </footer>
    </article>
	<!-- </div>
    </div> -->
  </section>
</template>

<script>
import Star from '@/components/common/star/star'
import mui from 'static/js/mui'
// 数据请求
import req from '../../api/config'

export default {
  components: {
    Star
  },
  data () {
    return {
      partnerListData: [], // 车商列表
      wm_poi_score: 0, // 星星
      sessionKey: localStorage.getItem('sessionKey'),
      pageNo: 1, // 页码。取值范围:大于零的整数;默认值:1
      pageSize: 20, // 每页条数。取值范围：1~1000;默认值:1000
      loading: true // 若为真，则无限滚动不会被触发
    }
  },
  props: {},
  watch: {},
  methods: {
    goCardealerIndex (id, got) {
      if (got) {
        this.$router.push({
          path: '/cardealer_index',
          query: {
            id: id
          }
        })
      } else {
        this.$router.push({
          path: '/machine_index',
          query: {
            id: id
          }
        })
      }
    },
    goAddMerchant () {
      // this.$router.push({
      //     path: '/machine_index',
      //     query: {
      //         id: id
      //     }
      //   });
      this.$router.push('/addMerchant/')
    },
    goPubish (id) {
      this.$router.push({
        path: '/publish',
        query: {
          shopId: id,
          _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
        }
      })
    },
    getList (parm) {
      let _th = this
      console.log('parm---', parm)
      req.get('/shopCtrl/v1/getCopartnerShopList', parm).then(result => {
        console.log('车商设备列表---', result)
        _th.partnerListData = [..._th.partnerListData, ...result.data.data]
        if (result.data.data.length < _th.pageSize && _th.pageNo > 1) {
          // 当这一页请求数据没超过每页条数着不在请求
          _th.loading = false
        }
      })
    },
    pulldownRefresh () { // 下拉刷新
      let self = this
      setTimeout(() => {
        self.partnerListData = []
        self.pageNo = 1
        self.pageSize = 20
        self.getList({
          sessionKey: localStorage.getItem('sessionKey'),
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        mui('#partnerListWrap').pullRefresh().endPulldownToRefresh()
      }, 500)
    },
    pullupRefresh () { // 上拉加载更多
      this.pageNo++
      this.getList({
        sessionKey: localStorage.getItem('sessionKey'),
        pageNo: this.pageNo,
        pageSize: this.pageSize
      })
    }
  },
  filters: {},
  computed: {

  },
  created () {
    // console.log('$store.state.sessionKey', localStorage.getItem('sessionKey') )
    this.getList({
      sessionKey: localStorage.getItem('sessionKey'),
      pageNo: this.pageNo,
      pageSize: this.pageSize
    })
  },
  mounted () {
    let self = this
    // console.log('sessionKey', localStorage.getItem('sessionKey'))
    /* mui.ready(function(){
      mui.init({
          pullRefresh : {
              container:"#partnerListWrap",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
              down: {
                height:50,//可选,默认50.触发下拉刷新拖动距离,
                auto: false,//可选,默认false.首次加载自动下拉刷新一次
                contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: self.pulldownRefresh
              },
              up : {
                  height:50,// 可选.默认50.触发上拉加载拖动距离
                  auto:false,// 可选,默认false.自动上拉加载一次
                  contentrefresh : "正在加载...",// 可选，正在加载状态时，上拉加载控件上显示的标题内容
                  contentnomore:'没有更多数据了',// 可选，请求完毕若没有更多数据时显示的提醒内容；
                  callback : self.pullupRefresh
              }
          }
      });
    }) */
  }
}
</script>
<style scoped  lang="scss">
@import '~static/common/common.scss';
@import '~@/assets/scss/mixin.scss';

.mui-scroll-wrapper.Muimargin{
  position: fixed;
	@include muiMargin(0px);
}

#partnerListWrap{
  padding-bottom: 1rem;
  background-color: #F9F9F9;
  .partnerList{
    background-color: #fff;
    margin-bottom:.24rem;
    .partnerInfo{
      height:2.16rem;
      padding:.4rem .3rem 0;
      @extend .dis-flex;
      .partnerPic{
        width:1.35rem;
        height:1.35rem;
        background-color: #ccc;
        border-radius: 50%;
        img{
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .partnerText{
        @extend .flex-1;
        padding-left:.2rem;
        .pt-title{
          font-size:.34rem;
          color: #343A3D;
          margin-bottom:.1rem;
        }
        .pt-subTitle{
          font-size:.26rem;
          color: #606060;
          margin-bottom:.1rem;
        }
        .pt-x{
          display: flex;
          align-items: center;
          span{
            &.pt-papers{
              display: block;
              font-size:.2rem;
              width: 1.5rem;
              height: .3rem;
              line-height: .3rem;
              text-align: center;
              color: #FF3333;
              border:pxr(1) solid #FF3333;
              border-radius:.2rem;
              margin-right: .2rem;
            }
          }
        }
      }
    }
    .partnerBut{
      @extend .dis-flex;
      height:.9rem;
      line-height:.9rem;
      p{
        @extend .flex-1;
        font-size:.28rem;
        color: #5680A6;
        text-align: center;
      }
    }
  }
}

</style>
