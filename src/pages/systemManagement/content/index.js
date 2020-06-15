import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col, Card, Button, Modal } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { } from '../../../services/api'
import { formList, config } from './formList'
import { get_sys_content_list, delete_sys_content } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
import AddContent from './addContent'
const AuthButton = wrapAuth(Button)
function DataDictionary() {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]) // 选中的数组
  const [visible, setVisible] = useState(false)
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  // const [sourceDataType,setSourceDataType] = useState([]);    // 数据类型
  // const [sourceStartStatus,setSourceStartStatus] = useState([]);    // 数据源启用状态
  const [record, setRecord] = useState({}) // 修改选中的那一行
  const [tableColumns, setTableColumns] = useState([])
  const [id, setId] = useState(0) // 是否修改状态
  const [editDiction, setEditDiction] = useState(false) // 点击修改的时候变为true的时候名称和备注可以修改

  const requestList = useCallback(async(page) => {
    const res = await get_sys_content_list({ ...filterParams, page })
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

  const edit = (type, record) => {
    setRecord(record)
    setVisible(true)
    setId(record.id)
    setEditDiction(true)
  }

  useEffect(() => {
    requestList()
  }, [requestList])

  useEffect(() => {
    const renderDom = (record) => {
      return <AuthButton style={{ padding: 0 }} type='link' onClick={ () => edit('edit', record) } menu_id={ 84 }>修改</AuthButton>
    }
    setTableColumns([
      {
        title: '业务索引名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '业务索引代码',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '内容',
        dataIndex: 'value',
        key: 'value',
        width: 600
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

  // 选择表格获取的数据
  const selectedItems = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows)
  }

  const closeModal = (_, type) => {
    setVisible(false)
    if (type === 'update') {
      requestList()
    }
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.name = filterParams.name.replace(/\s*/g, '')
    filterParams.code = filterParams.code.replace(/\s*/g, '')
    setFilterParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setFilterParams({})
  }

  const add = () => {
    setVisible(true)
    setId(0)
    setEditDiction(false)
  }

  const isDelete = () => {
    if (Object.keys(selectedRows).length === 0) {
      Modal.warning({
        title: '提示',
        content: '请选择一条记录'
      })
      return
    }
    Modal.confirm({
      title: '提示',
      content: '确认删除吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        deleteOrganization()
      }
    })
  }

  // 删除
  const deleteOrganization = async() => {
    const arr = selectedRows.map(item => {
      return item.id
    })
    const res = await delete_sys_content({ idsStr: arr.join(',') })
    if (res.data.responseCode) {
      setFilterParams({})
      return
    }
    const responseMsg = res.data.responseMsg
    Modal.warning({
      title: '提示',
      content: responseMsg || '删除成功',
      onOk: () => {
        setSelectedRows({})
      }
    })
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
                <AuthButton type='primary' onClick={ add } className='add' menu_id={ 83 } icon='plus'>新增</AuthButton>
                <AuthButton onClick={ isDelete } menu_id={ 85 } icon='delete'>删除</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='id'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
        />
      </Card>
      <AddContent visible={ visible } close={ closeModal } updateList={ record } ConId={ id } editDiction={ editDiction } />
    </div>
  )
}

export default withRouter(DataDictionary)