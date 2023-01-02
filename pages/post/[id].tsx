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

const inter = Inter({ subsets: ['latin'] })


export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>) {

  let params = context.params

  const res = await postService.getPost(Number(params?.id))

  return { props: { data: res.data.data } }
}

export default function Post(props: { data: any }) {
  const postData = props.data

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
        <meta name="description" content={postData.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style.main}>
        <h2 className={inter.className}>
          {postData.title}
        </h2>
        <div>
          <div className={style.user_name}>{postData.author.name}</div>
          <time className={style.time}>{postData.create_time}</time>
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
      </main>
    </>
  )
}