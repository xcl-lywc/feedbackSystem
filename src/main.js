// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/store.js'
// import './plugins/element.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import './assets/style/common.less'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

//引用公用js
import commonJS from "./plugins/common.js"
Vue.prototype.common = commonJS;

// 全局引入axios 并配置
import axios from 'axios'
import qs from 'qs'

//引入js-md5
import md5 from 'js-md5';
window.md5Js = md5
Vue.prototype.md5 = md5;


axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.axios = axios;

/******************axios拦截器****************/
//request 拦截
Vue.prototype.axios.interceptors.request.use(
  config => {
    try {
      if(sessionStorage.getItem("token")) {
        config.headers.common['Access-Token'] = JSON.parse(sessionStorage.getItem("token"));
        // Vue.prototype.axios.defaults.headers.common['Authorization'] = JSON.parse(sessionStorage.getItem("token"));
      }
      if(sessionStorage.getItem("Access-Key")) {
        config.headers.common['Access-Key'] = JSON.parse(sessionStorage.getItem("Access-Key"));
      }
    } catch(e) {
      console.log("获取token 或 assignee 有误!");
    }
    config.headers.common['nonce']      = Math.floor(Math.random()*10000000000000000) // 随机数0-10000000000000000
    config.headers.common['Time-Stamp'] = (new Date()).valueOf() // 当前时间戳
    config.headers.common['secret']     = "feed" // 口令
    config.headers.common['type']       = "PC" //  口令 

    let object = {
      'nonce': config.headers.common.nonce,
      'Time-Stamp': config.headers.common['Time-Stamp'],
      'secret': config.headers.common.secret,
      'Access-Key': config.headers.common['Access-Key'],
    }
    let ObjectCombine = object;
    // -------- get请求需要需要加上请求后面的参数
    if(config.method == 'get') { 
      ObjectCombine = Object.assign(object, config.params)
    }
    let array = []
    for ( let k in ObjectCombine ) {
      array.push(k)
    }
    array.sort()
    let FinalArray = []
    array.forEach( (item, index) => {
      FinalArray.push(ObjectCombine[item])
    })
    config.headers.common['sign'] = window.md5Js(FinalArray.join(""))// 写入sign
    
    return config
  }, 
  error => {
    return Promise.reject(error)
  }
)
//response 拦截
Vue.prototype.axios.interceptors.response.use(function (response) {
  //请求成功的拦截
  if (response.config.responseType != "blob") {  //非文件类型不进行处理
    if (response.data.meta.code == "401") {
      // 抛出未登录异常, 并定时跳转至登录页
      setTimeout(() => {
        window.location.href = window.location.origin + "/#/login"
      }, 1500)
      return Promise.reject("未登陆或登陆信息失效!")
    } else if (response.data.meta.code != 0) {
      if(response.data.meta.message=="nonce验证不通过，请重新连接。"){
        setTimeout(() => {
          window.location.href = window.location.origin + "/#/login"
        }, 1000)
      }else if(response.data.meta.message=="请求缺少认证参数：Access-Key"){
        setTimeout(() => {
          window.location.href = window.location.origin + "/#/login"
        }, 1000)
      }
      // 抛出请求失的异常
      return Promise.reject(response.data.meta.message)
    } else {
      // 无异常直接返回
      return response
    }
  } else { //文件类型直接返回
    return response
  }
  return response
}, function (error) {
	if (error.response.status == "401") {
		setTimeout(() => {
			window.location.href = window.location.origin + "/#/login"
		}, 1500)
		return Promise.reject("用户令牌已过期，请重新登录!")
	}
  else if (error.response.status == "403") {
    return Promise.reject("权限不足!")
  } else {
    return Promise.reject("请求失败!");
  }
});

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })

//引入markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

new Vue({
  router,
  render: function (createElement) {
    let routeMeta = this.$route.meta
    let props = {}
    // 控制是否显示 带导航的布局 || 空白布局
    if (routeMeta && routeMeta.showNav) {
      props.layout = 'nav-layout'
    } else {
      props.layout = 'blank-layout'
    }
    return createElement(App, {props})
  }
}).$mount('#app')
