/*
 * @Author: your name
 * @Date: 2020-02-14 13:21:55
 * @LastEditTime: 2020-02-17 17:46:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/systemManagement/dictionary/formList.js
 */
export const formList = [
  {
    type: 'INPUT',
    label: '业务标识',
    field: 'businessIdent',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180
  }, {
    type: 'INPUT',
    label: '字段',
    field: 'field',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180,
    maxLen: 100
  }
]

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 86, // 权限控制
  resetMenuId: 158 // 权限控制
}

export const modalConfig = {
  layout: 'inline',
  btnType: 'search',
  hideBtn: true,
  formListSpan: 24
}

export const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  }
}

