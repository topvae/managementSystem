import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Button } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { config, formItemLayout } from './formList'
import { opt_log_summary_importList } from '../../../services/api'
import OperationImportView from './operationImportView'
import './index.less'

function OperatinDetails(props) {
  const GetQueryValue = (queryName) => {
    const reg = new RegExp('(^|&)' + queryName + '=([^&]*)(&|$)', 'i')
    const r = props.location.search.substr(1).match(reg)
    if (r != null) {
      return decodeURI(r[2])
    } else {
      return null
    }
  }
  const traceId = (GetQueryValue('traceId'))
  const userName = (GetQueryValue('userName'))
  const ip = (GetQueryValue('ip'))
  const createTime = (GetQueryValue('createTime'))
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  const [formList, setFormList] = useState([]) // 查询字段
  const [tableColumns, setTableColumns] = useState([])
  const [documentDetailVisible, setDocumentDetailVisible] = useState(false)
  const [detail, setDetail] = useState(0) // 查看弹框参数

  const requestList = useCallback(async(page) => {
    filterParams.traceId = traceId
    const res = await opt_log_summary_importList({ ...filterParams, page })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    const records = res.data.responseData.records
    const tableData = records.map((item, index) => {
      item.key = index
      return item
    })
    setTableData(tableData)
    setResponseData(responseData)
  }, [filterParams, traceId])

  const viewFile = (record) => {
    setDetail(record)
    setDocumentDetailVisible(true)
  }

  useEffect(() => {
    requestList()
  }, [requestList])

  useEffect(() => {
  }, [])

  useEffect(() => {
    const renderDom = (record) => {
      return (<>
        <Button type='link' onClick={ () => viewFile(record) } style={{ padding: 0 }} >查看</Button>
      </>)
    }
    setFormList([
      {
        type: 'SELECT_OPTIONS',
        label: '操作类型',
        field: 'operatorType',
        rules: [{ id: '-1', rule: '全部' }, { id: 'import_insert', rule: '新增' }, { id: 'import_update', rule: '修改' }, { id: 'import_delete', rule: '删除' }],
        width: 200,
        formItemLayout: formItemLayout
      },
      {
        type: 'INPUT',
        label: '操作描述',
        field: 'optSummary',
        placeholder: '请输入',
        width: 200,
        formItemLayout: formItemLayout
      }
    ])
    setTableColumns([
      {
        title: '序号',
        dataIndex: 'optLogImportDetailId',
        key: 'optLogImportDetailId'
        // width: '150px'
      },
      {
        title: '操作类型',
        dataIndex: 'operatorType',
        key: 'operatorType',
        // width: '150px',
        render: (record) => {
          let typeName = ''
          switch (record) {
            case 'import_insert':
              typeName = '新增'
              break
            case 'import_update':
              typeName = '修改'
              break
            case 'import_delete':
              typeName = '删除'
              break
          }
          return typeName
        }
      },
      {
        title: '操作描述',
        dataIndex: 'optSummary',
        key: 'optSummary'
        // width: '150px'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => renderDom(record),
        width: 150
      }
    ])
  }, [])

  const documentDetailModalClose = () => {
    setDocumentDetailVisible(false)
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.optSummary = filterParams.optSummary.replace(/\s*/g, '')
    if (Number(filterParams.operatorType) === -1) {
      filterParams.operatorType = ''
    }
    setFilterParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setFilterParams({})
  }

  return (
    <div className='nameList'>
      <Card bordered={ false } className='searchCard'>
        <BaseForm
          formList={ formList }
          config={ config }
          filterSubmit={ handleFilterSubmit }
          resetFields={ resetFields }
        />
      </Card>
      <Card bordered={ false } className='searchResult'>
        <div className='operationMsg'>
          <span>操作人：{userName}</span>&nbsp;&nbsp;
          <span>操作IP：{ip}</span>&nbsp;&nbsp;
          <span>操作时间：{createTime}</span>
        </div>
        <BaseTable
          rowKeyType='optLogImportDetailId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          request={ requestList }
        />
      </Card>
      <OperationImportView visible={ documentDetailVisible } close={ documentDetailModalClose } detail={ detail } userName={ userName } />
    </div>
  )
}

export default withRouter(OperatinDetails)
