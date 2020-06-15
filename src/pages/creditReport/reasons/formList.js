/*
 * @Author: your name
 * @Date: 2020-02-17 14:25:17
 * @LastEditTime: 2020-03-20 17:03:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/creditReport/reasons/formList.js
 */

export const formList = [
  {
    type: 'INPUT',
    label: '查询原因编码',
    field: 'reasonNo',
    placeholder: '请输入',
    width: 210
  }, {
    type: 'INPUT',
    label: '查询原因',
    field: 'content',
    placeholder: '请输入',
    width: 210
  }, {
    type: 'SELECT_OPTIONS',
    label: '是否写入信用报告',
    field: 'isWrite',
    placeholder: '请输入',
    width: 210,
    rules: [{ id: '-1', rule: '全部' }, { id: '1', rule: '是' }, { id: '0', rule: '否' }],
    initialValue: '-1'
  }
]

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 181, // 权限控制
  resetMenuId: 182 // 权限控制
}

export const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 16
  }
}

export const modalConfig = {
  btnType: 'search',
  hideBtn: true,
  formListSpan: 24
}
