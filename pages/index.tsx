import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { GetServerSidePropsContext } from 'next'
import { postService } from '../service/post'
import { Pagination } from 'antd'
import PostCard from '../components/post/card'
import { usePagination } from '../hooks/usePagination'
import Layout from '../components/layout'

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
      <Layout>
        <h4 className={styles.title}>最新文章</h4>
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
      </Layout>
    </>
  )
}
