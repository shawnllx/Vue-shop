import Vue from 'vue'
import App from './App.vue'
// import './plugins/element.js'
import router from "../router";

//导入字体图标
import './assets/fonts/iconfont.css'

//导入样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";



//导入 NProgress 包对应的js和css
import NProgress from 'nprogress'



import axios from "axios";
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request 拦截器中,展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  //console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
// 在response 拦截器中，展示进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})


Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

//将富文本编辑器,注册为全局可用的组件
Vue.use(VueQuillEditor)

//全局格式化时间的过滤器
Vue.filter('dataFormat',function (originVal){
  const dt = new Date(originVal)

  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2,'0')
  const day = (dt.getDay() + '').padStart(2, '0')
  const hour = (dt.getHours() + '').padStart(2, '0')
  const minute = (dt.getMinutes() + '' ).padStart(2, '0')
  const second = (dt.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
