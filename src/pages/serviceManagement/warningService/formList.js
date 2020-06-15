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
// 预警模块-首页-查询项目test
export const formList = [
  {
    type: 'INPUT',
    label: '服务编码',
    field: 'swichCode',
    placeholder: '请输入服务编号',
    width: 200,
    formItemLayout: formItemLayout
  },
  {
    type: 'INPUT',
    label: '服务名称',
    field: 'warnServeName',
    placeholder: '请输入服务名称',
    width: 200,
    formItemLayout: formItemLayout
  },
  {
    type: 'INPUT',
    label: '产品名称',
    field: 'productName',
    placeholder: '请输入产品名称',
    width: 200,
    formItemLayout: formItemLayout
  },
  {
    type: 'SELECT_OPTIONS',
    label: '服务状态',
    field: 'effectState',
    placeholder: '请选择',
    width: 200,
    formItemLayout: formItemLayout,
    rules: []
  },
  // {
  //   type: 'SELECT_OPTIONS',
  //   label: '信用主体',
  //   field: 'creditType',
  //   placeholder: '请选择',
  //   width: 200,
  //   formItemLayout: formItemLayout,
  //   rules: []
  // },
  {
    type: 'SELECT_OPTIONS',
    label: '预警周期',
    field: 'warnPeriod',
    placeholder: '请选择',
    width: 200,
    formItemLayout: formItemLayout,
    rules: []
  },
  {
    type: 'SELECT_OPTIONS',
    label: '预警方式',
    field: 'sendType',
    placeholder: '请选择',
    width: 200,
    formItemLayout: formItemLayout,
    rules: [],
    ifConnect: true // 是否和下面的加压/加密/文件类型进行联动
  }
]
// 预警模块-首页-查询按钮
export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  formListSpan: 20,
  handleMenuId: 37, // 权限控制
  resetMenuId: 38 // 权限控制
}
// let copyService = window.location.href.includes('copyService')
// let editService = window.location.href.includes('editService')
// -------------------------------预警服务增加/修改/复制模块---------注意：预警模块文件类型是静态数据--------------

export const AlertServiceformList = [
  {
    type: 'INPUT',
    label: '服务名称：',
    field: 'warnServeName',
    placeholder: '请输入服务名称',
    width: 400,
    formItemLayout: formItemLayoutTwo,
    required: true,
    requiredMsg: '请选择服务名称',
    validatorType: 'warnServeName'
    // disabled: (copyService||editService)? false : true
  },
  {
    type: 'SELECT_BTN',
    field: 'select',
    formItemLayout: formItemLayoutTwo,
    label: <span> <span style={{ color: '#f5222d', paddingRight: '4px' }}>*</span>选择产品：</span>,
    label1: <span> <span style={{ color: '#f5222d', paddingRight: '4px' }}>*</span>选择产品</span>
    // required: true,
    // requiredMsg: "请选择",
  },
  // {
  //   type: 'SELECT_OPTIONS',
  //   label: '信用主体：',
  //   field: 'creditType',
  //   placeholder: '请选择',
  //   width: 400,
  //   formItemLayout: formItemLayoutTwo,
  //   rules: [],
  //   required: true,
  //   requiredMsg: '请选择信用主体'
  // },
  {
    type: 'SELECT_OPTIONS',
    label: '预警周期：',
    field: 'warnPeriod',
    placeholder: '请选择',
    width: 400,
    formItemLayout: formItemLayoutTwo,
    rules: [],
    required: true,
    requiredMsg: '请选择预警周期'
  },
  {
    type: 'SELECT_OPTIONS',
    label: '预警方式：',
    field: 'sendType',
    placeholder: '请选择',
    width: 400,
    formItemLayout: formItemLayoutTwo,
    rules: [],
    required: true,
    requiredMsg: '请选择预警方式',
    ifConnect: true // 是否进行联动
  },
  {
    type: 'RADIO',
    label: '合并发送：',
    field: 'merge',
    placeholder: '请选择',
    width: 400,
    required: true,
    requiredMsg: '请选择是否合并发送',
    formItemLayout: formItemLayoutTwo,
    rules: [{ id: 0, rule: '是' }, { id: 1, rule: '否' }] // 1是  0否,
  },
  {
    type: 'RADIO',
    label: '是否加压：',
    field: 'forcing',
    placeholder: '请选择',
    width: 400,
    required: true,
    requiredMsg: '请选择是否加压',
    formItemLayout: formItemLayoutTwo,
    rules: [{ id: 0, rule: '是' }, { id: 1, rule: '否' }] // 是否加密 1-是 0-否
  },
  {
    type: 'RADIO',
    label: '是否加密：',
    field: 'encrypt',
    placeholder: '请选择',
    width: 400,
    required: true,
    requiredMsg: '请选择是否加密',
    formItemLayout: formItemLayoutTwo,
    rules: [{ id: 0, rule: '是' }, { id: 1, rule: '否' }] // 是否加密 1-是 0-否
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
    type: 'SELECT_OPTIONS',
    label: '文件类型：',
    field: 'fileType',
    placeholder: '请选择',
    required: true,
    requiredMsg: '请选择文件类型',
    width: 400,
    formItemLayout: formItemLayoutTwo,
    rules1: [{ id: 4, rule: '文本' }], // 0 json 1 xml 2txt 3pdf 4文本 5 excel 6 word 短信对应文本  邮件对应 文本、txt, pdf excel   接口对应json,xml
    rules2: [{ id: 3, rule: 'pdf' }, { id: 5, rule: 'excel' }, { id: 6, rule: 'word' }],
    rules3: [{ id: 0, rule: 'json' }, { id: 1, rule: 'xml' }]
  },
  {
    type: 'TEXTAREA',
    label: '预警内容：',
    field: 'warnContent',
    placeholder: '由后台计算后自动生成(前端暂时没有请求接口)',
    width: 400,
    formItemLayout: formItemLayoutTwo,
    disabled: true
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
    type: 'CHECKBOX',
    label: '服务状态：',
    field: 'checkboxStatus',
    placeholder: '请选择',
    width: 400,
    // required: true,
    // requiredMsg: "请选择服务状态",
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

export const AlertServiceconfig = {
  layout: 'vertical',
  btnType: 'save',
  formListSpan: 24
}
// 查看服务的时候隐藏保存取消按钮
export const hideAlertServiceconfig = {
  hideBtn: true
}

