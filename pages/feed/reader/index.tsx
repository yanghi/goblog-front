import { useSetState } from 'ahooks'
import { Badge, Col, Row, Space, Tag } from 'antd'
import classname from 'classname'
import React, { useMemo } from 'react'
import Header from '../../../components/layout/header'
import { useApi } from '../../../hooks/useApi'
import { usePagination } from '../../../hooks/usePagination'
import { rssService } from '../../../service/rss'
import { FeedItem } from '../../../struct/rss'
import style from './style.module.less'

export interface RSSReaderProps {

}

const RSSReader: React.FC<RSSReaderProps> = (props) => {

  const { } = props

  const { data: feedList } = useApi(rssService.getAllFeedList, { initialData: [] })
  const [currentRead, setC] = useSetState<{ fid: number, item: null | FeedItem }>({ fid: -1, item: null })
  const { data: feedItemList, fetch } = usePagination(rssService.getFeedItems, { auto: false, pageSize: 20 })
  const currentFeedItem = currentRead.item

  const feedItemContent = useMemo(() => {
    if (!currentFeedItem) return ''

    if (currentFeedItem.content.length > currentFeedItem.description.length) {
      return currentFeedItem.content
    }
    return currentFeedItem.description
  }, [currentFeedItem])

  const viewFeed = async (f: any) => {
    if (currentRead.fid == f.id) {
      return
    }
    setC({ fid: f.id, item: null })
    await fetch({ feedId: f.id, size: 20 })

  }
  const viewFeedItem = async (f: FeedItem) => {

    setC({ fid: f.feed_id, item: f })
  }

  return <div>
    <Header />
    <Row gutter={10}>
      <Col span={5}>
        <div>
          {feedList.map((f: any) => {
            return <div className={classname(style.feed, currentRead.fid == f.id && style.feed_actived)} key={f.id} onClick={() => viewFeed(f)}>
              {f.title}
              <Badge style={{ marginLeft: 10 }} color='lime' count={Number(f.count)}></Badge>
            </div>
          })}
        </div>
      </Col>
      <Col span={7}>
        <div>
          {feedItemList && feedItemList.list.map((fi: any) => {
            return <div className={classname(style.feed_item, currentRead.item?.id == fi.id && style.feed_item_actived)} key={fi.id} onClick={() => viewFeedItem(fi)}>
              {fi.title}
              <div>
                <span className={style.content_time}>{fi.published}</span>
              </div>
            </div>
          })}
        </div>
      </Col>
      <Col span={12}>
        {currentFeedItem && <div className={style.content}>
          <div className={style.content_header}>
            <div className={style.content_title}>{currentFeedItem.title}</div>
            <div>
              <Space>
                <span className={style.content_time}>{currentFeedItem.published}</span>
                <a href={currentFeedItem.feed_link || currentFeedItem.link} target='_blank'>打开链接</a>
              </Space>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: feedItemContent }}></div>

        </div>}
      </Col>
    </Row>


  </div >
}

export default RSSReader