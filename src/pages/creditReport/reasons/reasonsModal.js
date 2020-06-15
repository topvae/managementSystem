import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import './index.less'
import BaseForm from '../../../components/Form'
import { formItemLayout, modalConfig } from './formList'
import { add_reason, update_reason } from '../../../services/api'

function ReasonsModal(props) {
  let formRef
  const [visible, setVisible] = useState()
  const [updateList, setUpdateList] = useState({}) // 回显
  const [reasonId, setReasonId] = useState(0) // 是否修改状态
  const [formList, setFormList] = useState([])
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    setFormList([
      {
        type: 'INPUT',
        label: '查询原因编码',
        field: 'reasonNo',
        required: true,
        requiredMsg: '请输入',
        placeholder: '请输入',
        width: 320,
        formItemLayout,
        disabled,
        maxLen: 6,
        validatorFn: (rule, value, callback) => {
          // 开头不能为数字的正则
          const reg = /^[0-9a-zA-Z]{0,6}$/
          if (value.length > 6) {
            callback('不能超过6个字符')
          } else if (!reg.test(value) && value) {
            callback('只能由数字和字母组成')
          } else {
            callback()
          }
        }
      }, {
        type: 'INPUT',
        label: '查询原因',
        field: 'content',
        required: true,
        requiredMsg: '请输入',
        placeholder: '请输入',
        width: 320,
        maxLen: 100,
        formItemLayout,
        disabled
      }, {
        type: 'RADIO',
        label: '是否写入信用报告',
        field: 'isWrite',
        required: true,
        width: 320,
        formItemLayout,
        rules: [{ id: '1', rule: '是' }, { id: '0', rule: '否' }],
        initialValue: '1'
      }
    ])
  }, [disabled])

  useEffect(() => {
    setVisible(props.visible)
    setReasonId(props.reasonId)
  }, [props.visible, props.reasonId])

  useEffect(() => {
    props.reasonId ? setDisabled(true) : setDisabled(false)
  }, [props.reasonId])

  // 如果visible变化 就set回显
  useEffect(() => {
    if (props.reasonId) {
      const record = props.updateList
      setTimeout(() => {
        setUpdateList({
          reasonNo: record.reasonNo,
          content: record.content,
          isWrite: record.isWrite.toString()
        })
      }, 0)
    } else {
      setUpdateList({})
    }
  }, [props.reasonId, visible, props.updateList])

  const onOk = () => {
    formRef.props.form.validateFields(async(err, values) => {
      if (!err) {
        if (!reasonId) {
          await add_reason({ ...values })
          Modal.success({
            title: '提示',
            content: '新增成功',
            onOk: () => { }
          })
        } else {
          await update_reason({ ...values, reasonId })
          Modal.success({
            title: '提示',
            content: '修改成功',
            onOk: () => { }
          })
        }
        setVisible(false)
        props.close(false, 'updata')
      }
    })
  }

  const onCancel = () => {
    setVisible(false)
    props.close(false)
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='rseasonsModal'
      title={ reasonId ? '修改' : '新增' }
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
        formList={ formList }
        updateList={ updateList }
        config={ modalConfig }
      />
    </Modal>
  )
}

export default ReasonsModal
