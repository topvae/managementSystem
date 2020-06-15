import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import './index.less'
import BaseForm from '../../../components/Form'
import { modalConfig, formItemLayout } from './formList'
import { save_credit_subject } from '../../../services/api'
function AddNameListModal(props) {
  let formRef
  const [visible, setVisible] = useState(false)
  const [updateList, setUpdateList] = useState({}) // 回显
  const [creditSubjectListId, setCreditSubjectListId] = useState(0) // 是否修改状态
  const [formListModal, setFormListModal] = useState([])

  useEffect(() => {
    setFormListModal([
      {
        type: 'INPUT',
        label: '名单名称',
        field: 'listName',
        placeholder: '请输入业务标识',
        width: 260,
        formItemLayout,
        requiredMsg: '请输入',
        required: true
      }, {
        type: 'SELECT_OPTIONS',
        label: '选择机构:',
        field: 'dataUseOrganizationId',
        width: 260,
        rules: props.options,
        formItemLayout,
        initialValue: props.options.length > 0 ? '' : '参数错误',
        requiredMsg: '请选择',
        required: true
      }, {
        type: 'SELECT_OPTIONS',
        label: '选择信用主体:',
        field: 'creditType',
        width: 260,
        formItemLayout,
        rules: props.serveCreditOption,
        initialValue: props.serveCreditOption.length > 0 ? '' : '参数错误',
        requiredMsg: '请选择',
        required: true
      }
    ])
    setVisible(props.visible)
    setCreditSubjectListId(props.creditSubjectListId)
  }, [props.visible, props.creditSubjectListId, props.serveCreditOption, props.options])

  // 如果visible变化 就set回显
  useEffect(() => {
    if (creditSubjectListId) {
      const record = props.updateList
      setTimeout(() => {
        setUpdateList({
          listName: record.listName,
          dataUseOrganizationId: record.dataUseOrganizationId,
          creditType: record.creditType
        })
      }, 0)
    } else {
      setUpdateList({})
    }
  }, [creditSubjectListId, visible, props.updateList])

  const onOk = () => {
    formRef.props.form.validateFields(async(err, values) => {
      if (!err) {
        const parameterFieldsValue = formRef.props.form.getFieldsValue()
        const isNumber = isNaN(parameterFieldsValue.listName.substr(0, 1))
        if (!isNumber) {
          Modal.warning({
            title: '提示',
            content: '首字母不能是数字',
            onOk: () => { }
          })
          return
        }
        if (!creditSubjectListId) {
          await save_credit_subject({ ...parameterFieldsValue })
          Modal.success({
            title: '提示',
            content: '新增成功',
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
      className='nameListModal'
      title='新增名单'
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
        formList={ formListModal }
        config={ modalConfig }
        updateList={ updateList }
      />
    </Modal>
  )
}

export default AddNameListModal
