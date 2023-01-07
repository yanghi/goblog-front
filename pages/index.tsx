import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { GetServerSidePropsContext } from 'next'
import { postService } from '../service/post'
import Header from '../components/layout/header'
import { Pagination } from 'antd'
import PostCard from '../components/post/card'
import { usePagination } from '../hooks/usePagination'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>) {


  const res = await postService.getPostList()

  return { props: { data: res.data.data } }
}

export default function Home(props: any) {

  const { data, pagination } = usePagination(postService.getPostList, { auto: false, initialData: props.data })

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
              return <PostCard key={post.id} post={post}></PostCard>
            })
          }
        </div>
        <div className={styles.pagination}>
          <Pagination pageSize={pagination.pageSize} defaultCurrent={1} onChange={pagination.onChange} total={pagination.total} />
        </div>
      </main>
    </>
  )
}
