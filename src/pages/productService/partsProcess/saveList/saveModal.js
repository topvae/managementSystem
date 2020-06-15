/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-03-17 09:28:02
 * @LastEditors: Please set LastEditors
 */
import React, { useEffect, useState, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Row, Col, Card, Button, Tag, Modal, Tooltip, Table, Pagination } from 'antd'
import BaseForm from '../../../../components/Form'
import { formList, config, statusList } from './formList'
import { mapRows, unique } from '../../../../utils/utils'
import { get_parts_list, check_component } from '../../../../services/api'
import { wrapAuth } from '../../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function Parts(props) {
  const [isShowKeep, setIsShowKeep] = useState(false) // 是否展示留存项
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [keepList, setKeepList] = useState([]) // 留存数组
  const [doubleArr, setDoubleArr] = useState([]) // 勾选表格后产生的二维数组
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 选中项的 key 数组
  const [selectedRows, setSelectedRows] = useState([]) // 选中的数组
  // const [selectedIds, setSelectedIds] = useState([]) // 选中的数组id
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useState({ page: 1, effectState: '1' }) // 分页请求参数
  const [page, setPage] = useState('1')
  const [colorFlag, setColorFlag] = useState(false)
  // const editType = sessionStorage.getItem('editType')
  // 操作留存项state的统一调用的函数
  // selectedRowsList 操作勾选的时候 产生的二维数组
  const setKeepFun = useCallback((selectedRowsList, selectedRowKeys) => {
    // 勾选的二维数组扁平化
    selectedRowsList = mapRows(selectedRowsList)
    const uniqueItems = unique([...keepList, ...selectedRowsList], 'componentId')
    // selectedRowsList 选中的
    // uniqueItems 去重后的留存项
    if (selectedRowKeys) {
      let filterItem = selectedRowKeys.map(item => {
        return uniqueItems.filter(key => {
          return key.componentId === item
        })
      })
      filterItem = mapRows(filterItem)
      setKeepList(filterItem)
    } else {
      setKeepList([])
    }
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
    if (props.visible) {
      const partKeepList = props.partsList
      const ids = partKeepList && partKeepList.length > 0 && partKeepList.map(item => {
        return item.componentId
      })
      if (ids) {
        setSelectedRowKeys(ids)
      }
      setKeepList(partKeepList)
    }
  }, [props.visible, props.partsList])

  useEffect(() => {
    if (props.visible) {
      requestList()
    }
  }, [requestList, props.visible])

  useEffect(() => {
    if (props.visible) {
      setVisible(props.visible)
    }
  }, [props.visible])

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
  useEffect(() => {
    keepList.length > 0 ? setIsShowKeep(true) : setIsShowKeep(false)
  }, [keepList])

  const tableColumns = [
    {
      title: '零件名称',
      dataIndex: 'componentName',
      key: 'componentName',
      width: '150px'
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
      render: (index) => <span>{statusList[index]}</span>, //    0-未生效 1-已生效 2-已失效
      width: '150px'
    }
  ]

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
    console.log(selectedRows)
  }

  // 清除留存
  const clearKeep = () => {
    // 'open' 窗口依然打开
    props.close([], 'open')
    setKeepFun([], [])
    setSelectedRowKeys([])
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
  // const formDelete = () => {
  //   if (selectedRowKeys.length === 0) {
  //     Modal.warning({
  //       title: '提醒',
  //       content: '请选择需要删除的零件'
  //     })
  //   } else {
  //     isDelectParts(selectedRowKeys.join(','))
  //   }
  // }

  // 检测删除
  // const isDelectParts = async(selectedIds) => {
  //   const res = await is_delect_parts({ componentIds: selectedIds })
  //   const msg = res.data.responseData.msg
  //   const result = res.data.responseData.result
  //   // 可以删除
  //   if (result) {
  //     Modal.confirm({
  //       title: '删除零件',
  //       content: '删除后将无法进行恢复， 是否确认删除？',
  //       cancelText: '取消',
  //       okText: '确定',
  //       onOk: () => {
  //         delectParts(selectedIds)
  //       }
  //     })
  //   } else {
  //     // 不可以删除
  //     Modal.warning({
  //       title: '提醒',
  //       content: msg
  //     })
  //   }
  // }

  // const delectParts = async(selectedIds) => {
  //   const res = await delect_parts({ componentIds: selectedIds })
  //   const msg = res.data.responseData.msg
  //   const result = res.data.responseData.result
  //   // 可以删除
  //   if (result) {
  //     Modal.success({
  //       title: '成功',
  //       content: '删除成功',
  //       onOk: () => {
  //         resetFields()
  //         selectedIds = selectedIds.split(',') // 同时删除留存项里面的数据
  //         const arr = []
  //         for (let i = 0; i < selectedIds.length; i++) {
  //           for (let j = 0; j < keepList.length; j++) {
  //             if (keepList.length > 0 && Number(keepList[j].componentId) !== Number(selectedIds[i])) {
  //               arr.push(keepList[j])
  //             }
  //           }
  //         }
  //         setKeepFun(arr)
  //       }
  //     })
  //   } else {
  //     // 不可以删除
  //     Modal.warning({
  //       title: '提醒',
  //       content: msg
  //     })
  //   }
  // }

  // 查询表单
  const handleFilterSubmit = (filterParams) => {
    filterParams.componentName = filterParams.componentName.replace(/\s*/g, '')
    filterParams.purpose = filterParams.purpose.replace(/\s*/g, '')
    setParams({
      ...params,
      ...filterParams
    })
  }

  // 重置表格的时候
  const resetFields = () => {
    setParams({
      effectState: '1',
      page: 1
    })
  }

  const paginationOnChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  const onOk = async() => {
    let componentNo
    const id = props.match.params.id
    // 刷新后参数丢失兼容
    if (props.location.params) {
      componentNo = props.location.params.componentNo
    } else {
      componentNo = sessionStorage.getItem('componentNo')
    }
    // 筛选出componentNo
    const componentNoList = keepList.map(item => {
      return item.componentNo
    })
    const params = {
      includeComponents: componentNoList.join(','),
      componentId: id
    }
    // 有id的情况是复制或者修改
    if (id) {
      // 有包含关系无法新增
      const res = await check_component(params)
      const status = res.data.responseData.status
      let msg = res.data.responseData.msg
      if (status === 0) {
        setKeepList(keepList)
        setVisible(false)
        props.close(keepList)
        setParams({
          effectState: '1',
          page: 1
        })
        localStorage.setItem('processKeepList', JSON.stringify(keepList))
        return
      } else if (status === 1) {
        Modal.warning({
          title: '提醒',
          content: msg
        })
        msg = componentNo
      } else if (status === 2) {
        Modal.warning({
          title: '提醒',
          content: '零件直接有包含关系'
        })
        msg = msg.split(',')
      }
      const newList = keepList.map(item => {
        if (msg.includes(String(item.componentNo))) {
          item.containState = 1
        }
        return item
      })
      props.close(newList)
      setColorFlag(true)
    } else {
      // 直接新增 不需要进行包含关系请求判断
      setVisible(false)
      props.close(keepList)
      setColorFlag(true)
      setParams({
        effectState: '1',
        page: 1
      })
      localStorage.setItem('processKeepList', JSON.stringify(keepList))
    }
  }

  const onCancel = () => {
    setVisible(false)
    props.close()
    setParams({
      effectState: '1',
      page: 1
    })
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='keepListModal'
      title='留存'
      centered
      visible={ visible }
      onOk={ onOk }
      onCancel={ onCancel }
      okText='确定'
      cancelText='取消'
      maskClosable={ false }
      width={ 1100 }
    >
      <div className='partsContentModal'>
        <Card bordered={ false } className='searchCard'>
          <BaseForm
            formList={ formList }
            config={ config }
            filterSubmit={ handleFilterSubmit }
            resetFields={ resetFields }
          />
        </Card>
        { isShowKeep &&
          <div className='keepWrap'>
            <p>留存项</p>
            <Row type='flex' align='middle'>
              <Col span={ 18 }>
                {keepList && keepList.length > 0 && keepList.map(item => {
                  return (
                    <Tag color={ item.containState !== 1 ? 'blue' : colorFlag ? 'red' : 'blue' }
                      closable
                      onClose={ () => log(item.componentId) }
                      key={ item.componentId }
                      style={{ marginBottom: 10 }}
                      className={ item.containState !== 1 ? '' : colorFlag && 'anticon-close-red' }
                    >{item.componentName + '-' + item.departmentName + '-' + item.officeName}</Tag>
                  )
                })}
              </Col>
              <Col span={ 6 } style={{ textAlign: 'right' }}>
                <AuthButton onClick={ clearKeep } menu_id={ 21 } style={{ marginRight: 32 }}>清除留存</AuthButton>
              </Col>
            </Row>
          </div>
        }
        <Card bordered={ false } className='searchResult'>
          {/* <Row style={{ marginBottom: 20 }}>
            <Col span={ 18 }>
              {
                <div>
                  <AuthButton onClick={ formDelete } menu_id={ 23 }>删除</AuthButton>
                </div>
              }
            </Col>
          </Row> */}
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
      </div>
    </Modal>
  )
}

export default withRouter(Parts)
