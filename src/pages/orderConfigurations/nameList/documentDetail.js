import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Icon, Button } from 'antd'
import BaseTable from '../../../components/Table/BaseTable'
import { file_list } from '../../../services/api'

function DocumentDetail(props) {
  const [visible, setVisible] = useState(false)
  const [tableColumns, setTableColumns] = useState([])
  const [tableData, setTableData] = useState([]) // list数据
  const [responseData, setResponseData] = useState([])
  const [creditSubjectListId, setCreditSubjectListId] = useState(0)

  const requestList = useCallback(async(page) => {
    const res = await file_list({ creditSubjectListId, page })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    const tableData = responseData.map((item, index) => {
      item.key = index
      return item
    })
    setTableData(tableData)
    setResponseData(responseData)
  }, [creditSubjectListId])

  useEffect(() => {
    setTableColumns([
      {
        title: '文件名',
        width: 280,
        dataIndex: 'fileName',
        key: 'fileName',
        // eslint-disable-next-line react/display-name
        render: (text, record) => {
          return (<div className='documentRecord'>
            <Button type='link' style={{ padding: 0 }}>{ text } </Button>
            <Icon className='downloadIcon' type='download' onClick={ () => { window.location.href = record.url } } />
          </div>)
        }
      },
      {
        title: '文件操作类型',
        width: 220,
        dataIndex: 'fileOperateType',
        key: 'fileOperateType',
        render: (text) => {
          switch (text) {
            case 0:
              return '新建'
            case 1:
              return '修改'
            case 2:
              return '删除'
            default:
              return ''
          }
        }
      },
      {
        title: '信用主体类型',
        dataIndex: 'creditTypeName',
        width: 220,
        key: 'creditTypeName'
        // render: (text) => {
        //   switch (text) {
        //     case 0:
        //       return '个人'
        //     case 1:
        //       return '企业'
        //     default:
        //       return ''
        //   }
        // }
      },
      {
        title: '信用主体数',
        width: 180,
        dataIndex: 'creditNumber',
        key: 'creditNumber'
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 380,
        render: (record) => {
          if (JSON.stringify(record).indexOf('T') !== -1) {
            return <span>{record.replace('T', ' ')}</span>
          } else {
            return <span>{record}</span>
          }
        }
      },
      {
        title: '导入人',
        width: 180,
        dataIndex: 'userName',
        key: 'userName'
      }
    ])
  }, [])

  useEffect(() => {
    setVisible(props.visible)
    setCreditSubjectListId(props.creditSubjectListId)
  }, [props.visible, props.creditSubjectListId])

  useEffect(() => {
    if (visible && creditSubjectListId && creditSubjectListId !== 0) {
      requestList()
    }
  }, [visible, creditSubjectListId, requestList])

  const onCancel = () => {
    setVisible(false)
    props.close(false)
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='documentDetail'
      title='查看文件名称'
      centered
      visible={ visible }
      onCancel={ onCancel }
      footer={ null }
      maskClosable={ false }
      width={ '900px' }
    >
      <BaseTable
        hidePagination={ true }
        rowKeyType='creditSubjectFileLogId'
        data={ responseData } // 所有数据
        dataSource={ tableData } // list数据
        columns={ tableColumns }
        request={ requestList }
        scroll={{ x: 900, y: 400 }}
      />
    </Modal>

  )
}

export default DocumentDetail
