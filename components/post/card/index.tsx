import { Avatar, Tag } from 'antd';
import React from 'react'
import style from './style.module.less'

export interface PostCardProps {
  post: any;
  extraBottomRight?: React.ReactNode
}

const PostCard: React.FC<PostCardProps> = (props) => {

  const { post, extraBottomRight } = props

  return <div key={post.id} onClick={() => {
    window.location.href = '/post/' + post.id;
  }} className={style.postItem}>
    <div className={style.postItemTitle}>

      <h4>{post.title}</h4>
      <div className={style.tagList}>
        {post.tagList.map((tag: any) => <Tag key={tag.id} className={style.tagItem}>{tag.name}</Tag>)}
      </div>
    </div>
    <div className={style.user_info}>
      <Avatar size={26} style={{ lineHeight: 26 }} className={style.user_avtar} src={post.author?.avatar}>
        {!post.author?.avatar && post.author?.name[0]}
      </Avatar>
      <span className={style.user_name}>{post.author?.name || "用户已注销"}</span>
      <span className={style.time}>发布于:&nbsp;{post.create_time.slice(0, 10)}</span>
    </div>
    <p>{post.description}</p>
    <div className={style.footerInfo}>
      <span>阅读量: {post.view}</span>
      <div onClick={e => {
        e.stopPropagation()
      }}>
        {extraBottomRight}
      </div>
    </div>
  </div>
}

export default PostCard