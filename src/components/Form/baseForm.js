/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-03-18 10:54:16
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Tree
} from 'antd'
import ChooseProduct from '../../pages/serviceManagement/queryService/chooseProduct'
import { validatorName } from '../../utils/utils'
import moment from 'moment'
import axios from 'axios'
import 'moment/locale/zh-cn'
import './../../pages/serviceManagement/queryService/index.less'
moment.locale('zh-cn')
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'
const { TreeNode } = Tree

class ServiceForm extends React.Component {
  state = {
    copyService: false,
    editService: false,
    addService: false,
    config: {
      ...this.props.config,
      hideBtn: this.props.config.hideBtn ? this.props.config.hideBtn : false
    },
    sendType: '', // 传送类型
    productName: '', // 选择产品的名字
    productNo: '', // 选择好的产品的number
    IfDisabled: false, // 设置一个参数在复制修改页面的禁止更改项
    ifShowErr: false,
    checkBoxChecked: false, // 默认服务状态单选框
    sendTypeConnect: '', //
    updateList: {},
    menuIdList: [], // 功能权限树tree组勾选选中的keys
    deptId: [], // 所属部门tree勾选的keys
    parentIds: [], // 上级部门tree勾选的keys
    menuIds: [], // 用户模块功能权限
    editRoleIds: [], // 角色Id的数组
    menuAutoExpandParent: true, // 是否自动展开父节点  菜单树
    depAutoExpandParent: true, // 是否自动展开父节点  部门树
    expandedKeys: [], // 树结构展开的keys
    halfCheckedKeys: [], // 半勾选状态下的id
    passswordChanged: false,
    serviceConfig: false // 产品管理-服务控制参数
  };
  params = {
    page: 1,
    effectState: 1 // 已生效   effectState生效状态 0-未生效 1-已生效 2-已失效
  };

  componentDidUpdate() {
    const copyService = window.location.href.includes('copyService')
    const editService = window.location.href.includes('editService')
    const serviceConfig = window.location.href.includes('serviceConfig') // 产品管理-服务配置
    if (copyService === this.state.copyService || editService === this.state.editService) {
      return
    }
    this.setState({
      copyService,
      editService
    })
    if (copyService || editService) {
      // 通过这个变量控制赋值和编辑的禁止更改项
      this.setState({
        IfDisabled: true
      })
    } else if (serviceConfig) {
      this.setState({
        serviceConfig: true
      })
    }
  }

