import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { postService } from "../../service/post";
import { Inter } from '@next/font/google'
import ReactMarkdown from "react-markdown";
import style from './style.module.less'
import mdstyle from '../../styles/markdown.module.less'
import remarkGfm from 'remark-gfm'
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-ignore
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Header from "../../components/layout/header";
import { useMounted } from "../../hooks/useMouted";
import { Avatar, Button, Dropdown, message, Space, Tag } from "antd";
import classname from 'classname'
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { UserState } from "../../store/user/userSlice";
import { getPostStatuText, PostStatu, PostStatuOptions } from "../../struct/post";
import { DownOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from "react";
import { useSetState } from "ahooks";
import { ItemType } from "antd/es/menu/hooks/useItems";
import Layout from "../../components/layout";
const inter = Inter({ subsets: ['latin'] })


export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>) {

  let params = context.params

  let id = Number(params?.id)
  let token = context.req.cookies.token

  const res = await postService.getPost(id, token)

  return { props: { data: res.data.data, id } }
}

export default function Post(props: { data: any, id: number }) {
  const [postData, setpostData] = useSetState(props.data)
  const { id } = props

  const user = useSelector<RootState, UserState>((state) => state.user)

  const isMyPost = postData?.authorId == user.user.id

  const chageStatu = (statu: PostStatu) => {
    postService.modifiyPost({
      id: postData.id,
      statu
    }).then(() => {
      message.success(`设为${getPostStatuText(statu)}成功`)
      setpostData({ statu })
    }).catch(() => {
      message.error('修改失败')
    })
  }

  useMounted(() => {
    postData && postService.actionView(id)
  })

  if (!postData) {
    return <div>
      <p>
        访问的内容不存在
      </p>

      可能以下原因:
      <ul>
        <li>文章不存在</li>
        <li>文章被作者设为私有</li>
        <li>文章被删除</li>
      </ul>
    </div>
  }

  return (
    <>
      <Head>
        <title>{postData.title}</title>
        <meta name="title" content={postData.title} />
        <meta name="description" content={postData.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <h2 className={classname([inter.className, style.title])}>
          {postData.title}
        </h2>
        <div className={style.postInfo}>
          {postData.tagList?.map((tag: any) => <Tag key={tag.id}>{tag.name}</Tag>)}
          <span>阅读量:&nbsp;{postData.view}</span>
          {isMyPost &&
            <div className={style.opration}>
              <span>状态: {getPostStatuText(postData.statu)}</span>
              <Dropdown menu={{
                selectedKeys: [postData.statu],
                onClick(e) {
                  chageStatu(parseInt(e.key))
                },
                items: PostStatuOptions.map(it => ({ icon: it.value == PostStatu.Public ? <EyeOutlined /> : <EyeInvisibleOutlined style={{ marginRight: 2 }} />, label: it.label, key: it.value, disabled: postData.statu == it.value }))
              }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    修改状态
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
              <Button type='link' icon={<EditOutlined />} onClick={() => {
                window.location.href = '/create/edit/' + postData.id
              }}>编辑</Button>
            </div>
          }
        </div>
        <div className={style.user_info}>
          <Avatar style={{ width: 32, height: 32 }} className={style.user_avtar} src={postData.author?.avatar}>
            {!postData.author?.avatar && postData.author?.name[0]}
          </Avatar>
          <div>
            <div className={style.user_name}>{postData.author?.name}</div>
            <time className={style.time}>发布于:&nbsp;{postData.create_time}</time>
          </div>
        </div>
        <article className={style.article}>
          {/* {postData.content} */}
          <ReactMarkdown
            className={mdstyle.reactMarkDown}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
            remarkPlugins={[remarkGfm]}>{postData.content}</ReactMarkdown>
        </article>
      </Layout>
    </>
  )
}