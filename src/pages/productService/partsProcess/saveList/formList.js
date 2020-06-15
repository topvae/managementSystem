/*
 * @Author: your name
 * @Date: 2019-11-14 10:34:37
 * @LastEditTime: 2020-03-25 10:52:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/productService/partsProcess/saveList/formList.js
 */

export const formList = [
  {
    type: 'INPUT',
    label: '零件名称',
    field: 'componentName',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 160
  }, {
    type: 'SELECT',
    label: '一级分类',
    field: 'officeId',
    placeholder: '请输入',
    width: 160,
    searchType: 1
  }, {
    type: 'SELECT',
    label: '二级分类',
    field: 'departmentId',
    placeholder: '请输入',
    width: 160,
    searchType: 2,
    noAffect: true // 设置了以后不受一级名称影响  可以单独搜索
  }, {
    type: 'INPUT',
    label: '用途名称',
    field: 'purpose',
    placeholder: '请输入',
    width: 160
  }
]

export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 5,
  formListSpan: 19
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
