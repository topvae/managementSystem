import React, { useState, useEffect, useCallback } from 'react'
import { Card, message, Button, Modal, Icon } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from './../../../components/Table/BaseTable'
import { post_serve_list, delete_serve_list } from '../../../services/api'
import { formList, config } from './formList'
import './index.less'
import { setDate } from './../../../utils/utils'
import { getServeSendType, getServeState, getServeWarnPeriod } from './selectRequests.js'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)
// const confirm = Modal.confirm;
function AlertService(props) {
  const [totalData, setTotalData] = useState({})
  const [tableData, setTableData] = useState([])
  const [params, setParams] = useState({ page: 1 })
  const [selectedServeRowKeys, setSelectedServeRowKeys] = useState([]) // 选中的rowKeys
  // const [selectedServeRows, setSelectedServeRows] = useState({})  ;     //选中的selectedServeRows
  const [alertFormList, setAlertFormList] = useState(formList)

  // console.log(selectedServeRows)
  const requestList = useCallback(
    (param) => {
      params.page = param
      post_serve_list({ ...params })
        .then((res) => {
          const data = res.data.responseData
          setTableData(data.records)
          setTotalData(data)
        })
    },
    [params]
  )

  // 请求服务的list

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
    // 发送类型
    getServeSendType().then(res => {
      const datas = setDate(res)
      const formList1 = getRules('sendType', datas, formList)
      setAlertFormList(formList1)
    })
    // 服务状态
    getServeState().then(res => {
      const datas = setDate(res)
      const formList1 = getRules('effectState', datas, formList)
      setAlertFormList(formList1)
    })
    // 预警主体
    // const params = {
    //   businessIdent: 'all',
    //   field: 'credit_type'
    // }
    // getServeCreditType(params).then(res => {
    //   const datas = setCreditDate(res)
    //   const formList1 = getRules('creditType', datas, formList)
    //   setAlertFormList(formList1)
    // })
    // 预警周期
    getServeWarnPeriod().then(res => {
      const datas = setDate(res)
      const formList1 = getRules('warnPeriod', datas, formList)
      setAlertFormList(formList1)
    })
  }, [])

  // 查询方法
  const handleAlertServiceSubmit = (filterParams) => {
    for (const x in filterParams) {
      if (filterParams[x] === -1) {
        filterParams[x] = ''
      }
    }
    filterParams.swichCode = filterParams.swichCode.replace(/\s*/g, '')
    filterParams.productName = filterParams.productName.replace(/\s*/g, '')
    filterParams.warnServeName = filterParams.warnServeName.replace(/\s*/g, '')
    setParams(filterParams)
  }

  // 重置查询项目
  const resetFields = () => {
    setParams({})
  }

  // 选择表格获取的数据
  const selectedItems = (selectedServeRowKey, selectedServeRow) => {
    setSelectedServeRowKeys(selectedServeRowKey)
    // setSelectedServeRows(selectedServeRow)
  }
  // 点击修改或者复制按钮
  const CopyOrEdit = (record) => {
    if (record.effectState === 0) {
      return (<div>
        <AuthButton type='link' className='like_a' onClick={ () => AddOrEditService('copy', record) } menu_id={ 78 }>复制</AuthButton>
        <AuthButton type='link' className='like_a' onClick={ () => AddOrEditService('edit', record) } menu_id={ 77 }>修改</AuthButton>
      </div>)
    } else if ((record.effectState === 1 || record.effectState === 3)) {
      return <AuthButton type='link' className='like_a' onClick={ () => AddOrEditService('copy', record) } menu_id={ 78 }>复制</AuthButton>
    } else {
      return ''
    }
  }

  // 展示操作内容的按钮
  const AddOrEditService = useCallback((val, record) => {
    if (val === 'add') {
      props.history.push({ pathname: '/serviceManagement/warningService/addService' })
    } else if (val === 'copy') {
      props.history.push({ pathname: '/serviceManagement/warningService/copyService' })
      sessionStorage.setItem('warnServeId', record.warnServeId)
      sessionStorage.setItem('warnServeNo', record.warnServeNo)
      sessionStorage.setItem('swichCode', record.swichCode)
    } else if (val === 'show') {
      sessionStorage.setItem('warnServeId', record.warnServeId)
      props.history.push({ pathname: '/serviceManagement/warningService/showServiceDetails' })
    } else {
      props.history.push({ pathname: '/serviceManagement/warningService/editService' })
      sessionStorage.setItem('warnServeId', record.warnServeId)
    }
  }, [props.history])

  // 删除服务
  const deleteService = () => {
    if (selectedServeRowKeys.length === 0) {
      message.warning('请选择服务')
    } else {
      Modal.confirm({
        title: '删除服务',
        content: '确认删除吗?',
        onOk: () => {
          delete_serve_list(selectedServeRowKeys)
            .then(res => {
              Modal.success({
                title: '服务删除成功'
              })
              setParams({})
              setSelectedServeRowKeys([])
            })
        }
      })
    }
  }

  const sendTypeList = ['短信', '邮件', '接口'] // 传送方式
  const effectStateList = ['未生效', '已生效', '已失效', '可用不可见'] // 生效状态 0-未生效 1-已生效 2-已失效3-可用不可见
  // const creditTypeList = ['个人', '公司'] // 预警主体 0-个人 1-公司
  const warnPeriodList = ['周', '月', '季', '半年', '年'] // 预警周期 0-周 1-月 2-季 3-半年 4-年
  const stateClass = ['orange-circle', 'green-circle', 'grey-circle', 'grey-circle']
  const tableColumns = [{
    title: '服务编码',
    dataIndex: 'swichCode',
    key: 'swichCode'
  }, {
    title: '服务名称',
    dataIndex: 'warnServeName',
    key: 'warnServeName',
    // eslint-disable-next-line react/display-name
    render: (text, record) =>
      (<span
        className='like_a'
        onClick={ () => AddOrEditService('show', record) }
      >
        {text}
      </span>)
  }, {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName'
  }, {
    title: '预警周期',
    dataIndex: 'warnPeriod',
    key: 'warnPeriod',
    // eslint-disable-next-line react/display-name
    render: (text) => <span> {warnPeriodList[text]} </span>
  },
  {
    title: '预警方式',
    dataIndex: 'sendType',
    key: 'sendType',
    // eslint-disable-next-line react/display-name
    render: (text) => <span> {sendTypeList[text]} </span>
  }, {
    title: '生效时间',
    dataIndex: 'effectDate',
    key: 'effectDate'
  }, {
    title: '状态',
    dataIndex: 'effectState',
    key: 'effectState',
    // eslint-disable-next-line react/display-name
    render: (text) => <span><span className={ `basic-circle ${ stateClass[text] }` }> </span>{effectStateList[text]}</span>
  }, {
    title: '操作',
    dataIndex: 'operator',
    key: 'operator',
    // eslint-disable-next-line react/display-name
    render: (text, record) => CopyOrEdit(record)
  }]
  return (
    <div className='content'>
      <Card className='searchCard' bordered={ false }>
        <BaseForm
          formList={ alertFormList }
          config={ config }
          filterSubmit={ handleAlertServiceSubmit }
          resetFields={ resetFields }
        />
      </Card>
      <Card style={{ marginTop: '20px' }} bordered={ false }>
        <div style={{ marginBottom: '10px' }}>
          <AuthButton type='primary' icon='plus' onClick={ () => AddOrEditService('add') } menu_id={ 39 }>新建服务</AuthButton>
          <AuthButton onClick={ deleteService } menu_id={ 40 }><Icon type='delete' />删除服务</AuthButton>
        </div>
        <BaseTable
          rowKeyType='warnServeId'
          data={ totalData } // 所有数据test
          dataSource={ tableData }
          columns={ tableColumns }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
        />
      </Card>
    </div>
  )
}
export default AlertService
