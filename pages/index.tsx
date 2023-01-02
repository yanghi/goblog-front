import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import poststyles from './create/my-post/style.module.less'
import { GetServerSidePropsContext } from 'next'
import { postService } from '../service/post'
import Header from '../components/layout/header'
import { Avatar, Tag } from 'antd'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>) {


  const res = await postService.getPostList()

  return { props: { data: res.data.data } }
}

export default function Home(props: any) {
  console.log(`Home `, props.data)
  const { data } = props
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="博客" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <main className={styles.main}>
        <h4>最新文章</h4>
        <div>
          {
            data.list.map((post: any) => {
              return <div key={post.id} className={poststyles.postItem}>
                <h4>{post.title}</h4>
                <p>
                  <Avatar src={post.author?.avatar}>{!post.author?.avatar && post.author?.name[0]}</Avatar>
                  <span style={{ marginLeft: 10 }}>
                    {post.author?.name || "用户已注销"}
                  </span>
                </p>
                <div>
                  <span className={poststyles.postTime}>{post.create_time}</span>
                </div>
                <p>{post.description}</p>
                <div>
                  {post.tagList.map((tag: any) => <Tag key={tag.id} className={poststyles.tagItem}>{tag.name}</Tag>)}
                </div>
              </div>
            })
          }
        </div>
      </main>
    </>
  )
}
