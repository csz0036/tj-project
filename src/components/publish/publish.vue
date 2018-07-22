<!-- 发布 -->

<template>
  <div class="carDealer">
    <!-- 侧滑导航根容器 -->
    <div class="mui-off-canvas-wrap mui-draggable mui-slide-in">
      <!-- 菜单容器 -->
      <aside class="mui-off-canvas-right">
        <div class="mui-scroll-wrapper">
          <div class="mui-scroll">
            <!-- 菜单具体展示内容 -->
          </div>
        </div>
      </aside>
      <!-- 主页面容器 -->
      <div class="mui-inner-wrap">
         <section id="publishCenter">
        <div class="add-1">
            <textarea id="productName" v-model="productName" class="writeTitle" placeholder="宝贝标题 填写品牌型号更容易被买家搜到"></textarea>
            <!-- 图片上传 -->
            <div id="containerImg">
                <div class="add-pic" id="progressId"></div>
                <div id="upPercent"></div>
                <div id="selectfiles">
                    <em class="iconfont icon-add_circle"></em>
                    <a href="javascript:void(0);" class="btn">选择上传图片,最少传1张,最多24张</a>
                </div>
                <div id="postfiles" style="display: none;">
                    <em class="myFont my-shangchuan"></em>
                    <a href="javascript:void(0);" class="btn">点击上传</a>
                </div>
            </div>
        </div>

        <div class="add-2">
          <!-- <p @tap="getFirstType" style="height:200px; font-size:30px">ttttt</p> -->
          <ul class="mui-table-view">
              <li class="mui-table-view-cell" @click="getProvinces" >
                  <a class="mui-navigate-right">所在位置</a>
                  <span class="rt-text">{{location}}</span>
              </li>
              <li class="mui-table-view-cell" @click="getCategorys">
                  <a class="mui-navigate-right">选择机型</a>
                  <span class="rt-text">{{typeText}}</span>
              </li>
              <li class="mui-table-view-cell">
                  出厂年限
                  <div class="table-input">
                    <input type="tel" v-model="outDate" class="mui-input-clear table-input" placeholder="请输入">年
                  </div>
              </li>
              <li class="mui-table-view-cell">
                小时数量
                <div class="table-input">
                  <input type="tel" v-model="hoursDesc" class="mui-input-clear table-input" placeholder="请输入">小时
                </div>
              </li>
              <li class="mui-table-view-cell">
                出售价格
                <div class="table-input">
                  <input type="text" v-model="sellPrice" class="mui-input-clear table-input" placeholder="请输入">万
                </div>
              </li>
          </ul>
        </div>

        <div class="shopTabList">
            <p>选择标签，描述设备卖点，可多选（非必填项）</p>
            <ul id="propertyLabel">
                <li v-for="item in signDesc" :key="item.id" @click="selectSort(item)"  :class="{'active':item.show===true}">{{item.sort}}</li>
            </ul>
        </div>

        <div class="butStyle_1" @click="shopAdd" v-if="sub">发  布</div>
        <div class="butStyle_1 butStyle_2" v-else>发  布</div>

    </section>
      </div>
    </div>

    <!-- 省 -->
    <mt-popup v-if="provincesBoo"
      position="right"
      popup-transition="popup-fade"
      v-model="provincesBoo"
      >
      <section class="sPopup"
        infinite-scroll-disabled
        infinite-scroll-distance="10"
      >
          <span v-for="item in provincesData" :key="item.id" @click="getCitys(item.id, item.name)">
            <mt-cell :title="item.name" :key="item.id" is-link ></mt-cell>
          </span>
          <!-- <mt-cell :title="item.name" :key="item.id" is-link v-for="item in provincesData" @click="getCitys(item.id, item.name)"></mt-cell> -->
      </section>
    </mt-popup>
    <!-- 市 -->
    <mt-popup v-if="cityBoo"
      position="right"
      popup-transition="popup-fade"
      v-model="cityBoo"
      >
      <section class="sPopup"
        infinite-scroll-disabled
        infinite-scroll-distance="10"
      >
          <span v-for="item in cityData" :key="item.id"  @click="getDistricts(item.id, item.name)">
            <mt-cell :title="item.name" :key="item.id" is-link></mt-cell>
          </span>
      </section>
    </mt-popup>
    <!-- 区 -->
    <mt-popup v-if="districtsBoo"
      position="right"
      popup-transition="popup-fade"
      v-model="districtsBoo"
      >
      <section class="sPopup"
        infinite-scroll-disabled
        infinite-scroll-distance="10"
      >
          <span v-for="item in districtsData" :key="item.id"  @tap="getLocation(item.id, item.name)">
          <mt-cell :title="item.name" :key="item.id" is-link ></mt-cell>
          </span>
      </section>
    </mt-popup>

    <!-- 一级机型 -->
    <mt-popup v-if="categorysBoo"
      position="right"
      popup-transition="popup-fade"
      v-model="categorysBoo"
      >
      <section class="sPopup"
        infinite-scroll-disabled
        infinite-scroll-distance="10"
      >
          <span v-for="item in categorysData" :key="item.id"  @click="getBrands(item.id, item.name)">
            <mt-cell :title="item.name" :key="item.id" is-link ></mt-cell>
          </span>
      </section>
    </mt-popup>
    <!-- 二级机型 -->
    <mt-popup v-if="categorysTwoBoo"
      position="right"
      popup-transition="popup-fade"
      v-model="categorysTwoBoo"
      >
      <section class="sPopup"
        infinite-scroll-disabled
        infinite-scroll-distance="10"
      >
          <span v-for="item in categorysTwoData" :key="item.id"  @click="getBrands(item.id, item.name)">
            <mt-cell :title="item.name" :key="item.id" is-link ></mt-cell>
          </span>
      </section>
    </mt-popup>
    <!-- 品牌 -->
    <mt-popup v-if="brandBoo"
      position="right"
      popup-transition="popup-fade"
      v-model="brandBoo"
      >
      <mt-index-list class="sPopup">
        <mt-index-section :index="key" v-for="(value, key) in brandData" :key='key'>
          <span v-for="b in value"  :key='b.id' @click="getModels(b.id, b.zhBrandName)">
            <mt-cell :title="b.zhBrandName" ></mt-cell>
          </span>
        </mt-index-section>
      </mt-index-list>
    </mt-popup>
    <!-- 型号 -->
    <mt-popup v-if="modelsBoo"
      position="right"
      popup-transition="popup-fade"
      v-model="modelsBoo"
      >
      <section class="sPopup"
        infinite-scroll-disabled
        infinite-scroll-distance="10"
      >
          <span v-for="item in modelsData" :key="item.id"  @click="modelsFn(item.id, item.modelName)">
            <mt-cell :title="item.modelName" :key="item.id" is-link ></mt-cell>
          </span>
      </section>
    </mt-popup>

  </div>
