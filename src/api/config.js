/**
 * Created by 陈水章 on 2018/05/06.
 * 接口地址配置文件
 * axios 封装
 */
// 引入axios
import axios from 'axios'
import crypto from 'crypto'
// import mui from 'static/js/mui'
import { Toast } from 'mint-ui'

let cancel, promiseArr = {}, LOCATION_API = '', singId = ''
const CancelToken = axios.CancelToken

/**
 * 本地
 * 线上
 */
if (window.location.host == 'wx.myvfo.cn') {
  axios.defaults.baseURL = 'http://bizapi.myvfo.cn' // 本地访问接口api
  singId = 'c21880f9ee1c8c5022a5444965912aff'
} else {
  axios.defaults.baseURL = 'http://testbizapi.myvfo.cn' // 测试访问接口api
  singId = 'c21880f9ee1c8c5022a5444965912aff'
}
/**
 *
 * @param obj  请求参数对象
 * @returns {string}  参数排序之后字符串化
 */
let setSignRule = function (obj, url) {
  let getTim = (new Date()).getTime() // 返回当前时间戳;
  // 添加公用参数
  var dataObj = Object.assign(obj, {
    client: 'H5',
    timestamp: getTim
  })
  // 参数排序
  var ary = []
  for (var k in dataObj) {
    if (dataObj[k]) {
      ary.push(k + '=' + dataObj[k])
    }
  }
  ary.sort() // 数组排序
  ary = ary.join('&') + singId // 数组变字符串
  // console.log('url',axios.defaults.baseURL + url + '?' + ary)
  // md5 计算
  let md5 = crypto.createHash('md5')
  md5.update(axios.defaults.baseURL + url + '?' + ary) // 需要加密的内容
  let sg = md5.digest('hex')
  return sg
}

// let signId = $.md5(URlComm + augs.ajaxUrl+'?'+arySort.join('&')+singId);
/*  */
// 请求拦截器
axios.interceptors.request.use(config => {
  // 发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }
  return config
}, error => {
  return Promise.reject(error)
})

function notification (cod = '', msg = '接口错误') {
  let showErrorInf = '', viewTop = 100
  // mui.toast(`${cod} 错误${msg}`,{ duration:'long'},)
  Toast({
    message: `${msg}`,
    position: 'bottom',
    duration: 3000
  })
}

// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
  // console.log('响应拦截器即异常处理',response.data.code)
  if (response.data.code != 200) {
    if (response.data.code == 407) {
      // sessionkey过期，需要重新登录
      location.href = 'http://' + location.host + '#/login'
      // location.href = location.href.split('#')[0]+'#/login';
    } else {
      // notification(response.data.code, response.data.msg);
    }
  }
  return response
}, err => {
  if (err && err.response) {
    //   notification(err.response.code, err.response.msg)
  }
})

axios.defaults.timeout = 10000

export default {
  // sessionKey:localStorage.getItem('sessionKey') || 'dDExMXRlcw%3D%3D',
  sessionKey: localStorage.getItem('sessionKey'),
  getRequest (name) { // 获取URL上的参数
    var url = decodeURIComponent(window.location.href)
    var ary = url.split('?')
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    // console.log('ary[1]',ary[1]);
    if (ary[1] == undefined || ary[1] == '') return null
    var r = ary[1].match(reg)
    if (r != null) return unescape(r[2]); return null
  },
  // get请求
  get (url, param) {
    // 设置默认请求头
    /* axios.defaults.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token'),
            'csz': 112,
        } */

    param = Object.assign(param, {sign: setSignRule(param, url)})
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  // post请求
  post (url, param) {
    param = Object.assign(param, {sign: setSignRule(param, url)})

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  }
}
