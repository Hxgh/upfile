/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/*
    axios统一处理
*/
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import config from '@/config'
import {
  getToken,
  logout
} from '@/utils/public'
import {
  Message
} from 'element-ui';

let cancelToken = axios.CancelToken
class HttpRequest {
  constructor(baseUrl = config.getBaseUrl()) {
    this.baseUrl = baseUrl
    this.queue = {}
    this.pending = []
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken()
      },
      withCredentials: true
    }
    return config
  }
  distroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  removePending(flagUrl, f) {
    if (this.pending.indexOf(flagUrl) !== -1) {
      if (f) {
        f() // 执行取消操作
      } else {
        this.pending.splice(this.pending.indexOf(flagUrl), 1) // 把这条记录从数组中移除
      }
    } else {
      if (f) {
        this.pending.push(flagUrl)
      }
    }
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 防止post方式重复提交
        if (config.method !== 'get') {
          config.cancelToken = new cancelToken(c => {
            let flagUrl = this.baseUrl + config.url + '&' + config.method
            this.removePending(flagUrl, c)
          })
        }
        NProgress.start(); //顶部加载条开始
        if (!Object.keys(this.queue).length) {
          // Spin.show()
        }
        // 判断url
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      response => {
        NProgress.done(); //顶部加载条结束
        this.distroy(url)
        if (response.config.method !== 'get') {
          // 防止post方式重复提交
          let flagUrl = response.config.url + '&' + response.config.method
          this.removePending(flagUrl)
        }
        return response.data || response
      },
      error => {
        NProgress.done(); //顶部加载条结束
        if (error.response) {
          let status = error.response.status;
          switch (true) {
            case status == 1001 || status == 1002 || status == 1003 || status == 401:
              // 提示授权
              Message.error('未授权，请先登录！')
              // 保存当前的路由
              let route = window.app.$router.currentRoute;
              let urlHistory = {
                name: route.name,
                params: route.params,
                query: route.query
              }
              localStorage.setItem('url_history', JSON.stringify(urlHistory))
              // 退出登录
              setTimeout(function () {
                logout();
              }, 1000)
              break;
            case 2002:
              Message.error = 'bucket 不能为空';
              break;
            case 2003:
              Message.error = '服务商空间不存在';
              break;
            case 2004:
              Message.error = '上传空间不能为空';
              break;
            default:
              Message.error(error.response.data.msg || error.response.data.message);
          }
          // 判断是500 错误则后台常驻并显示请求id
        } else if (error.request) {
          console.log(error)
          Message.error('服务器错误')
          // 网络错误
        }
        this.pending = []
        this.distroy(url)
        return Promise.reject(error)
      }
    )
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest