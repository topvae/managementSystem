/*
 * @Author: your name
 * @Date: 2019-11-07 16:41:39
 * @LastEditTime: 2019-11-07 16:42:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/orderConfiguration/placeOrders/formList.js
 */
// import moment from 'moment'
// import React from 'react'
const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

// 预警模块-首页-查询项目
export const formList = [
  {
    type: 'INPUT',
    label: '服务编码',
    field: 'swichCode',
    placeholder: '请输入服务编码',
    width: 165,
    formItemLayout: formItemLayout
  },
  {
    type: 'INPUT',
    label: '服务名称',
    field: 'serveName',
    placeholder: '请输入服务名称',
    width: 165,
    formItemLayout: formItemLayout
  },
  {
    type: 'SELECT_OPTIONS',
    label: '服务类型',
    field: 'type',
    placeholder: '请选择',
    width: 165,
    formItemLayout: formItemLayout,
    rules: [{ id: -1, rule: '全部' }, { id: 0, rule: '普通服务' }, { id: 1, rule: '预警服务' }]
  },
  {
    type: 'SELECT_OPTIONS',
    label: '信用主体类型',
    field: 'creditType',
    placeholder: '请选择',
    width: 165,
    formItemLayout: {
      labelCol: {
        span: 10
      },
      wrapperCol: {
        span: 14
      }
    },
    rules: []
  }
]
// 预警模块-首页-查询按钮
export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  formListSpan: 20,
  handleMenuId: 106, // 权限控制
  resetMenuId: 107 // 权限控制
}
