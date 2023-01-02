import { useRequest } from "ahooks"
import { Button, Modal, Tag } from "antd"

import Link from "next/link"
import Header from "../../../components/layout/header"
import { useMounted } from "../../../hooks/useMouted"
import { postService } from "../../../service/post"
import style from './style.module.less'


export default function MyPost() {
  const { data, runAsync } = useRequest(postService.getMyPostList, { manual: true })

  useMounted(() => {
    setTimeout(() => {
      runAsync()
    }, 10);
  })

  return <>
    <Header></Header>
    <main className={style.main}>
      <h2>我的文章</h2>
      <div>
        <p>
          共发表 {data?.data.data.total} 篇
        </p>
      </div>
      {
        data?.data.data.list.map((post: any) => {
          return <div key={post.id} className={style.postItem}>
            <h4>
              {post.title}
            </h4>
            <span className={style.postTime}>创建于&nbsp;{post.create_time.slice(0, 10)}</span>
            {post.create_time != post.update_time && <span className={style.postTime}>&nbsp;&nbsp;上次更新&nbsp;{post.update_time}</span>}

            <p>
              {post.description}
            </p>
            <div>
              {post.tagList.map((tag: any) => <Tag key={tag.id} className={style.tagItem}>{tag.name}</Tag>)}
            </div>
            <div>
              <Button.Group>
                <Button style={{ paddingLeft: 0 }} type="link" ><Link href={'/create/edit/' + post.id}>编辑</Link></Button>
                <Button type="link">
                  <Link href={'/post/' + post.id}>查看</Link>
                </Button>
                <Button type="link" danger onClick={(e) => {
                  e.stopPropagation()
                  Modal.confirm({
                    title: `删除文章 "${post.title}"`,
                    content: '删除后不可恢复',
                    onOk() {
                      postService.deletePost(post.id)
                    }
                  })
                }}>删除</Button>
              </Button.Group>
            </div>
          </div>
        })
      }
    </main>
    <div>
    </div>


  </>
}