/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2019-12-16 17:27:48
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect } from 'react'
import './index.less'
import { Modal, Form, Input, Select } from 'antd'
import { formItemLayout, ChangeSelectParams } from './utils'
import { get_options, save_data_use_organization, update_data_use_organization } from '../../../services/api'
import './index.less'

function useOrganizationModal(props) {
  const { Option } = Select
  const { updateList } = props
  const { getFieldDecorator, setFieldsValue } = props.form
  const [visible, setVisible] = useState(false)
  const regEn = /[`~!@¥#$%^&*+<>?:{},/;]/im
  const regCn = /[·！#￥——：；、，|《。》？、【】]/im
  const [sourceOrganizationType, setSourceOrganizationType] = useState([]) // 数据类型options
  const [dataUseOrganizationId, setDataUseOrganizationId] = useState(0) // 是否修改状态    有具体数字: 修改    0 ： 保存
  const [organizationTypeDicId, setOrganizationTypeDicId] = useState(-1)
  // 校验手机号
  const validateMobile = (rule, value, callback) => {
    const mobileReg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (mobileReg.test(value) || !value) {
      callback()
    } else {
      callback('请输入正确的手机号')
    }
  }

  const validateUrl = (rule, value, callback) => {
    const mobileReg = /(ht|f)tp(s?):\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-.?,'/\\+&amp;%$#_]*)?/
    if (mobileReg.test(value) || !value) {
      callback()
    } else {
      callback('请输入正确的地址')
    }
  }

  // 如果visible变化 就set回显
  useEffect(() => {
    if (dataUseOrganizationId) {
      const record = updateList
      setOrganizationTypeDicId(record.organizationTypeDicId)
      setFieldsValue({
        'organizationName': record.organizationName,
        'switchCode': record.switchCode,
        'address': record.address,
        'contactName': record.contactName,
        'contactMobile': record.contactMobile,
        'organizationType': record.organizationTypeDesc,
        'discountRate': JSON.stringify(record.discountRate),
        'warnMobile': record.warnMobile,
        'warnEmail': record.warnEmail,
        'warnUrl': record.warnUrl
      })
    } else {
      setFieldsValue({})
    }
  }, [dataUseOrganizationId, visible, setFieldsValue, updateList])

  useEffect(() => {
    async function fetchData() {
      const sourceOrganizationTypeRes = await get_options({ 'businessIdent': 't_data_use_organization', 'field': 'organization_type_dic_id' })
      const sourceDataTypeResponseData = sourceOrganizationTypeRes.data.responseData
      if (sourceDataTypeResponseData) {
        const sourceOrganizationType = ChangeSelectParams(sourceDataTypeResponseData)
        setSourceOrganizationType(sourceOrganizationType)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setVisible(props.visible)
    setDataUseOrganizationId(props.dataUseOrganizationId)
  }, [props.visible, props.dataUseOrganizationId])

  const closeModal = () => {
    setVisible(false)
    props.close(false)
  }

  const organizationTypeChange = (organizationTypeDicId) => {
    setOrganizationTypeDicId(organizationTypeDicId)
  }

  const onOk = () => {
    props.form.validateFields(async(err, values) => {
      const { warnMobile, warnEmail, warnUrl } = values
      const typeItem = sourceOrganizationType.filter(item => {
        return item.id === Number(organizationTypeDicId)
      })
      if (typeItem.length > 0) {
        values.organizationTypeDesc = typeItem[0].rule
        values.organizationTypeDicId = organizationTypeDicId
      } else {
        values.organizationTypeDicId = ''
        values.organizationTypeDesc = ''
      }
      values.dataSourceTypeDesc = '数据类型描述'
      if (!warnMobile && !warnEmail && !warnUrl) {
        Modal.warn({
          title: '提示',
          content: '预警方式至少填写一个',
          onOk: () => { }
        })
        return
      }

      if (!err) {
        // save
        if (!dataUseOrganizationId) {
          const res = await save_data_use_organization({ ...values })
          Modal.success({
            title: '提示',
            content: res.data.responseMsg,
            onOk: () => { props.close(false, 'updata') }
          })
        } else {
          // updata
          const res = await update_data_use_organization({ ...values, dataUseOrganizationId: dataUseOrganizationId })
          Modal.success({
            title: '提示',
            content: res.data.responseMsg,
            onOk: () => { props.close(false, 'updata') }
          })
        }
        closeModal()
      }
    })
  }

  const onCancel = () => {
    closeModal()
  }

  // input校验特殊字符
  const validateInput = (rule, value, callback) => {
    if (regEn.test(value) || regCn.test(value)) {
      callback('不能包含特殊字符')
    } else {
      callback()
    }
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='useOrganizationModal'
      title='新增机构'
      centered
      visible={ visible }
      onOk={ onOk }
      onCancel={ onCancel }
      okText='确定'
      cancelText='取消'
      maskClosable={ false }
    >
      <Form { ...formItemLayout } className='useOrganizationForm' >
        <h4 className='baseTitle'><span className='blue'></span>基本信息</h4>
        <Form.Item label='机构名称'>
          {getFieldDecorator('organizationName', {
            // initialValue:JSON.stringify(rand),
            rules: [
              {
                required: true,
                message: '请输入机构名称'
              },
              {
                // message: '不能超过20个字',
                // max:20
              },
              {
                validator: validateInput
              }
            ]
          })(
            <Input
              placeholder='请输入'
            />
          )}
        </Form.Item>
        <Form.Item label='机构编码'>
          {getFieldDecorator('switchCode', {
            // initialValue:JSON.stringify(rand),
            rules: [
              {
                required: true,
                message: '请输入机构名称'
              },
              {
                // message: '不能超过20个字',
                // max:20
              },
              {
                validator: validateInput
              }
            ]
          })(
            <Input
              placeholder='请输入'
            />
          )}
        </Form.Item>
        <Form.Item label='通讯地址'>
          {getFieldDecorator('address', {
            // initialValue:'123',
            rules: [
              {
                message: '不能超过80个字',
                max: 80
              },
              {
                validator: validateInput
              }
            ]
          })(
            <Input
              placeholder='请输入'
            />
          )}
        </Form.Item>
        <Form.Item label='联系人'>
          {getFieldDecorator('contactName', {
            // initialValue:'123',
            rules: [
              { required: true, message: '请输入' },
              {
                message: '不能超过20个字',
                max: 20
              },
              {
                validator: validateInput
              }
            ]
          })(
            <Input
              placeholder='请输入'
            />
          )}
        </Form.Item>
        <Form.Item label='手机号'>
          {getFieldDecorator('contactMobile', {
            rules: [
              {
                required: true,
                message: '请输入正确的手机号'
              },
              {
                validator: validateMobile
              }
            ]
          })(
            <Input
              placeholder='请输入'
              type='number'
            />
          )}
        </Form.Item>
        <h4 className='baseTitle'><span className='blue'></span>参数信息</h4>
        <Form.Item label='机构类型'>
          {getFieldDecorator('organizationType', {
            // initialValue:'1',
            rules: [{ required: true, message: '请选择' }]
          })(
            <Select getPopupContainer={ triggerNode => triggerNode.parentNode } onChange={ organizationTypeChange }>
              {
                sourceOrganizationType && sourceOrganizationType.map(item => <Option key={ item.id }>{item.rule}</Option>)
              }
            </Select>
          )}
        </Form.Item>
        <Form.Item label='机构优惠参数'>
          {getFieldDecorator('discountRate', {
            // initialValue:'0.2',
            rules: [
              { required: true, message: '请输入' },
              {
                message: '不能超过20个字',
                max: 20
              },
              {
                validator: validateInput
              }
            ]
          })(
            <Input
              placeholder='请输入'
            />
          )}
        </Form.Item>
        <h4 className='tipFonts'><span className='blue'></span>传送地址<span className='atLeastTip'>（传送地址至少填写一个）</span></h4>
        <Form.Item label='短信地址'>
          {getFieldDecorator('warnMobile', {
            rules: [
              {
                validator: validateMobile
              }
            ]
          })(
            <Input
              placeholder='请输入'
              type='number'
            />
          )}
        </Form.Item>
        <Form.Item label='邮箱地址'>
          {getFieldDecorator('warnEmail', {
            rules: [
              {
                message: '不能超过40个字',
                max: 40
              },
              {
                type: 'email',
                message: '请输入正确的邮箱'
              }
            ]
          })(
            <Input
              placeholder='请输入'
            />
          )}
        </Form.Item>
        <Form.Item label='接口地址'>
          {getFieldDecorator('warnUrl', {
            rules: [
              {
                validator: validateUrl
              }
            ]
          })(
            <Input
              placeholder='请输入'
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create({})(useOrganizationModal)
