import { Button, message, Modal, Pagination, Select } from "antd"

import Link from "next/link"
import Header from "../../../components/layout/header"
import PostCard from "../../../components/post/card"
import { useMounted } from "../../../hooks/useMouted"
import { usePagination } from "../../../hooks/usePagination"
import { postService } from "../../../service/post"
import { getPostStatuText, PostStatu, PostStatuOptions } from "../../../struct/post"
import style from './style.module.less'


export default function MyPost() {
  const { data, pagination, mutate } = usePagination(postService.getMyPostList, { auto: false })

  useMounted(() => {

    setTimeout(() => {
      pagination.onChange(1)
    }, 10);
  })

  const chageStatu = (id: number, statu: PostStatu) => {
    postService.modifiyPost({
      id,
      statu
    }).then(() => {
      message.success(`设为${getPostStatuText(statu)}成功`)
    }).catch(() => {
      message.error('修改失败')
    })
  }

  return <>
    <Header></Header>
    <main className={style.main}>
      <h2>我的文章</h2>
      <div>
        <p>
          共发表 {data?.total} 篇
        </p>
      </div>
      {
        data?.list.map((post: any) => {

          return <PostCard
            key={post.id}
            post={post}
            extraBottomRight={
              <>
                <span>设为:</span>
                <Select
                  onChange={statu => {
                    chageStatu(post.id, statu)
                  }}
                  style={{ width: 100, marginRight: 10 }}
                  value={post.statu}
                  options={PostStatuOptions}
                >
                </Select>
                <Button.Group>
                  <Button style={{ paddingLeft: 0 }} type="link" ><Link href={'/create/edit/' + post.id}>编辑</Link></Button>
                  <Button type="link" danger onClick={(e) => {
                    e.stopPropagation()
                    Modal.confirm({
                      title: `删除文章 "${post.title}"`,
                      content: '删除后不可恢复',
                      onOk() {
                        postService.deletePost(post.id).then(() => {
                          message.success("删除成功")

                          if (data) {
                            var idx = data.list.findIndex((p: any) => p.id === post.id);
                            data.total--
                            data.list.splice(idx, 1)

                            mutate({
                              ...data
                            })
                          }
                        })
                      }
                    })
                  }}>删除</Button>
                </Button.Group>
              </>
            }
          ></PostCard>
        })
      }
      <div className={style.pagination}>
        <Pagination pageSize={pagination.pageSize} defaultCurrent={1} onChange={pagination.onChange} total={pagination.total} />
      </div>
    </main>
    <div>
    </div>


  </>
}