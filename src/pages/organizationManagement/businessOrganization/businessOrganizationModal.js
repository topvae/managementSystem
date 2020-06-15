import React, { useState, useEffect } from 'react'
import './index.less'
import { Modal } from 'antd'
import BaseForm from '../../../components/Form'
import { modalConfig, formItemLayout } from './utils'
import { office_save, office_update } from '../../../services/api'
function ManagementModal(props) {
  let formRef
  const [visible, setVisible] = useState()
  const [formListModal, setFormListModal] = useState([])
  const [othersRules, setOthersRules] = useState([])
  const [updateList, setUpdateList] = useState([]) // 回显
  const [editId, setEditId] = useState(false) // 是否修改状态
  const [officeBusinessTypeDicId, setOfficeBusinessTypeDicId] = useState(-1)
  useEffect(() => {
    setVisible(props.visible)
    setOthersRules(props.othersRules)
    setEditId(props.editId)
    setFormListModal([
      {
        type: 'INPUT',
        label: '业务发生机构',
        field: 'officeName',
        placeholder: '请输入',
        formItemLayout: formItemLayout,
        width: 260,
        required: true,
        requiredMsg: '请输入业务发生机构',
        validatorType: 'firstClassOfficeName'
      }, {
        type: 'INPUT',
        label: '机构编码',
        field: 'swichCode',
        placeholder: '请输入',
        formItemLayout: formItemLayout,
        width: 260,
        required: true,
        requiredMsg: '请输入机构编码'
      }, {
        type: 'SELECT_OPTIONS',
        label: '业务类型:',
        field: 'officeBusinessTypeDicId',
        width: 260,
        formItemLayout: formItemLayout,
        rules: [{ id: '-1', rule: '请选择业务类型' }, ...othersRules],
        initialValue: '-1'
      }, {
        type: 'INPUT',
        label: '联系人',
        width: 260,
        field: 'contackName',
        placeholder: '请输入',
        formItemLayout: formItemLayout
      }, {
        type: 'INPUT',
        label: '手机号',
        field: 'mobile',
        validatorType: 'mobile',
        formItemLayout: formItemLayout,
        placeholder: '请输入',
        width: 260
      }, {
        type: 'INPUT',
        label: '固定电话',
        placeholder: '请输入',
        field: 'fixTelephone',
        validatorType: 'fixTelephone',
        formItemLayout: formItemLayout,
        width: 260
      }, {
        type: 'INPUT',
        label: '邮箱',
        field: 'email',
        validatorType: 'email',
        placeholder: '请输入',
        formItemLayout: formItemLayout,
        width: 260,
        typeRequired: {
          type: 'email',
          message: '请输入正确的邮箱'
        }
      }
    ])
  }, [props.visible, props.othersRules, props.editId, othersRules, props.updateList])

  // 如果visible变化 就set回显
  useEffect(() => {
    if (editId) {
      const record = props.updateList
      const officeBusinessTypeDesc = record.officeBusinessTypeDesc ? record.officeBusinessTypeDesc : '请选择业务类型'
      setOfficeBusinessTypeDicId(record.officeBusinessTypeDicId)
      setTimeout(() => {
        setUpdateList({
          officeName: record.officeName ? record.officeName : '',
          swichCode: record.swichCode ? record.swichCode : '',
          officeBusinessTypeDicId: officeBusinessTypeDesc,
          contackName: record.contackName ? record.contackName : '',
          mobile: record.mobile ? record.mobile : '',
          fixTelephone: record.fixTelephone ? record.fixTelephone : '',
          email: record.email ? record.email : ''
        })
      }, 0)
    } else {
      setUpdateList({})
    }
  }, [editId, visible, props.updateList])

  const handleChange = (officeBusinessTypeDicId) => {
    setOfficeBusinessTypeDicId(officeBusinessTypeDicId)
  }

  const onOk = () => {
    formRef.props.form.validateFields(async(err, values) => {
      console.log(values)
      if (!err) {
        const typeItem = othersRules.filter(item => {
          return item.id === Number(officeBusinessTypeDicId)
        })
        if (typeItem.length > 0) {
          values.officeBusinessTypeDesc = typeItem[0].rule
          values.officeBusinessTypeDicId = officeBusinessTypeDicId
        } else {
          values.officeBusinessTypeDicId = ''
          values.officeBusinessTypeDesc = ''
        }
        values.type = 0
        if (!editId) {
          const res = await office_save({ ...values })
          Modal.success({
            title: '提示',
            content: res.data.responseMsg,
            onOk: () => { }
          })
        } else {
          const res = await office_update({ ...values, officeId: editId })
          Modal.success({
            title: '提示',
            content: res.data.responseMsg,
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
      className='businessOrganizationModal'
      title='机构'
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
        handleChange={ handleChange }
        config={ modalConfig }
        updateList={ updateList }
      />
    </Modal>
  )
}

export default ManagementModal
