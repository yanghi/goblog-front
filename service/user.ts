import { request } from "../utils/request";
import { setLocalUser } from "../utils/storage";

class UserService {
  getUserInfo() {
    return request({
      url: "/v1/user/info/base",
      method: 'get'
    }).then(res => {
      setLocalUser(res.data.data)
      return res
    })
  }
}

export const userService = new UserService()