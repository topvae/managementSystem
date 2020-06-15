import React, { useState, useEffect, useCallback } from 'react'
import { Card, Button, Tag, message } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { get_services_list, order_serveExcel, get_options } from '../../../services/api'
import { formList, config } from './formList'
import { setCreditDate } from './../../../utils/utils'
import { withRouter } from 'react-router-dom'
import { mapRows, unique } from '../../../utils/utils'
import DiscountsDetailModal from './discountDetailsModal'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)
function PlaceOrders(props) {
  const { ifModalOk, showServices, showServiceKeys, serviceKeys, topServices, ifSameCreditType, FatherSelectedRows, closeModal, visible } = props
  const { pathname } = props.location
  const [totalData, setTotalData] = useState({})
  const [tableData, setTableData] = useState([])
  const [params, setParams] = useState({ page: 1 })
  const [selectedServeRowKeys, setSelectedServeRowKeys] = useState([]) // 选中的rowKeys
  const [selectedServeRows, setSelectedServeRows] = useState([]) // 选中的selectedServeRows
  const [checkedKeys, setCheckedKeys] = useState([]) // 选择服务默认选择的keys
  const [checkedService, setCheckedService] = useState([]) // 选择服务默认选中的rows
  const [doubleArr, setDoubleArr] = useState([]) // 维护的双数组
  const [orderFormList, setOrderFormList] = useState([])
  const [page, setPage] = useState('1') // 将page页变为变量，方便扁平化处理
  const [
    discountsDetailModalVisible,
    setDiscountsDetailModalVisible
  ] = useState(false)
  const [serveConfigId, setServeConfigId] = useState(-1)

  // 请求服务list接口
  const requestList = useCallback(
    async param => {
      setPage(param)
      params.page = param
      const res = await get_services_list({ ...params })
      const data = res.data.responseData
      setTableData(data.records)
      setTotalData(data)
    },
    [params]
  )

  useEffect(() => {
    if (visible) {
      setParams({})
    }
  }, [visible])

  useEffect(() => {
    requestList() // 请求服务list
  }, [requestList])

  useEffect(() => {
    const getRules = (val, datas, formVal) => {
      return formVal.map((item, index) => {
        if (item.field === val) {
          item.rules = [
            { id: -1, rule: '全部' },
            ...datas
          ]
        }
        return {
          ...item
        }
      })
    }
    // 信用主体
    const params = {
      businessIdent: 'all',
      field: 'credit_type'
    }
    get_options(params).then(res => {
      const datas = setCreditDate(res)
      const formList1 = getRules('creditType', datas, formList)
      setOrderFormList(formList1)
    })
  }, [])

  // 查询方法
  const handleAlertServiceSubmit = filterParams => {
    if (filterParams.type === -1) {
      filterParams.type = ''
    }
    if (filterParams.creditType === -1) {
      filterParams.creditType = ''
    }
    filterParams.swichCode = filterParams.swichCode.replace(/\s*/g, '')
    filterParams.serveName = filterParams.serveName.replace(/\s*/g, '')
    console.log(filterParams)
    setParams(filterParams)
  }

  // 重置查询项目
  const resetFields = useCallback(() => {
    setParams({})
  }, [setParams])

  // 设置session缓存
  const setSession = useCallback((rows, keys) => {
    sessionStorage.setItem('selectedService', JSON.stringify(rows))
    sessionStorage.setItem('selectedServicekeys', JSON.stringify(keys))
  }, [])

  // 下订单  需要做判断
  const placeOrders = useCallback(
    // 点击“下订单”会判断所选择的预警服务的信用主体类型是否一样，若不一样，提示“请选择信用主体一样的服务组成订单”；
    () => {
      const warnServiceRows = selectedServeRows.filter(item => item.creditType !== -1)// 筛选出所有的预警服务
      const sameCreditType = warnServiceRows.every(item => item.creditType === warnServiceRows[0].creditType)
      if (selectedServeRows.length === 0) {
        message.warning('请勾选服务项目')
      } else {
        if (sameCreditType) {
          props.history.push({
            pathname: '/orderConfiguration/placeOrders/addOrder'
          })
          setSession(selectedServeRows, selectedServeRowKeys)
        } else {
          message.warning('请选择信用主体类型一致的服务组成订单')
        }
      }
    },
    [props.history, selectedServeRows, selectedServeRowKeys, setSession]
  )

  // 下载价目表
  const downloadPrice = useCallback(async() => {
    // 请求下载链接
    if (selectedServeRowKeys.length > 0) {
      window.location.href = `${ order_serveExcel }?ids=${ selectedServeRowKeys }`
    } else {
      message.warning('请选择对应的服务')
    }
  }, [selectedServeRowKeys])

  // 查看优惠详情
  const getDetail = record => {
    const serveConfigIds = record.serveConfigId
    setServeConfigId(serveConfigIds)
    setDiscountsDetailModalVisible(true)
  }

  // 关闭modal
  const closeDiscountsDetailModal = () => {
    setDiscountsDetailModalVisible(false)
    setServeConfigId(-1)
  }

  // 删除已选服务，以及对应的key值
  const log = useCallback(
    removedTag => {
      const filteredService = checkedService.filter(
        tag => tag.serveConfigId !== removedTag.serveConfigId
      )
      // console.log('filteredService',filteredService,removedTag)
      const filteredKeys = checkedKeys.filter(
        tag => tag !== removedTag.serveConfigId
      )
      setCheckedService(filteredService)
      setCheckedKeys(filteredKeys)
    },
    [checkedService, checkedKeys]
  )

  // 遍历已选服务
  const mapService = useCallback(
    service => {
      return (
        service &&
        service.map(item => {
          return (
            <Tag
              closable
              onClose={ () => log(item) }
              key={ item.serveConfigId }
              color={ item.type === 0 ? 'blue' : 'red' }
            >
              {item.serveName}
            </Tag>
          )
        })
      )
    },
    [log])

  // 判断是在index页面还是下订单页面
  const showOrAdd = useCallback(() => {
    if (!props.visible) {
      return (
        <div style={{ marginBottom: '20px' }}>
          <AuthButton type='primary' icon='plus' onClick={ placeOrders } menu_id={ 105 }>
            下订单
          </AuthButton>
          <AuthButton icon='cloud-download' onClick={ downloadPrice } menu_id={ 108 }>下载价目表</AuthButton>
        </div>
      )
    } else {
      return <div style={{ marginBottom: '20px' }}>已选服务：{mapService(checkedService)}</div>
    }
  }, [placeOrders, mapService, checkedService, downloadPrice, props.visible])

  // 选择表格获取的数据
  const selectedItems = useCallback(
    (selectedServeRowKey, selectedServeRow) => {
      // console.log("selectedRowKeys",selectedServeRowKey, 'selectedRows',selectedServeRow)
      doubleArr[page ? page - 1 : 0] = selectedServeRow // 组合成双数组
      setDoubleArr(doubleArr)
      setCheckedKeys(selectedServeRowKey)
      setSelectedServeRowKeys(selectedServeRowKey)
      setSelectedServeRows(mapRows(doubleArr)) // 二维数组的扁平化处理(处理为一维数组)  （index页面使用）
      // 已选服务------
      const concatCheckedService = [...mapRows(doubleArr), ...checkedService] // 将已选服务和维护的一围数组拼接
      const uniqueCheckedService = unique(concatCheckedService, 'serveConfigId') // 将拼接好的去重
      // console.log('uniqueCheckedService',uniqueCheckedService)
      // 取消勾选的时候调用的方法，否则uniqueCheckedService数组的个数不变
      const filterCheckedService =
        uniqueCheckedService &&
        selectedServeRowKey.map(item => {
          // 根据selectedServeRowKey去判断数组剩下来的item
          return (
            uniqueCheckedService &&
            uniqueCheckedService.filter(key => {
              return key.serveConfigId === item
            })
          )
        })
      setCheckedService(mapRows(filterCheckedService)) // 扁平化处理
      // --------------------------------------------------------------
      // 传给父组件的rows  选择服务页面
      if (FatherSelectedRows) {
        FatherSelectedRows(mapRows(filterCheckedService))
      }
    },
    [doubleArr, page, checkedService, FatherSelectedRows]
  )

  const getSession = useCallback(() => {
    const addOrder = pathname.includes('addOrder')
    const editOrder = pathname.includes('editOrder')
    // 这步骤都是从session中获取数据，因为父组件传过来的在接收的时候放入了session中
    const checkedkeys = JSON.parse(sessionStorage.getItem('selectedServicekeys'))
    const checkedServices = JSON.parse(sessionStorage.getItem('selectedService'))
    if (addOrder || editOrder) {
      serviceKeys ? setCheckedKeys(serviceKeys) : setCheckedKeys(checkedkeys)
      topServices ? setCheckedService(topServices) : setCheckedService(checkedServices)
    }
  }, [serviceKeys, topServices, pathname])

  useEffect(() => {
    if (visible) {
      getSession()
    }
  }, [visible, getSession])

  useEffect(() => {
    getSession()
  }, [getSession])

  useEffect(() => {
    // 点击选择之后再次放入缓存中
    if (ifModalOk) {
      showServices(checkedService)
      showServiceKeys(checkedKeys)
      setSession(checkedService, checkedKeys)
      closeModal()
    }
  }, [ifModalOk, showServices, showServiceKeys, checkedService, checkedKeys, setSession, ifSameCreditType, closeModal])

  const sendTypeList = ['短信', '邮件', '接口'] // 传送方式
  const typeList = ['查询服务', '预警服务'] // 预警周期 0-周 1-月 2-季 3-半年 4-年
  // const creditTypeList = ['个人', '企业']
  const tableColumns = [
    {
      title: '服务编码',
      dataIndex: 'swichCode',
      key: 'swichCode',
      width: 200
    },
    {
      title: '服务名称',
      dataIndex: 'serveName',
      key: 'serveName',
      width: 220
    },
    {
      title: '原价',
      dataIndex: 'prices',
      key: 'prices',
      width: 180
    },
    {
      title: '优惠详情',
      dataIndex: 'operator',
      key: 'operator',
      width: 190,
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <span
          style={{ color: '#4091f7', cursor: 'pointer' }}
          onClick={ () => getDetail(record) }
        >
          详情
        </span>
      )
    },
    {
      title: '传送方式',
      dataIndex: 'sendType',
      key: 'sendType',
      width: 200,
      // eslint-disable-next-line react/display-name
      render: text => <span> {sendTypeList[text]} </span>
    },
    {
      title: '服务类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
      // eslint-disable-next-line react/display-name
      render: text => <span> {typeList[text]} </span>
    },
    {
      title: '信用主体类型',
      dataIndex: 'creditTypeName',
      key: 'creditTypeName',
      width: 220
      // eslint-disable-next-line react/display-name
      // render: (text) => {
      //   switch (text) {
      //     case -1:
      //       return <span>--</span>
      //     case 59:
      //       return <span>个人</span>
      //     case 60:
      //       return <span>企业</span>
      //     default:
      //       return ''
      //   }
      // }
    },
    {
      title: '生效时间',
      dataIndex: 'effectDate',
      width: 220,
      key: 'effectDate'
    },
    {
      title: '说明',
      dataIndex: 'remark',
      width: 180,
      key: 'remark',
      // eslint-disable-next-line react/display-name
      render: text => <span>{text}</span>
    }
  ]

  return (
    <div className={ !props.visible ? 'content' : '' }>
      <Card className='searchCard' bordered={ false }>
        <BaseForm
          formList={ orderFormList }
          config={ config }
          filterSubmit={ handleAlertServiceSubmit }
          resetFields={ resetFields }
        />
      </Card>
      <Card style={ !props.visible ? { marginTop: '20px' } : {} } bordered={ false } bodyStyle={ props.visible ? { paddingTop: '0px' } : {} }>
        {showOrAdd()}
        <BaseTable
          rowKeyType='serveConfigId'
          data={ totalData } // 所有数据
          dataSource={ tableData }
          columns={ tableColumns }
          selectedItems={ selectedItems }
          type={ 'checkbox' }
          request={ requestList }
          checkedKeys={ checkedKeys }
        />

        <DiscountsDetailModal
          visible={ discountsDetailModalVisible }
          close={ closeDiscountsDetailModal }
          serveConfigId={ serveConfigId }
        />
      </Card>
    </div>
  )
}
export default withRouter(PlaceOrders)