</template>

<script>
// import mui from "static/js/mui";
import { Toast } from 'mint-ui'
// require("static/js/plupload.full.min.js");
// 数据请求
import req from '../../api/config'
/**
 *
 * 上传图片
 */
$(function () {
  var accessid = '',
    accesskey = '',
    host = '',
    policyBase64 = '',
    signature = '',
    callbackbody = '',
    filename = '',
    key = '',
    expire = 0,
    g_object_name = '',
    g_object_name_type = 'random_name',
    now = Date.parse(new Date()) / 1000,
    suffix = '',
    indexNumber = 0,
    timestamp = Date.parse(new Date()) / 1000,
    upSucAry = []

  // 设置随机文件名
  function check_object_radio () {
    var tt = document.getElementsByName('myradio')
    for (var i = 0; i < tt.length; i++) {
      if (tt[i].checked) {
        g_object_name_type = tt[i].value
        break
      }
    }
  }

  // 可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
  function get_signature () {
    now = timestamp = Date.parse(new Date()) / 1000
    if (expire < now + 3) {
      req.get('/imagePolicyCtrl/v1/getPolicy', {}).then(e => {
        // 成功
        // console.log("获取接口", e.data.data);
        let obj = e.data.data
        host = obj['host'] // 指的是用户要往哪个域名发往上传请求
        policyBase64 = obj['policy'] // 指的是用户表单上传的策略policy，是经过base64编码过的字符串。
        accessid = obj['accessid'] // 指的用户请求的accessid
        signature = obj['signature'] // 是对上述第三个变量policy签名后的字符串。
        expire = parseInt(obj['expire']) // 指的是当前上传策略失效时间
        callbackbody = obj['callback']
        key = obj['dir']
      })
      return true
    }
    return false
  }

  function random_string (len) {
    len = len || 32
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = chars.length
    var pwd = ''
    for (var i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }
  function get_suffix (filename) {
    var pos = filename.lastIndexOf('.')
    suffix = ''
    // console.log('hahahah',suffix)
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
    return suffix
  }
  function calculate_object_name (filename) {
    if (g_object_name_type == 'local_name') {
      g_object_name += '${filename}'
    } else if (g_object_name_type == 'random_name') {
      var suffix = get_suffix(filename)
      g_object_name = key + random_string(10) + suffix
    }
    return ''
  }
  function get_uploaded_object_name (filename) {
    if (g_object_name_type == 'local_name') {
      tmp_name = g_object_name
      tmp_name = tmp_name.replace('${filename}', filename)
      return tmp_name
    } else if (g_object_name_type == 'random_name') {
      return g_object_name
    }
  }
  function set_upload_param (up, filename, ret) {
    // console.log('ret---',ret)
    if (ret == false) {
      ret = get_signature()
    }
    g_object_name = key
    if (filename != '') {
      suffix = get_suffix(filename)

      calculate_object_name(filename)
    }
    var new_multipart_params = {
      key: g_object_name,
      policy: policyBase64,
      OSSAccessKeyId: accessid,
      success_action_status: '200', // 让服务端返回200,不然，默认会返回204
      callback: callbackbody,
      signature: signature
    }
    up.setOption({
      url: host,
      multipart_params: new_multipart_params
    })
    up.start()
  }
  var uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'selectfiles',
    multi_selection: true,
    container: document.getElementById('containerImg'),
    flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
    silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
    url: 'http://oss.aliyuncs.com',
    filters: {
      // 设置上传文件过滤条件
      mime_types: [
        // 只允许上传图片和zip文件
        {
          title: 'Image files',
          extensions: 'jpg,jpeg,gif,png,bmp'
        },
        {
          title: 'Zip files',
          extensions: 'zip,rar'
        }
      ],
      max_file_size: '10mb', // 最大只能上传10mb的文件
      prevent_duplicates: false // 不允许选取重复文件
    },
    init: {
      PostInit: function () {
        // 点击上传按钮
        document.getElementById('postfiles').onclick = function () {
          set_upload_param(uploader, '', false)
          // console.log("点击上传按钮");
          return false
        }
      },
      FilesAdded: function (up, files) {
        // 选完文件
        if (files.length >= 9 || indexNumber >= 8) {
          $('#selectfiles, .moxie-shim').hide()
        }
        set_upload_param(uploader, '', false)
        plupload.each(files, function (file) {
          $('#containerImg')
            .find('.moxie-shim')
            .css({
              top: 'auto',
              bottom: '0px'
            })
        })
      },
      BeforeUpload: function (up, file) {
        // 点击上传
        check_object_radio()
        set_upload_param(up, file.name, true)
      },
      UploadProgress: function (up, file) {
        // 上传进度
        var d = document.getElementById('upPercent')
        d.innerHTML = '<span style="width:' + file.percent + '%"></span><p>' + file.percent + '%</p>'

        if (file.percent == 100) {
          d.innerHTML = ''
        }
      },
      FileUploaded: function (up, file, info) {
        /**
         * 获取上传后的文件名
         */
        if (info.status == 200) {
          // 成功之后返回的图片地址  get_uploaded_object_name(file.name)
          indexNumber++
          // 最多不能超过24张图片
          if (indexNumber > 24) {
            indexNumber = 24
            $('#postfiles,.moxie-shim').hide()
            $('#selectfiles').hide()
          } else {
            $('#progressId')
              .append(
                '<div class="publishImg" data-imgName="http://pic.myvfo.cn/' +
                  get_uploaded_object_name(file.name) +
                  '"></div>'
              )
              .find('.publishImg')
              .eq(indexNumber - 1)
              .html(
                "<span class='cancelPic'><em class='iconfont icon-shanchu'></em></span><img src='http://pic.myvfo.cn/" +
                  get_uploaded_object_name(file.name) +
                  "!150X150' />"
              )
            if (indexNumber == 24) {
              indexNumber = 24
              $('#postfiles,.moxie-shim').hide()
              $('#selectfiles').hide()
            }
          }
          // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, name:' + get_uploaded_object_name(file.name);
        } else {
          alert('上传失败:' + info.response)
          // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
        }
      },
      Error: function (up, err) {
        if (err.code == -600) {
          alert('选择的文件太大了,不可以超过10MB')
          // document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
        } else if (err.code == -601) {
          alert(
            '选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型'
          )
          // document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
        } else if (err.code == -602) {
          alert('有个文件已经上传过一遍了')
          // document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
        } else {
          alert('Error xml:' + err.response)
          // document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
        }
      }
    }
  })
  uploader.init()
  set_upload_param(uploader, '', false)

  $('#progressId').on('click', '.cancelPic', function () {
    indexNumber-- // 减去
    $(this)
      .parent('.publishImg')
      .remove() // 删除点击的元素
    $('.moxie-shim,#selectfiles').show()
    $('#containerImg')
      .find('.moxie-shim')
      .css({
        top: 'auto',
        bottom: '0px'
      })
  })
})

