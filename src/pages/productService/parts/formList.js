/*
 * @Author: your name
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2020-06-17 11:26:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/productService/parts/formList.js
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
export const formList = [
  {
    type: 'INPUT',
    label: '订单号',
    field: 'dingdan',
    width: 180,
    formItemLayout: formItemLayout
  },
  {
    type: 'INPUT',
    label: '商户号',
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
  }, {
    type: 'DATE',
    label: '结束日期',
    field: 'end',
    formItemLayout: formItemLayout,
    width: 180,
    defaultValue: moment().format('YYYY-MM-DD') }
]

export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  handleMenuId: 18, // 权限控制
  resetMenuId: 19 // 权限控制
}

export const componentColumn = [
  {
    title: '零件名称',
    dataIndex: 'componentName',
    key: 'componentName'
  },
  {
    title: '零件用途',
    dataIndex: 'purpose',
    key: 'purpose'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  }
]

export const statusList = ['未生效', '已生效', '已失效']
