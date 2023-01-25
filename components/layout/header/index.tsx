
import { Avatar, Button } from 'antd'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { UserState } from '../../../store/user/userSlice'
import style from './style.module.less'

export interface HeaderProps {

}

const Header: React.FC<HeaderProps> = (props) => {
  const { } = props

  const user = useSelector<RootState, UserState>((state) => state.user)

  return <header className={style.header}>
    <div className={style.left}>
      <div className={style.banner}></div>
      <Link href={'/'}>首页</Link>
      <Link href={'/feed/reader'}>RSS订阅</Link>
      {user.logged && <>
        {/* <Link href={'/create'}>我的创作</Link> */}
        <Link href={'/create/my-post'}>我的文章</Link>
        <Link href={'/create/write'}>写文章</Link>
      </>}

    </div>
    <div>
      {user.logged ? <div>
        <Avatar size={24} src={user.user.avatar}>{!user.user.avatar && user.user.name[0]}</Avatar>
        <span>&nbsp;{user.user.name}</span>
        <Button type='link'>退出登录</Button>
      </div> : <div>
        <Link href='/login'>登录</Link>
      </div>}
    </div>
  </header>
}

export default Header