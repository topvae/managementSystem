export const formList = [
  {
    type: 'INPUT',
    label: '业务索引名称',
    field: 'name',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180
  }, {
    type: 'INPUT',
    label: '业务索引代码',
    field: 'code',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180,
    maxLen: 100
  }
]

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 86, // 权限控制
  resetMenuId: 158 // 权限控制
}

export const modalConfig = {
  layout: 'inline',
  btnType: 'search',
  hideBtn: true,
  formListSpan: 24
}

export const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  }
}

