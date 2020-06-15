
import React from 'react'
import { Breadcrumb } from 'antd'
import { Link, withRouter } from 'react-router-dom'
// import menuConfig from '../../config/menuConfig';
import breadcrumbNameMap from './breadcrumb'
const bread = withRouter((props) => {
  // let list = [];
  // const getBreadcrumbName = (menuConfig) => {
  //     menuConfig.map((item) => {
  //         // 递归储存路径与面包屑名称生成字典
  //         list[item.path] = item.breadcrumbName;
  //         if (item.children) {
  //             return getBreadcrumbName(item.children)
  //         }
  //         return '';
  //     })
  //     return list;
  // }
  // const breadcrumbNameMap = getBreadcrumbName(menuConfig);
  const { location } = props
  // 从当前路由拿路由信息 与字典匹配 生成面包屑
  const pathSnippets = location.pathname.split('/').filter(i => i)
  // 过滤数字类型
  const newPathSnippets = pathSnippets.filter(i => {
    return isNaN(i)
  })
  const extraBreadcrumbItems = newPathSnippets.map((_, index) => {
    const url = `/${ pathSnippets.slice(0, index + 1).join('/') }`
    // 目录级别不让点击  / 出现一次的 都不让点击
    const flag = (url.split('/')).length - 1 === 1
    return (
      <Breadcrumb.Item key={ url }>
        {
          flag ? breadcrumbNameMap[url]
            : ((index === newPathSnippets.length - 1) ? breadcrumbNameMap[url] : <Link to={ url }>
              {breadcrumbNameMap[url]}
            </Link>
            )
        }
      </Breadcrumb.Item>
    )
  })
  const breadcrumbItems = [(
    <Breadcrumb.Item key='home'>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems)
  return (
    <Breadcrumb separator='>'>
      {breadcrumbItems}
    </Breadcrumb>
  )
})

export default bread

