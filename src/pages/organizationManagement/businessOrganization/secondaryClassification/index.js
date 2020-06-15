/*
 * @Author: Amy
 * @Date: 2019-11-21 09:49:27
 * @LastEditTime: 2019-12-12 11:09:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/organizationManagement/businessOrganization/ secondaryClassification/index.js
 */
import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import '../index.less'
import { Row, Col, Card, Button, Modal, message, Icon } from 'antd'
import BaseForm from '../../../../components/Form'
import BaseTable from '../../../../components/Table/BaseTable'
import { formList, config, addModalList, modalConfig } from './formList'
import { secondaryClassification_list, secondaryClassification_add, get_office_page_list, get_secondaryClass_info, secondaryClassification_update, delete_secondaryClass_list } from './../../../../services/api'
import { wrapAuth } from '../../../../components/AuthButton'
const AuthButton = wrapAuth(Button)
let formRef
function SecondaryClassification(props) {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  const [visible, setVisible] = useState(false) // 选中的数组
  const [params, setParams] = useState({ page: 1 }) // 分页参数
  const [selectInputdataSearch, setSelectInputdataSearch] = useState([]) // 边输入边下拉请求到的数据
  const [selectInputdataAdd, setSelectInputdataAdd] = useState([]) // select-input返回的数据
  const [departmentId, setDepartmentId] = useState() // 二级分类的ID
  const [officeId, setOfficeId] = useState() // 业务发生机构的ID
  const tableColumns = [
    {
      title: '业务发生机构',
      dataIndex: 'officeName',
      key: 'officeName',
      width: 200
    },
    {
      title: '二级分类',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 200
    },
    {
      title: '二级分类编码',
      dataIndex: 'swichCode',
      key: 'swichCode',
      width: 200
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
      // eslint-disable-next-line react/display-name
      render: (record) => {
        if (JSON.stringify(record).indexOf('T') !== -1) {
          return <span>{record.replace('T', ' ')}</span>
        } else {
          return <span>{record}</span>
        }
      },
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      // eslint-disable-next-line react/display-name
      render: (index, record) => record.type === 1 ? <div>
        <AuthButton type='link' menu_id={ 152 } onClick={ () => showOrganization(record.departmentId) }>修改</AuthButton>
      </div>
        : <div style={{ marginLeft: '20px' }}>--</div>
      ,
      width: 200
    }
  ]
  // 数据请求
  const requestList = useCallback(
    async(page) => {
      params.page = page
      const res = await secondaryClassification_list({ ...params })
      // if (res.data.responseCode) return
      const Data = res.data.responseData
      const records = res.data.responseData.records
      setTableData(records)
      setResponseData(Data)
    }, [params])

  useEffect(() => {
    requestList()
  }, [requestList])
  // 查询边输入边下拉
  const requestSelectInputSearch = (value) => {
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then(body => {
        const data = body.results.map(user => ({
          text: `${ user.name.first }${ user.name.last }`,
          value: user.login.username
        }))
        setSelectInputdataSearch(data)
      })
  }
  // 选择表格获取的数据
  const selectedItems = (selectedRowKey, selectedRows, selectedIds) => {
    setSelectedRowKeys(selectedRowKey)
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    setParams(filterParams)
  }

  // 重置表格的时候
  const resetFields = () => {
    setParams({ page: 1 })
  }
  // 新增二级分类
  const addSecond = () => {
    setVisible(true)
    setDepartmentId(null) // 点击新增的时候清空
  }
  // 业务发生机构下拉
  const requestSelectInputAdd = useCallback((value) => {
    get_office_page_list({ officeName: value })
      .then(res => {
        const resData = res.data.responseData.records
        const data = resData.map(item => ({
          name: item.officeName,
          id: item.officeId
        }))
        setSelectInputdataAdd(data)
      })
  }, [])
  // 请求新增二级分类的接口
  // 新增请求接口
  const addSecondaryClass = useCallback(async(params) => {
    await secondaryClassification_add({ ...params })
    Modal.success({
      title: '二级分类新增成功'
    })
    requestList()
  }, [requestList])

  // 修改二级分类
  const editOrganization = useCallback(async(params) => {
    await secondaryClassification_update({ ...params, departmentId: departmentId, officeId: officeId })
    Modal.success({
      title: '二级分类修改成功'
    })
    requestList()
  }, [requestList, departmentId, officeId])

  // 点击弹窗确定按钮 （判断新增还是修改）
  const onOk = useCallback(() => {
    formRef.props.form.validateFields((err, values) => {
      if (!err) {
        setVisible(false)
        const secondaryValue = formRef.props.form.getFieldsValue()
        secondaryValue.swichCode = secondaryValue.swichCode.replace(/\s*/g, '')
        secondaryValue.departmentName = secondaryValue.departmentName.replace(/\s*/g, '')
        if (departmentId) {
          editOrganization(secondaryValue)
        } else {
          addSecondaryClass(secondaryValue)
        }
      }
    })
  }, [addSecondaryClass, editOrganization, departmentId])

  // 查看二级分类详情
  const showOrganization = async(id) => {
    setVisible(true)
    const response = await get_secondaryClass_info({ departmentId: id })
    const secondInfo = response.data.responseData
    const updataInfo = {
      officeId: secondInfo.officeName,
      departmentName: secondInfo.departmentName,
      swichCode: secondInfo.swichCode
    }
    formRef.props.form.setFieldsValue({ ...updataInfo })
    setDepartmentId(id)
    setOfficeId(secondInfo.officeId)
  }

  // 修改--选中的时候baseform组件传过来改变OfficeId
  const changeOfficeId = useCallback((office) => {
    setOfficeId(office)
  }, [])
  // 子组件传过来修改后的OfficeId
  const getSearchOnChangeValue = useCallback((searchType, value) => {
    setOfficeId(value)
  }, [])
  // 请求二级分类详情接口
  // 删除角色
  const deleteRole = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择二级分类')
    } else {
      Modal.confirm({
        title: '删除二级分类',
        content: '确认删除吗?',
        onOk: () => {
          delete_secondaryClass_list(selectedRowKeys)
            .then(res => {
              Modal.success({ content: '删除成功' })
              setParams({})
              setSelectedRowKeys([])
            })
        }
      })
    }
  }

  // 取消弹窗
  const onCancel = () => {
    setVisible(false)
  }

  return (
    <div className='roleManage'>
      <Card className='searchCard'>
        <BaseForm
          formList={ formList }
          config={ config }
          filterSubmit={ handleFilterSubmit }
          resetFields={ resetFields }
          requestSelectInput={ requestSelectInputSearch }
          selectInputdata={ selectInputdataSearch }
        />
      </Card>
      <Card bordered={ false } className='searchResult'>
        <Row style={{ marginBottom: 20 }}>
          <Col span={ 18 }>
            {
              <div className='btnWrap'>
                <AuthButton type='primary' menu_id={ 151 } icon='plus' onClick={ addSecond } className='add'>新增二级分类</AuthButton>
                <AuthButton className='del' menu_id={ 153 } onClick={ deleteRole } ><Icon type='delete' />删除二级分类</AuthButton>
              </div>
            }
          </Col>
        </Row>
        <BaseTable
          rowKeyType='departmentId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
        />
      </Card>
      <Modal
        destroyOnClose={ true }
        className='addSecondary'
        title='新增二级分类'
        centered
        visible={ visible }
        onOk={ onOk }
        onCancel={ onCancel }
        okText='确定'
        cancelText='取消'
        maskClosable={ false }
      >
        <BaseForm
          wrappedComponentRef={ (inst) => (formRef = inst) }
          formList={ addModalList }
          config={ modalConfig }
          requestSelectInput={ requestSelectInputAdd } // baseform中的value请求选框
          selectInputdata={ selectInputdataAdd } // 选框中的数据传给baseform
          changeOfficeId={ changeOfficeId } // 选框中选中后baseform传给当亲组件
          getSearchOnChangeValue={ getSearchOnChangeValue }
        />
      </Modal>
    </div>
  )
}

export default withRouter(SecondaryClassification)

