import React from 'react'
import { Table, Pagination } from 'antd'
import { connect } from 'react-redux'
import './index.less'
let uid = ''
class BaseTable extends React.Component {
  state = {
    toClearSelectedRowKeys: false, // 是否清空选中项
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
    const { data, toClearSelectedRowKeys, ifProductChecked, ifPartChecked, checkedKeys } = newProps
    if (data && Object.keys(data).length !== 0) {
      this.setState({
        data
      })
    }
    if (toClearSelectedRowKeys) {
      this.setState({
        selectedRowKeys: []
      })
    }
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
    if (checkedKeys && checkedKeys !== this.state.selectedRowKeys) {
      this.setState({
        selectedRowKeys: checkedKeys
      })
    }
  }

  onChange = (page, pageSize) => {
    const { request } = this.props
    this.setState({
      selectedRowKeys: []
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
      },
      onSelect: (record, selected, selectedRows) => {
      },
      onSelectAll: (selected, selectedRows, changeRows) => {

      }
    }
    const { data } = this.state
    const { current, size, total } = data
    const { dataSource, columns, type, hidePagination, onChange, scroll, rowKeyType } = this.props
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
          onChange={ onChange }
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
BaseTable.defaultProps = {
  type: null // 默认的type类型是空
}

const mapStateToProps = state => {
  return {
    selectedKeys: state.clearKeys
  }
}

export default connect(
  mapStateToProps,
  null
)(BaseTable)
