import moment from 'moment'
const formItemLayout = {
  labelCol: {
  },
  wrapperCol: {
  }
}

export const formItemLayoutTwo = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

// 产品配置--产品list的搜索条件
export const formListOne = [
  {
    type: 'INPUT',
    label: '产品名称',
    field: 'productName',
    placeholder: '请输入产品名称',
    // requiredMsg: "请输入产品名称",
    width: 200,
    formItemLayout: formItemLayout
    // required: true
  },
  {
    type: 'INPUT',
    label: '产品备注',
    field: 'remark',
    placeholder: '请输入产品备注',
    width: 200,
    formItemLayout: formItemLayout
  },
  {
    type: 'SELECT_OPTIONS',
    label: '信用主体类型',
    field: 'creditType',
    placeholder: '请选择',
    width: 200,
    formItemLayout: formItemLayout,
    rules: []
  }
]
// 产品配置-零件list列表
export const formListTwo = [
  {
    type: 'INPUT',
    label: '零件名称',
    field: 'componentName',
    placeholder: '请输入零件名称',
    width: 180,
    formItemLayout: formItemLayout
  },
  {
    type: 'SELECT',
    label: '一级分类',
    field: 'officeId',
    placeholder: '请输入一级名称',
    width: 180,
    formItemLayout: formItemLayout,
    searchType: 1
  },
  {
    type: 'SELECT',
    label: '二级分类',
    field: 'departmentId',
    placeholder: '请输入二级分类',
    width: 180,
    formItemLayout: formItemLayout,
    searchType: 2
  },
  {
    type: 'INPUT',
    label: '用途名称',
    field: 'purpose',
    placeholder: '请输入用途名称',
    width: 180,
    formItemLayout: formItemLayout
  }
]

// 产品配置-筛选产品list
export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 5,
  formListSpan: 19,
  handleMenuId: 24, // 权限控制
  resetMenuId: 25 // 权限控制
}
// 产品配置-新增产品
export const AddProductconfig = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  formListSpan: 24,
  hideBtn: true
}
export const Editconfig = {
  layout: 'vertical',
  btnType: 'editSave',
  btnFonts: '保存修改',
  btnSpan: 4
}

// 新增产品模块的list或者产品修改的list
export const addProductList = [
  {
    type: 'INPUT',
    label: '产品名称:',
    field: 'productName',
    placeholder: '请输入',
    required: true,
    requiredMsg: '请输入产品名称',
    validatorType: 'productName',
    formItemLayout: formItemLayoutTwo,
    width: 300
  },
  {
    type: 'SELECT_OPTIONS',
    label: '组合方式:',
    field: 'configuration',
    required: true,
    placeholder: '请输入',
    requiredMsg: '选择组合方式',
    initialValue: 0,
    formItemLayout: formItemLayoutTwo,
    width: 300,
    rules: [{ id: 0, rule: '组合' }]
  },
  {
    type: 'SELECT_OPTIONS',
    label: '信用主体类型:',
    field: 'creditType',
    required: true,
    placeholder: '请选择',
    requiredMsg: '选择信用主体类型',
    initialValue: 0,
    formItemLayout: formItemLayoutTwo,
    width: 300,
    rules: []
  },
  {
    type: 'INPUT',
    label: '产品外码:',
    field: 'swichCode',
    placeholder: '请输入',
    requiredMsg: '请输入外码',
    formItemLayout: formItemLayoutTwo,
    required: true,
    width: 300
  },
  {
    type: 'DATE',
    label: '生效时间:',
    field: 'effectDate',
    placeholder: '请选择',
    requiredMsg: '请选择时间',
    formItemLayout: formItemLayoutTwo,
    required: true,
    width: 300,
    defaultValue: moment()
      .add(1, 'days')
      .format('YYYY-MM-DD'),
    disabledDate: moment()
      .add(1, 'days')
      .format('YYYY-MM-DD')
  },
  {
    type: 'TEXTAREA',
    label: '备注信息:',
    field: 'remark',
    required: true,
    formItemLayout: formItemLayoutTwo,
    requiredMsg: '请输入备注信息',
    placeholder: '请输入',
    width: 300
  }
]
export const departmentsconfig = {
  layout: 'vertical',
  btnType: 'save',
  formListSpan: 24
}
