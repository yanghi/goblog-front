import { request } from "../utils/request";

class PostService {
  getPostList() {
    return request({
      method: 'get',
      url: 'v1/post/list'
    })
  }
  getMyPostList() {
    return request({
      method: 'get',
      url: 'v1/user/post/list'
    })
  }

  deletePost(id: number) {
    return request({
      url: 'v1/post/post',
      method: 'delete',
      params: {
        id
      }
    })
  }
  getPost(id: number) {
    return request({
      url: 'v1/post/post',
      method: 'get',
      params: {
        id
      }
    })
  }
  createPost(params: any) {
    return request({
      url: 'v1/post/post',
      method: 'post',
      data: params
    })
  }
  modifiyPost(params: any) {
    return request({
      url: 'v1/post/post',
      method: 'put',
      data: params
    })
  }
}

export const postService = new PostService()