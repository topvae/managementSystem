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
    label: '用户名称',
    field: 'username',
    placeholder: '请输入',
    requiredMsg: '请输入',
    width: 180
  }
]

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 67, // 权限控制
  resetMenuId: 68 // 权限控制
}

export const users = [
  {
    type: 'INPUT',
    label: '用户名：',
    field: 'username',
    placeholder: '请输入用户名称',
    width: 400,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请输入用户名称',
    disabled: false,
    validatorType: 'username',
    typeRequired: {
      max: 20,
      message: '最多不能超过20个字符'
    }
  },
  {
    type: 'TREE',
    label: '所属部门：',
    field: 'deptId',
    requiredMsg: '请选择所属部门',
    required: true,
    width: 400,
    formItemLayout: formItemLayout,
    treeData: [], // 注意：这里是个空数组，需要到引入的页面赋值
    treekey: 'deptId',
    checkable: false,
    treeName: 'name'
  }, {
    type: 'INPUT',
    label: '密码：',
    field: 'password',
    placeholder: '请输入密码',
    width: 400,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请输入密码',
    // typeRequired: {
    //   len: 6,
    //   message:'密码为6位'
    // },
    validatorType: 'password'
  }, {
    type: 'INPUT',
    label: '邮箱：',
    field: 'email',
    placeholder: '请输入邮箱',
    width: 400,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请输入邮箱',
    typeRequired: {
      type: 'email',
      message: '请输入正确的邮箱格式'
    }
  }, {
    type: 'INPUT',
    label: '手机号：',
    field: 'mobile',
    placeholder: '请输入手机号',
    width: 400,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请输入手机号',
    validatorType: 'mobile'
  }, {
    type: 'SELECT_OPTIONS',
    label: '角色：',
    field: 'roleIds',
    placeholder: '请选择角色',
    width: 400,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请选择角色',
    mode: 'multiple', // 控制多选的属性
    rules: []
  }, {
    type: 'TREE',
    label: '功能权限：',
    field: 'menuIds',
    width: 400,
    formItemLayout: formItemLayout,
    treeData: [], // 注意：这里是个空数组，需要到引入的页面赋值
    treekey: 'menuId',
    checkable: true,
    treeName: 'name'
  }, {
    type: 'RADIO',
    label: '状态：',
    field: 'status',
    placeholder: '请选择',
    width: 400,
    required: true,
    requiredMsg: '请选择状态',
    formItemLayout: formItemLayout,
    userstatus: true // 通过这个参数去修改封装好的单选框文字
  }
]
export const usersconfig = {
  layout: 'vertical',
  btnType: 'save',
  formListSpan: 24
}
