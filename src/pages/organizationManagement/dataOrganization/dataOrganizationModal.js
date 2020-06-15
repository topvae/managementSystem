/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2019-12-30 11:50:20
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { formItemLayout, ChangeSelectParams } from './utils'
import { get_options, source_save, source_updata } from '../../../services/api'
import './index.less'

function DataOrganizationModal(props) {
  const regEn = /[~!@¥#$%^&*+<>?:{},/;]/im
  const regCn = /[·！#￥——：；、，|《。》？、【】]/im
  const { Option } = Select
  const { getFieldDecorator, setFieldsValue } = props.form
  const { updateList } = props
  const [visible, setVisible] = useState(false)
  const [priorityRules, setPriorityRules] = useState([])
  const [sourceId, setSourceId] = useState(0) // 是否修改状态    有具体数字: 修改    0 ： 保存
  const [sourceDataType, setSourceDataType] = useState([]) // 数据类型
  const [sourcePriorityDicId, setSourcePriorityDicId] = useState(-1)
  const [dataSourceTypeDicId, setDataSourceTypeDicId] = useState(-1)
  // 校验手机号
  const validateMobile = (rule, value, callback) => {
    const mobileReg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (mobileReg.test(value) || !value) {
      callback()
    } else {
      callback('请输入正确的手机号')
    }
  }

  const validateUrl = (rule, value, callback, type) => {
    let mobileReg = ''
    let tip = ''
    if (type === 'url') {
      mobileReg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      tip = '请以https或http开头'
    } else if (type === 'ftp') {
      mobileReg = /(ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      tip = '请以ftp开头'
    }
    if (mobileReg.test(value) || !value) {
      callback()
    } else {
      callback(tip)
    }
  }

  // 如果visible变化 就set回显
  useEffect(() => {
    if (sourceId) {
      const record = updateList
      setDataSourceTypeDicId(record.dataSourceTypeDicId)
      setSourcePriorityDicId(record.sourcePriorityDicId)
      setFieldsValue({
        address: record.address,
        contactName: record.contactName,
        dataSourceTypeDicId: record.dataSourceTypeDesc,
        email: record.email,
        fileUrl: record.fileUrl,
        fixedTelephone: record.fixedTelephone,
        mobile: record.mobile,
        sourceName: record.sourceName,
        sourcePriorityDicId: record.sourcePriorityDesc,
        switchCode: record.switchCode,
        url: record.url
      })
    } else {
      setFieldsValue({})
    }
  }, [sourceId, visible, setFieldsValue, updateList])

  // 请求下拉内容
  useEffect(() => {
    async function fetchData() {
      const setPriorityRulesRes = await get_options({ 'businessIdent': 't_source', 'field': 'source_priority_dic_id' })
      const setPriorityRulesResponseData = setPriorityRulesRes.data.responseData
      if (setPriorityRulesResponseData) {
        const priorityRules = ChangeSelectParams(setPriorityRulesResponseData)
        setPriorityRules(priorityRules)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setVisible(props.visible)
    setSourceId(props.sourceId)
    setSourceDataType(props.sourceDataType)
  }, [props.visible, props.sourceId, props.sourceDataType])

  const closeModal = () => {
    setVisible(false)
    props.close(false)
  }

  const sourcePriorityChange = (sourcePriorityDicId) => {
    setSourcePriorityDicId(sourcePriorityDicId)
  }

  const dataSourceTypeChange = (dataSourceTypeDicId) => {
    setDataSourceTypeDicId(dataSourceTypeDicId)
  }

  const onOk = () => {
    props.form.validateFields(async(err, values) => {
      const { mobile, fixedTelephone, email, url, fileUrl } = values
      const typeItem = priorityRules.filter(item => {
        return item.id === Number(sourcePriorityDicId)
      })
      if (typeItem.length > 0) {
        values.sourcePriorityDesc = typeItem[0].rule
        values.sourcePriorityDicId = sourcePriorityDicId
      } else {
        values.sourcePriorityDicId = ''
        values.sourcePriorityDesc = ''
      }
      const sourceDataTypeItem = sourceDataType.filter(item => {
        return item.id === Number(dataSourceTypeDicId)
      })
      if (sourceDataTypeItem.length > 0) {
        values.dataSourceTypeDesc = sourceDataTypeItem[0].rule
        values.dataSourceTypeDicId = dataSourceTypeDicId
      } else {
        values.dataSourceTypeDicId = ''
      }
      if (!mobile && !fixedTelephone && !email) {
        Modal.warn({
          title: '提示',
          content: '联系方式至少填写一个',
          onOk: () => { }
        })
        return
      }
      if (!url && !fileUrl) {
        Modal.warn({
          title: '提示',
          content: '对接地址至少填写一个',
          onOk: () => { }
        })
        return
      }
      if (!err) {
        // save
        if (!sourceId) {
          const res = await source_save({ ...values })
          Modal.success({
            title: '提示',
            content: res.data.responseMsg,
            onOk: () => { props.close(false, 'updata') }
          })
        } else {
          // updata
          const res = await source_updata({ ...values, sourceId: sourceId })
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
      title='机构'
      centered
      visible={ visible }
      onOk={ onOk }
      onCancel={ onCancel }
      okText='确定'
      cancelText='取消'
      maskClosable={ false }
    >
      <Form { ...formItemLayout } className='parameter' >
        <h4 className='baseTitle'><span className='blue'></span>基本信息</h4>
        <Form.Item label='机构名称'>
          {getFieldDecorator('sourceName', {
            rules: [
              {
                required: true,
                message: '请输入机构名称'
              },
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
        <Form.Item label='机构编码'>
          {getFieldDecorator('switchCode', {
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
        <Form.Item label='通信地址'>
          {getFieldDecorator('address', {
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
        <h4 className='atLeastTip'><span className='blue'></span>（联系方式至少填写一个）</h4>
        <Form.Item label='手机号'>
          {getFieldDecorator('mobile', {
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
        <Form.Item label='固定电话'>
          {getFieldDecorator('fixedTelephone', {
            rules: [
              {
                message: '不能超过20个字',
                max: 20
              }
            ]
          })(
            <Input
              placeholder='请输入'
              type='number'
            />
          )}
        </Form.Item>
        <Form.Item label='邮箱'>
          {getFieldDecorator('email', {
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
        <h4 className='baseTitle'><span className='blue'></span>参数信息</h4>
        <Form.Item label='数据类型'>
          {getFieldDecorator('dataSourceTypeDicId', {
            rules: [
              { required: true, message: '请输入' }
            ], sourceDataType
          })(
            <Select getPopupContainer={ triggerNode => triggerNode.parentNode } onChange={ dataSourceTypeChange }>
              {
                sourceDataType && sourceDataType.map(item => <Option key={ item.id }>{item.rule}</Option>)
              }
            </Select>
          )}
        </Form.Item>
        <Form.Item label='采集优先级' className='gather'>
          {getFieldDecorator('sourcePriorityDicId', {
            rules: [{ required: true, message: '请选择' }]
          })(
            <Select getPopupContainer={ triggerNode => triggerNode.parentNode } onChange={ sourcePriorityChange }>
              {
                priorityRules && priorityRules.map(item => <Option key={ item.id }>{item.rule}</Option>)
              }
            </Select>
          )}
        </Form.Item>
        <h4 className='atLeastTip'><span className='blue'></span>（对接地址至少填写一个）</h4>
        <p className='tipFonts'>对接方式：接口</p>
        <Form.Item label='接口地址'>
          {getFieldDecorator('url', {
            rules: [
              {
                validator: (rule, value, callback, type) => validateUrl(rule, value, callback, 'url')
              }
            ]
          })(
            <Input
              placeholder='请输入'
            />
          )}
        </Form.Item>
        <p className='tipFonts'>对接方式：文件</p>
        <Form.Item label='文件采集地址'>
          {getFieldDecorator('fileUrl', {
            rules: [
              {
                validator: (rule, value, callback, type) => validateUrl(rule, value, callback, 'ftp')
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

export default Form.create({})(DataOrganizationModal)
