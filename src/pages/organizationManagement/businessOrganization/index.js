/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2019-12-30 09:58:25
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Row, Col, Card, Button, Upload, Modal, Icon } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { ChangeSelectParams, config, beforeUpload } from './utils'
import { import_Office_url, get_office_page_list, get_options, office_delete, download_office_template } from '../../../services/api'
import ManagementModal from './businessOrganizationModal.js'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function BusinessOrganization() {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  const [selectedRows, setSelectedRows] = useState([]) // 选中的数组
  const [visible, setVisible] = useState(false)
  const [fileList, setFileList] = useState(false)
  const [formList, setFormList] = useState([]) // 查询字段
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  const [othersRules, setOthersRules] = useState([]) // 后端给的规则 第一个option需要前端配置
  const [tableColumns, setTableColumns] = useState([]) // 表格字段
  const [record, setRecord] = useState({}) // 修改选中的那一行
  const [editId, setEditId] = useState(0) // 是否修改状态

  const requestList = useCallback(async(page) => {
    const res = await get_office_page_list({ ...filterParams, page })
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
    setEditId(record.officeId)
  }

  //  上传文件后 提取后端提供数据
  const filter = (file) => {
    const { name, response, uid, status } = file
    if (status === 'done') {
      if (response.responseCode !== 0) {
        Modal.error({
          title: response.responseMsg
        })
      } else {
        Modal.success({
          title: response.responseMsg
        })
        setFilterParams({})
      }
    } else if (status === 'error') {
      Modal.error({
        title: '上传失败'
      })
    }
    return { name, url: response.data, uid, status }
  }

  useEffect(() => {
    async function fetchData() {
      const res = await get_options({ 'businessIdent': 't_office', 'field': 'office_business_type_dic_id' })
      const responseData = res.data.responseData
      if (responseData) {
        const othersRules = ChangeSelectParams(responseData)
        setOthersRules(othersRules)
      }
    }
    fetchData()
  }, [filterParams])

  useEffect(() => {
    requestList()
  }, [requestList])

  useEffect(() => {
    const renderDom = (record) => {
      return <AuthButton type='link' style={{ padding: 0 }} menu_id={ 138 } onClick={ () => edit('edit', record) }>修改</AuthButton>
    }
    setFormList([
      {
        type: 'INPUT',
        label: '业务发生机构',
        field: 'officeName',
        placeholder: '请输入',
        width: 180
      }, {
        type: 'INPUT',
        label: '机构编码',
        field: 'swichCode',
        placeholder: '请输入',
        width: 180
      }, {
        type: 'SELECT_OPTIONS',
        label: '业务类型:',
        field: 'officeBusinessTypeDicId',
        width: 200,
        rules: [{ id: '-1', rule: '全部' }, ...othersRules],
        initialValue: '-1'
      }
    ])

    setTableColumns([
      {
        title: '业务发生机构',
        dataIndex: 'officeName',
        key: 'officeName',
        width: 140
      },
      {
        title: '机构编码',
        dataIndex: 'swichCode',
        key: 'swichCode',
        width: 140
      },
      {
        title: '业务类型',
        dataIndex: 'officeBusinessTypeDesc',
        key: 'officeBusinessTypeDesc',
        width: 140
      },
      {
        title: '联系人',
        dataIndex: 'contackName',
        key: 'contackName',
        width: 140
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 140
      },
      {
        title: '固定电话',
        dataIndex: 'fixTelephone',
        key: 'fixTelephone',
        width: 140
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 160
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        render: (record) => {
          if (JSON.stringify(record).indexOf('T') !== -1) {
            return <span>{record.replace('T', ' ')}</span>
          } else {
            return <span>{record}</span>
          }
        },
        width: 180
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => renderDom(record),
        width: 100
      }
    ])
  }, [othersRules])

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
    requestList()
  }

  // 上传文件
  const uploadChange = info => {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1)
    fileList = fileList.map(file => {
      if (file.response) {
        filter(file)
        // file.url = file.response.url;
      }
      return file
    })
    setFileList(fileList)
  }

  const [uploadProps] = useState(
    {
      action: import_Office_url,
      onChange: uploadChange,
      multiple: false
    }
  )

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
    filterParams.officeName = filterParams.officeName.replace(/\s*/g, '')
    filterParams.swichCode = filterParams.swichCode.replace(/\s*/g, '')
    // dicId
    setFilterParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setFilterParams({})
  }

  const addOrganization = () => {
    setVisible(true)
    setEditId(0)
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

  const deleteOrganization = async() => {
    const arr = selectedRows.map(item => {
      return item.officeId
    })
    const res = await office_delete({ officeIds: arr.join(',') })
    const responseMsg = res.data.responseMsg
    Modal.warning({
      title: '提示',
      content: responseMsg
    })
    requestList()
    setSelectedRows([])
    setSelectedRowKeys([])
    return
  }

  const download = () => {
    window.location.href = download_office_template
  }

  return (
    <div className='businessOrganization'>
      <Card bordered={ false } className='searchCard'>
        <BaseForm
          formList={ formList }
          config={ config }
          filterSubmit={ handleFilterSubmit }
          resetFields={ resetFields }
        />
      </Card>
      <Card bordered={ false } className='searchResult'>
        <Row style={{ height: 66 }}>
          <Col span={ 18 }>
            {
              <div className='btnWrap'>
                <AuthButton type='primary' onClick={ addOrganization } className='add' menu_id={ 43 } icon='plus'>新增机构</AuthButton>
                <Upload className='Upload' { ...uploadProps } beforeUpload={ beforeUpload } fileList={ fileList }>
                  <AuthButton menu_id={ 44 }><Icon type='cloud-download' />导入机构</AuthButton>
                </Upload>
                <AuthButton className='download' onClick={ download } menu_id={ 137 }><Icon type='cloud-download' />模版下载</AuthButton>
                <AuthButton className='del' onClick={ isDelete } menu_id={ 45 } icon='delete'>删除机构</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='officeId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          onChange={ onChange }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
          scroll={{ x: 1500 }}
        />
      </Card>
      <ManagementModal visible={ visible } close={ closeModal } othersRules={ othersRules } updateList={ record } editId={ editId } />
    </div>
  )
}

export default withRouter(BusinessOrganization)
