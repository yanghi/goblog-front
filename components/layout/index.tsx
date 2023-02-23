import React from 'react'
import Header from './header'
import style from './index.module.less'


export interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = (props) => {

  const { children } = props

  return <div className={style.layout}>
    <Header></Header>
    <div className={style.layoutMain}>
      {children}
    </div>
  </div>
}

export default Layout