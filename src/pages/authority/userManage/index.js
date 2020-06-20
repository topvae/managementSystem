import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Row, Col, Card, Button, Modal } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { formList, config, users, usersconfig } from './formList'
import { get_roles_list, post_user_delete } from './../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function RoleManage(props) {
  const [tableData, setTableData] = useState([]) // list数据
  const [userData, setUserData] = useState(users) // 用户数据
  const [formRef, setFormRef] = useState()
  const [visible, setVisible] = useState(false) // 新增用户的弹窗
  const [isEdit, setIsEdit] = useState(false)
  const [responseData, setResponseData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  // const [selectedRows,setSelectedRows] = useState([]);   //选中的数组
  const [params, setParams] = useState({ page: 1 }) // 分页参数
  const tableColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 200
    }, {
      title: 'ITC账号',
      dataIndex: 'userName',
      key: 'userName',
      width: 200
    }, {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 200
    }, {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 200
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200
    }, {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 200
    }, {
      title: '工作电话',
      dataIndex: 'officeTel',
      key: 'officeTel',
      width: 200
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      // eslint-disable-next-line react/display-name
      render: (index, record) => {
        return (
          <div>
            <AuthButton type='link' className='edit_style' onClick={ () => editOrganization(record.userId) } menu_id={ 80 }>变更角色</AuthButton>
            <AuthButton type='link' className='edit_style' onClick={ () => freezeUser(record.roleId) } menu_id={ 70 }>冻结</AuthButton>
          </div>
        )
      },
      width: 250
    }
  ]
  const userArr = [{ id: 1, rule: '管理员' }, { id: 2, rule: '研发人员' }, { id: 3, rule: '测试人员' }]
  const userInfo = { username: 'vae', roleIds: 2 }
  const requestList = useCallback(
    async(page) => {
      params.page = page
      const res = await get_roles_list({ ...params })
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
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.username = filterParams.username.replace(/\s*/g, '')
    setParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setParams({ page: 1 })
  }

  // 新增用户(打开弹窗)
  const addOrganization = useCallback(() => {
    // props.history.push({ pathname: '/authority/userManage/addUserManage' })
    setVisible(true)
    setIsEdit(false)
    userData[1].rules = userArr
    setUserData([...userData])
  }, [userData, userArr])
  // 关闭弹窗
  const handleCancel = () => {
    setVisible(false)
  }

  // 修改用户
  const editOrganization = useCallback((ids) => {
    // 请求详情接口
    setVisible(true)
    setIsEdit(true)
    userData[1].rules = userArr
    setUserData([...userData])
  }, [userData, userArr])

  // 删除用户
  const freezeUser = (id) => {
    Modal.confirm({
      title: '冻结用户',
      content: '确认冻结用户吗?',
      onOk: () => {
        post_user_delete(id)
          .then(res => {
            Modal.success({ content: '冻结成功' })
            setParams({})
            setSelectedRowKeys([])
          })
      }
    })
  }
  // 用户新增
  const addRole = useCallback(params => {
    setVisible(false)
    requestList()
    //   post_user_add({ ...params }).then(res => {
    //     Modal.success({
    //       title: '用户新增成功'
    //     })
    //   })
  }, [requestList])
  // 用户修改
  const editRole = useCallback(params => {
    setVisible(false)
    requestList()
    // post_user_updata({ ...params, userId: Id }).then(res => {
    //   Modal.success({
    //     title: '用户修改成功'
    //   })
  }, [requestList])
  // 保存
  const filterSubmit = useCallback(
    (e) => {
      const { form } = formRef.props
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
          const fieldsValue = form.getFieldsValue()
          if (isEdit) {
            editRole(fieldsValue)
          } else {
            addRole(fieldsValue)
          }
        }
      })
    }, [formRef, editRole, addRole, isEdit])

  return (
    <div className='userManage'>
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
                <AuthButton type='primary' icon='plus' onClick={ addOrganization } className='add' menu_id={ 69 }>新增用户</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='userId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          request={ requestList }
        />
      </Card>
      <Modal
        width={ 500 }
        className='productTable'
        title={ isEdit ? '修改用户' : '新增用户' }
        visible={ visible }
        maskClosable={ false }
        onCancel={ handleCancel }
        onOk={ filterSubmit }
        // footer={ null }
      >
        { <BaseForm
          wrappedComponentRef={ inst => (setFormRef(inst)) }
          formList={ userData }
          config={ usersconfig }
          updateList={ userInfo }
        /> }
      </Modal>
    </div>
  )
}

export default withRouter(RoleManage)
