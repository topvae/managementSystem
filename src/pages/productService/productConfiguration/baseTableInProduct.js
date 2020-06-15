import React from 'react'
import { Table, Pagination } from 'antd'
import './index.less'
let uid = ''
class BaseTableInProduct extends React.Component {
  state = {
    data: '',
    selectedRowKeys: [],
    ifChecked: '',
    ifProductChecked: false,
    ifPartChecked: false
  }

  componentDidMount() {
    const { data } = this.props
    if (data && Object.keys(data).length !== 0) {
      this.setState({
        data
      })
    }
  }
  componentWillReceiveProps(newProps) {
    const { data, ifProductChecked, ifPartChecked, selectedProductRowKeys, selectedPartRowKeys } = newProps
    // console.log("huhuuhu11",newProps)
    this.setState({
      data
    })
    // 清空keys值的时候
    if (ifProductChecked && ifProductChecked !== this.state.ifProductChecked) {
      this.setState({
        selectedRowKeys: []
      })
    }
    if (ifPartChecked && ifPartChecked !== this.state.ifPartChecked) {
      this.setState({
        selectedRowKeys: []
      })
    }
    if (selectedProductRowKeys && selectedProductRowKeys !== this.state.selectedRowKeys) {
      this.setState({
        selectedRowKeys: selectedProductRowKeys
      })
    }
    if (selectedPartRowKeys && selectedPartRowKeys !== this.state.selectedRowKeys) {
      this.setState({
        selectedRowKeys: selectedPartRowKeys
      })
    }
  }
  onChange = (page, pageSize) => {
    const { request } = this.props
    this.setState({
      // selectedRowKeys: []
    })
    request(page)
  }
  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys, // 分页的时候  勾选自动取消  必写
      type: this.props.type,
      onChange: (selectedRowKeys, selectedRows) => {
        const SelectedIds = []
        selectedRows.forEach(item => {
          if (item.componentId) {
            SelectedIds.push(item.componentId)
          } else if (item.productId) {
            SelectedIds.push(item.productId)
          } else if (item.templateId) {
            SelectedIds.push(item.templateId)
          }
        })
        this.setState({ // 分页的时候  勾选自动取消  必写
          selectedRowKeys: selectedRowKeys
        })
        this.props.selectedItems(selectedRowKeys, selectedRows, SelectedIds)
      }
    }
    const { data } = this.state
    const { current, size, total } = data
    const { dataSource, columns, type, hidePagination, scroll, rowKeyType } = this.props
    return (
      <div>
        <Table
          data={ data }
          dataSource={ dataSource }
          columns={ columns }
          rowKey={ record => { // 分页  删除具体表格行  以后不自动勾选
            if (record[rowKeyType]) {
              uid = record[rowKeyType]
            }
            return uid
          } }
          rowSelection={ type === null ? null : rowSelection }
          pagination={ false }
          scroll={ scroll }
        />
        {
          !hidePagination &&
          <Pagination
            className='pagination'
            current={ current }
            total={ total }
            defaultPageSize={ size }
            showQuickJumper={ total > 0 }
            showTotal={ () => `共${ total || 0 }条` }
            onChange={ this.onChange }
          />
        }
      </div>
    )
  }
}
BaseTableInProduct.defaultProps = {
  type: null // 默认的type类型是空
}

export default BaseTableInProduct
