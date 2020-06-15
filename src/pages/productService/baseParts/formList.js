import React from 'react'
import { Tooltip } from 'antd'

export const formList = [
  {
    type: 'INPUT',
    label: '原子零件名称',
    field: 'componentName',
    placeholder: '请输入零件名称',
    requiredMsg: '请输入零件名称',
    width: 180
  }, {
    type: 'SELECT',
    label: '一级分类',
    field: 'officeId',
    placeholder: '请输入一级名称',
    width: 180,
    searchType: 1,
    officeType: 0
  }, {
    type: 'SELECT',
    label: '二级分类',
    field: 'departmentId',
    placeholder: '请输入二级名称',
    width: 180,
    searchType: 2,
    officeType: 0,
    noAffect: true // 设置了以后不受一级名称影响  可以单独搜索
  }
]

export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  handleMenuId: 14, // 权限控制
  resetMenuId: 15 // 权限控制
}

export const tableColumns = [
  {
    title: '一级分类',
    dataIndex: 'officeName',
    key: 'officeName'
  },
  {
    title: '一级分类编码',
    dataIndex: 'officeSwichCode',
    key: 'officeSwichCode'
  },
  {
    title: '二级分类',
    dataIndex: 'departmentName',
    key: 'departmentName'
  },
  {
    title: '二级分类编码',
    dataIndex: 'departmentSwichCode',
    key: 'departmentSwichCode'
  },
  {
    title: '零件名称',
    dataIndex: 'componentName',
    key: 'componentName'
  },
  {
    title: '零件编码',
    dataIndex: 'swichCode',
    key: 'swichCode'
  },
  {
    title: '零件用途',
    dataIndex: 'purpose',
    key: 'purpose',
    // width: '300px',
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
    title: '零件描述',
    dataIndex: 'remark',
    key: 'remark',
    // width: '300px',
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
    title: '数据类型',
    dataIndex: 'componentFieldTypeName',
    key: 'componentFieldTypeName'
  },
  {
    title: '数据长度',
    dataIndex: 'componentFieldLength',
    key: 'componentFieldLength'
  },
  {
    title: '数据提供机构名称',
    dataIndex: 'sourceName',
    key: 'sourceName'
  },
  {
    title: '数据提供机构编码',
    dataIndex: 'sourceSwichCode',
    key: 'sourceSwichCode'
  },
  {
    title: '导入时间',
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
    }
  }
]
