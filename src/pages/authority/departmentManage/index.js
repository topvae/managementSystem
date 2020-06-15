import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Row, Col, Card, Button, Modal, message } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { formList, config } from './formList'
import { get_department_list, post_department_delete } from './../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function DepartmentManage(props) {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  const [params, setParams] = useState({ page: 1 }) // 分页参数

  const tableColumns = [
    {
      title: '部门ID',
      dataIndex: 'deptId',
      key: 'deptId',
      width: 200
    },
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '上级部门名称',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 200
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
            <AuthButton type='link' className='edit_style' onClick={ () => editOrganization(record.deptId) } menu_id={ 87 }>修改</AuthButton>
          </div>
        )
      },
      width: 200
    }
  ]

  const requestList = useCallback(
    async(page) => {
      params.page = page
      const res = await get_department_list({ ...params })
      const Data = res.data.responseData
      const records = res.data.responseData.records
      setTableData(records)
      setResponseData(Data)
    }, [params])

  useEffect(() => {
    requestList()
  }, [requestList])

  // 选择表格获取的数据
  const selectedItems = (selectedRowKey) => {
    setSelectedRowKeys(selectedRowKey)
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.name = filterParams.name.replace(/\s*/g, '')
    setParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setParams({ page: 1 })
  }

  const addOrganization = () => {
    props.history.push({ pathname: '/authority/departmentManage/addDepartmentManage' })
  }

  const editOrganization = (ids) => {
    // const ids = 12;
    props.history.push({ pathname: `/authority/departmentManage/editDepartmentManage/${ ids }` })
  }
  // 删除部门
  const deleteDepartment = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择部门')
    } else {
      Modal.confirm({
        title: '删除部门',
        content: '确认删除吗?',
        onOk: () => {
          post_department_delete(selectedRowKeys)
            .then(res => {
              Modal.success({ content: '删除成功' })
              setParams({})
              setSelectedRowKeys([])
            })
        }
      })
    }
  }

  return (
    <div className='departmentManage'>
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
                <AuthButton type='primary' icon='plus' onClick={ addOrganization } className='add' menu_id={ 65 }>新增部门</AuthButton>
                <AuthButton className='del' icon='delete' onClick={ deleteDepartment } menu_id={ 66 }>删除部门</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='deptId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
        />
      </Card>
    </div>
  )
}

export default withRouter(DepartmentManage)
