/*
 * @Author: your name
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime : 2020-02-14 13:25:47
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/productService/parts/formList.js
 */
export const formList = [
  {
    type: 'INPUT',
    label: '零件名称',
    field: 'componentName',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180
  }, {
    type: 'SELECT',
    label: '一级分类',
    field: 'officeId',
    placeholder: '请输入',
    width: 180,
    searchType: 1
  }, {
    type: 'SELECT',
    label: '二级分类',
    field: 'departmentId',
    placeholder: '请输入',
    width: 180,
    searchType: 2,
    noAffect: true // 设置了以后不受一级名称影响  可以单独搜索
  }, {
    type: 'INPUT',
    label: '用途名称',
    field: 'purpose',
    placeholder: '请输入',
    width: 180
  }
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
