
export const intoRuleConfig = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 5,
  btnFonts: '查询',
  formListSpan: 19
}

export const intoRuleFormList = [
  {
    type: 'INPUT',
    label: '规则名称',
    field: 'templateName',
    placeholder: '请输入',
    width: 200
  },
  {
    type: 'INPUT',
    label: '规则内容',
    field: 'content',
    placeholder: '请输入',
    width: 200
  }
]

export const ruleSaveConfig = {
  layout: 'inline',
  formListSpan: 24,
  hideBtn: false
}

export const ruleSaveFormItemLayout = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 12
  }
}

export const ruleSaveFormList = [
  {
    type: 'INPUT',
    label: '规则名称:',
    field: 'templateName',
    placeholder: '请输入规则名称',
    width: 200,
    formItemLayout: ruleSaveFormItemLayout,
    required: true,
    requiredMsg: '请输入规则名称'
    // initialValue:'1'
  },
  {
    type: 'INPUT',
    label: '规则分类:',
    field: 'templateType',
    placeholder: '请输入规则分类',
    width: 200,
    formItemLayout: ruleSaveFormItemLayout,
    required: true,
    requiredMsg: '请输入规则分类'
    // initialValue:'1'
  },
  {
    type: 'TEXTAREA',
    label: '规则描述:',
    field: 'remark',
    placeholder: '请输入备注',
    width: 200,
    formItemLayout: ruleSaveFormItemLayout,
    required: true,
    requiredMsg: '请输入备注'
    // initialValue:'1'
  }
]

