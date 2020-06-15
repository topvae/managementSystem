import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Button } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
// import { setCreditDate } from '../../../utils/utils'
import { config } from './formList'
import { opt_log_summary_list } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
import OperationView from './operationView'
import moment from 'moment'
import './index.less'
const AuthButton = wrapAuth(Button)

function OperationLogs(props) {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [documentDetailVisible, setDocumentDetailVisible] = useState(false)
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  const [formList, setFormList] = useState([]) // 查询字段
  const [tableColumns, setTableColumns] = useState([])
  const [detail, setDetail] = useState(0) // 查看弹框参数

  const requestList = useCallback(async(page) => {
    const res = await opt_log_summary_list({ ...filterParams, page })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    const records = res.data.responseData.records
    const tableData = records.map((item, index) => {
      item.key = index
      return item
    })
    setTableData(tableData)
    setResponseData(responseData)
  }, [filterParams])

  const viewFile = (record) => {
    setDetail(record)
    setDocumentDetailVisible(true)
  }

  useEffect(() => {
    requestList()
  }, [requestList])

  const toDetails = useCallback((record) => {
    if (record) {
      props.history.push({
        pathname: `/systemManagement/operationLogs/details?traceId=${ record.traceId }&userName=${ record.userName }&ip=${ record.ip }&createTime=${ record.createTime }`
      })
    }
  }, [props.history])

  useEffect(() => {
    const host = process.env.NODE_ENV === 'development' ? 'http://47.99.203.15' : '/file'
    const importFile = (record) => {
      const url = '/' + record.fileName
      window.location.href = host + url
    }
    const renderDom = (record) => {
      return (<>
        <AuthButton type='link' onClick={ () => viewFile(record) } style={{ padding: 0 }} menu_id={ 172 }>查看</AuthButton>
      </>)
    }
    const renderDomElse = (record) => {
      return (<>
        <AuthButton type='link' onClick={ () => toDetails(record) } menu_id={ 173 } style={{ padding: 0 }}>详情</AuthButton>
        <AuthButton type='link' onClick={ () => importFile(record) } menu_id={ 174 } style={{ padding: 0 }}>下载</AuthButton>
      </>)
    }
    setFormList([
      {
        type: 'INPUT',
        label: '操作人',
        field: 'userName',
        placeholder: '请输入',
        width: 200
        // formItemLayout: formItemLayout
      },
      {
        type: 'INPUT',
        label: '操作描述',
        field: 'optSummary',
        placeholder: '请输入',
        width: 220
        // formItemLayout: formItemLayout
      },
      {
        type: 'SELECT_OPTIONS',
        label: '操作类型',
        field: 'operatorType',
        rules: [{ id: '-1', rule: '全部' }, { id: 'insert', rule: '新增' }, { id: 'update', rule: '修改' }, { id: 'delete', rule: '删除' }, { id: 'import', rule: '导入' }],
        width: 220
        // formItemLayout: formItemLayout
      },
      {
        type: 'DATE_RANGE',
        label: '操作时间:',
        field: 'effectDate',
        placeholder: '请选择',
        width: 380
        // formItemLayout: formItemLayoutTwo
      }
    ])
    setTableColumns([
      {
        title: '序号',
        dataIndex: 'optLogId',
        key: 'optLogId'
      },
      {
        title: '操作人',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '操作类型',
        dataIndex: 'operatorType',
        key: 'operatorType',
        render: (record) => {
          let typeName = ''
          switch (record) {
            case 'insert':
              typeName = '新增'
              break
            case 'update':
              typeName = '修改'
              break
            case 'delete':
              typeName = '删除'
              break
            case 'import':
              typeName = '导入'
              break
          }
          return typeName
        }
      },
      {
        title: '操作描述',
        dataIndex: 'optSummary',
        key: 'optSummary'
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip'
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (record) => {
          if (record && JSON.stringify(record).indexOf('T') !== -1) {
            return <span>{record.replace('T', ' ')}</span>
          } else {
            return <span>{record}</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          if (record.operatorType === 'import') {
            return renderDomElse(record)
          } else {
            return renderDom(record)
          }
        },
        width: 150
      }
    ])
  }, [toDetails])

  const documentDetailModalClose = () => {
    setDocumentDetailVisible(false)
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.userName = filterParams.userName.replace(/\s*/g, '')
    filterParams.optSummary = filterParams.optSummary.replace(/\s*/g, '')
    if (Number(filterParams.operatorType) === -1) {
      filterParams.operatorType = ''
    }
    if (filterParams.effectDate) {
      // console.log(111111)
      filterParams.startTime = moment(filterParams.effectDate[0]).format('YYYY-MM-DD HH:mm:ss')
      filterParams.endTime = moment(filterParams.effectDate[1]).format('YYYY-MM-DD HH:mm:ss')
      delete filterParams.effectDate
    } else {
      filterParams.startTime = ''
      filterParams.endTime = ''
      delete filterParams.effectDate
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
        {/* <Row style={{ marginBottom: 20 }}>
          <Col span={ 18 }>
            {
              <div>
                <AuthButton type='primary' onClick={ placeOrder } menu_id={ 102 } icon='plus'>新增名单</AuthButton>
              </div>
            }
          </Col>
        </Row> */}
        <BaseTable
          rowKeyType='optLogId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          request={ requestList }
        />
      </Card>
      <OperationView visible={ documentDetailVisible } close={ documentDetailModalClose } detail={ detail } />
    </div>
  )
}

export default withRouter(OperationLogs)
