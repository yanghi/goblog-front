import { message } from "antd";
import axios from "axios";
import config from '../config/base'
import { getToken, setToken } from "./cookies";

var request = axios.create({
  baseURL: config.baseURL
})

request.interceptors.request.use(function requestInterceptor(conf) {

  let headers: any = {}
  headers['Authorization'] = getToken()

  Object.assign(conf.headers || (conf.headers = {}), headers)
  return conf
})

request.interceptors.response.use((res) => {

  if (res.status === 200) {
    if (res.data.ok === false) {
      if (process.browser) {
        if (res.data.code === 401) {
          setToken()
        }

        message.error(res.data.msg)
        throw res.data.msg
      }
    }
  }

  return res
})

export { request }