import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col, Card, Button } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { setCreditDate } from '../../../utils/utils'
import { config } from './formList'
import { get_name_list, get_options, option_list } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
import AddNameListModal from './addNameListModal'
import DraggerModal from './draggerModal'
import DocumentDetail from './documentDetail'
import ViewNameModal from './viewNameModal'
const AuthButton = wrapAuth(Button)

function DataDictionary() {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [visible, setVisible] = useState(false)
  const [viewNameVisible, setViewNameVisible] = useState(false)
  const [draggerVisible, setDraggerVisible] = useState(false)
  const [documentDetailVisible, setDocumentDetailVisible] = useState(false)
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  const [record, setRecord] = useState({}) // 修改选中的那一行
  const [formList, setFormList] = useState([]) // 查询字段
  const [tableColumns, setTableColumns] = useState([])
  const [creditSubjectListId, setCreditSubjectListId] = useState(0) // 是否修改状态
  const [serveCreditOption, setServeCreditOption] = useState([])
  const [options, setOptions] = useState([])

  const requestList = useCallback(async(page) => {
    const res = await get_name_list({ ...filterParams, page })
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

  const importFile = (record) => {
    setRecord(record)
    setDraggerVisible(true)
  }

  const viewList = (record) => {
    setCreditSubjectListId(record.creditSubjectListId)
    setViewNameVisible(true)
  }

  const viewFile = (record) => {
    setCreditSubjectListId(record.creditSubjectListId)
    setDocumentDetailVisible(true)
  }

  useEffect(() => {
    requestList()
  }, [requestList])

  useEffect(() => {
    async function getServe() {
      const params = {
        businessIdent: 'all',
        field: 'credit_type'
      }
      const res = await get_options(params)
      const creditTypeResponseData = res.data.responseData
      if (creditTypeResponseData) {
        const othersRules = setCreditDate(res)
        setServeCreditOption(othersRules)
      }
    }
    async function getDataUseOrganization() {
      const res = await option_list()
      const data = res.data.responseData
      if (data) {
        const othersRules = data && data.map(item => {
          return {
            id: item.dataUseOrganizationId,
            rule: item.organizationName
          }
        })
        setOptions(othersRules)
      }
    }
    getServe()
    getDataUseOrganization()
  }, [])

  useEffect(() => {

  }, [])

  useEffect(() => {
    const renderDom = (record) => {
      return (<>
        <AuthButton type='link' onClick={ () => importFile(record) } menu_id={ 103 } style={{ padding: 0 }}>导入文件</AuthButton>
        <AuthButton type='link' onClick={ () => viewList(record) } menu_id={ 104 } style={{ padding: 0 }}>查看列表</AuthButton>
      </>)
    }
    setFormList([
      {
        type: 'SELECT_OPTIONS',
        label: '机构名称',
        field: 'dataUseOrganizationId',
        rules: [{ id: '-1', rule: '全部' }, ...options],
        initialValue: '-1',
        width: 180
      }, {
        type: 'INPUT',
        label: '名单名称',
        field: 'listName',
        placeholder: '请输入',
        width: 180
      }, {
        type: 'SELECT_OPTIONS',
        label: '信用主体类型:',
        field: 'creditType',
        width: 200,
        rules: [{ id: '-1', rule: '全部' }, ...serveCreditOption],
        initialValue: '-1'
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
        title: '名单编码',
        dataIndex: 'switchCode',
        key: 'switchCode'
      },
      {
        title: '信用主体类型',
        dataIndex: 'creditTypeName',
        key: 'creditTypeName'
      },
      {
        title: '文件名称',
        dataIndex: 'isFileList',
        key: 'isFileList',
        render: (text, record) => {
          if (text === 0) {
            return <AuthButton type='link' onClick={ () => viewFile(record) } style={{ padding: 0 }} menu_id={ 123 }>查看文件详情</AuthButton>
          }
        }
      },
      {
        title: '创建时间',
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
        title: '创建人',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => renderDom(record),
        width: 230
      }
    ])
  }, [serveCreditOption, options])

  const nameListModalClose = (_, type) => {
    setVisible(false)
    if (type === 'updata') {
      setFilterParams({})
    }
  }

  const draggerModalClose = () => {
    setDraggerVisible(false)
  }

  const documentDetailModalClose = () => {
    setDocumentDetailVisible(false)
  }

  const viewNameModalClose = () => {
    setViewNameVisible(false)
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.listName = filterParams.listName.replace(/\s*/g, '')
    filterParams.dataUseOrganizationId = Number(filterParams.dataUseOrganizationId)
    filterParams.creditType = Number(filterParams.creditType)
    if (filterParams.creditType === -1) {
      filterParams.creditType = ''
    }
    if (filterParams.dataUseOrganizationId === -1) {
      filterParams.dataUseOrganizationId = ''
    }
    setFilterParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setFilterParams({})
  }

  const placeOrder = () => {
    setVisible(true)
    setCreditSubjectListId(0)
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
        <Row style={{ marginBottom: 20 }}>
          <Col span={ 18 }>
            {
              <div>
                <AuthButton type='primary' onClick={ placeOrder } menu_id={ 102 } icon='plus'>新增名单</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='creditSubjectListId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          request={ requestList }
          scroll={{ x: 1500 }}
        />
      </Card>
      <AddNameListModal visible={ visible } close={ nameListModalClose } updateList={ record } creditSubjectListId={ creditSubjectListId } options={ options } serveCreditOption={ serveCreditOption } />
      <DraggerModal visible={ draggerVisible } close={ draggerModalClose } record={ record } creditSubjectListId={ creditSubjectListId } />
      <DocumentDetail visible={ documentDetailVisible } close={ documentDetailModalClose } creditSubjectListId={ creditSubjectListId } />
      <ViewNameModal visible={ viewNameVisible } close={ viewNameModalClose } creditSubjectListId={ creditSubjectListId } />
    </div>
  )
}

export default withRouter(DataDictionary)
