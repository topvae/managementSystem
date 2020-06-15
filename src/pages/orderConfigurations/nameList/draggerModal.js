/*
 * @Author: your name
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2020-03-10 16:11:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/orderConfiguration/nameList/draggerModal.js
 */
import React, { useState, useEffect } from 'react'
import { Modal, Upload, Icon, Button } from 'antd'
import { file_template } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

function DraggerModal(props) {
  const { Dragger } = Upload
  const [visible, setVisible] = useState(false)
  const [record, setRecord] = useState({}) // 修改选中的那一行
  const [creditSubjectListId, setCreditSubjectListId] = useState({})
  const draggerProps = {
    name: 'file',
    multiple: true,
    action: '/api/credit-serve/serve/creditSubjectList/importFile',
    data: {
      creditSubjectListId
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        const responseCode = info.file.response.responseCode
        const responseMsg = info.file.response.responseMsg
        if (responseCode === 0) {
          Modal.success({
            title: '成功',
            content: responseMsg
          })
        } else {
          Modal.warning({
            title: '提示',
            content: responseMsg
          })
        }
      } else if (status === 'error') {
        Modal.warning({
          title: '错误',
          content: `${ info.file.name } 上传失败 `
        })
      }
    }
  }

  useEffect(() => {
    setVisible(props.visible)
    setRecord(props.record)
    setCreditSubjectListId(props.record.creditSubjectListId)
  }, [props.visible, props.record])

  const download = () => {
    window.location.href = `${ file_template }?organizationName=${ record.officeName }&listName=${ record.listName }`
  }

  const onCancel = () => {
    setVisible(false)
    props.close(false)
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='nameListModal'
      title='导入文件'
      centered
      visible={ visible }
      onCancel={ onCancel }
      footer={ null }
      maskClosable={ false }
    >
      <Dragger { ...draggerProps }>
        <p className='ant-upload-drag-icon'>
          <Icon type='inbox' />
        </p>
        <p className='ant-upload-text'>点击或将文件拖拽到这里上传</p>
        <p className='ant-upload-hint'>
          文件名规范：M代表修改，A代表新增，D代表删除 示例：机构名称_名单名称-2019/08/19 18:28:30-M.xlsx
        </p>
      </Dragger>
      <AuthButton type='like' style={{ padding: 0 }} menu_id={ 121 } className='like_a' onClick={ download }>下载模板文件</AuthButton>
    </Modal>

  )
}

export default DraggerModal
