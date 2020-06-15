/*
 * @Author: your name
 * @Date: 2019-11-07 16:38:56
 * @LastEditTime: 2019-11-07 16:39:00
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/orderConfiguration/orderList/formList.js
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
    label: '订单编码',
    field: 'orderNo',
    placeholder: '请输入订单编码',
    width: 200,
    formItemLayout: formItemLayout
  },
  {
    type: 'SELECT_OPTIONS',
    label: '订单状态',
    field: 'effectState',
    placeholder: '请选择',
    width: 200,
    formItemLayout: formItemLayout,
    rules: [{ id: '-1', rule: '全部' }, { id: 0, rule: '未生效' }, { id: 1, rule: '生效' }, { id: 2, rule: '失效' }]
  },
  {
    type: 'INPUT',
    label: '机构名称',
    field: 'organizationName',
    placeholder: '请输入机构名称',
    width: 200,
    formItemLayout: formItemLayout
  }
]
// 预警模块-首页-查询按钮
export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  formListSpan: 20,
  handleMenuId: 109, // 权限控制
  resetMenuId: 110 // 权限控制
}
