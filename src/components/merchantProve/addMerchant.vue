<!-- 车商认证 组件 -->

<template>
  <div id="merchantProve">
    <form class="mui-input-group">
        <div class="mui-input-row">
            <label>公司名称</label>
            <input type="text" v-model="form.companyName" class="mui-input-clear" placeholder="请输入">
        </div>
        <div class="mui-input-row" @click="getProvinces" >
            <label>公司区域</label>
            <p>{{form.location}}</p>
        </div>
        <div class="mui-input-row">
            <label>公司地址</label>
            <input type="text" v-model="form.address" class="mui-input-clear" placeholder="请输入">
        </div>
        <div class="mui-input-row">
            <label>老板姓名</label>
            <input type="text" v-model="form.bossName" class="mui-input-clear" placeholder="请输入">
        </div>
        <div class="mui-input-row">
            <label>联系电话</label>
            <input type="tel" v-model="form.telephone" class="mui-input-clear" placeholder="买家咨询设备时将拨打该号码">
        </div>

        <div class="mui-input-row">
            <label>注册电话</label>
            <input type="text" v-model="form.registerTelephone" class="mui-input-clear" placeholder="输入手机号仅用于登录">
        </div>
    </form>

    <!-- 图片列表 -->
    <div class="picList">
      <div class="picLi" v-for="item in upImg" :key="">
        <div class="showPic">
          <div class="img_p">
            <!-- 图片上传 -->
            <div :id="'containerImg'+item.id" class="containerImg">
                <div class="add-pic" :id="'progressId'+item.id"></div>
                <div :id="'upPercent'+item.id" class="progress"></div>
                <div :id="'selectfiles'+item.id" class="selectfiles">
                    <em class="iconfont icon-add_circle"></em>
                    <a href="javascript:void(0);" class="btn">{{item.upinfo}}</a>
                </div>
                <div :id="'postfiles'+item.id" style="display: none;">
                    <em class="myFont my-shangchuan"></em>
                    <a href="javascript:void(0);" class="btn">点击上传</a>
                </div>
            </div>
          </div>
          <p class="text_p">{{item.tit}}</p>
        </div>
      </div>

      <svg width="0" height="0">
        <defs>
          <lineargradient id="cl1" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
              <stop stop-color="#618099"></stop>
              <stop offset="100%" stop-color="#8e6677"></stop>
          </lineargradient>
          <lineargradient id="cl2" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
              <stop stop-color="#8e6677"></stop>
              <stop offset="100%" stop-color="#9b5e67"></stop>
          </lineargradient>
          <lineargradient id="cl3" gradientUnits="objectBoundingBox" x1="1" y1="0" x2="0" y2="1">
              <stop stop-color="#9b5e67"></stop>
              <stop offset="100%" stop-color="#9c787a"></stop>
          </lineargradient>
          <lineargradient id="cl4" gradientUnits="objectBoundingBox" x1="1" y1="1" x2="0" y2="0">
              <stop stop-color="#9c787a"></stop>
              <stop offset="100%" stop-color="#817a94"></stop>
          </lineargradient>
          <lineargradient id="cl5" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="0" y2="0">
              <stop stop-color="#817a94"></stop>
              <stop offset="100%" stop-color="#498a98"></stop>
          </lineargradient>
          <lineargradient id="cl6" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="0">
              <stop stop-color="#498a98"></stop>
              <stop offset="100%" stop-color="#618099"></stop>
          </lineargradient>
        </defs>
      </svg>

    </div>

    <p class="butStyle_1 but" @click="addMerchantFn">提交认证</p>

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
          <span v-for="item in provincesData" @click="getCitys(item.id, item.name)">
            <mt-cell :title="item.name" :key="item.id" is-link ></mt-cell>
          </span>
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
          <span v-for="item in cityData" @click="getDistricts(item.id, item.name)">
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
          <span v-for="item in districtsData" @tap="getLocation(item.id, item.name)">
          <mt-cell :title="item.name" :key="item.id" is-link ></mt-cell>
          </span>
      </section>
    </mt-popup>

    <popup :pop='pop' :img="'../../../static/images/notCar.png'" :but="'add'" :text="'已成功提交~'" ref="popup"></popup>

  </div>
</template>

