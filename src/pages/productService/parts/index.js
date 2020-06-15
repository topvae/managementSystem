/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-03-18 16:03:33
 * @LastEditors: Please set LastEditors
 */
import React, { useEffect, useState, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Row, Col, Card, Button, Tag, Modal, Checkbox, Tooltip, Table, Pagination, message, Icon } from 'antd'
import BaseForm from '../../../components/Form'
import { formList, config, componentColumn, statusList } from './formList'
import { mapRows, unique } from '../../../utils/utils'
import { get_parts_list, delect_parts, is_delect_parts, get_parts_detail, queryComponentPageByComponentIds } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function Parts(props) {
  const [isShowKeep] = useState(true) // 是否展示留存项
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [keepList, setKeepList] = useState([]) // 留存数组
  const [doubleArr, setDoubleArr] = useState([]) // 勾选表格后产生的二维数组
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  const [selectedRows, setSelectedRows] = useState([]) // 选中的数组
  // const [selectedIds, setSelectedIds] = useState([]) // 选中的数组id
  const [checked, setChecked] = useState(false)
  const [visible, setVisible] = useState(false) // 点击零件名称弹出的弹框
  const [componentDetail, setComponentDetail] = useState([]) // 零件详情
  const [params, setParams] = useState({ page: 1, effectState: '0,1' }) // 分页请求参数
  const [page, setPage] = useState('1')
  const [colorFlag, setColorFlag] = useState(false)
  const stateClass = ['orange-circle', 'green-circle', 'grey-circle']

  // 操作留存项state的统一调用的函数
  // selectedRowsList 操作勾选的时候 一维数组或者二维数组
  const setKeepFun = useCallback((selectedRowsList, selectedRowKeys) => {
    // 勾选的二维数组扁平化
    selectedRowsList = mapRows(selectedRowsList)
    const uniqueItems = unique([...keepList, ...selectedRowsList], 'componentId')
    // selectedRowsList 选中的
    // uniqueItems 去重后的留存项
    let filterItem = selectedRowKeys && selectedRowKeys.map(item => {
      return uniqueItems.filter(key => {
        return key.componentId === item
      })
    })
    // 二维数组扁平化
    filterItem = mapRows(filterItem)
    // const arr = filterItem.filter(item => (item.effectState !== 0 && item.effectState !== 2))
    setKeepList(filterItem)
    localStorage.setItem('partKeepList', JSON.stringify(filterItem))
    localStorage.setItem('processKeepList', JSON.stringify(filterItem))
  }, [keepList])

  // 数据请求
  const requestList = useCallback(async() => {
    setPage(params.page)
    const res = await get_parts_list({ ...params })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    const records = res.data.responseData.records
    const tableData = records.map((item, index) => {
      item.key = index
      return item
    })
    setTableData(tableData)
    setResponseData(responseData)
  }, [params])

  // 页面初始化
  useEffect(() => {
    requestList()
  }, [requestList])

  useEffect(() => {
    // let newKeepList = []
    const partKeepList = localStorage.getItem('partKeepList') ? JSON.parse(localStorage.getItem('partKeepList')) : []
    // 获取selectedRowKeys
    const ids = partKeepList && partKeepList.length > 0 && partKeepList.map(item => {
      return item.componentId
    })
    // 表格自动打勾
    if (ids) {
      setSelectedRowKeys(ids)
    }
    // 设置留存项
    partKeepList ? setKeepList(partKeepList) : setKeepList([])
  }, [tableData])

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
      // const idList = selectedRows.map(item => {
      //   return item.componentId
      // })
      // 选中的零件id
      // setSelectedIds(idList)
      // 勾选生成二维数组
      doubleArr[page ? page - 1 : 0] = selectedRows
      setDoubleArr(doubleArr)
      setKeepFun(doubleArr, selectedRowKeys)
    }
  }

  // 留存是否展示
  // useEffect(() => {
  //   keepList.length > 0 ? setIsShowKeep(true) : setIsShowKeep(false)
  // }, [keepList])

  const tableColumns = [
    {
      title: '零件名称',
      dataIndex: 'componentName',
      key: 'componentName',
      width: '150px',
      // eslint-disable-next-line react/display-name
      render: (index, record) => {
        return <span className={ record.type !== 0 ? 'like_a' : '' } onClick={ () => { record.type !== 0 && showComponentDetails(record) } } > {index} </span>
      }
    },
    {
      title: '一级分类',
      dataIndex: 'officeName',
      key: 'officeName',
      width: '150px'
    },
    {
      title: '二级分类',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: '150px'
    },
    {
      title: '用途',
      dataIndex: 'purpose',
      key: 'purpose',
      width: '150px',
      // eslint-disable-next-line react/display-name
      render: (record) => {
        return (
          <Tooltip title={ record }>
            <div className='twoEllipsis'>
              {record}
            </div>
          </Tooltip>
        )
      }
    },
    {
      title: '生效时间',
      dataIndex: 'effectDate',
      key: 'effectDate',
      sorter: true,
      // eslint-disable-next-line react/display-name
      render: (record) => {
        if (JSON.stringify(record).indexOf('T') !== -1) {
          return <span>{record.replace('T', ' ')}</span>
        } else {
          return <span>{record}</span>
        }
      },
      width: '150px'
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
      width: '150px'
    },
    {
      title: '状态',
      dataIndex: 'effectState',
      key: 'effectState',
      // eslint-disable-next-line react/display-name
      render: (index) => <span><span className={ `basic-circle ${ stateClass[index] }` }> </span>{statusList[index]}</span>, //    0-未生效 1-已生效 2-已失效
      width: '150px'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      // eslint-disable-next-line react/display-name
      render: (index, record) => CopyOrDelete(record),
      width: '150px'
    }
  ]

  // 打开弹窗显示零件详情
  const showComponentDetails = params => {
    getComponentInfo(params)
    setVisible(true)
  }

  // 请求查看零件详情接口
  const getComponentInfo = params => {
    get_parts_detail({ componentId: params.componentId }).then(res => {
      if (res.data.responseCode === 0) {
        setComponentDetail(res.data.responseData.includeComponents)
      }
    })
  }

  // 取消Modal的时候
  const handleCancel = () => {
    setVisible(false)
  }

  // 后端时间排序
  const onChange = (pagination, filters, sorter) => {
    const { field, order } = sorter
    params.orderBy = field
    if (order === 'descend') {
      // 降序
      setParams({
        ...params,
        asc: false,
        orderBy: field
      })
    } else if (order === 'ascend') {
      // 升序
      setParams({
        ...params,
        asc: true,
        orderBy: field
      })
    }
  }

  // 加工
  const process = async() => {
    // 通过零件No查询最新的留存项零件，替换留存项
    const componentIds = keepList.map(item => {
      return item.componentId
    })
    const res = await queryComponentPageByComponentIds({ componentIds: componentIds.join(',') })
    const newKeepList = res.data.responseData
    // if (!newKeepList || newKeepList.length === 0) {
    //   Modal.warning({
    //     title: '提醒',
    //     content: '至少选择一个零件,先留存，再加工'
    //   })
    //   return
    // }
    // 设置替换后的keeplist
    setKeepList(newKeepList)
    localStorage.setItem('processKeepList', JSON.stringify(newKeepList))
    // 已生效的才可以加工
    // 0-未生效 1-已生效 2-已失效
    const isSetColor = newKeepList.some(item => {
      return item.effectState === 0 || item.effectState === 2
    })
    if (isSetColor) {
      message.error('请选择生效零件或不选择零件进行加工')
      setColorFlag(true)
      return
    }
    // editType: 1 复制 2 修改    清空 代表新增
    sessionStorage.setItem('editType', '')
    props.history.push({ pathname: '/product/parts/partsProcess' })
  }

  // 零件加工列表 修改 复制进入的时候
  // 将 componentContentType：加工状态（回显到计算框还是条件判断）
  // 将 type: 是复制还是修改 传递到 计算框或条件判断页面
  const edit = (record, type) => {
    if (!record) return
    const componentNo = record.componentNo
    sessionStorage.setItem('componentContentType', record.componentContentType)
    sessionStorage.setItem('editType', type)
    sessionStorage.setItem('componentNo', componentNo)
    props.history.push({ pathname: `/product/parts/${ record.componentId }`, params: { type: type, componentNo }})
  }

  const del = (record) => {
    isDelectParts([record.componentId].join(','))
  }

  // 操作按钮
  const CopyOrDelete = (record) => {
    if (record) {
      // effectState：0-未生效 1-已生效 2-已失效   type：0: 原子零件
      return (<div>
        { (record.effectState === 0 || record.effectState === 1) && record.type !== 0 && <AuthButton type='link' className='copy' onClick={ () => edit(record, '1') } menu_id={ 71 } style={{ padding: 0 }}>复制</AuthButton> }
        { record.effectState === 0 && record.type !== 0 && <AuthButton type='link' className='edit' onClick={ () => edit(record, '2') } menu_id={ 72 } style={{ padding: 0 }}>修改</AuthButton> }
        { record.type !== 0 && <AuthButton type='link' className='edit' onClick={ () => del(record) } style={{ padding: 0 }} menu_id={ 23 } >删除</AuthButton> }
      </div>)
    }
  }

  // 清除留存
  const clearKeep = () => {
    setKeepFun([], [])
    setSelectedRowKeys([])
    console.log(selectedRows)
  }

  // 单个删除留存
  const log = (deleteID) => {
    const arr = keepList.filter(item => {
      return item.componentId !== deleteID
    })
    const keys = selectedRowKeys.filter(item => {
      return item !== deleteID
    })
    setSelectedRowKeys(keys)
    setKeepFun(arr, keys)
  }

  // 零件删除
  const formDelete = () => {
    console.log(selectedRowKeys)
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: '提醒',
        content: '请选择需要删除的零件'
      })
    } else {
      isDelectParts(selectedRowKeys.join(','))
    }
  }

  // 检测删除
  const isDelectParts = async(selectedIds) => {
    const res = await is_delect_parts({ componentIds: selectedIds })
    const msg = res.data.responseData.msg
    const result = res.data.responseData.result
    // 可以删除
    if (result) {
      Modal.confirm({
        title: '删除零件',
        content: '删除后将无法进行恢复， 是否确认删除？',
        cancelText: '取消',
        okText: '确定',
        onOk: () => {
          delectParts(selectedIds)
        }
      })
    } else {
      // 不可以删除
      Modal.warning({
        title: '提醒',
        content: msg
      })
    }
  }

  const delectParts = async(selectedIds) => {
    const res = await delect_parts({ componentIds: selectedIds })
    const msg = res.data.responseData.msg
    const result = res.data.responseData.result
    // 可以删除
    if (result) {
      Modal.success({
        title: '成功',
        content: '删除成功',
        onOk: () => {
          resetFields()
          selectedIds = selectedIds.split(',')
          const keys = selectedRowKeys && selectedRowKeys.filter(item => !selectedIds.some(ids => item === Number(ids)))
          // 同时删除留存项里面的数据
          const arr = []
          for (let i = 0; i < selectedIds.length; i++) {
            for (let j = 0; j < keepList.length; j++) {
              if (keepList.length > 0 && Number(keepList[j].componentId) !== Number(selectedIds[i])) {
                arr.push(keepList[j])
              }
            }
          }
          setKeepFun(arr, keys)
        }
      })
    } else {
      // 不可以删除
      Modal.warning({
        title: '提醒',
        content: msg
      })
    }
  }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.componentName = filterParams.componentName.replace(/\s*/g, '')
    filterParams.purpose = filterParams.purpose.replace(/\s*/g, '')
    filterParams.page = 1
    setParams({
      ...params,
      ...filterParams
    })
  }

  // 重置表格的时候
  const resetFields = () => {
    setParams({})
    setChecked(false)
  }

  const checkboxChange = (e) => {
    const isChecked = e.target.checked
    setChecked(e.target.checked)
    if (isChecked) {
      // 请求失效数据
      setParams({
        ...params,
        effectState: '0,1,2'
      })
    } else {
      // 默认请求数据
      setParams({
        ...params,
        effectState: '0,1'
      })
    }
  }

  const paginationOnChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  return (
    <div className='partsContent'>
      <Card bordered={ false } className='searchCard'>
        <BaseForm
          // wrappedComponentRef={ (inst) => (formRef = inst) }
          formList={ formList }
          config={ config }
          filterSubmit={ handleFilterSubmit }
          resetFields={ resetFields }
        />
      </Card>
      { isShowKeep &&
        <Card bordered={ false } className='keepWrap'>
          <Row type='flex' align='middle'>
            <Col span={ 18 }>
              {keepList && keepList.length > 0 && keepList.map(item => {
                // 已生效的才可以加工
                // 0-未生效 1-已生效 2-已失效
                return (
                  <Tag color={ item.effectState === 1 ? 'blue' : colorFlag ? 'red' : 'blue' }
                    closable
                    onClose={ () => log(item.componentId) }
                    key={ item.componentId }
                    style={{ marginBottom: 10 }}
                    className={ item.effectState === 1 ? '' : colorFlag && 'anticon-close-red' }
                  >{item.componentName + '-' + item.departmentName + '-' + item.officeName}</Tag>
                )
              })}
            </Col>
            <Col span={ 6 } style={{ textAlign: 'right' }}>
              <AuthButton type='primary' icon='plus' onClick={ process } menu_id={ 20 }>加工</AuthButton>
              <AuthButton onClick={ clearKeep } menu_id={ 21 }>清除留存</AuthButton>
            </Col>
          </Row>
        </Card>
      }
      <Card bordered={ false } className='searchResult'>
        <Row style={{ marginBottom: 20 }}>
          <Col span={ 18 }>
            {
              <div>
                {/* <AuthButton type='primary' onClick={ addKeep } menu_id={ 22 }>留存</AuthButton> */}
                <AuthButton onClick={ formDelete } menu_id={ 23 }><Icon type='delete' />删除</AuthButton>
              </div>
            }
          </Col>
          <Col span={ 6 } style={{ textAlign: 'right' }}>
            <Checkbox checked={ checked } onChange={ (e) => checkboxChange(e) }>显示失效零件</Checkbox>
          </Col>
        </Row>
        <Table
          rowKey={ record => record.componentId }
          data={ responseData } // 所有数据
          dataSource={ tableData } // list数据
          columns={ tableColumns }
          onChange={ onChange }
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ requestList }
          rowSelection={ rowSelection }
          pagination={ false }
        />
        <Pagination
          className='pagination'
          current={ responseData.current }
          total={ responseData.total }
          defaultPageSize={ responseData.size }
          showQuickJumper={ responseData.total > 0 }
          showTotal={ () => `共${ responseData.total || 0 }条` }
          onChange={ paginationOnChange }
        />
      </Card>
      <Modal
        width={ 800 }
        className='productTable'
        title={ '零件详情' }
        visible={ visible }
        // onOk={handleOk}
        onCancel={ handleCancel }
        footer={ null }
      >
        <Table
          dataSource={ componentDetail }
          columns={ componentColumn }
          pagination={ false }
          rowKey={ record => record.componentId }
        />
      </Modal>
    </div>
  )
}

export default withRouter(Parts)
