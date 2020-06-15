/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2019-11-05 15:29:22
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect, useCallback } from 'react'
import { Card, Modal, Button } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from './../../../components/Table/BaseTable'
import { get_orders_list, post_order_cancel } from '../../../services/api'
import { formList, config } from './formList'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)
const confirm = Modal.confirm
function OrderList(props) {
  const [totalData, setTotalData] = useState({})
  const [tableData, setTableData] = useState([])
  const [params, setParams] = useState({ page: 1 })
  // 请求订单列表接口
  const requestList = useCallback(
    (param) => {
      params.page = param
      get_orders_list({ ...params })
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

  // 查询方法
  const handleAlertServiceSubmit = (filterParams) => {
    if (filterParams.effectState === '-1') {
      filterParams.effectState = ''
    }
    filterParams.orderNo = filterParams.orderNo.replace(/\s*/g, '')
    filterParams.organizationName = filterParams.organizationName.replace(/\s*/g, '')
    setParams(filterParams)
  }

  // 重置查询项目
  const resetFields = () => {
    setParams({})
  }

  // 选择表格获取的数据
  const selectedItems = (selectedServeRowKey, selectedServeRow) => {

  }
  // 作废订单
  const cancelOrder = useCallback(async(id) => {
    const res = await post_order_cancel({ id: id })
    if (res.data.responseCode === 0) {
      Modal.success({
        title: '作废成功',
        onOk: () => {
          setParams({})
        }
      })
    }
  }, [])
  // 展示操作内容的按钮
  const AddOrEditService = useCallback((val, record) => {
    if (val === 'edit') {
      props.history.push({ pathname: `/orderConfiguration/orderList/editOrder/${ record.id }` })
    } else if (val === 'show') {
      // 这里要判断下是否包含预警服务
      props.history.push({ pathname: `/orderConfiguration/orderList/showOrderDetails/${ record.id }` })
    } else {
      confirm({
        title: '确认要作废该订单？',
        onOk() {
          // ----点击ok的时候请求作废接口
          cancelOrder(record.id)
        }
      })
    }
  }, [props.history, cancelOrder])
  // 点击修改或者复制按钮
  const CopyOrEdit = useCallback((record) => {
    if (record.effectState === 2) {
      return <AuthButton type='link' className='like_a' onClick={ () => AddOrEditService('show', record) } style={{ padding: 0 }} menu_id={ 112 }>查看</AuthButton>
    }
    return (<div>
      <AuthButton type='link' className='like_a' onClick={ () => AddOrEditService('edit', record) } style={{ padding: 0 }} menu_id={ 111 }>修改</AuthButton>
      <AuthButton type='link' className='like_a' onClick={ () => AddOrEditService('show', record) } style={{ padding: 0 }} menu_id={ 112 }>查看</AuthButton>
      <AuthButton type='link' className='like_a' onClick={ () => AddOrEditService('invalid', record) } style={{ padding: 0 }} menu_id={ 113 }>作废</AuthButton>
    </div>)
  }, [AddOrEditService])

  // // 查看订单下的所有服务
  // const showOrderService = useCallback(async(param) => {
  //   setVisible(true)
  //   const res = await get_order_services({ id: param })
  //   const responseData = res.data.responseData
  //   // 给每条数据添加唯一的key
  //   responseData && responseData.map((item, index) => {
  //     item.key = index
  //     return item
  //   })
  //   setOrderServices(responseData)
  // }, [])

  // 关闭modal
  // const CancelModal = (val) => {
  //   setVisible(false)
  // }

  const effectStateList = ['未生效', '已生效', '已失效'] // 生效状态 0-未生效 1-已生效 2-已失效
  const stateClass = ['orange-circle', 'green-circle', 'grey-circle']
  // const typeList = ['查询服务', '预警服务']
  const tableColumns = [{
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo'
  }, {
    title: '机构名称',
    dataIndex: 'organizationName',
    key: 'organizationName'
  }, {
    title: '订单状态',
    dataIndex: 'effectState',
    key: 'effectState',
    // eslint-disable-next-line react/display-name
    render: (text) => <span> <span className={ `basic-circle ${ stateClass[text] }` }> </span>{effectStateList[text]} </span>
  }, {
    title: '生效时间',
    dataIndex: 'effectDate',
    key: 'effectDate'
  }, {
    title: '到期时间',
    dataIndex: 'endDate',
    key: 'endDate'
  }, {
    title: '操作',
    dataIndex: 'operator',
    key: 'operator',
    render: (text, record) => CopyOrEdit(record)
  }]
  return (
    <div className='content'>
      <Card className='searchCard' bordered={ false }>
        <BaseForm
          formList={ formList }
          config={ config }
          filterSubmit={ handleAlertServiceSubmit }
          resetFields={ resetFields }
        />
      </Card>
      <Card style={{ marginTop: '20px' }} bordered={ false }>
        <BaseTable
          rowKeyType='id'
          data={ totalData } // 所有数据
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
export default OrderList
