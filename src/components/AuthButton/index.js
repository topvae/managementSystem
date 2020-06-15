import React, { Component } from 'react'
import connect from './connect.js'

//  按钮权限根据后端接口的menuId来匹配，所以后端接口每一个按钮的menuId不允许更改
// 进页面把用户拥有的所有按钮权限的menuId的数组获取出来放入menuIdList，每一个按钮写成高阶组件，判断每个按钮的menuId是否存在menuIdList，没有就null

export const wrapAuth = ComposedComponent => {
   @connect class AuthButton extends Component {
    state = {
      menuIdList: [], // 用户拥有的所有按钮权限
      isAuth: false // 此按钮是否有权限
    }

    componentDidMount() {
      const { menu, menu_id } = this.props
      const flattenTree = menu.getTree.flattenTree
      flattenTree && flattenTree.filter(item => item.type === 2)
      // 获取该用户拥有的所有按钮权限的 id 集合  [1，2，3，4，5]   比如传入的组件按钮 id是 6 但是集合里不存在 表示他没有这个按钮的权限 bool就 false
      const menuIdList = flattenTree && flattenTree.map(item => {
        return item.menuId
      })
      // 一顿操作 得出是否有该按钮的权限 bool
      const bool = menuIdList && menuIdList.some(item => item === menu_id)
      this.setState({
        menuIdList,
        isAuth: bool
      })
    }

    render() {
      // eslint-disable-next-line no-unused-vars
      const { dispatch, menu, ...otherProps } = this.props
      return (
        this.state.isAuth ? <ComposedComponent { ...otherProps } /> : null
      )
    }
   }
   return AuthButton
}