<script>
import popup from '@/components/common/popup/popup'
// 数据请求
import req from '../../api/config'
import { Toast } from 'mint-ui'

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
  get_signature()
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
    // if (ret == false) {
    //   ret = get_signature();
    // }
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

  function upImgFn (upBut, showPicId, containerId, upPercent) {
    $(showPicId).hide()
    var uploader = new plupload.Uploader({
      runtimes: 'html5,flash,silverlight,html4',
      browse_button: upBut, // 上传按钮（）
      multi_selection: false, // true 多选， false  单选
      container: document.getElementById(containerId),
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
          // 没用到，不用管
        },
        FilesAdded: function (up, files) {
          // 选完文件
          set_upload_param(uploader, '', false)
        },
        BeforeUpload: function (up, file) {
          // 点击上传
          check_object_radio()
          set_upload_param(up, file.name, true)
        },
        UploadProgress: function (up, file) {
          // 上传进度
          // $("#"+upPercent).html('<span style="width:' + file.percent + '%"></span><p>'+file.percent+'%</p>');
          $('#' + upBut).hide()
          $('#' + upPercent).css({'width': '100%', 'height': '100%'}).html(`<span>${file.percent} %</span>`)
          if (file.percent == 100) {
            $('#' + upBut).show()
            $('#' + upPercent).css({'width': '0%', 'height': '0%'}).html('')
          }
        },
        FileUploaded: function (up, file, info) {
          /**
                 * 获取上传后的文件名
                 */
          if (info.status == 200) {
            $(showPicId).show()
            // 成功之后返回的图片地址  get_uploaded_object_name(file.name)
            $(showPicId).append(
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
          } else {
            alert('上传失败:' + info.response)
          }
        },
        Error: function (up, err) {
          if (err.code == -600) {
            alert('选择的文件太大了,不可以超过10MB')
          } else if (err.code == -601) {
            alert(
              '选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型'
            )
          } else if (err.code == -602) {
            alert('有个文件已经上传过一遍了')
          } else {
            alert('Error xml:' + err.response)
          }
        }
      }
    })
    uploader.init()
    set_upload_param(uploader, '', false)
  }

  //
  upImgFn('selectfiles1', '#progressId1', 'containerImg1', 'upPercent1')
  upImgFn('selectfiles2', '#progressId2', 'containerImg2', 'upPercent2')
  upImgFn('selectfiles3', '#progressId3', 'containerImg3', 'upPercent3')
  upImgFn('selectfiles4', '#progressId4', 'containerImg4', 'upPercent4')
  upImgFn('selectfiles5', '#progressId5', 'containerImg5', 'upPercent5')
  // 删除操作
  $('#containerImg1').on('click', '.cancelPic', function () {
    $(this).parent('.publishImg').remove() // 删除点击的元素
    $('#progressId1').hide()
  })
  $('#containerImg2').on('click', '.cancelPic', function () {
    $(this).parent('.publishImg').remove() // 删除点击的元素
    $('#progressId2').hide()
  })
  $('#containerImg3').on('click', '.cancelPic', function () {
    $(this).parent('.publishImg').remove() // 删除点击的元素
    $('#progressId3').hide()
  })
  $('#containerImg4').on('click', '.cancelPic', function () {
    $(this).parent('.publishImg').remove() // 删除点击的元素
    $('#progressId4').hide()
  })
  $('#containerImg5').on('click', '.cancelPic', function () {
    $(this).parent('.publishImg').remove() // 删除点击的元素
    $('#progressId5').hide()
  })
})