export default {
  data () {
    return {
      sub: true, // 发布设备
      outDate: '', // 出厂日期
      hoursDesc: '', // 小时数
      sellPrice: '', // 价格
      productImgs: [], // 图片地址
      productName: '', // 产品名称
      location: '省-市',
      typeText: '请选择',
      provincesBoo: false,
      provincesName: '',
      provincesId: '',
      provincesData: [], // 省
      cityBoo: false,
      cityName: '',
      cityId: '',
      cityData: [], // 市
      districtsBoo: false,
      districtsName: '',
      districtsId: '',
      districtsData: [], // 区
      categorysBoo: false,
      categoryName: '',
      categorysId: '',
      categorysData: [], // 一级机型
      categorysTwoBoo: false,
      categorysTwoName: '',
      categorysTwoId: '',
      categorysTwoData: [], // 二级机型
      brandBoo: false,
      brandName: '',
      brandId: '',
      brandData: [], // 品牌
      modelsBoo: false,
      modelsName: '',
      modelsId: '',
      modelsData: [], // 型号
      signDesc: [
        { sort: '有发票', show: false, id: 1 },
        { sort: '有合格证', show: false, id: 2 },
        { sort: '无债权', show: false, id: 3 },
        { sort: '一手车源', show: false, id: 4 },
        { sort: '本地一手', show: false, id: 5 },
        { sort: '产权清晰', show: false, id: 6 },
        { sort: '个人车源', show: false, id: 7 },
        { sort: '诚信车商', show: false, id: 8 },
        { sort: '可议价', show: false, id: 9 },
        { sort: '急售', show: false, id: 10 },
        { sort: '随时看车', show: false, id: 11 }
      ],
      addSignDesc: [] // 发布时用
    }
  },
  components: {},
  computed: {},
  created () {
    // 初始化列表数据
    if (!localStorage.getItem('reloadPage')) {
      localStorage.setItem('reloadPage', 1)
      location.reload(true)
    }
  },
  mounted () {},
  watch: {},
  methods: {
    selectSort (ite) {
      console.log(ite.show)
      // ite.show ? true : false;

      if (ite.show) {
        ite.show = false
      } else {
        ite.show = true
      }
      // this.addSignDesc.push(ite.sort);
    },
    loadMore () {},
    // 【区域】省信息接口
    getProvinces () {
      req
        .get('/areaCtrl/v1/getProvinces', {
          sessionKey: localStorage.getItem('sessionKey')
        })
        .then(result => {
          this.provincesBoo = true
          console.log('】省信息接口---', result)
          // _.yzm = result.data
          this.provincesData = result.data.data
        })
    },
    // 【区域】城市信息接口-不按字母排序
    getCitys (id, na) {
      console.log(id, na)
      req
        .get('/areaCtrl/v1/getCitys', {
          // sessionKey: req.sessionKey,
          provinceId: id
        })
        .then(result => {
          this.provincesBoo = false
          this.cityBoo = true
          this.provincesId = id
          this.provincesName = na

          console.log('城市信息接口---', result)
          // _.yzm = result.data
          this.cityData = result.data.data
        })
    },
    // 【区域】区信息接口
    getDistricts (id, na) {
      console.log(id, na)
      req
        .get('/areaCtrl/v1/getDistricts', {
          // sessionKey: req.sessionKey,
          cityId: id
        })
        .then(result => {
          this.provincesBoo = false
          this.cityBoo = false
          this.districtsBoo = true
          this.cityId = id
          this.cityName = na
          console.log('区信息接口---', result)
          // _.yzm = result.data
          this.districtsData = result.data.data
        })
    },
    // 区点击
    getLocation (id, na) {
      this.districtsId = id
      this.districtsName = na
      this.districtsBoo = false
      this.location =
      this.provincesName + '-' + this.cityName + '-' + this.districtsName
    },
    // 【查询分类】一级机型
    getCategorys () {
      req
        .get('/categoryCtrl/v1/getCategorys', {
          parentId: '0'
        })
        .then(result => {
          this.categorysBoo = true
          this.categorysData = result.data.data
        })
    },
    // 【查询分类】二级机型
    getCategorysTwo (id, name) {
      req
        .get('/categoryCtrl/v1/getCategorys', {
          parentId: id
        })
        .then(result => {
          this.categorysName = name
          this.categorysId = id
          this.categorysBoo = false

          this.categorysTwoBoo = true
          this.categorysTwoData = result.data.data
        })
    },
    // 【查询分类】获取所有品牌信息
    getBrands (id, name) {
      req
        .get('/brandCtrl/v1/getBrands', {
          categoryId: id
        })
        .then(result => {
          // this.categorysTwoName = name;
          // this.categorysTwoId = id;
          // this.categorysTwoBoo = false;

          this.categorysName = name
          this.categorysId = id
          this.categorysBoo = false

          this.brandBoo = true
          this.brandData = result.data.data
        })
    },
    // 【查询分类】获取型号信息
    getModels (id, name) {
      req
        .get('/modelCtrl/v1/getModels', {
          brandId: id
        })
        .then(result => {
          this.brandName = name
          this.brandId = id
          this.brandBoo = false

          this.modelsBoo = true
          this.modelsData = result.data.data
        })
    },
    modelsFn (id, name) {
      this.modelsName = name
      this.modelsId = id
      this.modelsBoo = false
      this.typeText =
        this.categorysName +
        '-' +
        this.categorysTwoName +
        '-' +
        this.brandName +
        '-' +
        name
    },
    shopAdd () {
      let _ = this
      let elementImg = $('#progressId').find('.publishImg')
      if (elementImg.length < 1) {
        Toast({
          message: '请添加宝贝照片',
          duration: 3000
        })
        return
      }
      if (isNaN(this.sellPrice)) {
        Toast({
          message: '有价才能卖哦',
          duration: 3000
        })
        return
      }
      if (isNaN(this.hoursDesc)) {
        Toast({
          message: '小时数为必填哦',
          duration: 3000
        })
        return
      }
      if (!this.productName) {
        Toast({
          message: '宝贝标题未填写',
          duration: 3000
        })
        return
      }
      if (!this.categorysId) {
        Toast({
          message: '请选择宝贝机型',
          duration: 3000
        })
        return
      }
      if (!this.brandId) {
        Toast({
          message: '请选择宝贝品牌',
          duration: 3000
        })
        return
      }
      if (!this.outDate) {
        Toast({
          message: '请选择年限',
          duration: 3000
        })
        return
      }
      elementImg.each(function (i, v) {
        if (i < 9) {
          _.productImgs.push(elementImg.eq(i).data('imgname'))
        }
      })
      this.sub = false

      $('#propertyLabel').find('.active').forEach(element => {
        _.addSignDesc.push($(element).text())
      })

      req.get('/productCtrl/v1/add', {
        sessionKey: localStorage.getItem('sessionKey'),
        provinceId: this.provincesId,
        cityId: this.cityId,
        districtsId: this.districtsId,
        productName: this.productName, // 产品名称
        productImgs: this.productImgs.join(), // 图片地址，多张逗号分隔
        sellPrice: this.sellPrice, // 价格
        brandId: this.brandId, // 品牌ID
        categoryId: this.categorysId, // 分类ID，机型ID
        modelId: this.modelsId, // 型号ID
        outDate: this.outDate, // 出厂日期
        hoursDesc: this.hoursDesc, // 小时数
        signDesc: this.addSignDesc.join(), // 标签，中间逗号分隔 如：急售,有发票
        propertiesDesc: '', // 标签2，中间逗号分隔
        shopId: this.$route.query.shopId
      })
        .then(result => {
          // console.log("添加成功---", result.data);
          if (result.data.code == 200) {
            let usi = localStorage.getItem('userInfo')
            /**
               * 1：车商      ---->  车商首页
               * 2：信息商    ---->  信息商首页
               * 3：合伙人    ---->  合伙人首页
               */
            switch (usi) {
              case '1':
                this.$router.push('/cardealer_index/')
                break
              case '2':
                this.$router.push('/machine_index/')
                break
              case '3':
                this.$router.push('/home/')
                break
            }
            this.sub = true
          } else {
            alert(result.data.msg)
            this.sub = true
          }
        })
    }
  },
  filters: {},

  destroyed () {}
}
</script>

