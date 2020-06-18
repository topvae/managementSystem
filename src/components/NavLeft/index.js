import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import './index.less'
import { menu } from '../../redux/action'
import { NavLink, withRouter } from 'react-router-dom'
import { toTree, deleteBtnNode } from '../../utils/utils'
const SubMenu = Menu.SubMenu
import { IconFont } from './../../config/iconConfig'
function NavLeft(props) {
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([])
  const [menuTreeList, setMenuTreeList] = useState([])
  const [openKeys, setOpenKeys] = useState([]) // 当前展开的 SubMenu 菜单项 key 数组
  const { getMenuTreeFn } = props
  const pathname = props.location.pathname

  useEffect(() => {
    getMenuTreeFn()
  }, [getMenuTreeFn])

  useEffect(() => {
    const sessionOpenKeys = sessionStorage.getItem('openKeys')
    setOpenKeys(
      sessionOpenKeys ? [].concat(JSON.parse(sessionOpenKeys)) : ['/product']
    )
  }, [pathname])

  useEffect(() => {
    const urlList = []
    const renderMenu = data => {
      const arr = data.map(item => {
        if (item.type === 0) {
          urlList.push(item.url)
        }
        if (item.nodes && item.nodes.length > 0) {
          const IconFontHtml = item.icon ? (
            <IconFont type={ `${ item.icon }` } />
          ) : null
          return (
            <SubMenu
              title={
                <span>
                  { IconFontHtml }
                  <span>{ item.name }</span>
                </span>
              }
              key={ item.url }
            >
              {renderMenu(item.nodes)}
            </SubMenu>
          )
        }
        const IconFontHtml = item.icon ? (
          <IconFont type={ `${ item.icon }` } className='icon' />
        ) : null
        return (
          <Menu.Item key={ item.url }>
            <NavLink to={ item.url }>
              { IconFontHtml }
              <span>{ item.name }</span>
            </NavLink>
          </Menu.Item>
        )
      })
      setRootSubmenuKeys(urlList)
      return arr
    }
    const tree = props.menu.getTree.flattenTree
    if (tree) {
      const deleteBtnNodeTree = deleteBtnNode(JSON.parse(JSON.stringify(tree))) // 删除按钮级别的节点
      const toTreeList = toTree(deleteBtnNodeTree) // 扁平化再转换成children 树状图
      const menuTreeList = renderMenu(toTreeList)
      setMenuTreeList(menuTreeList)
    }
  }, [props.menu.getTree.flattenTree])

  const onOpenChange = useCallback(
    changeOpenKeys => {
      const latestOpenKey = changeOpenKeys.find(key => {
        return openKeys.indexOf(key) === -1
      })
      if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        setOpenKeys(changeOpenKeys)
        sessionStorage.setItem('openKeys', JSON.stringify(changeOpenKeys))
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
        sessionStorage.setItem(
          'openKeys',
          latestOpenKey ? JSON.stringify([latestOpenKey]) : []
        )
      }
    },
    [openKeys, rootSubmenuKeys]
  )
  // console.log(menuTreeList)
  return (
    <div className=''>
      <div className='menuFonts'>管理系统</div>
      <Menu
        mode='inline'
        theme='dark'
        openKeys={ openKeys }
        onOpenChange={ onOpenChange }
        selectedKeys={ pathname }
      >
        {/* {menuTreeList} */}
        <SubMenu key='/product' title='客诉查询'>
          <Menu.Item key='/product/parts'>
            <NavLink to={ '/product/parts' }>
              <span>{ '订单号查询' }</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key='/product/configuration'>
            <NavLink to={ '/product/configuration' }>
              <span>{ '证件号查询' }</span>
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key='/aggregation'>
          <NavLink to={ '/aggregation' }>
            <span>{ '聚合查询查询' }</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key='/dashboard'>
          <NavLink to={ '/dashboard' }>
            <span>{ 'DashBoard' }</span>
          </NavLink>
        </Menu.Item>
        <SubMenu key='/authority' title='用户角色管理'>
          <Menu.Item key='/authority/roleManage'>
            <NavLink to={ '/authority/roleManage' }>
              <span>{ '角色管理' }</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key='/authority/userManage'>
            <NavLink to={ '/authority/userManage' }>
              <span>{ '用户管理' }</span>
            </NavLink>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key='/operationLogs'>
          <NavLink to={ '/operationLogs' }>
            <span>{ '日志管理' }</span>
          </NavLink>
        </Menu.Item>
      </Menu>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    menu: state,
    selectedKeys:
      Object.keys(state.setMenuSelected).length > 0
        ? [state.setMenuSelected.selectedKeys.data]
        : []
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getMenuTreeFn: () => dispatch(menu())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavLeft))
