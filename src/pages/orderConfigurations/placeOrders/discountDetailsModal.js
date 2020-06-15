import React, { useState, useEffect, useCallback } from 'react'
import './index.less'
import { Modal, Table } from 'antd'
import { config_discount_list } from '../../../services/api'

function DiscountsDetailModal(props) {
  const [tableData, setTableData] = useState([]) // list数据
  const [visible, setVisible] = useState(false)
  const [tableColumns, setTableColumns] = useState([])
  const [serveConfigId, setServeConfigId] = useState() // 是否修改状态
  // const format = 'HH:mm';
  // const dateFormat = 'YYYY/MM/DD';

  // 后端返回的数据
  // const responseData = [
  //   {
  //     dateDiscount: 1,
  //     endDate: "2019-01-02",
  //     startDate: "2019-01-01",
  //     timeData:[
  //       {
  //         discountPrice: 1,
  //         endTime: "21:21:21",
  //         startTime: "20:20:20",
  //         timeDiscount: 1,
  //       },
  //       {
  //         discountPrice: 2,
  //         endTime: "21:21:21",
  //         startTime: "20:20:20",
  //         timeDiscount: 2,
  //       },
  //       {
  //         discountPrice: 3,
  //         endTime: "21:21:21",
  //         startTime: "20:20:20",
  //         timeDiscount: 3,
  //       }
  //     ]
  //   },
  //   {
  //     dateDiscount: 1,
  //     endDate: "1111-11-11",
  //     startDate: "1111-11-11",
  //     timeData:[
  //       {
  //         discountPrice: 0.012,
  //         endTime: "00:00:00",
  //         startTime: "00:00:00",
  //         timeDiscount: 2,
  //       },
  //       {
  //         discountPrice: 0.013,
  //         endTime: "00:00:00",
  //         startTime: "00:00:00",
  //         timeDiscount: 3,
  //       }
  //     ]
  //   }
  // ]

  // 拆分成需要的数据
  // const responseData = [
  //   {
  //     key:0,
  //     date:'1111',
  //     dateDiscount:'0.1',
  //     createTime:'1111-22222',
  //     timeDiscount:'0.222',
  //     discountPrice:'1111',
  //     span:2,
  //   },
  //   {
  //     key:1,
  //     date:'222',
  //     dateDiscount:'0.1',
  //     createTime:'55555-66666',
  //     timeDiscount:'0.3333',
  //     discountPrice:'2222',
  //     span:0,
  //   },
  //   {
  //     key:2,
  //     date:'3333',
  //     dateDiscount:'0.1',
  //     createTime:'77777-88888',
  //     timeDiscount:'0.4444',
  //     discountPrice:'3333',
  //     span:4,
  //   },
  //   {
  //     key:3,
  //     date:'444444',
  //     dateDiscount:'0.1',
  //     createTime:'77777-88888',
  //     timeDiscount:'0.4444',
  //     discountPrice:'3333',
  //     span:0,
  //   },
  //   {
  //     key:4,
  //     date:'55555',
  //     dateDiscount:'0.1',
  //     createTime:'77777-88888',
  //     timeDiscount:'0.4444',
  //     discountPrice:'3333',
  //     span:0,
  //   },
  //   {
  //     key:5,
  //     date:'66666',
  //     dateDiscount:'0.1',
  //     createTime:'77777-88888',
  //     timeDiscount:'0.4444',
  //     discountPrice:'3333',
  //     span:0,
  //   }
  // ]

  const requestList = useCallback(async() => {
    const res = await config_discount_list({ serveConfigId })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    setVisible(true)
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
      width={ 600 }
    >
      <Table columns={ tableColumns } dataSource={ tableData } bordered />
    </Modal>
  )
}

export default DiscountsDetailModal
