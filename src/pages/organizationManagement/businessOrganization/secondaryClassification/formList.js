const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
// 查询角色列表list
export const formList = [
  {
    type: 'SELECT',
    label: '业务发生机构:',
    field: 'officeId',
    placeholder: '请输入业务发生机构',
    width: 200,
    searchType: 1
  },
  {
    type: 'SELECT',
    label: '二级分类:',
    field: 'departmentName',
    placeholder: '请输入二级分类',
    width: 200,
    searchType: 3,
    noAffect: true
  },
  {
    type: 'SELECT',
    label: '二级分类编码：',
    field: 'swichCode',
    placeholder: '请输入二级分类编码',
    width: 200,
    searchType: 4,
    noAffect: true
  }
]

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 149, // 权限控制
  resetMenuId: 150 // 权限控制
}

// 新增角色

export const addModalList = [
  {
    type: 'SELECT',
    label: '业务发生机构',
    field: 'officeId',
    placeholder: '请输入业务发生机构',
    width: 250,
    formItemLayout: formItemLayout,
    required: true,
    requiredMsg: '请输入业务发生机构',
    // validatorType: 'roleName',
    typeRequired: {
      max: 20,
      message: '最多不能超过20个字符'
    },
    searchType: 1,
    disabled: false
  },
  {
    type: 'INPUT',
    label: '二级分类：',
    field: 'departmentName',
    requiredMsg: '请输入二级分类',
    width: 250,
    required: true,
    formItemLayout: formItemLayout,
    validatorType: 'departmentName',
    typeRequired: {
      max: 20,
      message: '最多不能超过20个字符'
    }
  },
  {
    type: 'INPUT',
    label: '二级分类编码：',
    field: 'swichCode',
    requiredMsg: '请输入二级分类编码',
    width: 250,
    required: true,
    formItemLayout: formItemLayout,
    validatorType: 'swichCode',
    typeRequired: {
      max: 20,
      message: '最多不能超过20个字符'
    }
  }
]
export const modalConfig = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  formListSpan: 24,
  hideBtn: true
}
