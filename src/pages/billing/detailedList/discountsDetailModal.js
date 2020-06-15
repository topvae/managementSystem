import React, { useState, useEffect, useCallback } from 'react'
import './index.less'
import { Modal, Table } from 'antd'
import { config_discount_list } from '../../../services/api'

function DiscountsDetailModal(props) {
  const [tableData, setTableData] = useState([]) // list数据
  const [visible, setVisible] = useState(false)
  const [tableColumns, setTableColumns] = useState([])
  const [serveConfigId, setServeConfigId] = useState() // 是否修改状态

  const requestList = useCallback(async(page) => {
    const res = await config_discount_list({ serveConfigId, page })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    let arr = []
    // 将数据拆分
    responseData.map(responseDataItem => {
      const len = responseDataItem.timeData.length
      responseDataItem.timeData.map((timeDataItem, index) => {
        arr = [
          ...arr,
          {
            time: timeDataItem.startTime === '33:33:33' ? '其他时间' : timeDataItem.startTime + '-' + timeDataItem.endTime,
            discountPrice: timeDataItem.discountPrice,
            timeDiscount: timeDataItem.timeDiscount,
            date: responseDataItem.startDate === '1111-11-11' ? '其他日期' : responseDataItem.startDate + '-' + responseDataItem.endDate,
            dateDiscount: responseDataItem.dateDiscount,
            span: index === 0 ? len : 0
          }
        ]
        return arr
      })
      return arr
    })
    const tableData = arr.map((item, index) => {
      item.key = index
      return item
    })
    setTableData(tableData)
  }, [serveConfigId])

  useEffect(() => {
    setVisible(props.visible)
    setServeConfigId(props.serveConfigId)
  }, [props.visible, props.serveConfigId])

  useEffect(() => {
    if (visible && serveConfigId && serveConfigId !== -1) {
      requestList()
    }
  }, [visible, serveConfigId, requestList])

  useEffect(() => {
    setTableColumns([
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: 140,
        render: (value, row, index) => {
          return {
            children: value,
            props: { rowSpan: row.span }
          }
        }
      },
      {
        title: '日期折扣',
        dataIndex: 'dateDiscount',
        key: 'dateDiscount',
        width: 140,
        render: (value, row) => {
          return {
            children: value,
            props: { rowSpan: row.span }
          }
        }
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        width: 140
      },
      {
        title: '时间折扣',
        dataIndex: 'timeDiscount',
        key: 'timeDiscount',
        width: 140
      },
      {
        title: '价格(元)',
        dataIndex: 'discountPrice',
        key: 'discountPrice',
        width: 140
      }
    ])
  }, [])

  const onCancel = () => {
    setVisible(false)
    props.close(false, -1)
    setServeConfigId(-1)
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='discountsDetailModal'
      title='优惠详情'
      centered
      visible={ visible }
      footer={ null }
      onCancel={ onCancel }
      maskClosable={ false }
      width={ 1200 }
    >
      <Table columns={ tableColumns } dataSource={ tableData } bordered pagination={ false } align='center' />
    </Modal>
  )
}

export default DiscountsDetailModal