<style lang="scss" >
@import "~static/common/common.scss";

#publishListContent {
  overflow: hidden;
}
#publishCenter {
  padding-bottom: 0rem;
  .add-1 {
    // background-color: #fff;
    .writeTitle {
      width: 100%;
      border: none;
      font-size: 0.28rem;
      display: block;
      box-sizing: border-box;
      padding: 0.2rem 0 0.2rem 0.2rem;
      outline: none;
      height: 2.5rem;
      margin-bottom: 0.24rem;
      //&::-webkit-input-placeholder{color:#89adec;}
    }
    .add-pic {
      overflow: auto;
      margin-bottom: 0.2rem;
      padding-left: 0.24rem;
      .publishImg {
        //flex: 1;
        width: 2.2rem;
        height: 3rem;
        background-color: #f6f6f6;
        box-sizing: border-box;
        border: 0.01rem solid #eeeeee;
        position: relative;
        margin: 0 0.15rem 0.2rem 0;
        float: left;
        overflow: hidden;
        span {
          position: absolute;
          top: 0.1rem;
          right: 0.1rem;
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          color: #fff;
          z-index: 12;
          text-align: center;
          line-height: 0.5rem;
          em {
            color: #fff;
            display: inline-block;
            font-size: 0.3rem;
          }
        }
        img {
          display: block;
          width: 100%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .loactionAddr {
    @extend .dis-flex;
    padding: 0 0.2rem;
    font-size: 0.3rem;
    align-items: center;
    height: 0.9rem;
    line-height: 0.9rem;
    //border-top: 0.01rem solid #f6f6f6;
    border-top: 1px solid #f6f6f6;
    margin-top: 0.2rem;
    color: #333;
    .addrText {
      flex: 1;
    }
    .cityList {
      color: #666;
      em {
        font-size: 0.2rem;
      }
    }
  }
  .add-2 {
    background-color: #fff;
    .loactionAddr {
      margin-top: 0;
    }

    .priceList {
      display: flex;
      flex: 1;
      align-items: center;
      .priceNumber {
        display: block;
        border: none;
        outline: none;
        padding-right: 0.1rem;
        flex: 1;
        text-align: right;
        font-size: 0.3rem;
        //height: .4rem;
      }
      span {
        display: block;
      }
    }
  }
  .shopTabList {
    background-color: #fff;
    margin-top: 0.2rem;
    font-size: 0.24rem;
    padding: 0 0.2rem;
    overflow: auto;
    P {
      //height: .6rem;
      font-size: 0.28rem;
      line-height: 0.4rem;
      color: #757575;
      padding: 0.1rem 0 0.2rem;
    }
    li {
      float: left;
      background-color: #f5f8fa;
      color: #333;
      padding: 0.1rem 0.2rem;
      box-sizing: border-box;
      margin: 0 0.15rem 0.2rem 0;
      border-radius: 0.05rem;
      &.active {
        background-color: #02ba6f;
        color: #fff;
        border-radius: 0.04rem;
      }
    }
  }
  .publishDeviceBut {
    font-size: 0.3rem;
    text-align: center;
    line-height: 0.88rem;
    height: 0.88rem;
    width: 100%;
    margin: 1rem auto;
    color: #fff;
    background-color: #89adec;
  }
  #selectMapBaidu {
    .my-dingwei {
      font-size: 0.32rem;
    }
  }
}
.mui-input-group input {
  text-align: right;
  padding-right: 0.4rem;
}
.table-input {
  text-align: right;
  position: absolute;
  width: 60%;
  border: none !important;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.28rem;
}
#containerImg {
  text-align: center;
  background-color: #fff;
  padding: 0.2rem 0;
  position: relative;

  em {
    display: block;
    color: #fe534a;
    font-size: 0.8rem;
  }
  a {
    color: #959698;
    font-size: 0.28rem;
    padding-top: 0.2rem;
    display: inline-block;
  }
}
.sPopup {
  width: 90vw;
  height: 100vh;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  overflow-y: auto;
}
.butStyle_1 {
  margin: 0.1rem auto;
}
.butStyle_2{background-color: #ccc}
.mint-cell:last-child {
  background-image: none;
}
#upPercent{
  width:90%;
  // height: .3rem;
  // border:.01rem solid #ccc;
  text-align: left;
  margin-left: 5%;
  overflow: hidden;
  // box-shadow: 0 0 .05rem 0 #ddd inset;
  p{text-align: center; color: #000; margin-top: .1rem;}
  span{
    display: block;
    // width: 80%;
    height: .3rem;
    border-radius: .15rem;
    background: linear-gradient(45deg, #2989d8 33%,#7db9e8 34%,#7db9e8 59%,#2989d8 60%);
    background-size:.6rem .3rem;
  }
}
</style>
