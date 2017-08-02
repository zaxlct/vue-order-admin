import axios from 'axios'
import { Message } from 'element-ui'

const Axios = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
})

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(config => {
  // 在发送请求之前做某件事
  if(config.method  === 'post'){
    // 数据序列化成表单
    const data = { config }
    const formData = new FormData()
    Object.keys(data).forEach(key => formData.append(key, data[key]))
    config.data = qs.stringify(formData)
  }

  return config
},error =>{
  alert("错误的传参", 'fail')
  return Promise.reject(error)
})

//
// Axios.interceptors.response.use(res => {
//   return res.data
// },error => {
//   if(!error.response) return Promise.reject(error)
//   if(error.response.status === 401) {
//     // 未登录 or  token 过期，跳转到登录页面
//     localStorage.token = ''
//     location.href = '/login'
//   } else if (error.response.status === 400) {
//     const { data } = error.response
//     const errorMsg = Object.keys(data).reduce((str, key) => str + data[key][0] + '      ', '')
//     Message.error(errorMsg.trim())
//   }
//   return Promise.reject(error.response.data)
// })

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$http', { value: Axios })
  }
}
