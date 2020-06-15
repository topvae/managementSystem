/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-03-03 14:22:28
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import BaseTable from './baseTableInProduct'
import { get_parts_detail } from '../../../services/api'
import { Modal, Table } from 'antd'
class PartsTable extends React.Component {
  state = {
    current: 1,
    ifPartChecked: false,
    componentDetail: [], // 零件详情
    visible: false, // 点击零件名称弹出的弹框
    selectedPartRowKeys: [] // 零件选中的keys
  };
  params = {
    page: 3
  };

  componentDidMount() {}
  componentWillReceiveProps(props) {
    if (props.ifPartChecked !== this.state.ifPartChecked) {
      this.setState({
        ifPartChecked: props.ifPartChecked
      })
    }
    if (props.selectedPartRowKeys !== this.state.selectedPartRowKeys) {
      this.setState({
        selectedPartRowKeys: props.selectedPartRowKeys
      })
    }
  }

  // 选择表格获取的数据
  selectedItems = (selectedRowKeys, selectedRows, selectedIds) => {
    // console.log(selectedRowKeys, selectedRows, selectedIds)
    this.props.getPartList(selectedRowKeys, selectedRows, selectedIds)
  };

  request = params => {
    this.props.request(params)
  };
  // 打开弹窗显示零件详情
  showComponentDetails = params => {
    this.getComponentInfo(params)
    this.setState({
      visible: true
      // productName: params.productName
    })
  }
  // 请求查看零件详情接口
  getComponentInfo = params => {
    get_parts_detail({ componentId: params.componentId }).then(res => {
      if (res.data.responseCode === 0) {
        this.setState({
          componentDetail: res.data.responseData.includeComponents
        })
      }
    })
  };
  // 取消Modal的时候
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { componentDetail } = this.state
    const tableColumns = [
      {
        title: '零件名称',
        dataIndex: 'componentName',
        key: 'componentName',
        render: (index, record) => {
          if (record.type === 1) {
            return (<span
              className='like_a'
              onClick={ () => {
                this.showComponentDetails(record)
              } }
            >
              {index}
            </span>)
          } else {
            return (<span>
              {index}
            </span>)
          }
        }
      },
      {
        title: '一级分类',
        dataIndex: 'officeName',
        key: 'officeName'
      },
      {
        title: '二级分类',
        dataIndex: 'departmentName',
        key: 'departmentName'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // eslint-disable-next-line react/display-name
        render: (record) => {
          if (JSON.stringify(record).indexOf('T') !== -1) {
            return <span>{record.replace('T', ' ')}</span>
          } else {
            return <span>{record}</span>
          }
        }
      }
      // {
      //   title: '生效时间',
      //   dataIndex: 'effectDate',
      //   key: 'effectDate'
      // }
    ]
    const componentColumn = [
      {
        title: '零件名称',
        dataIndex: 'componentName',
        key: 'componentName'
      },
      {
        title: '零件用途',
        dataIndex: 'purpose',
        key: 'purpose'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
      }
    ]
    return (
      <div>
        <BaseTable
          rowKeyType='componentId'
          data={ this.props.totalData } // 所有数据
          dataSource={ this.props.tableData }
          columns={ tableColumns }
          selectedItems={ this.selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ this.request }
          ifPartChecked={ this.state.ifPartChecked }
          selectedPartRowKeys={ this.state.selectedPartRowKeys }
        />
        <Modal
          width={ 800 }
          className='productTable'
          title={ '零件详情' }
          visible={ this.state.visible }
          // onOk={this.handleOk}
          onCancel={ this.handleCancel }
          footer={ null }
        >
          <Table
            dataSource={ componentDetail }
            columns={ componentColumn }
            pagination={ false }
            rowKey={ record => record.componentId }
          />
        </Modal>
      </div>
    )
  }
}

export default PartsTable
