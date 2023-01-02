import { setToken } from "../utils/cookies";
import { request } from "../utils/request";

interface LoginParameters {
  name: string
  password: string
}

class AuthService {
  login(params: LoginParameters) {
    return request({
      url: '/v1/user/login',
      method: 'POST',
      data: params
    }).then(res => {
      setToken(res.data.data.token)
    })
  }
}
export const authService = new AuthService();