  // 表单提交
  handleFormSubmit = e => {
    const copyService = window.location.href.includes('copyService')
    const editService = window.location.href.includes('editService')
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 增加服务逻辑：ids参数根据后台参数做进一步修改
        if (window.location.href.includes('addService')) {
          if (this.state.productNo) {
            values.productNo = this.state.productNo
            values.effectDate = moment(values.effectDate).format('YYYY-MM-DD')
            // 服务的开启时间 ：如果服务状态点击可用不可见之后，给后台传开启时间的字段，否则不传过去
            values.availableNotVisibleDate = this.state.checkBoxChecked ? moment(values.availableNotVisibleDate).format('YYYY-MM-DD') : null
            this.props.filterSubmit(values)
          } else {
            // 名称不存在的时候将选择产品报错信息暴露出来
            this.setState({
              ifShowErr: true
            })
          }
        } else if (copyService || editService) {
          // 服务模块复制/修改逻辑： 下面的参数有两种情况： 1.页面没有调用change方法的时候，需要检索出index值， 2.调用change方法的时候，value值为定义的rules中的ID值
          values.productNo = this.state.productNo
          values.effectDate = moment(values.effectDate).format('YYYY-MM-DD')
          // 服务的开启时间 ：如果服务状态点击可用不可见之后，给后台传开启时间的字段，否则不传过去
          values.availableNotVisibleDate = this.state.checkBoxChecked ? moment(values.availableNotVisibleDate).format('YYYY-MM-DD') : null
          this.props.filterSubmit(values)
        } else {
          // 用户角色管理模块
          // console.log("Received values of form: ", values);
          this.props.filterSubmit(values)
        }
      } else {
        // 什么都不填的时候，就点击提交的时候
        if (!this.state.productNo) {
          this.setState({
            ifShowErr: true // 在正确信息之外判断状态
          })
        }
        this.ifShowMessage()
      }
    })
  };
  // 在需要展示出来message提示的地方做提示
  ifShowMessage=() => {
    if (this.props.showMessage) {
      this.props.showMessage()
    }
  }
  // 重置表单
  handleReset = () => {
    this.props.handleReset()
    // 同时重置产品数组
    this.setState({
      productName: '',
      productNo: ''
    })
  };

  // modal表单回显 在服务复制修改页面请求详情接口赋值（注意：有弊端--在所有复制修改页面需要配置if条件）
  componentDidMount() {
    const copyService = window.location.href.includes('copyService')
    const editService = window.location.href.includes('editService')
    if (copyService || editService) {
      // 通过这个变量控制赋值和编辑的禁止更改项
      this.setState({
        IfDisabled: true
      })
    }
  }
  componentWillReceiveProps(props) {
    const { updateList, productName, productNo, checkBoxChecked, menuIdList, deptId, parentIds, menuIds, editRoleIds, menuExpandKeys, depExpandKeys } = this.state
    if (props.updateList && updateList !== props.updateList) {
      this.setState({
        updateList: props.updateList,
        sendTypeConnect: props.updateList.sendType
      })
      setTimeout(() => {
        this.props.form.setFieldsValue(props.updateList)
      }, 100)
    }
    if (productName !== props.productName && productNo !== props.productNo) {
      this.setState({
        productName: props.productName,
        productNo: props.productNo
      })
    }

    if (checkBoxChecked !== props.checkBoxChecked) {
      this.setState({
        checkBoxChecked: props.checkBoxChecked
      })
    }
    if (menuIdList !== (props.menuIdList && props.menuIdList.length > 0)) {
      this.setState({
        menuIdList: props.menuIdList && props.menuIdList.map(item => {
          return item.toString()
        })
      })
    }
    if (deptId !== props.deptId) { // 角色管理-------部门      //一个
      this.setState({
        deptId: props.deptId && props.deptId.map(item => {
          return item.toString()
        })
      })
    }
    if (parentIds !== props.parentIds) { // 部门管理 -----部门   //可能为多个
      this.setState({
        parentIds: props.parentIds && props.parentIds.map(item => {
          return item.toString()
        })
      })
    }
    if (menuIds !== props.menuIds) {
      this.setState({
        menuIds: props.menuIds && props.menuIds.map(item => {
          return item.toString()
        })
      })
    }
    if (editRoleIds !== props.editRoleIds) {
      this.setState({
        editRoleIds: props.editRoleIds
      })
    }
    // ---------------------------角色模块展开的keys----menuExpandKeys---------------------
    if (menuExpandKeys !== props.menuExpandKeys) {
      // console.log('menuExpandKeys',menuExpandKeys)
      this.setState({
        menuExpandKeys: props.menuExpandKeys && props.menuExpandKeys.map(item => {
          return item.toString()
        })
      })
    }
    if (depExpandKeys !== props.depExpandKeys) {
      // console.log('depExpandKeys',depExpandKeys)
      this.setState({
        depExpandKeys: props.depExpandKeys && props.depExpandKeys.map(item => {
          return item.toString()
        })
      })
    }
  }

  // 子组件调用父组件的方法，显示showProductNo
  showProductNo = (paramsNo, paramsName, paramsRemark) => {
    this.props.showProductNo(paramsNo, paramsName, paramsRemark)
  }
  // 子组件调用父组件的方法，控制ifShowErr
  ShowErrMsg =() => {
    this.setState({
      ifShowErr: false
    })
  }

  // 校验选择产品
  checkChooseBtn = (rule, value, callback) => {
    if (value) {
      callback()
    } else {
      callback('产品')
    }
  }

  // 选中传送方式的时候
  handleChange = (value, field) => {
    this.setState({
      [field]: value
    })
  };

  // 选中传送方式的时候
  handleConnectChange =(value, field) => {
    const { form } = this.props
    // let {serviceConfig} = this.state
    if (value === 0) {
      this.setState({
        sendTypeConnect: 0
      }, () => {
        if (this.state.sendTypeConnect === 0) {
          // 产品管理
          setTimeout(() => {
            form.setFieldsValue({ forcingType: 0, encryptType: 0 })
          }, 100)
          // 下面这个是预警服务
          setTimeout(() => {
            form.setFieldsValue({ forcing: 0, encrypt: 0 })
          }, 100)
        }
      })
    } else if (value === 1) {
      this.setState({
        sendTypeConnect: 1
      })
    } else if (value === 2) {
      this.setState({
        sendTypeConnect: 2
      })
    }
    form.setFieldsValue({ fileType: '' }) // 传送方式选择任何一项，文件类型都会清空让用户重新选择
  }

  // 日期改变的时候
  dateChange = (date, dateString) => {
    // this.props.dateChange(date, dateString)
  };

  // 不能选择的时间
  disabledDate = (current, disabledDate) => {
    return current && current < moment(disabledDate, dateFormat)
  };

  // 多选框改变的时候
  CheckboxChange =(e) => {
    this.props.CheckboxChange(e)
  }
  // 单选框改变的时候
  onRadioChange =(e, field) => {
    // 预警服务中的合并发送不用被控制，所以代码要排除掉它
    if (this.state.sendTypeConnect === 0 && field !== 'merge') {
      e.target.value = 0
    }
  }

  // 根据不同类型判断  按钮占用的栅格  注意：保存的时候一定要判断不同的类型 edit add copy
  getButton = () => {
    return (
      <Col span={ 24 }>
        <div style={{ textAlign: 'center' }}>
          <Button type='primary' htmlType='submit'>
            保存
          </Button>
          <Button onClick={ this.handleReset }>取消</Button>
        </div>
      </Col>
    )
  };
  // 校验服务名称  只在新增页面校验
  validateServiceName = (rule, value, callback) => {
    if (window.location.href.includes('addService') && value) {
      const serviceValue = value.replace(/\s*/g, '')
      if (!validatorName(serviceValue)) {
        callback('包含特殊字符或首字母为数字')
      } else {
        this.setState(
          {
            onlyName: serviceValue
          },
          () => {
            if (value) {
              this.nameChange(callback)
            } else {
              callback()
            }
          }
        )
      }
    } else {
      callback()
    }
  };
  // 密码
  passswordChange =() => {
    this.setState({
      passswordChanged: true
    })
    if (this.props.passswordChange) {
      this.props.passswordChange()
    }
  }

  // 密码校验
  validatePassword =(rule, value, callback) => {
    const { passswordChanged } = this.state
    var reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{6}$/
    if ((value.length !== 0 && !reg.test(value)) && passswordChanged) {
      callback('密码须由字母、数字、特殊字符构成的6位')
    } else {
      callback()
    }
  }

  // 校验预警模块服务名称
  validateAlertServiceName =(rule, value, callback) => {
    let testValue
    if (value) {
      testValue = value.replace(/\s*/g, '') // 去除空格
      if (!validatorName(testValue)) {
        callback('包含特殊字符或首字母为数字')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  // 校验手机号
  validateMobile =(rule, value, callback) => {
    const mobileReg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (mobileReg.test(value)) {
      callback()
    } else {
      callback('请输入正确的手机号')
    }
  }

  // 服务名称改变的时候同时请求接口
  nameChange = callback => {
    // 输入的时候请求接口
    axios
      .get('/api/credit-serve/serve/checkServeName', {
        params: { serveName: this.state.onlyName.replace(/\s*/g, '') }
      })
      .then(res => {
        if (res.data.responseCode === 0) {
          callback()
        } else {
          callback(res.data.responseMsg)
        }
      })
  };

  // 时间框的禁止项
  DatePickerDisabled =(v) => {
    if (window.location.href.includes('showServiceDetails')) {
      return true
    } else {
      if (this.state.checkBoxChecked) {
        return false
      } else {
        return v // v代表的是item.disabled
      }
    }
  }
  // item的disabled
  itemDisabled =(v) => {
    if (window.location.href.includes('showServiceDetails')) {
      return true
    } else {
      // console.log(3333333)
      if (v) {
        // console.log(v,'vvvvvvvvv')
        return v
      } else {
        // console.log('false',v)
        return false
      }
    }
  }

  // 校验textarea
  validateTextArea =(rule, value, callback) => {
    if (value && value.length > 50) {
      callback('不能超过50个字符')
    } else {
      callback()
    }
  }
  // --------------------------------------Tree控件------------------------------------
  // 选中节点的时候出发方法
  onCheck = (checkedKeys, info, field) => {
    const { form, selectedTreeKeys } = this.props
    // 注意：halfCheckedKeys 是没有全部勾选状态下的父节点
    const concatTreeData = checkedKeys.concat(info.halfCheckedKeys)
    form.setFieldsValue({ [field]: concatTreeData }) // 将拼接好的数组传过去
    this.setState({
      [field]: checkedKeys,
      halfCheckedKeys: info.halfCheckedKeys
    }
    , () => {
      selectedTreeKeys(field, checkedKeys, info.halfCheckedKeys)
    })
  }

  // 选中树节点的时候触发的方法
  onSelect = (selectedKeys, info, field) => {
    // if(field === "deptId") {
    const { form, selectedTreeKeys } = this.props
    // console.log('onSelect',selectedKeys,info, field);
    form.setFieldsValue({ [field]: selectedKeys })
    this.setState({
      [field]: selectedKeys
    }, () => {
      selectedTreeKeys(field, selectedKeys)
    })
    // }
  };
  onExpand =(expandedKeys, field) => {
    // console.log('onExpand',expandedKeys, field)
    const { chooseExpandKeys } = this.props
    switch (field) {
      case 'menuIdList':
      case 'menuIds':
        this.setState({
          menuExpandKeys: expandedKeys,
          menuAutoExpandParent: false
        }, () => { chooseExpandKeys(field, this.state.menuExpandKeys) })
        break
      case 'deptId':
        this.setState({
          depExpandKeys: expandedKeys,
          depAutoExpandParent: false
        }, () => { chooseExpandKeys(field, this.state.depExpandKeys) })
        break
      case 'parentIds':
        this.setState({
          depExpandKeys: expandedKeys,
          depAutoExpandParent: false
        }, () => { chooseExpandKeys(field, this.state.depExpandKeys) })
        break
      default:
        this.setState({
          menuAutoExpandParent: false,
          depAutoExpandParent: false
        })
    }
  }

 renderList =(data, treekey, treeName) => {
   return data && data.map(item => {
     if (item.nodes) {
       return (<TreeNode title={ item[treeName] } key={ item[treekey] }>
         {this.renderList(item.nodes, treekey, treeName)}
       </TreeNode>)
     }
     return <TreeNode title={ item[treeName] } key={ item[treekey] }></TreeNode>
   })
 }

  // 初始化表单
  initFormList = () => {
    const { getFieldDecorator } = this.props.form
    const formList = this.props.formList
    const formItemList = []
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        const label = item.label
        const field = item.field
        const placeholder = item.placeholder
        const width = item.width
        const required = item.required || false
        const requiredMsg = item.requiredMsg
        const formItemLayout = item.formItemLayout
        const validatorType = item.validatorType
        const ifConnect = item.ifConnect ? item.ifConnect : false // 联动  预警方式、是否加密、是否加压、文件类型的关系
        const disabled = this.itemDisabled(item.disabled) // 代表所有的item的disable状态
        const typeRequired = item.typeRequired
        if (item.type === 'INPUT') {
          let fn
          switch (validatorType) {
            case 'serveName':
              fn = this.validateServiceName
              break
            case 'warnServeName':
              fn = this.validateAlertServiceName
              break
            case 'roleName':
              fn = this.validateAlertServiceName // 角色管理
              break
            case 'username':
              fn = this.validateAlertServiceName // 用户管理
              break
            case 'name': // 部门管理
              fn = this.validateAlertServiceName
              break
            case 'mobile':
              fn = this.validateMobile
              break
            case 'password':
              fn = this.validatePassword
              break
            default:
              fn = null
          }
          const INPUT = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  },
                  {
                    validator: fn
                  },
                  { ...typeRequired }
                ]
              })(
                field === 'password'
                  ? <Input style={{ width }} onChange={ this.passswordChange } type='password' autoComplete='new-password' />
                  : <Input
                    id='test'
                    style={{ width }}
                    type='text'
                    placeholder={ placeholder }
                    disabled={ this.state.IfDisabled ? this.state.IfDisabled : disabled }
                  />
              )}
            </FormItem>
          )
          formItemList.push(INPUT)
        } else if (item.type === 'TEXTAREA') {
          const TEXTAREA = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  },
                  {
                    validator: this.validateTextArea
                  }
                ]
              })(<TextArea style={{ width }} placeholder={ placeholder } disabled={ disabled } />)}
            </FormItem>
          )
          formItemList.push(TEXTAREA)
        } else if (item.type === 'SELECT_OPTIONS') {
          const { sendTypeConnect } = this.state
          let rules = item.rules
          // debugger;
          // 当field是文件类型的时候 对应的不同的rules
          if (field === 'fileType') {
            switch (sendTypeConnect) {
              case 0:
                rules = item.rules1
                break
              case 1:
                rules = item.rules2
                break
              case 2:
                rules = item.rules3
                break
              default:
                rules = item.rules
            }
          }
          const mode = item.mode // 控制控制单选多选属性
          const options =
          rules && rules.map(d => <Option key={ d.id } value={ d.id } >{d.rule}</Option>)
          const SELECT = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  }
                ]
              })(
                <Select
                  mode={ mode } // 控制单选多选属性
                  onChange={ value => ifConnect ? this.handleConnectChange(value, field) : this.handleChange(value, field) }
                  placeholder={ placeholder }
                  style={{ width }}
                  disabled={ disabled }
                  getPopupContainer={ triggerNode => triggerNode.parentElement }

                >
                  {options}
                </Select>
              )}
            </FormItem>
          )
          formItemList.push(SELECT)
        } else if (item.type === 'SELECT_BTN') {
          const showServiceDetails = window.location.href.includes('showServiceDetails')
          const label1 = item.label1
          const SELECTBTN = (
            <div className='relaDiv' key={ field }>
              <FormItem label={ showServiceDetails ? label1 : label } { ...formItemLayout } >
                {getFieldDecorator(field)(
                  <ChooseProduct
                    showProductNo={ this.showProductNo }
                    productName={ this.state.productName }
                    ShowErrMsg={ this.ShowErrMsg } // 子组件调用父组件的方法改变ifShowErr状态
                    ifShowErr={ this.state.ifShowErr } // 控制选择产品errorMsg的显示
                  />
                )}
              </FormItem>
            </div>

          )
          formItemList.push(SELECTBTN)
        } else if (item.type === 'DATE') {
          // 初始化时间  不传默认当天时间
          const defaultValue = item.defaultValue || moment().format('YYYY-MM-DD')
          const disabledDate = item.disabledDate
          const DATE = (
            <div key={ field } style={{ position: 'relative' }}>
              <FormItem label={ label } { ...formItemLayout } >
                {getFieldDecorator(field, {
                  rules: [
                    {
                      required: required,
                      message: requiredMsg
                    }
                  ],
                  initialValue: moment(defaultValue, dateFormat)
                })(
                  <DatePicker
                    style={{ width: item.width }}
                    onChange={ this.dateChange }
                    format={ dateFormat }
                    disabled={ this.DatePickerDisabled(item.disabled) }
                    getCalendarContainer={ trigger => trigger.parentNode }
                    disabledDate={ current =>
                      this.disabledDate(current, disabledDate)
                    } // 不能选择的时间
                  />
                )}
              </FormItem>
              {/* <div>{field === 'availableNotVisibleDate' ? <div style={{ position: 'absolute', left: '27%', top: '35px' }}>注意：开启时间必须大于生效时间</div> : null}</div> */}
            </div>
          )
          formItemList.push(DATE)
        } else if (item.type === 'CHECKBOX') {
          const CHECKBOX = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  }
                ]
              })(
                <Checkbox
                  onChange={ this.CheckboxChange }
                  checked={ this.state.checkBoxChecked }
                  disabled={ disabled }
                >
                可用不可见
                </Checkbox>
              )}
            </FormItem>
          )
          formItemList.push(CHECKBOX)
        } else if (item.type === 'RADIO') {
          const userstatus = item.userstatus // 判断单选多选的文字    是 否/正常 禁用
          const RADIO = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  }
                ]
              })(
                <Radio.Group onChange={ (e) => this.onRadioChange(e, field) } disabled={ disabled }>
                  <Radio value={ 1 }>{userstatus ? '正常' : '是'}</Radio>
                  <Radio value={ 0 }>{userstatus ? '禁用' : '否'}</Radio>
                </Radio.Group>
              )}
            </FormItem>
          )
          formItemList.push(RADIO)
        } else if (item.type === 'TREE') {
          const treeData = item.treeData // 从父组件取到的数据
          const treekey = item.treekey
          const treeName = item.treeName
          const checkable = item.checkable
          const checkStrictly = item.checkStrictly ? item.checkStrictly : false
          let fn
          let selectedKeys
          let expandedKeys
          let autoExpandParent
          switch (field) {
            case 'menuIdList':
              fn = this.state.menuIdList
              expandedKeys = this.state.menuExpandKeys
              autoExpandParent = this.state.menuAutoExpandParent
              break
            case 'deptId':
              selectedKeys = this.state.deptId
              expandedKeys = this.state.depExpandKeys
              autoExpandParent = this.state.depAutoExpandParent
              break
            case 'parentIds':
              selectedKeys = this.state.parentIds
              expandedKeys = this.state.depExpandKeys
              autoExpandParent = this.state.depAutoExpandParent
              break
            case 'menuIds':
              fn = this.state.menuIds
              expandedKeys = this.state.menuExpandKeys
              autoExpandParent = this.state.menuAutoExpandParent
              break
            default:
              fn = null
          }
          const TREE = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  }
                ]
              })(
                <div>
                  <Tree
                    checkable={ checkable }
                    onCheck={ (v, m) => this.onCheck(v, m, field) }
                    checkedKeys={ fn }
                    onSelect={ (v, m) => this.onSelect(v, m, field) }
                    selectedKeys={ selectedKeys }
                    checkStrictly={ checkStrictly }
                    onExpand={ (v) => this.onExpand(v, field) }
                    expandedKeys={ expandedKeys }
                    autoExpandParent={ autoExpandParent } // 不能公用一个变量
                  >

                    {this.renderList(treeData, treekey, treeName)}
                  </Tree>
                </div>

              )}
            </FormItem>
          )
          formItemList.push(TREE)
        }
      })
    }
    // 根据不同类型判断 form表单占用的栅格
    return (
      <Col
        span={
          this.state.config.formListSpan ? this.state.config.formListSpan : 20
        }
      >
        {formItemList}
      </Col>
    )
  };

  render() {
    return (
      <div>
        <Form
          onSubmit={ this.handleFormSubmit }
          layout={ this.state.config.layout }
        >
          <Row>
            {this.initFormList()}
            { this.state.config.hideBtn ? '' : this.getButton()}
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create({})(ServiceForm)
