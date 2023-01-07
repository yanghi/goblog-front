import { PaginationParams } from './../struct/api';
import { request } from "../utils/request";

class PostService {
  getPostList(params?: PaginationParams) {
    return request({
      method: 'get',
      url: 'v1/post/list',
      params
    })
  }
  getMyPostList(params?: PaginationParams) {
    return request({
      method: 'get',
      url: 'v1/user/post/list',
      params
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
  getPost(id: number, token?: string) {
    return request({
      url: 'v1/post/post',
      method: 'get',
      params: {
        id
      },
      headers: {
        "Authorization": token
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
  actionView(id: number) {
    return request({
      url: 'v1/post/action/view',
      method: 'put',
      params: { id }
    })
  }
}

export const postService = new PostService()