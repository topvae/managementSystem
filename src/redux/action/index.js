/*
 * @Author: ysk
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2020-06-16 10:41:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/redux/action/index.js
 */
import { get_menu_tree, get_dep_tree } from '../../services/api'
import { GET_MENU_TREE, GET_MENU_BTN_TREE, GET_DEP_TREE, SET_MENU_LEFT } from './actionTypes'

// 获取菜单
const getMenuTreeAction = (responseData) => ({
  type: GET_MENU_TREE,
  responseData
})

// 获取不同菜单中的按钮
const getMenuBtnTreeAction = (responseBtnData) => ({
  type: GET_MENU_BTN_TREE,
  responseBtnData
})

// 获取部门树
const getDepartmentTreeAction = (responseBtnData) => ({
  type: GET_DEP_TREE,
  responseBtnData
})

// 设置左侧导航栏
const setNavLeftAction = (data) => ({
  type: SET_MENU_LEFT,
  data
})

// 设置左侧导航栏
export const setNavLeft = (data) => {
  return (dispatch) => {
    dispatch(setNavLeftAction(data))
  }
}

// dispatch只能处理同步action
// thunk可以让dispatch处理异步action
// 异步处理完以后，再dispatch一个同步的action
// 将请求来的树状图 设置给reducer的state
export const menu = () => (dispatch) => {
  get_menu_tree().then(res => {
    console.log(res, '---res')
    const { responseData } = res.data
    dispatch(getMenuTreeAction(responseData))
  })
}
// 区别于凯凯的另一种低逼格写法
export const getMenuBtnTree = () => {
  return (dispatch) => {
    get_menu_tree().then(res => {
      const { responseData } = res.data
      dispatch(getMenuBtnTreeAction(responseData))
    })
  }
}
export const getDepartmentTree = () => {
  return (dispatch) => {
    get_dep_tree().then(res => {
      const { responseData } = res.data
      dispatch(getDepartmentTreeAction(responseData))
    })
  }
}

