import { setToken } from "../utils/cookies";
import { request } from "../utils/request";
import { setLocalUser } from "../utils/storage";

interface LoginParameters {
  name: string
  password: string
}

class AuthService {
  login(params: LoginParameters) {
    return request<any>({
      url: '/v1/user/login',
      method: 'POST',
      data: params
    }).then(res => {
      setToken(res.data.data.token)
      setLocalUser(res.data.data.user)
      return res
    })
  }
}
export const authService = new AuthService();