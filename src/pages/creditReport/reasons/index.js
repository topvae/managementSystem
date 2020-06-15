/*
 * @Author: your name
 * @Date: 2020-02-17 12:43:37
 * @LastEditTime: 2020-03-20 17:03:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/creditReport/companyReport/index.js
 */

import React, { useState, useCallback, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col, Card, Button, Modal } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { formList, config } from './formList'
import { list_reason, report_delete } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
import ReasonsModal from './reasonsModal.js'
import './index.less'

const AuthButton = wrapAuth(Button)

function Reasons() {
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]) // 选中的数组
  const [visible, setVisible] = useState(false)
  const [record, setRecord] = useState({}) // 修改选中的那一行
  const [tableColumns, setTableColumns] = useState([])
  const [reasonId, setReasonId] = useState(0) // 是否修改状态

  const requestList = useCallback(async(page) => {
    const res = await list_reason({ ...filterParams, page })
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

  useEffect(() => {
    requestList()
  }, [requestList])

  useEffect(() => {
    const renderDom = (record) => {
      return <AuthButton style={{ padding: 0 }} type='link' onClick={ () => edit('edit', record) } menu_id={ 185 }>修改</AuthButton>
    }
    setTableColumns([
      {
        title: '查询编码原因',
        dataIndex: 'reasonNo',
        key: 'reasonNo'
      },
      {
        title: '查询原因',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: '是否写入信用报告',
        dataIndex: 'isWrite',
        render: (text) => {
          if (text === 1) {
            return '是'
          }
          if (text === 0) {
            return '否'
          }
        },
        key: 'isWrite'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => renderDom(record),
        width: 100
      }
    ])
  }, [])

  const add = () => {
    setVisible(true)
    setReasonId(0)
  }

  const isDelete = () => {
    if (Object.keys(selectedRows).length === 0) {
      Modal.warning({
        title: '提示',
        content: '请至少选择一条记录进行删除'
      })
      return
    }
    Modal.confirm({
      title: '提示',
      content: '确定删除吗？',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        deleteReasons()
      }
    })
  }

  const edit = (type, record) => {
    setRecord(record)
    setVisible(true)
    setReasonId(record.reasonId)
  }

  // 删除
  const deleteReasons = async() => {
    const arr = selectedRows.map(item => {
      return item.reasonId
    })
    const res = await report_delete(arr)
    if (res.data.responseCode) {
      setFilterParams({})
      return
    }
    Modal.warning({
      title: '提示',
      content: '删除成功',
      onOk: () => {
        setSelectedRows({})
      }
    })
    setFilterParams({})
  }

  // 查询表单
  const handleFilterSubmit = (params) => {
    params.isWrite === '-1' ? params.isWrite = '' : params.isWrite
    setFilterParams(params)
  }

  // 重置表格的时候
  const resetFields = () => {
    setFilterParams({})
  }

  const closeModal = (_, type) => {
    setVisible(false)
    if (type === 'updata') {
      requestList()
    }
  }

  // 选择表格获取的数据
  const selectedItems = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows)
  }
  return (
    <div className='reasons'>
      <Card bordered={ false } className='searchCard'>
        <BaseForm
          formList={ formList }
          config={ config }
          filterSubmit={ handleFilterSubmit }
          resetFields={ resetFields }
        />
      </Card>
      <Card bordered={ false } className='searchResult'>
        <Row style={{ marginBottom: 20 }}>
          <Col span={ 18 }>
            {
              <div>
                <AuthButton type='primary' onClick={ add } className='add' menu_id={ 183 } icon='plus'>新增原因</AuthButton>
                <AuthButton onClick={ isDelete } menu_id={ 184 } icon='delete'>删除原因</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='reasonId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
        />
      </Card>
      <ReasonsModal visible={ visible } close={ closeModal } reasonId={ reasonId } updateList={ record } />
    </div>
  )
}

export default withRouter(Reasons)
