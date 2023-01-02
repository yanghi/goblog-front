import Link from 'next/link'
import React from 'react'
import style from './style.module.less'

export interface HeaderProps {

}

const Header: React.FC<HeaderProps> = (props) => {
  const { } = props

  return <header className={style.header}>
    <div className={style.left}>

      <Link href={'/'}>首页</Link>
      <Link href={'/create'}>我的创作</Link>
      <Link href={'/create/my-post'}>我的文章</Link>
    </div>
  </header>
}

export default Header