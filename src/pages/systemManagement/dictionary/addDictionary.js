import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import './index.less'
import BaseForm from '../../../components/Form'
import { modalConfig, formItemLayout } from './formList'
import { add_sys_dic, update_sys_dic } from '../../../services/api'
function AddDictionary(props) {
  let formRef
  const [visible, setVisible] = useState()
  const [updateList, setUpdateList] = useState({}) // 回显
  const [dicId, setDicId] = useState(0) // 是否修改状态
  const [editDiction, setEditDiction] = useState(false)
  const [formList, setFormList] = useState([])

  useEffect(() => {
    setFormList([
      {
        type: 'INPUT',
        label: '业务标识',
        field: 'businessIdent',
        required: true,
        requiredMsg: '请输入业务标识',
        placeholder: '请输入业务标识',
        width: 260,
        disabled: editDiction,
        formItemLayout
      }, {
        type: 'INPUT',
        label: '字段',
        field: 'field',
        required: true,
        requiredMsg: '请输入字段',
        placeholder: '请输入字段',
        width: 260,
        maxLen: 100,
        disabled: editDiction,
        formItemLayout
      }, {
        type: 'INPUT',
        label: '值',
        field: 'dicvalue',
        required: true,
        requiredMsg: '请输入值',
        placeholder: '请输入值',
        disabled: editDiction,
        width: 260,
        formItemLayout
      }, {
        type: 'INPUT',
        label: '名称',
        field: 'name',
        required: true,
        requiredMsg: '请输入名称',
        placeholder: '请输入名称',
        width: 260,
        formItemLayout
      }, {
        type: 'TEXTAREA',
        label: '备注',
        field: 'remarks',
        placeholder: '请输入',
        width: 260,
        formItemLayout
      }
    ])
  }, [editDiction])

  useEffect(() => {
    setVisible(props.visible)
    setDicId(props.dicId)
    setEditDiction(props.editDiction)
  }, [props.visible, props.formListModal, props.othersRules, props.dicId, props.editDiction])

  // 如果visible变化 就set回显
  useEffect(() => {
    if (dicId) {
      const record = props.updateList
      setTimeout(() => {
        setUpdateList({
          dicvalue: record.dicvalue,
          // dicId: record.dicId,
          businessIdent: record.businessIdent,
          field: record.field,
          name: record.name,
          remarks: record.remarks
        })
      }, 0)
    } else {
      setUpdateList({})
    }
  }, [dicId, visible, props.updateList])

  const onOk = () => {
    formRef.props.form.validateFields(async(err, values) => {
      if (!err) {
        const parameterFieldsValue = formRef.props.form.getFieldsValue()
        parameterFieldsValue.businessIdent = parameterFieldsValue.businessIdent.toLowerCase()
        parameterFieldsValue.field = parameterFieldsValue.field.toLowerCase()
        if (typeof (parameterFieldsValue.dicvalue) === 'string') { // 不是数字专成小写
          parameterFieldsValue.dicvalue = parameterFieldsValue.dicvalue.toLowerCase()
        }
        if (!dicId) {
          await add_sys_dic({ ...parameterFieldsValue })
          Modal.success({
            title: '提示',
            content: '新增成功',
            onOk: () => { }
          })
        } else {
          await update_sys_dic({ ...parameterFieldsValue, dicId: dicId })
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
      className='addDictionary'
      title={ dicId ? '修改字典' : '新增字典' }
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

export default AddDictionary
