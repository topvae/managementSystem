/*
 * @Author: your name
 * @Date: 2020-05-08 09:46:29
 * @LastEditTime: 2020-06-19 16:26:28
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
    label: '姓名',
    field: 'name',
    placeholder: '请输入',
    width: 180
  },
  {
    type: 'INPUT',
    label: 'ITC账号',
    field: 'username',
    placeholder: '请输入',
    width: 180
  },
  {
    type: 'INPUT',
    label: '角色Id',
    field: 'roleId',
    placeholder: '请输入',
    width: 180
  },
  {
    type: 'SELECT_OPTIONS',
    label: '状态',
    field: 'status',
    placeholder: '请选择',
    width: 180,
    formItemLayout: formItemLayout,
    rules: [{ id: 0, rule: '正常' }, { id: 1, rule: '冻结' }]
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
