import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import './index.less'
import BaseForm from '../../../components/Form'
import { modalConfig, formItemLayout } from './formList'
import { add_sys_content, update_sys_content } from '../../../services/api'
function AddContent(props) {
  let formRef
  const [visible, setVisible] = useState()
  const [updateList, setUpdateList] = useState({}) // 回显
  const [ConId, setConId] = useState(0) // 是否修改状态
  const [editDiction, setEditDiction] = useState(false)
  const [formList, setFormList] = useState([])

  useEffect(() => {
    setFormList([
      {
        type: 'INPUT',
        label: '业务索引名称',
        field: 'name',
        required: true,
        requiredMsg: '请输入业务索引名称',
        placeholder: '请输入业务索引名称',
        width: 260,
        disabled: editDiction,
        formItemLayout
      }, {
        type: 'INPUT',
        label: '业务索引代码',
        field: 'code',
        required: true,
        requiredMsg: '请输入业务索引代码',
        placeholder: '请输入业务索引代码',
        width: 260,
        maxLen: 100,
        disabled: editDiction,
        formItemLayout
      }, {
        type: 'TEXTAREA',
        label: '内容',
        field: 'value',
        placeholder: '请输入',
        width: 260,
        formItemLayout,
        textNumber: 2000
      }
    ])
  }, [editDiction])

  useEffect(() => {
    setVisible(props.visible)
    setConId(props.ConId)
    setEditDiction(props.editDiction)
  }, [props.visible, props.formListModal, props.othersRules, props.ConId, props.editDiction])

  // 如果visible变化 就set回显
  useEffect(() => {
    if (ConId) {
      const record = props.updateList
      setTimeout(() => {
        setUpdateList({
          name: record.name,
          // id: record.id,
          code: record.code,
          value: record.value
        })
      }, 0)
    } else {
      setUpdateList({})
    }
  }, [ConId, visible, props.updateList])

  const onOk = () => {
    formRef.props.form.validateFields(async(err, values) => {
      if (!err) {
        const parameterFieldsValue = formRef.props.form.getFieldsValue()
        if (!ConId) {
          await add_sys_content({ ...parameterFieldsValue })
          Modal.success({
            title: '提示',
            content: '新增成功',
            onOk: () => { }
          })
        } else {
          await update_sys_content({ ...parameterFieldsValue, id: ConId })
          Modal.success({
            title: '提示',
            content: '修改成功',
            onOk: () => { }
          })
        }
        setVisible(false)
        props.close(false, 'update')
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
      className='addDictionary'
      title={ ConId ? '修改' : '新增' }
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
        config={ modalConfig }
        updateList={ updateList }
      />
    </Modal>
  )
}

export default AddContent
