import React from 'react'
import Header from './header'
import './index.less'


export interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = (props) => {

  const { children } = props



  return <>
    <Header></Header>
    <div className='layout-main'>
      {children}
    </div>
  </>
}

export default Layout