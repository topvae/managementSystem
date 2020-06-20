import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Row, Col, Card, Button, Modal } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { formList, config } from './formList'
import { get_roles_list, post_role_delete } from './../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function RoleManage(props) {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  // const [selectedRows,setSelectedRows] = useState([]);   //选中的数组
  const [params, setParams] = useState({ page: 1 }) // 分页参数
  const tableColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      // eslint-disable-next-line react/display-name
      render: (index, record) => {
        return (
          <div>
            <AuthButton type='link' className='edit_style' onClick={ () => editOrganization(record.roleId) } menu_id={ 79 }>修改</AuthButton>
            <AuthButton type='link' className='edit_style' onClick={ () => deleteRole(record.roleId) } menu_id={ 62 }>删除</AuthButton>
          </div>
        )
      },
      width: 200
    }
  ]

  // 数据请求
  const requestList = useCallback(
    async(page) => {
      params.page = page
      const res = await get_roles_list({ ...params })
      // if (res.data.responseCode) return
      const Data = res.data.responseData
      const records = res.data.responseData.records
      setTableData(records)
      setResponseData(Data)
    }, [params])

  useEffect(() => {
    requestList()
  }, [requestList])

  // 选择表格获取的数据
  const selectedItems = (selectedRowKey, selectedRows, selectedIds) => {
    setSelectedRowKeys(selectedRowKey)
    // setSelectedRows(selectedRows)
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.roleName = filterParams.roleName.replace(/\s*/g, '')
    setParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setParams({ page: 1 })
  }

  const addRole = () => {
    props.history.push({ pathname: '/authority/roleManage/addRoleManage' })
  }
  // 删除角色
  const deleteRole = () => {
    Modal.confirm({
      title: '删除角色',
      content: '确认删除吗?',
      onOk: () => {
        post_role_delete(selectedRowKeys)
          .then(res => {
            Modal.success({ content: '删除成功' })
            setParams({})
            setSelectedRowKeys([])
          })
      }
    })
  }

  const editOrganization = (ids) => {
    props.history.push({ pathname: `/authority/roleManage/editRoleManage/${ ids }` })
  }

  return (
    <div className='roleManage'>
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
              <div className='btnWrap'>
                <AuthButton type='primary' icon='plus' onClick={ addRole } className='add' menu_id={ 61 }>新增角色</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='roleId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          request={ requestList }
        />
      </Card>
    </div>
  )
}

export default withRouter(RoleManage)
