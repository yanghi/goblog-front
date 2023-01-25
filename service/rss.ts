import { PaginationParams } from './../struct/api';
import { request } from "../utils/request";

class RSSService {
  createFeed(params: any) {
    return request({
      method: 'POST',
      url: 'v1/rss/feed',
      params
    })
  }
  getAllFeedList() {
    return request({ method: 'GET', url: 'v1/rss/feed/all' })
  }
  getFeedItems(params: { feedId: number } & PaginationParams) {
    return request({ method: 'GET', url: 'v1/rss/item/list', params })
  }
}

export const rssService = new RSSService()