export default {
  data () {
    return {
      pop: false,
      form: {
        companyName: '', // 公司名称
        bossName: '', // 老板姓名
        location: '省-市', // 公司区域
        address: '', // 公司地址
        telephone: '', // 联系电话
        registerTelephone: '' // 注册电话
      },
      upImg: [
        {id: 1, upinfo: '店铺头像', tit: '店铺头像'},
        {id: 2, upinfo: '档口门头图片', tit: '场地认证'},
        {id: 3, upinfo: '区域负责人与老板档口合影', tit: '合影认证'},
        {id: 4, upinfo: '老板手持身份证照片', tit: '身份认证'},
        {id: 5, upinfo: '法人营业执照照片', tit: '营业执照'}
      ],

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
      districtsData: [] // 区
    }
  },
  components: {
    popup
  },
  props: {},
  watch: {},
  methods: {
    // 【区域】省信息接口
    getProvinces () {
      req.get('/areaCtrl/v1/getProvinces', {
        sessionKey: localStorage.getItem('sessionKey')
      }).then(result => {
        this.provincesBoo = true
        console.log('】省信息接口---', result)
        // _.yzm = result.data
        this.provincesData = result.data.data
      })
    },
    // 【区域】城市信息接口-不按字母排序
    getCitys (id, na) {
      console.log(id, na)
      req.get('/areaCtrl/v1/getCitys', {
        // sessionKey:  localStorage.getItem('sessionKey'),
        provinceId: id
      }).then(result => {
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
      req.get('/areaCtrl/v1/getDistricts', {
        // sessionKey:  localStorage.getItem('sessionKey'),
        cityId: id
      }).then(result => {
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
      this.form.location = this.provincesName + '-' + this.cityName + '-' + this.districtsName
    },
    // 【车商】添加车商接口
    addMerchantFn () {
      let img1 = $('#progressId1').find('.publishImg').data('imgname')
      let img2 = $('#progressId2').find('.publishImg').data('imgname')
      let img3 = $('#progressId3').find('.publishImg').data('imgname')
      let img4 = $('#progressId4').find('.publishImg').data('imgname')
      let img5 = $('#progressId5').find('.publishImg').data('imgname')

      if (!this.form.companyName) {
        Toast({
          message: '请输入公司名称',
          duration: 3000
        })
        return
      }
      if (!this.provincesId && !this.cityId) {
        Toast({
          message: '请选择公司区域',
          duration: 3000
        })
        return
      }
      if (!this.form.address) {
        Toast({
          message: '请输入公司地址',
          duration: 3000
        })
        return
      }
      if (!this.form.bossName) {
        Toast({
          message: '请输入老板姓名',
          duration: 3000
        })
        return
      }
      if (!this.form.telephone) {
        Toast({
          message: '请输入联系电话',
          duration: 3000
        })
        return
      }
      if (!this.form.registerTelephone) {
        Toast({
          message: '请输入注册电话',
          duration: 3000
        })
        return
      }

      req.get('/shopCtrl/v1/add', {
        sessionKey: localStorage.getItem('sessionKey'),
        companyName: this.form.companyName, // 公司名称
        address: this.form.address, // 公司地址
        provinceId: this.provincesId, // 公司所在省份id
        cityId: this.cityId, // 公司所在市id
        telephone: this.form.telephone, // 联系电话
        bossName: this.form.bossName, // 老板名称
        registerTelephone: this.form.registerTelephone, // 注册电话
        image1: img1 || '', // 店铺头像
        image2: img2 || '', // 场地
        image3: img3 || '', // 合影认证
        image4: img4 || '', // 身份证认证
        image5: img5 || '' // 营业执照
      }).then(result => {
        console.log('add成功---', result)

        // this.pop  = true;
        if (result.data.code == 200) {
          this.pop = true
        }
      })
    }
  },
  filters: {
    // 过滤器
  },
  computed: {},
  created () {
    if (!localStorage.getItem('reloadPage')) {
      localStorage.setItem('reloadPage', 1)
      location.reload(true)
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">
@import '~static/common/common.scss';
.mui-input-group .mui-input-row:after,.mui-input-group:after{
  background-color: rgba(220,226,238,0.60);
}
#merchantProve{
  background-color: #fff;
  margin-top: pxr(-2);
  font-size: pxr(28);
  // padding-left: pxr(20);
  padding-bottom: pxr(40);
  .mui-input-group .mui-input-row{height: pxr(100);display: flex;align-items: center;}
  .mui-input-group input:last-child{font-size: pxr(28); color: #959698;}
}
.picList{
  box-sizing: border-box;
  padding:pxr(30);
  overflow: auto;
  .picLi{
    text-align: center;
    width: 32%;
    float: left;
    margin-bottom:pxr(20);
    &:nth-child(3n+2){
      margin-left: 2%;
      margin-right: 2%;
    }
    .showPic{
      color: #606060;
      .img_p{
        width:2.2rem;
        height:3rem;
        position: relative;
        overflow: hidden;
        background-color: rgba(220,226,238,0.20);
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
        .containerImg{
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: .24rem;
          .add-pic{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 10;
            .publishImg{
              width:2.2rem;
              height:3rem;
            }
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
          }
          .selectfiles{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding-top: .7rem;
          }
          .icon-add_circle{
            color:#FE534A;
            font-size: .8rem;
            display: block;
          }
          .btn{
            width: 60%;
            margin-top: .2rem;
            display: inline-block;
            color: #ccc;
          }
        }
      }
      .text_p{
        font-size: pxr(28);
        padding: pxr(20) 0 pxr(30);
      }
    }
    .hidePic{
      font-size: pxr(34);
    }
  }
}
.but{width: 90%; margin: 0 auto;}
.mint-cell-wrapper{background-image:none;}

//圆圈
@-webkit-keyframes load {
  0% {
    stroke-dashoffset: 0;
  }
}
@keyframes load {
  0% {
    stroke-dashoffset: 0;
  }
}
.progress {
  position: absolute;
  line-height: 100%;
  span{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    font-size: .24rem;
  }
}

</style>
