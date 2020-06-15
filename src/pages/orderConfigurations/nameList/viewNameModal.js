import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Button } from 'antd'
import BaseTable from '../../../components/Table/BaseTable'
import BaseForm from '../../../components/Form'
import { person_list, delete_credit_person } from '../../../services/api'
import { configModal } from './formList'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function DocumentDetail(props) {
  const [formListModal, setFormListModal] = useState([])
  const [visible, setVisible] = useState(false)
  const [tableColumns, setTableColumns] = useState([])
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  const [creditSubjectListId, setCreditSubjectListId] = useState(0)

  const requestList = useCallback(async(page) => {
    const res = await person_list({ ...filterParams, page })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    const records = responseData.records
    const tableData = records.map((item, index) => {
      item.key = index
      return item
    })
    setTableData(tableData)
    setResponseData(responseData)
  }, [filterParams])

  const onCancel = () => {
    setVisible(false)
    props.close(false)
  }

  useEffect(() => {
    const del = async(record) => {
      Modal.confirm({
        title: '提示',
        content: '确认删除吗?',
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          delete_credit_person({ creditSubjectPersonId: record.creditSubjectPersonId }).then(() => {
            setFilterParams({ creditSubjectListId })
          })
        }
      })
    }
    setFormListModal([
      {
        type: 'INPUT',
        label: '名单/证件号',
        field: 'buttonName',
        width: 260
      }
    ])
    setTableColumns([
      {
        title: '机构名称',
        dataIndex: 'officeName',
        key: 'officeName'
      },
      {
        title: '名单名称',
        dataIndex: 'listName',
        key: 'listName'
      },
      {
        title: '客户名称',
        dataIndex: 'personName',
        key: 'personName'
      },
      {
        title: '证件类型',
        dataIndex: 'personIdNumberTypeName',
        key: 'personIdNumberTypeName'
      },
      {
        title: '证件号',
        dataIndex: 'personIdNumber',
        key: 'personIdNumber'
      },
      {
        title: '开始预警时间',
        dataIndex: 'warnStartTime',
        key: 'warnStartTime',
        width: 200,
        render: (record) => {
          if (JSON.stringify(record).indexOf('T') !== -1) {
            return <span>{record.replace('T', ' ')}</span>
          } else {
            return <span>{record}</span>
          }
        }
      },
      {
        title: '结束预警时间',
        dataIndex: 'warnEndTime',
        key: 'warnEndTime',
        width: 200,
        render: (record) => {
          if (JSON.stringify(record).indexOf('T') !== -1) {
            return <span>{record.replace('T', ' ')}</span>
          } else {
            return <span>{record}</span>
          }
        }
      },
      {
        title: '导入时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        render: (record) => {
          if (JSON.stringify(record).indexOf('T') !== -1) {
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
        // eslint-disable-next-line react/display-name
        render: (index, record) => {
          return (
            <div>
              <AuthButton type='link' style={{ padding: 0 }} onClick={ () => del(record) } menu_id={ 125 }>删除</AuthButton>
            </div>
          )
        },
        width: 200
      }
    ])
  }, [props.visible, props.record, creditSubjectListId])

  useEffect(() => {
    requestList()
  }, [requestList])

  useEffect(() => {
    setVisible(props.visible)
    setCreditSubjectListId(props.creditSubjectListId)
  }, [props.visible, props.creditSubjectListId])

  useEffect(() => {
    if (visible && creditSubjectListId && creditSubjectListId !== 0) {
      setFilterParams({ creditSubjectListId })
    }
  }, [visible, creditSubjectListId])

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.buttonName = filterParams.buttonName.replace(/\s*/g, '')
    setFilterParams({
      ...filterParams,
      creditSubjectListId
    })
  }

  // 重置表格的时候
  const resetFields = () => {
    setFilterParams({ creditSubjectListId })
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='documentDetail'
      title='名单列表'
      centered
      visible={ visible }
      onCancel={ onCancel }
      footer={ null }
      maskClosable={ false }
      width={ '900px' }
    >
      <BaseForm
        formList={ formListModal }
        config={ configModal }
        filterSubmit={ handleFilterSubmit }
        resetFields={ resetFields }
      />
      <BaseTable
        rowKeyType='creditSubjectPersonId'
        data={ responseData } // 所有数据
        dataSource={ tableData } // list数据
        columns={ tableColumns }
        request={ requestList }
        scroll={{ x: 1400 }}
      />
    </Modal>

  )
}

export default DocumentDetail
