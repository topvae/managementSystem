/*
 * @Author: your name
 * @Date: 2020-05-08 09:46:29
 * @LastEditTime: 2020-06-17 11:21:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /managementSystem/src/pages/productService/productConfiguration/formList.js
 */

import moment from 'moment'
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

export const formItemLayoutTwo = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

// 产品配置--产品list的搜索条件
export const formList = [
  {
    type: 'INPUT',
    label: '证件号',
    field: 'dingdan',
    width: 180,
    formItemLayout: formItemLayout
  },
  {
    type: 'INPUT',
    label: '网通号',
    field: 'shanghu',
    width: 180,
    formItemLayout: formItemLayout
  },
  {
    type: 'DATE',
    label: '开始日期',
    field: 'start',
    formItemLayout: formItemLayout,
    width: 180,
    defaultValue: moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD')
    // disabledDate: moment().format('YYYY-MM-DD')
  },
  {
    type: 'DATE',
    label: '结束日期',
    field: 'end',
    formItemLayout: formItemLayout,
    width: 180,
    defaultValue: moment().format('YYYY-MM-DD')
  }
]

// 产品配置-筛选产品list
export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 5,
  formListSpan: 19,
  handleMenuId: 24, // 权限控制
  resetMenuId: 25 // 权限控制
}
