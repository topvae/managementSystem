/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2020-03-10 14:57:12
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import { Modal, Tooltip } from 'antd'
import BaseForm from '../../../components/Form'
import BaseTable from '../../../components/Table/BaseTable'
import { intoRuleConfig, intoRuleFormList } from './ruleModalConfig'
import { get_rule_list } from '../../../services/api'
import './index.less'

class IntoRuleModal extends React.Component {
  state = {
    type: '',
    toClearSelectedRowKeys: false, // 是否清空子组件table的选中项
    totalData: {},
    tableData: [],
    intoRuleVisible: false,
    selectedRows: [],
    okText: '导入'
  }

  params = {};

  tableColumns = [
    {
      title: '规则名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: '200px'
    },
    {
      title: '规则内容',
      dataIndex: 'content',
      key: 'content',
      width: '400px',
      // eslint-disable-next-line react/display-name
      render: (record) => {
        return (
          <Tooltip title={ record }>
            <div className='twoEllipsis'>
              {record}
            </div>
          </Tooltip>
        )
      }
    }
  ]

  getRuleList = async(page) => {
    this.params.page = page
    this.params.componentContentType = this.props.componentContentType
    this.params.orderBy = 'create_time'
    const res = await get_rule_list(this.params)
    const responseData = res.data.responseData
    const records = res.data.responseData.records
    this.setState({
      totalData: responseData,
      tableData: records
    })
  }

  componentDidMount() {
    const { intoRuleVisible, content, type } = this.props
    this.getRuleList()
    this.setState({
      intoRuleVisible: intoRuleVisible,
      content
    })
    if (type === 'condition') {
      this.setState({
        type,
        okText: '导入'
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { intoRuleVisible } = nextProps
    if (intoRuleVisible) {
      this.params = {}
      this.getRuleList()
    }
    if (intoRuleVisible !== this.state.intoRuleVisible) {
      this.setState({
        intoRuleVisible: intoRuleVisible
      })
    }
  }

  toClearSelectedRowKeysFn = () => {
    this.setState({
      toClearSelectedRowKeys: true
    }, () => {
      this.setState({
        toClearSelectedRowKeys: false
      })
    })
  }

  selectedItems = (selectedRowKeys, selectedRows, selectedIds) => {
    this.setState({
      selectedRows
    })
  }

  intoRule = () => {
    this.setState({
      intoRuleVisible: true
    })
  }

  intoRuleOnOk = () => {
    const { selectedRows } = this.state
    if (selectedRows && selectedRows.length > 0) {
      const { content } = selectedRows[0]
      // if (type === 'condition') {
      // this.props.close(false, content)
      // } else {
      // this.handleClick(content)
      this.props.close(false, content)
      // }
      this.setState({
        intoRuleVisible: false,
        selectedRows: []
      })
      this.toClearSelectedRowKeysFn()
    } else {
      Modal.warning({
        title: '提示',
        content: '请选择需导入的规则内容'
      })
    }
  }

    intoRuleOnCancel = () => {
      this.setState({
        intoRuleVisible: false,
        selectedRows: []
      })
      this.props.close(false)
      this.toClearSelectedRowKeysFn()
    }

    // 查询表单 从子组件获取查询内容 进行请求
    handleFilterSubmit = (filterParams) => {
      this.params = filterParams
      this.getRuleList()
    };

    // 重置表格的时候
    resetFields = () => {
      this.getRuleList()
    }

    render() {
      const { intoRuleVisible, toClearSelectedRowKeys, okText } = this.state
      return (
        <Modal
          destroyOnClose={ true }
          className='ruleModal'
          title='导入'
          width={ 900 }
          visible={ intoRuleVisible }
          onOk={ this.intoRuleOnOk }
          okText={ okText }
          cancelText='取消'
          maskClosable={ false }
          onCancel={ this.intoRuleOnCancel }
        >
          <BaseForm
            wrappedComponentRef={ (inst) => (this.formRef = inst) }
            formList={ intoRuleFormList }
            config={ intoRuleConfig }
            filterSubmit={ this.handleFilterSubmit }
            resetFields={ this.resetFields }
          />
          <BaseTable
            rowKeyType='templateId'
            data={ this.state.totalData } // 所有数据
            dataSource={ this.state.tableData }
            columns={ this.tableColumns }
            selectedItems={ this.selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
            type={ 'radio' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
            request={ this.getRuleList }
            toClearSelectedRowKeys={ toClearSelectedRowKeys }
          />
        </Modal>
      )
    }
}

export default IntoRuleModal
