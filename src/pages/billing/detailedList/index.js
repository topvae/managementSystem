import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Row, Col, Card, Button, Modal, Checkbox } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import DetailedListModal from './detailedListModal'
import DiscountsDetailModal from './discountsDetailModal'
import { config } from './utils'
import { config_price_list, serve_config_delete } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function DetailedList() {
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  const [selectedRows, setSelectedRows] = useState([]) // 选中的数组
  const [detailedListModalvisible, setDetailedListModalvisible] = useState(false)
  const [discountsDetailModalVisible, setDiscountsDetailModalVisible] = useState(false)
  const [formList, setFormList] = useState([]) // 查询字段
  const [filterParams, setFilterParams] = useState({}) // 查询表单的参数
  const [tableColumns, setTableColumns] = useState([]) // 表格字段
  const [serveConfigId, setServeConfigId] = useState(-1) // 是否修改状态
  const [serveDisabled, setServeDisabled] = useState(true)
  const [noEffectChecked, setNoEffectChecked] = useState(false)
  const [noSeeChecked, setNoSeeChecked] = useState(false)
  const requestList = useCallback(async(page) => {
    const res = await config_price_list({ ...filterParams, page })
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
      if (record.isInvoke) {
        return '- -'
      } else {
        return <AuthButton type='link' onClick={ () => edit(record) } style={{ padding: 0 }} menu_id={ 99 }>修改</AuthButton>
      }
    }
    const renderDetailDom = (record) => {
      return <AuthButton type='link' style={{ padding: 0 }} menu_id={ 130 } onClick={ () => getDetail(record) }>详情</AuthButton>
    }
    setFormList([
      {
        type: 'INPUT',
        label: '服务名称',
        field: 'serveName',
        placeholder: '请输入',
        requiredMsg: '请输入',
        width: 180
      }
    ])
    const effectStateList = ['未生效', '已生效', '已失效', '可用不可见'] // 生效状态 0-未生效 1-已生效 2-已失效3-可用不可见
    const stateClass = ['orange-circle', 'green-circle', 'grey-circle', 'grey-circle']
    setTableColumns([
      {
        title: '服务名称',
        dataIndex: 'serveName',
        key: 'serveName',
        width: 140
      },
      {
        title: '服务编码',
        dataIndex: 'switchCode',
        key: 'switchCode',
        width: 140
      },
      {
        title: '原价(元)',
        dataIndex: 'prices',
        key: 'prices',
        width: 140
      },
      {
        title: '优惠详情',
        dataIndex: 'detail',
        key: 'detail',
        render: (text, record) => renderDetailDom(record),
        width: 140
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // sorter: true,
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
        title: '服务状态',
        dataIndex: 'effectState',
        key: 'effectState',
        width: 140,
        // eslint-disable-next-line react/display-name
        render: (text) => <span><span className={ `basic-circle ${ stateClass[text] }` }> </span>{effectStateList[text]}</span>
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 140
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

  const edit = (record) => {
    setServeDisabled(true)
    setDetailedListModalvisible(true)
    setServeConfigId(record.serveConfigId)
  }

  const getDetail = (record) => {
    const serveConfigId = record.serveConfigId
    setServeConfigId(serveConfigId)
    setDiscountsDetailModalVisible(true)
  }

  // 选择表格获取的数据
  const selectedItems = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
  }

  const closeDetailedListModal = (_, type) => {
    setDetailedListModalvisible(false)
    if (type === 'updata') {
      setFilterParams({
        ...filterParams,
        unEffectState: noEffectChecked ? 1 : null, // 显示未生效服务
        availableState: noSeeChecked ? 1 : null // 显示可用不可见服务
      })
    }
  }

  const closeDiscountsDetailModal = () => {
    setDiscountsDetailModalVisible(false)
    setServeConfigId(-1)
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.serveName = filterParams.serveName.replace(/\s*/g, '')
    setFilterParams({
      ...filterParams,
      unEffectState: noEffectChecked ? 1 : null,
      availableState: noSeeChecked ? 1 : null
    })
  }

  // 重置表格的时候
  const resetFields = () => {
    setFilterParams({
      unEffectState: noEffectChecked ? 1 : null, // 显示未生效服务
      availableState: noSeeChecked ? 1 : null // 显示可用不可见服务
    })
  }

  const addDetailedList = () => {
    setServeDisabled(false)
    setDetailedListModalvisible(true)
    setServeConfigId(-1)
  }

  const isDelete = () => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: '提示',
        content: '请选择一条服务进行删除'
      })
      return
    }
    Modal.confirm({
      title: '提示',
      content: '确认删除吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        deleteServre()
      }
    })
  }

  const deleteServre = async() => {
    const arr = selectedRows.map(item => {
      return {
        serveConfigId: item.serveConfigId,
        serveNo: item.serveNo
      }
    })
    const res = await serve_config_delete(arr)
    const responseMsg = res.data.responseMsg
    Modal.success({
      title: '提示',
      content: responseMsg
    })
    setFilterParams({
      ...filterParams
    })
    setSelectedRows([])
    setSelectedRowKeys([])
    return
  }
  // 可用不可见服务
  const noSeeChange = (e) => {
    const isChecked = e.target.checked
    setNoSeeChecked(isChecked)
    setFilterParams({
      ...filterParams,
      unEffectState: noEffectChecked ? 1 : null, // 显示未生效服务
      availableState: isChecked ? 1 : null // 显示可用不可见服务
    })
  }
  // 未生效服务
  const noEffectChange = (e) => {
    const isChecked = e.target.checked
    setNoEffectChecked(isChecked)
    setFilterParams({
      ...filterParams,
      unEffectState: isChecked ? 1 : null, // 显示未生效服务
      availableState: noSeeChecked ? 1 : null // 显示可用不可见服务
    })
  }
  return (
    <div className='detailedList'>
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
          <Col span={ 14 }>
            {
              <div className='btnWrap'>
                <AuthButton type='primary' onClick={ addDetailedList } className='add' menu_id={ 97 } icon='plus'>新增</AuthButton>
                <AuthButton className='del' onClick={ isDelete } menu_id={ 98 } icon='delete'>删除</AuthButton>
              </div>
            }
          </Col>
          <Col span={ 10 } style={{ textAlign: 'right' }}>
            <Checkbox checked={ noEffectChecked } onChange={ (e) => noEffectChange(e) }>未生效服务</Checkbox>
            <Checkbox checked={ noSeeChecked } onChange={ (e) => noSeeChange(e) }>显示可用不可见服务</Checkbox>
          </Col>
        </Row>
        <BaseTable
          rowKeyType='serveConfigId'
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          selectedItems={ selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
        />
      </Card>
      <DetailedListModal visible={ detailedListModalvisible } close={ closeDetailedListModal } serveConfigId={ serveConfigId } serveDisabled={ serveDisabled } />
      <DiscountsDetailModal visible={ discountsDetailModalVisible } close={ closeDiscountsDetailModal } serveConfigId={ serveConfigId } />
    </div>
  )
}

export default withRouter(DetailedList)
