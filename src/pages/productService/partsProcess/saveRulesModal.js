/*
 * @Author: your name
 * @Date: 2020-03-10 14:06:14
 * @LastEditTime: 2020-03-10 14:58:08
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/productService/partsProcess/saveRulesModal.js
 */
import React from 'react'
import './index.less'
import { message, Modal } from 'antd'
import BaseForm from '../../../components/Form'
import { add_rule } from '../../../services/api'
import { ruleSaveConfig, ruleSaveFormList } from './ruleModalConfig'
class SaveRuleModal extends React.Component {
  state = {
    saveRuleVisible: false,
    content: '',
    componentContentType: null
  }

  componentDidMount() {
    const { saveRuleVisible, componentContentType, content } = this.props
    this.setState({
      saveRuleVisible,
      componentContentType,
      content
    })
  }

  componentWillReceiveProps(nextProps) {
    const { saveRuleVisible, content } = nextProps
    if (saveRuleVisible !== this.state.saveRuleVisible) {
      this.setState({
        saveRuleVisible
      })
    }
    this.setState({
      content
    })
  }

  saveRuleFn = () => {
    this.setState({
      saveRuleVisible: true
    })
  }

  onOk = () => {
    const { content, componentContentType } = this.state
    this.formRef.props.form.validateFields(async(err, values) => {
      if (!err) {
        this.setState({
          saveRuleVisible: false
        })
        this.props.close(false)
        const fieldsValue = this.formRef.props.form.getFieldsValue()
        fieldsValue.componentContentType = componentContentType
        fieldsValue.content = content
        const res = await add_rule(fieldsValue)
        const responseMsg = res.data.responseMsg
        const responseCode = res.data.responseCode
        if (responseCode === 0) {
          message.success('操作成功', 1)
        } else {
          Modal.warning({
            title: '提示',
            content: responseMsg
          })
        }
      }
    })
  }

  onCancel = () => {
    this.setState({
      saveRuleVisible: false
    })
    this.props.close(false)
  }

  render() {
    const { saveRuleVisible } = this.state
    return (
      <Modal
        title='规则保存'
        centered
        destroyOnClose={ true }
        visible={ saveRuleVisible }
        onOk={ this.onOk }
        onCancel={ this.onCancel }
        okText='确定'
        cancelText='取消'
        maskClosable={ false }
      >
        <BaseForm
          wrappedComponentRef={ (inst) => (this.formRef = inst) }
          formList={ ruleSaveFormList }
          config={ ruleSaveConfig }
        />
      </Modal>
    )
  }
}

export default SaveRuleModal
