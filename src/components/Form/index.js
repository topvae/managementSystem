/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2020-03-27 16:14:02
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
  message,
  DatePicker,
  Radio
} from 'antd'
import { get_officeId_list, get_departmentId_list, get_departmentName_list, get_departmentCode_list } from '../../services/api'
import { validatorName } from '../../utils/utils'
import moment from 'moment'
import { wrapAuth } from '../AuthButton'
const AuthButton = wrapAuth(Button)
const { RangePicker } = DatePicker

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
// const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD'
const regEn = /[~!@¥#$%^&*+<>?:{},/;]/im
const regCn = /[·！#￥——：；、，|《。》？、【】]/im

class FilterForm extends React.Component {
  state = {
    searchChangeValue: '', // 联动搜索关键字
    searchOneID: null, // 记录一级搜索的id  查询二级搜索的时候用
    config: {
      ...this.props.config,
      hideBtn: this.props.config.hideBtn ? this.props.config.hideBtn : false
    },
    data: null,
    officeList: [], // 一级
    departmentList: [], // 二级
    secondaryName: [], // 二级分类
    secondaryCode: [], // 二级分类编码
    selectInputValue: [], // 边输入边下拉的value
    selectInputdata: [], // 边输入边下拉的data
    selectSearchValue: [], // 袁少凯版本 边输入边下拉的value
    selectSearchData: [] // 袁少凯版本 边输入边下拉的data
  }
  params = {
    // ifshowEffectDate: false
  }

  // 二级分类是否可以搜索
  isSearchTwo = false;

  // 表单提交
  handleFormSubmit = (e) => {
    const { form, filterSubmit, notifyError } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const fieldsValue = form.getFieldsValue()
        if (filterSubmit) {
          filterSubmit(fieldsValue)
        }
      } else {
        if (notifyError) {
          notifyError(true)
        }
      }
    })
  }

  // 重置表单后的回调函数
  handleReset = () => {
    const { form, resetFields } = this.props
    form.resetFields()
    // 通知父组件更新列表
    resetFields()
    this.setState({
      searchOneID: null
    })
  }

  componentWillReceiveProps(nextProps) {
    const { form, updateList, searchOneID, selectInputdata } = nextProps
    if (searchOneID && searchOneID !== this.state.searchOneID) {
      this.setState({
        searchOneID
      })
    }
    if (selectInputdata !== this.state.selectInputdata) {
      this.setState({
        selectInputdata
      })
    }
    if (
      updateList &&
      Object.keys(updateList).length > 0 &&
      this.state.updateList !== updateList
    ) {
      this.setState({
        updateList: nextProps.updateList
      })
      form.setFieldsValue(nextProps.updateList)
    }
  }

  // modal表单回显  父组件传递 回显的数据
  componentDidMount() {
    // let { form,updateList } = this.props;
    // form.setFieldsValue(updateList);
  }

  // timeout = null;
  currentValue = '';
  // 一级二级请求
  fetch = (value, searchType, officeType, noAffect) => {
    officeType = officeType === undefined ? 1 : officeType
    const params = {}
    // if (this.timeout) {
    //   clearTimeout(this.timeout)
    //   this.timeout = null
    // }
    this.currentValue = value
    // 一级分类与二级分类根据searchType来判断
    const fake = (value, searchType, officeType, noAffect) => {
      // 根据不同的searchType类型请求不同的接口
      // officeType  0: 原子零件  1: 组合零件
      // params.officeType = officeType === 0 ? 0 : 1;
      if (searchType === 1) {
        params.officeName = value.replace(/\s*/g, '')
        get_officeId_list(params)
          .then(res => {
            if (this.currentValue === value) {
              this.isSearchTwo = true // 能搜索
              this.getSearchList(res, searchType)
            }
          })
      } else if (searchType === 2) {
        params.departmentName = value.replace(/\s*/g, '')
        params.officeId = this.state.searchOneID
        if (!params.officeId && !noAffect) {
          message.warning('请先输入一级名称', 2)
          return
        }
        get_departmentId_list(params)
          .then(res => {
            if (this.currentValue === value) {
              this.getSearchList(res, searchType)
            }
          })
      } else if (searchType === 3) {
        params.departmentName = value.replace(/\s*/g, '')
        get_departmentName_list(params)
          .then(res => {
            if (this.currentValue === value) {
              this.getSearchList(res, searchType)
            }
          })
      } else if (searchType === 4) {
        params.swichCode = value.replace(/\s*/g, '')
        get_departmentCode_list(params)
          .then(res => {
            if (this.currentValue === value) {
              this.getSearchList(res, searchType)
            }
          })
      }
    }
    fake(value, searchType, officeType, noAffect)
  };

  // 1级 2级 公用生成list
  getSearchList = (res, searchType) => {
    const officeList = []
    const departmentList = []
    const secondaryName = []
    const secondaryCode = []
    // let options = null;
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    responseData.forEach(r => {
      if (searchType === 1) {
        officeList.push({
          value: r.officeId,
          text: r.officeName
        })
      } else if (searchType === 2) {
        departmentList.push({
          value: r.departmentId,
          text: r.departmentName
        })
      } else if (searchType === 3) {
        secondaryName.push({
          value: r.departmentName.replace(/\s*/g, ''),
          text: r.departmentName.replace(/\s*/g, '')
        })
      } else if (searchType === 4) {
        secondaryCode.push({
          value: r.swichCode.replace(/\s*/g, ''),
          text: r.swichCode.replace(/\s*/g, '')
        })
      }
    })
    if (searchType === 1) {
      this.setState({
        officeList
      })
    } else if (searchType === 2) {
      this.setState({
        departmentList
      })
    } else if (searchType === 3) {
      this.setState({
        secondaryName
      })
    } else if (searchType === 4) {
      this.setState({
        secondaryCode
      })
    }
  };

  // 当一级二级搜索的时候
  baseFormSearch = (value, searchType, officeType, noAffect) => {
    officeType = officeType === undefined ? 1 : officeType
    if (!value) return
    this.fetch(value, searchType, officeType, noAffect)
  };

  //  当select框选择option的时候 判断一级是否有值
  searchOnChange = (value, option, searchType) => {
    const { getSearchOnChangeValue } = this.props
    if (getSearchOnChangeValue) {
      this.props.getSearchOnChangeValue(searchType, value)
    }
    if (searchType === 1) {
      this.setState({
        searchChangeValue: value,
        searchOneID: value
      })
      this.isSearchTwo = true
    }
  };

  // selected options下拉框
  handleChange = value => {
    const { handleChange } = this.props
    if (handleChange) {
      this.props.handleChange(value)
    }
  }

  // Select-Input 边输入边请求接口
  fetchSelectInput = value => {
    const { requestSelectInput } = this.props
    const filterValue = value.replace(/\s*/g, '')
    requestSelectInput(filterValue)
  }
  // Select-Input 输入改变的时候请求接口
  handleSelectInputChange = (value, option) => {
    this.props.changeOfficeId(value)
  }

  // 时间改变
  dateChange = (date, dateString) => {
    const { dateChange } = this.props
    if (dateChange) {
      this.props.dateChange(dateString)
    }
  };

  // 不能选择的时间
  disabledDate = (current, disabledDate) => {
    return current && current < moment(disabledDate, dateFormat)
  };
  // 产品名称在输入的时候校验

  validateProductName = (rule, value, callback) => {
    // 开头不能为数字的正则
    const numberStartReg = /^[0-9]+$/
    if (regEn.test(value) || regCn.test(value)) {
      callback('不能包含特殊字符')
    } else if (numberStartReg.test(value)) {
      callback('不能以数字开头')
    } else {
      this.props.validator(rule, value, callback)
    }
  }
  // eamil校验
  validateEmail = (rule, value, callback) => {
    if (value.length > 150) {
      callback('不能超过150个字符')
    } else {
      callback()
    }
  }
  // input校验特殊字符
  validateInput = (rule, value, callback, maxLen) => {
    if (regEn.test(value) || regCn.test(value)) {
      callback('不能包含特殊字符')
    } else if (value.length > maxLen) {
      callback(`不能超过${ maxLen }个字符`)
    } else {
      callback()
    }
  }
  // textArea校验字数
  validateTextArea = (rule, value, callback, textNumber) => {
    // if (regEn.test(value) || regCn.test(value)) {
    //   callback('不能包含特殊字符')
    // } else
    if (value.length > textNumber) {
      callback(`不能超过${ textNumber }个字符`)
    } else {
      callback()
    }
  }
  // 校验生效时间 其他用到生效时间的不用校验
  validateEffectDate = (rule, value, callback) => {
    const { validator } = this.props
    if (validator) {
      this.props.validator(rule, value, callback)
    }
  }
  // 返回一个空的方法
  validateDate =(rule, value, callback) => {
    callback()
  }

  // 根据不同类型判断  按钮占用的栅格
  getButton = () => {
    const { btnType, btnFonts, btnSpan, handleMenuId, resetMenuId, cancelFn } = this.state.config
    if (btnType === 'search') {
      return (
        <Col span={ btnSpan } style={{ textAlign: 'right' }}>
          <div>
            {
              handleMenuId ? <AuthButton type='primary' icon='search' htmlType='submit' menu_id={ handleMenuId }>
                {btnFonts || '查询'}
              </AuthButton> : <Button type='primary' icon='search' htmlType='submit' menu_id={ handleMenuId }>
                {btnFonts || '查询'}
              </Button>
            }
            {
              handleMenuId ? <AuthButton onClick={ this.handleReset } menu_id={ resetMenuId }>重置</AuthButton>
                : <Button onClick={ this.handleReset } menu_id={ resetMenuId }>重置</Button>
            }
          </div>
        </Col>
      )
    } else if (btnType === 'editSave') {
      return (
        <Col span={ btnSpan }>
          <div>
            {
              handleMenuId ? <AuthButton type='primary' htmlType='submit' menu_id={ handleMenuId }> {btnFonts || '保存修改'}  </AuthButton>
                : <Button type='primary' htmlType='submit' menu_id={ handleMenuId }> {btnFonts || '保存修改'}  </Button>
            }
            <Button onClick={ cancelFn }>取消</Button>
          </div>
        </Col>
      )
    } else if (btnType === 'save') {
      return (
        <Col span={ btnSpan }>
          <div style={{ textAlign: 'center' }}>
            {
              handleMenuId ? <AuthButton type='primary' htmlType='submit' menu_id={ handleMenuId }>{btnFonts || ' 保存'}</AuthButton>
                : <Button type='primary' htmlType='submit' menu_id={ handleMenuId }>{btnFonts || ' 保存'}</Button>
            }
          </div>
        </Col>
      )
    }
  }

  selectOnFocus = () => {
    this.setState({
      officeList: [],
      departmentList: [],
      secondaryName: [],
      secondaryCode: []
    })
  }

  // 校验手机号
  validateMobile =(rule, value, callback) => {
    const mobileReg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (mobileReg.test(value) || !value) {
      callback()
    } else {
      callback('请输入正确的手机号')
    }
  }

  // 校验手机号
  validateFixTelephone =(rule, value, callback) => {
    const fixTelephoneReg = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
    if (fixTelephoneReg.test(value) || !value) {
      callback()
    } else {
      callback('请输入固定电话')
    }
  }

    // 校验零件名称 支持中文、英文大小写、下划线、数字，并且开头不能为数字
    validatePatrsName =(rule, value, callback) => {
      let testValue
      if (value) {
        testValue = value.replace(/\s*/g, '') // 去除空格
        if (!validatorName(testValue) && (testValue !== '')) {
          callback('包含特殊字符或首字母为数字')
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    selectInputOnSearch = value => {
      if (value) {
        this.props.selectInputFetch(value, selectSearchData => this.setState({ selectSearchData }))
      } else {
        this.setState({ selectSearchData: [] })
      }
    }

    handleSelectOnChange = (selectSearchValue, option) => {
      this.setState({ selectSearchValue })
      this.props.selectSearch && this.props.selectSearch(option.props)
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
        const initialValue = item.initialValue || ''
        const placeholder = item.placeholder
        const width = item.width
        const required = item.required || false
        const requiredMsg = item.requiredMsg || null
        const validatorType = item.validatorType
        const formItemLayout = item.formItemLayout
        const disabled = item.disabled
        if (item.type === 'INPUT') {
          const maxLen = item.maxLen ? item.maxLen : 20
          const whitespace = required
          const typeRequired = item.typeRequired || {}
          let fn
          // 使用 item.validatorFn 在业务组件自定义规则
          // 将不继续增加 case
          switch (validatorType) {
            case 'calculatePartsName':
            case 'departmentName': // 二级分类
            case 'swichCode': // 二级分类编码
            case 'firstClassOfficeName': // 机构配置--业务发生机构
              fn = this.validatePatrsName
              break
            case 'productName':
              fn = this.validateProductName
              break
            case 'email':
              fn = this.validateEmail
              break
            case 'mobile':
              fn = this.validateMobile
              break
            case 'fixTelephone':
              fn = this.validateFixTelephone
              break
            default:
              fn = (rule, value, callback) => this.validateInput(rule, value, callback, maxLen)
          }

          const INPUT = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    ...typeRequired
                  },
                  {
                    required: required,
                    message: requiredMsg,
                    whitespace: whitespace
                  },
                  {
                    validator: item.validatorFn ? item.validatorFn : fn
                  }
                ],
                initialValue: initialValue
              })(
                <Input
                  style={{ width }}
                  autoComplete='off'
                  type={ field === 'serveId' || field === 'tel' ? 'number' : 'text' } // 如果是服务ID的或phone话变成只能输入数字
                  placeholder={ placeholder }
                  disabled={ disabled }
                />
              )}
            </FormItem>
          )
          formItemList.push(INPUT)
        } else if (item.type === 'TEXTAREA') {
          const whitespace = required
          const textNumber = item.textNumber || 50
          const TEXTAREA = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg,
                    whitespace: whitespace
                  },
                  {
                    // 如果TEXTAREA类型是制定的就不校验字符个数
                    validator: (rule, value, callback) => this.validateTextArea(rule, value, callback, textNumber)
                  }
                ],
                initialValue: initialValue
              })(
                <TextArea
                  style={{ width }}
                  placeholder={ placeholder }
                  disabled={ disabled }
                />
              )}
            </FormItem>
          )
          formItemList.push(TEXTAREA)
        } else if (item.type === 'SELECT') {
          const searchType = item.searchType
          const noAffect = item.noAffect ? item.noAffect : false
          const { officeList, departmentList, secondaryName, secondaryCode } = this.state
          let option = null
          if (searchType === 1) {
            option = officeList.map(d => {
              return <Option key={ d.value } value={ d.value } >{d.text}</Option>
            })
          } else if (searchType === 2) {
            option = departmentList.map((d, index) => {
              return <Option key={ d.value } value={ d.value } >{d.text}</Option>
            })
          } else if (searchType === 3) {
            option = secondaryName.map((d, index) => {
              return <Option key={ d.value } value={ d.value } >{d.text}</Option>
            })
          } else if (searchType === 4) {
            option = secondaryCode.map((d, index) => {
              return <Option key={ d.value } value={ d.value } >{d.text}</Option>
            })
          }
          const SELECT = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  }
                ],
                initialValue: initialValue
              })(
                <Select
                  getPopupContainer={ triggerNode => triggerNode.parentNode }
                  showSearch
                  onFocus={ this.selectOnFocus }
                  onChange={ (value, option) =>
                    this.searchOnChange(value, option, searchType)
                  }
                  placeholder={ placeholder }
                  style={{ width }}
                  showArrow={ false }
                  onSearch={ value =>
                    this.baseFormSearch(value, searchType, item.officeType, noAffect)
                  }
                  notFoundContent={ null }
                  disabled={ disabled }
                  filterOption={ false }
                  defaultActiveFirstOption={ false }
                >
                  {option}
                </Select>
              )}
            </FormItem>
          )
          formItemList.push(SELECT)
        } else if (item.type === 'SELECT_OPTIONS') {
          const rules = item.rules
          const hide = item.hide
          if (hide) return
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
                ],
                initialValue: initialValue
              })(
                <Select
                  getPopupContainer={ triggerNode => triggerNode.parentNode }
                  onChange={ this.handleChange }
                  placeholder={ placeholder }
                  style={{ width }}
                  disabled={ disabled }
                >
                  {options}
                </Select>
              )}
            </FormItem>
          )
          formItemList.push(SELECT)
        } else if (item.type === 'SELECT_INPUT') { // 边输入边下拉的效果
          const { selectInputdata } = this.state
          const option = selectInputdata.map(d => {
            return <Option key={ d.id } value={ d.id } s>{ d.name }</Option>
          })
          const SELECT = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  }
                ],
                initialValue: initialValue
              })(
                <Select
                  defaultActiveFirstOption={ false }
                  showArrow={ false }
                  getPopupContainer={ triggerNode => triggerNode.parentNode }
                  showSearch
                  notFoundContent={ null }
                  filterOption={ false }
                  onSearch={ this.fetchSelectInput }
                  onChange={ (value, option) =>
                    this.handleSelectInputChange(value, option) }
                  style={{ width: '200px' }}
                >
                  { option }
                </Select>
              )}
            </FormItem>
          )
          formItemList.push(SELECT)
        } else if (item.type === 'SELECT_SEARCH') { // 袁少凯版本边输入边下拉的效果 如果新功能 用这套逻辑， 不要使用 SELECT_INPUT 这套逻辑
          const { selectSearchData } = this.state
          const option = selectSearchData.map(d => {
            return <Option key={ d.value } value={ d.value } title={ d.text }>{ d.text }</Option>
          })
          const SELECT = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  }
                ],
                initialValue: initialValue
              })(
                <Select
                  defaultActiveFirstOption={ false }
                  showArrow={ false }
                  getPopupContainer={ triggerNode => triggerNode.parentNode }
                  showSearch
                  notFoundContent={ null }
                  filterOption={ false }
                  onSearch={ this.selectInputOnSearch }
                  onChange={ (value, option) =>
                    this.handleSelectOnChange(value, option) }
                  style={{ width }}
                >
                  { option }
                </Select>
              )}
            </FormItem>
          )
          formItemList.push(SELECT)
        } else if (item.type === 'DATE') {
          const validatorType = item.validatorType
          // 初始化时间  不传默认当天时间
          const defaultValue = item.defaultValue || moment().format('YYYY-MM-DD')
          // 禁止选择的时间
          const disabledDate = item.disabledDate
          let fn
          switch (validatorType) {
            case 'productEffectDate':
              fn = this.validateEffectDate
              break
            default:
              fn = this.validateDate
          }
          const DATE = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  {
                    required: required,
                    message: requiredMsg
                  },
                  {
                    validator: fn
                  }
                ],
                initialValue: moment(defaultValue, dateFormat)
              })(
                <DatePicker
                  style={{ width: item.width }}
                  onChange={ this.dateChange }
                  format={ dateFormat }
                  disabled={ disabled }
                  disabledDate={ current =>
                    this.disabledDate(current, disabledDate)
                  } // 不能选择的时间
                />
              )}
            </FormItem>
          )
          formItemList.push(DATE)
        } else if (item.type === 'DATE_RANGE') {
          // 初始化时间  不传默认当天时间
          // const defaultValue = item.defaultValue || moment().format('YYYY-MM-DD')
          // 禁止选择的时间
          // const disabledDate = item.disabledDate
          // let fn
          // switch (validatorType) {
          //   case 'productEffectDate':
          //     fn = this.validateEffectDate
          //     break
          //   default:
          //     fn = this.validateDate
          // }
          const DATE_RANGE = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                rules: [
                  // {
                  //   required: required,
                  //   message: requiredMsg
                  // }
                ]
                // initialValue: moment(defaultValue, dateFormat)
              })(
                <RangePicker
                  allowClear={ false }
                  style={{ width: item.width }}
                  onChange={ this.dateChange }
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
                  }}
                  format='YYYY-MM-DD HH:mm:ss'
                  // disabledDate={ current =>
                  //   this.disabledDate(current, disabledDate)
                  // } // 不能选择的时间
                />
              )}
            </FormItem>
          )
          formItemList.push(DATE_RANGE)
        } else if (item.type === 'RADIO') { // 边输入边下拉的效果
          const list = item.rules
          const option = list.map(d => {
            return <Radio value={ d.id } key={ d.id }>{ d.rule }</Radio>
          })
          const RADIO = (
            <FormItem label={ label } { ...formItemLayout } key={ field }>
              {getFieldDecorator(field, {
                initialValue: initialValue
              })(
                <Radio.Group>
                  { option }
                </Radio.Group>
              )}
            </FormItem>
          )
          formItemList.push(RADIO)
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
      <Form
        className='ant-advanced-search-form'
        onSubmit={ this.handleFormSubmit }
        layout={ this.state.config.layout }
      >
        <Row>
          {this.initFormList()}
          {!this.state.config.hideBtn && this.getButton()}
        </Row>
      </Form>
    )
  }
}

export default Form.create({})(FilterForm)
