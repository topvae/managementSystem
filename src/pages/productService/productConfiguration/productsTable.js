/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-03-03 13:59:02
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import BaseTable from './baseTableInProduct'
import { get_Product_info } from './../../../services/api'
import { Modal, Tabs, Table, Tooltip, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { wrapAuth } from '../../../components/AuthButton'
import './index.less'
const TabPane = Tabs.TabPane
const AuthButton = wrapAuth(Button)
class ProductsTable extends React.Component {
  state = {
    productName: '', // 产品名称
    visible: false,
    productData: [], // 产品数组
    componentData: [], // 零件数组
    ifProductChecked: false,
    selectedProductRowKeys: [] // 产品选中的keys
  };
  params = {
    ifshowInvalidData: null
  };

  componentDidMount() {}

  // 选择表格获取的数据
  selectedItems = (selectedRowKeys, selectedRows, selectedIds) => {
    this.props.getProductList(selectedRowKeys, selectedRows, selectedIds)
  };

  componentWillReceiveProps(props) {
    if (props.ifProductChecked !== this.state.ifProductChecked) {
      this.setState({
        ifProductChecked: props.ifProductChecked
      })
    }
    if (props.selectedProductRowKeys !== this.state.selectedProductRowKeys) {
      // console.log(props.selectedProductRowKeys)
      this.setState({
        selectedProductRowKeys: props.selectedProductRowKeys
      })
    }
  }

  // 查看产品详情
  showProdectDetails = params => {
    // console.log('params', params)
    this.getProductInfo(params)
    this.setState({
      visible: true,
      productName: params.productName
    })
  };
  // 请求查看产品详情接口
  getProductInfo = params => {
    get_Product_info({ id: params.productId }).then(res => {
      if (res.data.responseCode === 0) {
        this.setState({
          componentData: res.data.responseData.components,
          productData: res.data.responseData.products
        })
      }
    })
  };

  // 取消Modal的时候
  handleCancel = () => {
    this.setState({
      visible: false
    })
  };
  // 改变tab的时候
  changeTab = key => {
    // console.log(key)
    // 注意：这边有需求，需要根据后台数据，如果只有产品的情况下只显示产品tab,两个都存在的情况下显示两个tab
  };
  // 产品修改
  productEdit = (record, val) => {
    if (record) {
      if (val === 'edit') {
        this.props.history.push({
          pathname: '/product/configuration/productEdit',
          state: { record: record }
        })
        sessionStorage.setItem('productId', record.productId)
        sessionStorage.setItem('productNo', record.productNo)
      } else if (val === 'copy') {
        this.props.history.push({
          pathname: '/product/configuration/productCopy',
          state: { record: record }
        })
        sessionStorage.setItem('productId', record.productId)
        sessionStorage.setItem('productNo', record.productNo)
      } else {
        this.props.deleteProductList([record.productId])
      }
    }
  };
  // 产品排序
  productSort = (record) => {
    if (record) {
      this.props.history.push({
        pathname: `/product/configuration/productSort/${ record.productId }`
      })
      // sessionStorage.setItem('productId', record.productId)
    }
  };
  // 请求查询详情接口
  // 复制或者删除
  CopyOrDelete = record => {
    // 0-未生效 1-已生效 2-已失效
    const pageType = this.props.pageType
    if (pageType === 'index') {
      if (record.effectState === 0) {
        return (
          <div>
            <AuthButton
              type='link'
              // className='like_a'
              onClick={ () => this.productEdit(record, 'copy') }
              menu_id={ 73 }
              style={{ padding: 0 }}
            >复制</AuthButton>

            <AuthButton
              type='link'
              // className='like_a'
              onClick={ () => this.productEdit(record, 'edit') }
              menu_id={ 74 }
              style={{ padding: 0 }}
            >修改</AuthButton>
            <AuthButton type='link' onClick={ () => this.productEdit(record, 'delete') } menu_id={ 29 } style={{ padding: 0 }}>删除</AuthButton>
            <AuthButton type='link' onClick={ () => this.productSort(record) } menu_id={ 186 } style={{ padding: 0 }}>排序</AuthButton>
          </div>
        )
      } else if (record.effectState === 1) {
        return (
          <div>
            <AuthButton
              type='link'
              // className='like_a'
              onClick={ () => this.productEdit(record, 'copy') }
              menu_id={ 73 }
              style={{ padding: 0 }}
            >复制</AuthButton>
            <AuthButton type='link' onClick={ () => this.productEdit(record, 'delete') } menu_id={ 29 } style={{ padding: 0 }}>删除</AuthButton>
            <AuthButton type='link' onClick={ () => this.productSort(record) } menu_id={ 186 } style={{ padding: 0 }}>排序</AuthButton>
          </div>
        )
      } else {
        return (<AuthButton type='link' onClick={ () => this.productEdit(record, 'delete') } menu_id={ 29 } style={{ padding: 0 }}>删除</AuthButton>)
      }
    } else {
      return ''
    }
  };
  request = params => {
    this.props.request(params)
  };

  render() {
    const StatusList = ['未生效', '已生效', '已失效']
    const stateClass = ['orange-circle', 'green-circle', 'grey-circle']
    const pageType = this.props.pageType // 从父组件获取到是在增加组件页还是在产品配置首页
    const tableColumns = [
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        // eslint-disable-next-line react/display-name
        render: (index, record) =>
          pageType === 'index' ? (
            <span
              className='like_a'
              onClick={ () => {
                this.showProdectDetails(record)
              } }
            >
              {index}
            </span>
          ) : (
            <span>{index}</span>
          )
      },
      {
        title: '信用主体类型',
        dataIndex: 'creditTypeName',
        key: 'creditTypeName'
      },
      {
        title: '创建人',
        dataIndex: 'originatorName',
        key: 'originatorName'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: pageType === 'index' ? 250 : 200,
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
      },
      {
        title: '生效时间',
        dataIndex: 'effectDate',
        key: 'effectDate'
      },
      {
        title: '状态',
        dataIndex: 'effectState', // 生效状态 0-未生效 1-已生效 2-已失效
        key: 'effectState',
        // eslint-disable-next-line react/display-name
        render: text => <span><span className={ `basic-circle ${ stateClass[text] }` }></span>{StatusList[text]}</span>
      },
      {
        title: pageType === 'index' ? '操作' : '',
        // eslint-disable-next-line react/display-name
        render: (index, record) => this.CopyOrDelete(record)
      }
    ]
    const productColumn = [
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: '创建人',
        dataIndex: 'originatorName',
        key: 'originatorName'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 300,
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
    const partColumn = [
      {
        title: '零件名称',
        dataIndex: 'componentName',
        key: 'componentName'
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
        title: '用途',
        dataIndex: 'purpose',
        key: 'purpose',
        width: 250,
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
    const { productData, componentData } = this.state
    return (
      <div>
        <BaseTable
          rowKeyType='productId'
          data={ this.props.totalData }
          dataSource={ this.props.tableData }
          columns={ tableColumns }
          selectedItems={ this.selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
          type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
          request={ this.request }
          ifProductChecked={ this.state.ifProductChecked }
          selectedProductRowKeys={ this.state.selectedProductRowKeys }
        />
        {/* 下面modal里面的内容只是在产品配置--主页面查看产品详情 ，编辑用不到*/}
        <Modal
          width={ 800 }
          className='productTable'
          title={ this.state.productName }
          visible={ this.state.visible }
          onOk={ this.handleOk }
          onCancel={ this.handleCancel }
          footer={ null }
        >
          <Tabs onChange={ this.changeTab } type='card' style={{ paddingTop: '10px', paddingBottom: '60px' }}>
            {productData && productData.length > 0
              ? <TabPane tab='组成产品' key='1'>
                <Table
                  dataSource={ productData }
                  columns={ productColumn }
                  pagination={ false }
                  rowKey={ record => record.productId }
                />
              </TabPane>
              : null}
            {componentData && componentData.length > 0
              ? <TabPane tab='组成零件' key='2'>
                <Table
                  dataSource={ componentData }
                  columns={ partColumn }
                  pagination={ false }
                  rowKey={ record => record.componentId }
                />
              </TabPane>
              : null}
          </Tabs>
        </Modal>
      </div>
    )
  }
}

export default withRouter(ProductsTable)
