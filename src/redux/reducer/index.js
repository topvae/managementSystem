/*
 * @Author: your name
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2019-11-12 14:26:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/redux/reducer/index.js
 */
import { combineReducers } from 'redux'
import { GET_MENU_TREE, GET_MENU_BTN_TREE, GET_DEP_TREE, SET_MENU_LEFT } from './../action/actionTypes'
import { flattenArray } from '../../utils/utils'

const getTree = (state = {}, action) => {
  switch (action.type) {
    case GET_DEP_TREE:
      return Object.assign({}, state, {
        depTree: action
      })
    case GET_MENU_TREE:
      // const flattenTree = flattenArray(JSON.parse(JSON.stringify(action.responseData)))
      return Object.assign({}, state, {
        flattenTree: flattenArray(JSON.parse(JSON.stringify(action.responseData)))
      })
    case GET_MENU_BTN_TREE:
      return Object.assign({}, state, {
        btnTree: action
      })
    case SET_MENU_LEFT:
      return Object.assign({}, state, {
        selectedKeys: action
      })
    default:
      return state
  }
}

const setMenuSelected = (state = {}, action) => {
  switch (action.type) {
    case SET_MENU_LEFT:
      return Object.assign({}, state, {
        selectedKeys: action
      })
    default:
      return state
  }
}

const reducer = combineReducers({
  getTree,
  setMenuSelected
})

export default reducer
