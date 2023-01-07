import { message } from "antd";
import axios, { AxiosResponse } from "axios";
import config from '../config/base'
import { ApiResponse } from "../struct/response";
import { getToken, setToken } from "./cookies";

type ResponseError = AxiosResponse<ApiResponse, any> & {
  message: string
  toString(): string
  _rerr: true
}

export const isResponseError = (e: any): e is ResponseError => e && e._rerr

var request = axios.create({
  baseURL: config.baseURL
})

request.interceptors.request.use(function requestInterceptor(conf) {

  let headers: any = {}
  let token = getToken()
  if (token) {
    headers['Authorization'] = token

    Object.assign(conf.headers || (conf.headers = {}), headers)
  }

  return conf
})

request.interceptors.response.use((res) => {

  if (res.status === 200) {
    if (res.data && res.data.ok === false) {
      if (process.browser) {
        if (res.data.code === 401) {
          setToken()
        }

        message.error(res.data.msg)

        var err: ResponseError = Object.assign(res, {
          message: res.data.msg,
          _rerr: true as const,
          toString() {
            return res.data.msg
          }
        })
        throw err
      }
    }
  }

  return res
})

export { request }