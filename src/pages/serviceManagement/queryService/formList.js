/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2019-10-15 18:28:17
 * @LastEditors: Please set LastEditors
 */
import moment from 'moment'
import React from 'react'
const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const formItemLayoutTwo = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
}

// 筛选服务的options
export const formList = [
  {
    type: 'INPUT',
    label: '服务编码',
    field: 'swichCode',
    placeholder: '请输入服务编码',
    // requiredMsg: "请输入服务ID",
    width: 200,
    formItemLayout: formItemLayout
  },
  {
    type: 'INPUT',
    label: '服务名称',
    field: 'serveName',
    placeholder: '请输入服务名称',
    // requiredMsg: "请输入服务名称",
    width: 200,
    formItemLayout: formItemLayout
    // required: true
  },
  {
    type: 'SELECT_OPTIONS',
    label: '服务状态',
    field: 'effectState',
    placeholder: '请选择',
    width: 200,
    formItemLayout: formItemLayout,
    rules: [
      { id: -1, rule: '全部' },
      { id: 0, rule: '未生效' },
      { id: 1, rule: '已生效' },
      { id: 2, rule: '已失效' },
      { id: 3, rule: '可用不可见' }
    ]
  }
]
export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  handleMenuId: 30, // 权限控制
  resetMenuId: 31 // 权限控制
}

// 增加/修改/复制服务模块的list
export const ServiceformList = [
  {
    type: 'INPUT',
    label: '服务名称：',
    field: 'serveName',
    placeholder: '请输入服务名称',
    requiredMsg: '请输入服务名称',
    width: 400,
    formItemLayout: formItemLayoutTwo,
    required: true,
    validatorType: 'serveName'
    // typeRequired: {
    //   max: 20,
    //   message: '最多不能超过20个字符'
    // }
  },
  {
    type: 'SELECT_OPTIONS',
    label: '传送方式：',
    field: 'sendType',
    placeholder: '请选择',
    requiredMsg: '请选择传送方式',
    width: 400,
    formItemLayout: formItemLayoutTwo,
    required: true,
    rules: [
      // { id: 0, rule: '短信' },
      { id: 1, rule: '邮件' },
      { id: 2, rule: '接口' }
    ],
    disabled: false,
    ifConnect: true // 是否和下面的加压/加密/文件类型进行联动
  },
  {
    type: 'SELECT_OPTIONS',
    label: '文件类型：',
    field: 'fileType',
    placeholder: '请选择',
    required: true,
    requiredMsg: '请选择文件类型',
    width: 400,
    formItemLayout: formItemLayoutTwo,
    // rules1: [{ id: 4, rule: '文本' }], // 0 json 1 xml 2txt 3pdf 4文本 5 excel 6word 短信对应文本  邮件对应 word pdf   接口对应json,xml
    rules2: [{ id: 3, rule: 'pdf' }, { id: 6, rule: 'word' }],
    rules3: [{ id: 0, rule: 'json' }, { id: 1, rule: 'xml' }]
  },
  {
    type: 'RADIO',
    label: '是否加压：',
    field: 'forcingType',
    placeholder: '请选择',
    width: 400,
    required: true,
    requiredMsg: '请选择是否加压',
    formItemLayout: formItemLayoutTwo
    // disabled: true
  },
  {
    type: 'RADIO',
    label: '是否加密：',
    field: 'encryptType',
    placeholder: '请选择',
    width: 400,
    required: true,
    requiredMsg: '请选择是否加密',
    formItemLayout: formItemLayoutTwo
    // disabled: true
  },
  {
    type: 'SELECT_BTN',
    field: 'select',
    formItemLayout: formItemLayoutTwo,
    label: <span> <span style={{ color: '#f5222d', paddingRight: '4px' }}>*</span>选择产品：</span>,
    label1: <span> <span style={{ color: '#f5222d', paddingRight: '4px' }}>*</span>选择产品：</span>
    // required: true,
    // requiredMsg: "请选择",
  },
  {
    type: 'TEXTAREA',
    label: '备注：',
    field: 'remark',
    placeholder: '请选择',
    width: 400,
    formItemLayout: formItemLayoutTwo
  },
  {
    type: 'DATE',
    label: '生效时间：',
    field: 'effectDate',
    placeholder: '请选择',
    width: 400,
    required: true,
    requiredMsg: '请选择生效时间',
    formItemLayout: formItemLayoutTwo,
    defaultValue: moment().add(1, 'days').format('YYYY-MM-DD'),
    disabledDate: moment().add(1, 'days').format('YYYY-MM-DD')
  },
  {
    type: 'CHECKBOX',
    label: '服务状态：',
    field: 'checkboxStatus',
    placeholder: '请选择',
    width: 400,
    formItemLayout: formItemLayoutTwo
  },
  {
    type: 'DATE',
    label: '开启时间：',
    field: 'availableNotVisibleDate',
    placeholder: '请选择',
    width: 400,
    disabled: true,
    formItemLayout: formItemLayoutTwo,
    defaultValue: moment().add(1, 'days').format('YYYY-MM-DD'),
    disabledDate: moment().add(1, 'days').format('YYYY-MM-DD')
  }

]

export const Serviceconfig = {
  layout: 'vertical',
  formListSpan: 24
  // btnType: 'search'
}
// 查看服务的时候隐藏保存取消按钮
export const hideServiceconfig = {
  hideBtn: true
}
