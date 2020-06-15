/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2019-11-12 13:41:03
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useCallback, useEffect } from 'react' // { , useEffect, }
import {
  Card,
  Icon,
  Modal,
  Form,
  Button,
  Select,
  DatePicker,
  Radio,
  Input,
  message
} from 'antd'
import axios from 'axios'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { setNavLeft } from '../../../redux/action'
import TopServices from './topServices'
import './index.less'
import {
  get_organization_list,
  add_order_list,
  // get_credit_mumbers,
  get_credit_count,
  post_order_calculate,
  post_order_update,
  get_orders_details,
  get_prices_dowmload,
  get_default_price
} from './../../../services/api'
const { Option } = Select
function AddOrder(props) {
  const { location, form, navLeft } = props
  const { setFieldsValue, validateFields } = form
  const param = location.pathname
  const pathSnippets = location.pathname.split('/').filter(i => i)
  const componentId = pathSnippets.filter(i => {
    return !isNaN(i)
  })
  const Id = componentId[0] // 订单列表的id
  const [topServices, setTopServices] = useState([]) // 新增服务--选择的服务
  const [serviceKeys, setServiceKeys] = useState([]) // 服务的keys
  const [ifContainWarnService, setIfContainWarnService] = useState(false) // 是否包含预警服务
  const [servicesDate, setServicesDate] = useState([]) // 传给后台的service数组
  const [organizationDate, setOrganizationDate] = useState([]) // 机构名称下拉框数据    一级
  const [dataUseOrganizationId, setDataUseOrganizationId] = useState() // 机构名称Id
  const [creditMumbers, setCreditMumbers] = useState([]) // 名单名称下拉框数据   二级
  const [creditCount, setcreditCount] = useState([]) // 名单人数
  const [caculateParams, setCaculateParams] = useState({}) // 计算框的相关参数
  const [caculateData, setCaculateData] = useState([]) // 传给后台的计算框中服务的相关参数
  const [showCalculateBox, setShowCalculateBox] = useState(false) // 显示人数天数计算框
  const [triggerBtn, setTriggerBtn] = useState(false) // 是否触发计算接口
  const [effectState, setEffectState] = useState('') // 订单的生效状态0-未生效 1-已生效 2-已失效 -修改判断参数
  const [serviceUsedInorganize, setServiceUsedInorganize] = useState([]) // 子组件传过来的服务
  // console.log(serviceUsedInorganize)
  // const [creditType,setCreditType] = useState()   //名单名称
  const [filterParams, setFilterParams] = useState({}) // 请求名单名称的参数
  // 将数据塞到form表单中
  const setFormValue = useCallback(
    params => {
      // 应该做个判断，2种服务
      if (params.type === 0) {
        setFieldsValue({
          dataUseOrganizationId: params.dataUseOrganizationId.toString(),
          effectDate: moment(params.effectDate),
          endDate: moment(params.endDate)
        })
        // requestCreditNumbers(params.dataUseOrganizationId); //请求下拉的接口 一级
      } else {
        setTimeout(() => {
          setFieldsValue({
            dataUseOrganizationId: params.dataUseOrganizationId.toString(),
            effectDate: moment(params.effectDate),
            endDate: moment(params.endDate),
            firstWarnDate: moment(params.firstWarnDate),
            degreeImportance: params.degreeImportance,
            emergencyDegree: params.emergencyDegree,
            rollCallId: params.rollCallId.toString()
          })
          setcreditCount(params.rollCallCount)
        }, 100)
        setFilterParams({
          dataUseOrganizationId: params.dataUseOrganizationId.toString(),
          creditType: params.creditType.toString()
        })
        setServiceUsedInorganize(params.serves)
        // requestCreditNumbers(); //请求下拉的接口 三级
        requestCreditCount(params.rollCallId) // 请求下拉接口  二级
      }
    },
    [setFieldsValue]
  )
  // 注意：不能写上form，否则一直陷入死循环
  // 获取价目表
  // eslint-disable-next-line
  const requsetDefaultPrice = async(paramId, serves) => {
    const arr = serves && serves.length > 0 ? serves : serviceUsedInorganize // 修改的时候会传入第二个参数，新增的时候通过serviceUsedInorganize判断
    const serveNoStr = arr.map(item => {
      return item.serveNo
    })
    const res = await get_default_price({ rollCallId: paramId, serveNoStr: serveNoStr.toString() })
    setCaculateData(res.data.responseData)
  }
  // 订单详情接口
  const requestOrderDetails = useCallback(() => {
    get_orders_details({ id: Id }).then(res => {
      const data = res.data.responseData
      const serviceKeyArrar = mapParams(data.serves)
      setServiceKeys(serviceKeyArrar)
      setTopServices(data.serves)
      setFormValue(data) // 给表格赋值
      setEffectState(data.effectState) // 将生效状态存入

      setDataUseOrganizationId(data.dataUseOrganizationId) // 机构名称ID存放起来
      setServiceUsedInorganize(data.serves)
      // 接口传来的服务

      if (data.type === 1) {
        // 如果type为1的话请求获取价目表接口
        const arr = data.serves
        const serveNoStr = arr.map(item => {
          return item.serveNo
        })
        get_default_price({ rollCallId: data.rollCallId, serveNoStr: serveNoStr.toString() })
          .then(res => {
            setCaculateData(res.data.responseData)
          })
        setIfContainWarnService(true)
      }
    })
  }, [Id, setFormValue])

  // 循环出选中服务的ID
  const mapParams = ids => {
    return (
      ids &&
      ids.map(item => {
        return item.serveConfigId
      })
    )
  }

  // 请求数据使用机构接口 一级别
  const requestOrganization = useCallback(async() => {
    const res = await get_organization_list()
    setOrganizationDate(res.data.responseData)
  }, [])

  useEffect(() => {
    requestOrganization()
  }, [requestOrganization])

  // 多选框改变的时候
  const radioChange = e => {
    // console.log(e.target.value);
  }

  // 机构名称下拉框改变的时候 （一级）
  const selectChange = (value, field) => {
    if (field === 'dataUseOrganizationId') {
      // 一级目录
      // console.log(serviceUsedInorganize,'serviceUsedInorganize')
      setDataUseOrganizationId(value)
      // if(ifContainWarnService){
      //   requestCreditNumbers(value,serviceUsedInorganize); //请求名单名称
      // }
    } else if (field === 'rollCallId') {
      // console.log('topServices', topServices)
      requestCreditCount(value)
      requsetDefaultPrice(value) // 请求价目表
      setShowCalculateBox(true) // 有请求的情况下设置为true
    }
  }

  useEffect(() => {
    // let warnServiceRows = serviceUsedInorganize.filter(item=>item.creditType !== -1);//筛选出所有的预警服务
    const getData = async() => {
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
      // let res = await get_credit_mumbers(filterParams);
      axios({
        url: '/api/credit-serve/serve/order/getCreditSubjectList',
        method: 'get',
        params: { ...filterParams },
        headers: headers,
        timeout: 8000
      }).then(res => {
        if (res.data.responseCode === 0) {
          setCreditMumbers(res.data.responseData)
          if (!Id) {
            setFieldsValue({ rollCallId: '' })
          }
        } else if (res.data.responseCode === 1) {
          Modal.warning({
            content: res.data.responseMsg
          })
          setCreditMumbers([])
          if (!Id) {
            setFieldsValue({ rollCallId: '' })
          }
        } else {
          Modal.warning({
            title: '提示',
            content: res.data.responseMsg
          })
        }
      }
      )
    }

    if (Id) {
      if (Object.keys(filterParams).length > 0) {
        getData()
      }
    } else {
      if (Object.keys(filterParams).length > 0 && filterParams.dataUseOrganizationId) {
        // console.log('filterParams', filterParams)
        getData()
      }
    }
  }, [Id, filterParams, setFieldsValue])

  // 请求订单详情
  useEffect(() => {
    if (param.includes('editOrder')) {
      requestOrderDetails() // 请求订单详情
      // 如果包含预警服务的话，需要请求名单名称接口
    }
  }, [requestOrderDetails, param])
  // param,ifContainWarnService,dataUseOrganizationId,topServices

  // useEffect(() => {
  //   if (param.includes("editOrder")) {
  //     //如果包含预警服务的话，需要请求名单名称接口
  //     if(ifContainWarnService){
  //       console.log('lllllllllll')
  //       requestCreditNumbers(dataUseOrganizationId,topServices);
  //     }
  //   }
  // }, [param,ifContainWarnService]);
  // 三级请求 名单名称下的名单人数
  const requestCreditCount = async paramId => {
    const res = await get_credit_count({ creditSubjectListId: paramId })
    setcreditCount(res.data.responseData)
  }

  const mapcreditMumbers = useCallback(() => {
    return creditMumbers && creditMumbers.map(item => {
      return (
        <Option key={ item.creditSubjectListId }>
          {item.listName}
        </Option>
      )
    })
  }, [creditMumbers])

  // Input改变的时候
  const InputChange = (e, val) => {
    // 这块需要做判断
    caculateParams[val] = e.target.value
    setCaculateParams(caculateParams)
  }
  // 请求计算接口
  const caculate = useCallback(async() => {
    if (caculateParams.hc && caculateParams.day) {
      const res = await post_order_calculate({
        ...caculateParams,
        serves: servicesDate
      })
      setCaculateData(res.data.responseData)
    } else {
      message.warning('请输入计算项')
    }

    setTriggerBtn(true)
  }, [caculateParams, servicesDate])

  // 请求下载的接口
  const download = useCallback(async() => {
    const res = await get_prices_dowmload({
      ...caculateParams,
      serves: servicesDate
    })
    window.location.href = res.data.responseData
  }, [caculateParams, servicesDate])

  // 不能选择的时间
  const disabledDate = (current, disableDate) => {
    return current && current < moment(disableDate, 'YYYY-MM-DD')
  }

  // 从子组件传过来的SetServicesDate
  const FatherSetServicesDate = useCallback(
    params => {
      setServicesDate(params)
      setFieldsValue({ serves: params }) // 在这里存入数据
    },
    [setFieldsValue]
  )
  // 机构名称的disabled
  // const disabled = useCallback(() => {
  //   if (Id) {
  //     return Id
  //   } else {
  //     return false
  //   }
  // }, [Id])
  // 生效时间的disabled
  // const DateDisabled = useCallback(() => {
  //   if (Id && effectState === 1) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }, [Id, effectState])

  // 新增
  const requestSave = useCallback(
    async params => {
      const res = await add_order_list({
        ...params,
        firstWarnDate: params.firstWarnDate
          ? moment(params.firstWarnDate).format('YYYY-MM-DD HH:mm:ss')
          : null,
        effectDate: moment(params.effectDate).format('YYYY-MM-DD'),
        endDate: moment(params.endDate).format('YYYY-MM-DD'),
        serves: servicesDate
      })
      if (res.data.responseCode === 0) {
        Modal.success({
          title: '新增成功',
          onOk: () => {
            navLeft('/orderConfiguration/orderList')
            // sessionStorage.setItem('selectedKeys', '/orderConfiguration/orderList')
            props.history.push('/orderConfiguration/orderList')
          }
        })
      }
    },
    [servicesDate, props.history, navLeft]
  )
  // 修改
  const updateOrder = useCallback(
    async params => {
      const res = await post_order_update({
        id: Id,
        ...params,
        firstWarnDate: params.firstWarnDate
          ? moment(params.firstWarnDate).format('YYYY-MM-DD HH:mm:ss')
          : null,
        effectDate: moment(params.effectDate).format('YYYY-MM-DD'),
        endDate: moment(params.endDate).format('YYYY-MM-DD'),
        serves: servicesDate
      })
      if (res.data.responseCode === 0) {
        Modal.success({
          title: '修改成功',
          onOk: () => {
            props.history.push('/orderConfiguration/orderList')
          }
        })
      }
    },
    [Id, servicesDate, props.history]
  )

  // 保存(保存需要做判断，是修改的保存还是新增的保存)
  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          if (param.includes('addOrder')) {
            requestSave(values)
          } else {
            updateOrder(values)
          }
        } else {
          return
        }
      })
    },
    [requestSave, param, updateOrder, validateFields]
  )

  // 获取到子组件传过来的服务
  const getTopServices = useCallback((services) => {
    const containWarnService =
    services && services.some(item => item.type === 1)
    setIfContainWarnService(containWarnService)

    if (containWarnService) {
      const warnServiceRows = services.filter(item => item.creditType !== -1)// 筛选出所有的预警服务
      setFilterParams({
        dataUseOrganizationId: dataUseOrganizationId,
        creditType: warnServiceRows[0].creditType
      })
    }

    setIfContainWarnService(containWarnService)
    setServiceUsedInorganize(services)
  }, [dataUseOrganizationId])

  // 取消
  const cancel = useCallback(() => {
    props.history.push({
      pathname: '/orderConfiguration/orderList'
    })
  }, [props.history])

  // let effectStateList = ["未生效", "已生效", "已失效"]; //生效状态 0-未生效 1-已生效 2-已失效
  const { getFieldDecorator } = props.form
  return (
    <div>
      <div className='add_order'>
        <Card bordered={ false } bodyStyle={{ padding: '0px 32px 20px 32px' }}>
          <div className='add_order_title'>新增订单</div>
          <div className='add_order_button'>
            <div className='save'>
              <Button type='primary' onClick={ handleSubmit }>
                保存
              </Button>
              <Button onClick={ cancel }>取消</Button>
            </div>
          </div>
        </Card>
        <Form className='login-form'>
          <Form.Item className='serves_formItem'>
            {getFieldDecorator('serves', {
              rules: [{ required: true, message: '请选择服务' }]
            })(
              <TopServices
                FatherTopServices={ topServices }
                FatherServiceKeys={ serviceKeys }
                FatherSetServicesDate={ FatherSetServicesDate }
                FatherEffectState={ effectState } // 传过去的生效时间
                getTopServices={ getTopServices }
              />
            )}
          </Form.Item>
          <div>
            <Card title='订单配置' className='card_style' bordered={ false }>
              <div className='item_style'>
                <Form.Item label='机构名称' style={{ width: '350px' }}>
                  {getFieldDecorator('dataUseOrganizationId', {
                    rules: [{ required: true, message: '请选择机构名称' }]
                  })(
                    <Select
                      style={{ width: '300px' }}
                      onChange={ val =>
                        selectChange(val, 'dataUseOrganizationId')
                      }
                      disabled={ !!Id } // 修改的时候机构名称不能修改
                      getPopupContainer={ triggerNode => triggerNode.parentElement }
                    >
                      {organizationDate &&
                        organizationDate.map(item => {
                          return <Option key={ item.id }>{item.name}</Option>
                        })}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label='生效时间' style={{ width: '350px' }}>
                  {getFieldDecorator('effectDate', {
                    rules: [{ required: true, message: '请选择生效时间' }]
                  })(
                    <DatePicker
                      // 已生效的订单生效时间不可以修改
                      disabled={ Id && effectState === 1 }
                      style={{ width: '300px' }}
                      disabledDate={ current => disabledDate(current, moment()) } // 不能选择的时间
                      getCalendarContainer={ trigger => trigger.parentNode }
                    />
                  )}
                </Form.Item>
                <Form.Item label='结束时间'>
                  {getFieldDecorator('endDate', {
                    rules: [{ required: true, message: '请选择结束时间' }]
                  })(
                    <DatePicker
                      style={{ width: '300px' }}
                      disabledDate={ current => disabledDate(current, moment()) } // 不能选择的时间
                      getCalendarContainer={ trigger => trigger.parentNode }
                    />
                  )}
                </Form.Item>
              </div>
              {ifContainWarnService ? (
                <div className='item_style'>
                  <Form.Item label='首次预警时间' style={{ width: '350px' }}>
                    {getFieldDecorator('firstWarnDate', {
                      rules: [{ required: true, message: '请选择首次预警时间' }]
                    })(
                      <DatePicker
                        showTime
                        getCalendarContainer={ trigger => trigger.parentNode }
                        style={{ width: '300px' }}
                        disabledDate={ current =>
                          disabledDate(current, moment())
                        }
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label='触发预警条件重要程度'
                    style={{ width: '350px' }}
                  >
                    {getFieldDecorator('degreeImportance', {
                      rules: [{ required: true, message: '请选择重要程度' }]
                    })(
                      <Radio.Group onChange={ radioChange }>
                        <Radio value={ 1 }>一般</Radio>
                        <Radio value={ 2 }>重要</Radio>
                        <Radio value={ 3 }>非常重要</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item label='触发预警条件紧急程度'>
                    {getFieldDecorator('emergencyDegree', {
                      rules: [{ required: true, message: '请选择紧急程度' }]
                    })(
                      <Radio.Group onChange={ radioChange }>
                        <Radio value={ 1 }>一般</Radio>
                        <Radio value={ 2 }>紧急</Radio>
                        <Radio value={ 3 }>非常紧急</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </div>
              ) : null}
            </Card>
            {ifContainWarnService ? (
              <Card
                title='预警服务价格详情'
                className='card_style'
                bordered={ false }
                extra={
                  triggerBtn ? (
                    <Icon
                      type='vertical-align-bottom'
                      className='download'
                      onClick={ download }
                    />
                  ) : null
                }
              >
                <div id='downloadDiv' style={{ display: 'none' }}></div>
                <Form.Item label='名单名称' style={{ width: '400px' }}>
                  {getFieldDecorator('rollCallId', {
                    rules: [{ required: true, message: '请选择名单名称' }]
                  })(
                    <Select
                      style={{ width: '200px', marginRight: '70px' }}
                      onChange={ val => selectChange(val, 'rollCallId') }
                      getPopupContainer={ triggerNode => triggerNode.parentElement }
                    >
                      {/* {creditMumbers &&
                        creditMumbers.map(item => {
                          return (
                            <Option key={item.creditSubjectListId}>
                              {item.listName}
                            </Option>
                          );
                        })} */}
                      {mapcreditMumbers()}
                    </Select>
                  )}
                  {showCalculateBox ? (
                    <span>名单人数：{creditCount}</span>
                  ) : null}
                </Form.Item>
                {showCalculateBox ? (
                  <div className='caculate_box'>
                    <div>
                      <div>人数：</div>
                      <Input
                        style={{ width: '200px', marginRight: '20px' }}
                        type='number'
                        onChange={ e => InputChange(e, 'hc') }
                      />
                    </div>
                    <div>
                      <div>天数：</div>
                      <Input
                        style={{ width: '200px', marginRight: '20px' }}
                        type='number'
                        onChange={ e => InputChange(e, 'day') }
                      />
                    </div>
                    <Button
                      className='caculate_btn'
                      type='primary'
                      onClick={ caculate }
                    >
                      计算
                    </Button>
                  </div>
                ) : null}
                {caculateData.map((item, index) => {
                  return (
                    <div key={ index } style={{ marginTop: '10px' }}>
                      <h3>{item.serveName}</h3>
                      <div className='calculate_details'>
                        <div className='calculate_items'>
                          单周价格：{item.prices.week}
                        </div>
                        <div className='calculate_items'>
                          单月价格：{item.prices.month}
                        </div>
                        <div className='calculate_items'>
                          每年价格：{item.prices.year}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </Card>
            ) : null}
            {/* <div className='save'>
              <Button type='primary' onClick={ handleSubmit }>
                保存
              </Button>
              <Button onClick={ cancel }>取消</Button>
            </div> */}
          </div>
        </Form>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedKeys: state
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    navLeft: url => dispatch(setNavLeft(url))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(withRouter(AddOrder)))
