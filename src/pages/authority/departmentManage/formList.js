const formItemLayout = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
}

export const formList = [
  {
    type: 'INPUT',
    label: '部门名称',
    field: 'name',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180
  }
]

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 63, // 权限控制
  resetMenuId: 64 // 权限控制
}

export const departments = [
  {
    type: 'INPUT',
    label: '部门名称：',
    field: 'name',
    placeholder: '请输入部门名称',
    width: 400,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请输入部门名称',
    disabled: false,
    validatorType: 'name',
    typeRequired: {
      max: 20,
      message: '最多不能超过20个字符'
    }
  },
  {
    type: 'TREE',
    label: '上级部门：',
    field: 'parentIds',
    requiredMsg: '请选择上级部门',
    required: true,
    width: 400,
    formItemLayout: formItemLayout,
    treekey: 'deptId',
    treeName: 'name',
    treeData: [] // 注意：这里是个空数组，需要到引入的页面赋值
    // checkable: true,   //单选
    // checkStrictly: true,
  },
  {
    type: 'TEXTAREA',
    label: '备注：',
    field: 'remark',
    placeholder: '请选择',
    width: 400,
    formItemLayout: formItemLayout
  }
]
export const departmentsconfig = {
  layout: 'vertical',
  btnType: 'save',
  formListSpan: 24
}
