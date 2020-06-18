/*
 * @Author: your name
 * @Date: 2020-05-08 09:46:29
 * @LastEditTime: 2020-06-18 16:51:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /managementSystem/src/pages/authority/userManage/formList.js
 */
const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 10
  }
}

export const formList = [
  {
    type: 'INPUT',
    label: '用户名称',
    field: 'username',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180
  }
]

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 67, // 权限控制
  resetMenuId: 68 // 权限控制
}

export const users = [
  {
    type: 'INPUT',
    label: '用户名：',
    field: 'username',
    placeholder: '请输入用户名称',
    width: 200,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请输入用户名称',
    typeRequired: {
      max: 20,
      message: '最多不能超过20个字符'
    }
  },
  {
    type: 'SELECT_OPTIONS',
    label: '角色：',
    field: 'roleIds',
    placeholder: '请选择角色',
    width: 200,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请选择角色',
    rules: []
  }
]

export const usersconfig = {
  layout: 'vertical',
  btnType: 'save',
  formListSpan: 24,
  hideBtn: true
}
