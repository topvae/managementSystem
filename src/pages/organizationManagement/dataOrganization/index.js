/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2019-12-30 09:55:37
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Row, Col, Card, Button, Modal } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { get_source_page_list, get_options, delete_source_page, source_start, source_shutdown } from '../../../services/api'

import { ChangeSelectParams, config } from './utils'
import DataOrganizationModal from './dataOrganizationModal.js'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function DataOrganization() {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  const [selectedRows, setSelectedRows] = useState([]) // 选中的数组
  const [visible, setVisible] = useState(false)
  const [formList, setFormList] = useState([]) // 查询字段
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  const [sourceDataType, setSourceDataType] = useState([]) // 数据类型
  const [tableColumns, setTableColumns] = useState([]) // 表格字段
  const [record, setRecord] = useState({}) // 修改选中的那一行
  const [sourceId, setSourceId] = useState(0) // 是否修改状态

  const edit = (type, record) => {
    setRecord(record)
    setVisible(true)
    setSourceId(record.sourceId)
  }

  const requestList = useCallback(async(page) => {
    const res = await get_source_page_list({ ...filterParams, page })
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

  const changeStatus = useCallback(async(record) => {
    let responseMsg
    // 0: 关闭  1: 启动
    if (record.avaliableStatus === '0') {
      Modal.confirm({
        title: '提示',
        content: '确定要开启吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: async() => {
          const res = await source_start({ sourceId: record.sourceId })
          if (res.data.responseCode) return
          responseMsg = res.data.responseMsg
          Modal.success({
            title: '提示',
            content: responseMsg,
            onOk: () => { setFilterParams({}) }
          })
        }
      })
    } else {
      Modal.confirm({
        title: '提示',
        content: '确定要关闭吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: async() => {
          const res = await source_shutdown({ sourceId: record.sourceId })
          if (res.data.responseCode) return
          responseMsg = res.data.responseMsg
          Modal.success({
            title: '提示',
            content: responseMsg,
            onOk: () => { setFilterParams({}) }
          })
        }
      })
    }
  }, [])

  useEffect(() => {
    requestList()
  }, [requestList])

  useEffect(() => {
    async function fetchData() {
      const sourceDataTypeRes = await get_options({ 'businessIdent': 't_source', 'field': 'data_source_type_dic_id' })

      const sourceDataTypeResponseData = sourceDataTypeRes.data.responseData

      if (sourceDataTypeResponseData) {
        const sourceDataType = ChangeSelectParams(sourceDataTypeResponseData)
        setSourceDataType(sourceDataType)
      }
    }
    fetchData()
  }, [])

  // 操作
  useEffect(() => {
    const renderDom = (record) => {
      return (
        <div>
          {record.avaliableStatus === '0'
            ? <AuthButton type='link' style={{ padding: 0 }} menu_id={ 140 } onClick={ () => changeStatus(record) }>启动</AuthButton>
            : <AuthButton type='link' style={{ padding: 0 }} menu_id={ 141 } onClick={ () => changeStatus(record) }>关闭</AuthButton>
          }
          <AuthButton type='link' style={{ padding: 0 }} menu_id={ 139 } onClick={ () => edit('edit', record) }>修改</AuthButton>
        </div>
      )
    }
    setFormList([
      {
        type: 'INPUT',
        label: '机构名称',
        field: 'sourceName',
        placeholder: '请输入',
        requiredMsg: '请输入',
        width: 180
      }, {
        type: 'INPUT',
        label: '机构编码',
        field: 'switchCode',
        placeholder: '请输入',
        requiredMsg: '请输入',
        width: 180
      }, {
        type: 'SELECT_OPTIONS',
        label: '数据类型',
        field: 'dataSourceTypeDicId',
        width: 180,
        rules: [{ id: '-1', rule: '全部' }, ...sourceDataType],
        initialValue: '-1'
      }, {
        type: 'SELECT_OPTIONS',
        label: '状态',
        field: 'avaliableStatus',
        width: 180,
        rules: [{ id: '-1', rule: '全部' }, { id: '0', rule: '关闭' }, { id: '1', rule: '启用' }],
        initialValue: '-1'
      }
    ])
    setTableColumns([
      {
        title: '机构名称',
        dataIndex: 'sourceName',
        key: 'sourceName',
        width: 280
      },
      {
        title: '机构编码',
        dataIndex: 'switchCode',
        key: 'switchCode',
        width: 260
      },
      {
        title: '数据类型',
        dataIndex: 'dataSourceTypeDesc',
        key: 'dataSourceTypeDesc',
        width: 200
      },
      {
        title: '通讯地址',
        dataIndex: 'address',
        key: 'address',
        width: 300
      },
      {
        title: '采集优先级',
        dataIndex: 'sourcePriorityDesc',
        key: 'sourcePriorityDesc',
        width: 200
      },
      {
        title: '接口地址',
        dataIndex: 'url',
        key: 'url',
        width: 400
      },
      {
        title: '文件采集地址',
        dataIndex: 'fileUrl',
        key: 'fileUrl',
        width: 300
      },
      {
        title: '联系人',
        dataIndex: 'contactName',
        key: 'contactName',
        width: 200
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 200
      },
      {
        title: '固定电话',
        dataIndex: 'fixedTelephone',
        key: 'fixedTelephone',
        width: 200
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 200
      },
      {
        title: '状态',
        dataIndex: 'avaliableStatusDesc',
        key: 'avaliableStatusDesc',
        width: 200
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => renderDom(record),
        width: 200
      }
    ])
  }, [sourceDataType, changeStatus])

  // 后端时间排序
  const onChange = (pagination, filters, sorter) => {
    const { field, order } = sorter
    setFilterParams({
      ...filterParams,
      orderBy: field
    })
    if (order === 'descend') {
      // 降序
      setFilterParams({
        ...filterParams,
        asc: false
      })
    } else {
      // order === 'ascend'
      // 升序
      // 降序
      setFilterParams({
        ...filterParams,
        asc: true
      })
    }
  }

  // 选择表格获取的数据
  const selectedItems = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
  }

  const closeModal = (_, type) => {
    setVisible(false)
    if (type === 'updata') {
      requestList()
    }
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.sourceName = filterParams.sourceName.replace(/\s*/g, '')
    filterParams.switchCode = filterParams.switchCode.replace(/\s*/g, '')
    if (filterParams.avaliableStatus === '-1') {
      filterParams.avaliableStatus = ''
    }
    if (filterParams.dataSourceTypeDicId === '-1') {
      filterParams.dataSourceTypeDicId = ''
    }
    setFilterParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setFilterParams({})
  }

  const addOrganization = () => {
    setVisible(true)
    setSourceId(0)
  }

  const isDelete = () => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请选择一条机构进行删除'
      })
      return
    }
    // if (selectedRowKeys.length > 1) {
    //   Modal.warning({
    //     title: '提示',
    //     content: '一次只能删除一个'
    //   })
    // }else{
    Modal.confirm({
      title: '提示',
      content: '确认删除吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        deleteOrganization()
      }
    })
    // }
  }

  // 删除
  const deleteOrganization = async() => {
    const arr = selectedRows.map(item => {
      return item.sourceId
    })
    const res = await delete_source_page({ sourceIds: arr.join(',') })
    const responseMsg = res.data.responseMsg
    Modal.warning({
      title: '提示',
      content: responseMsg
    })
    setSelectedRowKeys([])
    setSelectedRows([])
    setFilterParams({})
  }

  return (
    <div className='dataOrganization'>
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
                <AuthButton type='primary' onClick={ addOrganization } className='add' menu_id={ 50 } icon='plus'>新增机构</AuthButton>
                <AuthButton className='del' onClick={ isDelete } menu_id={ 51 } icon='delete'>删除机构</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='sourceId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          onChange={ onChange }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
          scroll={{ x: 2000 }}
        />
      </Card>
      <DataOrganizationModal visible={ visible } close={ closeModal } updateList={ record } sourceId={ sourceId } sourceDataType={ sourceDataType } />
    </div>
  )
}

export default withRouter(DataOrganization)
