const formItemLayout = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
}
// 查询角色列表list
export const formList = [
  {
    type: 'INPUT',
    label: '角色名称',
    field: 'roleName',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180
  }
]

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 59, // 权限控制
  resetMenuId: 60 // 权限控制
}

// 新增角色

export const roles = [
  {
    type: 'INPUT',
    label: '角色名称：',
    field: 'roleName',
    placeholder: '请输入角色名称',
    width: 400,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请选择角色名称',
    validatorType: 'roleName',
    typeRequired: {
      max: 20,
      message: '最多不能超过20个字符'
    },
    disabled: false
  },
  {
    type: 'TREE',
    label: '所属部门：',
    field: 'deptId',
    requiredMsg: '请选择所属部门',
    width: 400,
    required: true,
    treeData: [], // 注意：这里是个空数组，需要到引入的页面赋值
    checkable: false, // 不带多选框
    treekey: 'deptId',
    formItemLayout: formItemLayout,
    treeName: 'name'
  },
  {
    type: 'TEXTAREA',
    label: '备注：',
    field: 'remark',
    placeholder: '请选择',
    width: 400,
    formItemLayout: formItemLayout
  },
  {
    type: 'TREE',
    label: '功能权限：',
    field: 'menuIdList',
    requiredMsg: '请选择功能权限',
    width: 400,
    required: true,
    treeData: [], // 注意：这里是个空数组，需要到引入的页面赋值
    treekey: 'menuId',
    checkable: true, // 带多选框
    formItemLayout: formItemLayout,
    treeName: 'name'
  }
]
export const Rolesconfig = {
  layout: 'vertical',
  btnType: 'save',
  formListSpan: 24
}
