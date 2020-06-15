export const formList = [
  {
    type: 'INPUT',
    label: '规则名称',
    field: 'templateName',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 200
  }, {
    type: 'INPUT',
    label: '规则分类',
    field: 'templateType',
    placeholder: '请输入',
    width: 200,
    searchType: 1
  }, {
    type: 'INPUT',
    label: '规则内容',
    field: 'content',
    placeholder: '请输入',
    width: 200,
    searchType: 2
  }
]

export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  handleMenuId: 34, // 权限控制
  resetMenuId: 35 // 权限控制
}

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}

export const modalFormList = [
  {
    type: 'INPUT',
    label: '规则名称',
    field: 'templateName',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 380,
    formItemLayout

  }, {
    type: 'INPUT',
    label: '规则分类',
    field: 'content',
    placeholder: 'templateType',
    width: 380,
    formItemLayout
  }, {
    type: 'TEXTAREA',
    label: '规则内容',
    field: 'modalRuleContent',
    placeholder: 'content',
    width: 380,
    formItemLayout
  }
]

export const modalConfig = {
  layout: 'inline',
  btnType: 'search',
  hideBtn: true,
  btnSpan: 4
}
