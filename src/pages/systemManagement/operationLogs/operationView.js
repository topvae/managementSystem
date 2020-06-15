import React, { useState, useEffect, useCallback } from 'react'
import { Modal } from 'antd'
import BaseTable from '../../../components/Table/BaseTable'
import { opt_log_summary_importDetail } from '../../../services/api'
import './index.less'
import moment from 'moment'
// import 'moment/locale/zh-cn'
// moment.locale('zh-cn')

function OperationView(props) {
  const [visible, setVisible] = useState(false)
  const [tableColumns, setTableColumns] = useState([])
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [traceId, setTraceId] = useState(0)
  const [detailId, setDetailId] = useState(0)
  const [userName, setUserName] = useState('')
  const [operatorType, setOperatorType] = useState('')
  const [optSummary, setOptSummary] = useState('')

  const requestList = useCallback(async(page) => {
    const res = await opt_log_summary_importDetail({ traceId: traceId, optLogImportDetailId: detailId })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    const tableData = responseData.map((item, index) => {
      item.key = index
      return item
    })
    setTableData(tableData)
    setResponseData(responseData)
  }, [traceId, detailId])

  useEffect(() => {
    setTableColumns([
      {
        title: '序号',
        dataIndex: 'optLogDetailId',
        key: 'optLogDetailId'
      },
      {
        title: '字段',
        dataIndex: 'columnName',
        key: 'columnName'
      },
      {
        title: '名称',
        dataIndex: 'columnDesc',
        key: 'columnDesc'
      },
      {
        title: '旧值',
        dataIndex: 'oldValue',
        key: 'oldValue',
        render: (item, record) => {
          if (item) {
            if (record.columnName === 'effect_date' || record.columnName === 'create_time' || record.columnName === 'modify_time') {
              return moment(Number(item)).format('YYYY-MM-DD HH:mm:ss')
            } else {
              return item
            }
          } else {
            return item
          }
        }
      },
      {
        title: '新值',
        dataIndex: 'newValue',
        key: 'newValue',
        render: (item, record) => {
          if (item) {
            if (record.columnName === 'effect_date' || record.columnName === 'create_time' || record.columnName === 'modify_time') {
              return moment(Number(item)).format('YYYY-MM-DD HH:mm:ss')
            } else {
              return item
            }
          } else {
            return item
          }
        }
      }
    ])
  }, [])

  useEffect(() => {
    setVisible(props.visible)
    setTraceId(props.detail.traceId)
    setDetailId(props.detail.optLogId)
    setUserName(props.detail.userName)
    setOptSummary(props.detail.optSummary)
    const operatorType = props.detail.operatorType
    switch (operatorType) {
      case 'insert':
        setOperatorType('新增')
        break
      case 'update':
        setOperatorType('修改')
        break
      case 'delete':
        setOperatorType('删除')
        break
      case 'import':
        setOperatorType('导入')
        break
    }
  }, [props.detail, props.visible, props.detail.traceId, props.detail.userName, props.detail.operatorType, props.detail.optSummary])

  useEffect(() => {
    if (visible && traceId && traceId !== 0) {
      requestList()
    }
  }, [visible, traceId, requestList])

  const onCancel = () => {
    setVisible(false)
    props.close(false)
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='documentDetail'
      title='查看'
      centered
      visible={ visible }
      onCancel={ onCancel }
      footer={ null }
      maskClosable={ false }
      width={ '900px' }
    >
      <div className='operationMsg'>
        <b>操作人：</b><span>{userName}</span>&nbsp;&nbsp;
        <b>操作类型：</b><span>{operatorType}</span>&nbsp;&nbsp;
        <b>操作对象：</b><span>{optSummary}</span>
      </div>
      <BaseTable
        hidePagination={ true }
        rowKeyType='optLogDetailId'
        data={ responseData } // 所有数据
        dataSource={ tableData } // list数据
        columns={ tableColumns }
        request={ requestList }
        scroll={{ y: 400 }}
      />
    </Modal>

  )
}

export default OperationView
