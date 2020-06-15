/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-03-03 15:15:45
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react'
import { Modal, Button, Input, message, Icon, Col, Row } from 'antd'
import { get_baseProducts_list } from './../../../services/api'
import BaseTable from './../../../components/Table/BaseTable'
class ChooseProduct extends Component {
  state = {
    totalData: {},
    tableData: [],
    productName: '', // 产品名称
    visible: false // 选择产品
  }
  params = {
    page: 1,
    effectState: 1 // 已生效   effectState生效状态 0-未生效 1-已生效 2-已失效
  }
  componentWillReceiveProps(props) {
    if (props.productName !== this.state.productName) {
      this.setState({
        productName: props.productName
      })
    }
    if (props.ifShowErr !== this.state.ifShowErr) {
      this.setState({
        ifShowErr: props.ifShowErr
      })
    }
  }
  // 请求产品接口
  requestProductList = params => {
    this.params.page = params
    get_baseProducts_list({
      ...this.params,
      productName: this.state.serviceProductName && this.state.serviceProductName.replace(/\s*/g, ''),
      remark: this.state.serviceRemark && this.state.serviceRemark.replace(/\s*/g, '')
    }).then(res => {
      const data = res.data
      const tableData = data.responseData.records.map((item, index) => {
        item.key = index
        return item
      })
      this.setState({
        tableData,
        totalData: data.responseData
      })
    })
  };

  // input改变的时候
  InputChange = (e, val) => {
    this.setState({
      [val]: e.target.value
    })
  };
  // 查询服务中的产品
  findProduct = () => {
    // let {serviceProductName,serviceRemark} = this.state
    // if(!serviceProductName && !serviceRemark){
    //   message.error('请输入选择项')
    // }else{
    this.requestProductList()
  };

  // 重置参数
  resetProduct = () => {
    this.setState(
      {
        serviceProductName: '',
        serviceRemark: ''
      },
      () => {
        this.requestProductList()
      }
    )
  };

  // 选择产品
  chooseProduct = () => {
    this.requestProductList()
    this.setState({
      visible: true
    })
  };

  selectedItems = (selectedRowKeys, selectedRows, selectedIds) => {
    // console.log(selectedRowKeys, selectedRows, selectedIds);
    this.setState({
      selectedRowKeys,
      selectedRows,
      selectedIds
    })
  };

  handleCancel = () => {
    this.setState({
      visible: false
    })
  };
  // 点击modal确定的时候抓去选中的rows
  handleOk = () => {
    const selectedRows = this.state.selectedRows
    // 点击确定的时候判断是否选择了产品的list
    if (selectedRows && selectedRows.length > 0) {
      this.setState({
        visible: false,
        productName: selectedRows[0].productName,
        productNo: selectedRows[0].productNo,
        remark: selectedRows[0].remark, // 注意：新增预警服务的时候将已经生效的产品的备注带过去
        ifShowErr: false
      }, () => {
        this.props.showProductNo(this.state.productNo, this.state.productName, this.state.remark) // 点击确定的时候传给父组件
        this.props.ShowErrMsg()
      })
    } else {
      message.error('请选择产品')
    }
  };
  // 点击handleOK的时候同时把productName和productNo传递过去

  render() {
    const tableColumns = [
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
        key: 'remark'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      }
    ]
    // 预警模块查看预警服务详情 查看修改都不能改
    const showServiceDetails = window.location.href.includes('showServiceDetails') || window.location.href.includes('editService')
    return (
      <div>
        {showServiceDetails
          ? null
          : <Button type='primary' onClick={ this.chooseProduct } style={{ marginBottom: '8px' }}>
          选择
          </Button>}
        <div>
          {this.state.productName ? <Icon type='shop' style={{ marginRight: '5px' }} /> : null }
          {this.state.productName}
        </div>
        {this.state.ifShowErr ? <div style={{ color: '#f5222d' }}>请选择产品</div> : null }
        <Modal
          destroyOnClose // 这个属性需要确定需求
          width={ 900 }
          title='选择产品'
          visible={ this.state.visible }
          onOk={ this.handleOk }
          onCancel={ this.handleCancel }
          okText={ '添加选择' }
          maskClosable={ false }
        >
          <Row>
            <Col span={ 19 }>
              <div style={{ display: 'inline-block', marginRight: '20px', marginBottom: '20px' }}>
                <span>产品名称：</span>
                <Input
                  style={{ width: '200px' }}
                  onChange={ e => this.InputChange(e, 'serviceProductName') }
                  value={ this.state.serviceProductName }
                />
              </div>
              <div style={{ display: 'inline-block', marginBottom: '20px' }}>
                <span>备注：</span>
                <Input
                  style={{ width: '200px' }}
                  onChange={ e => this.InputChange(e, 'serviceRemark') }
                  value={ this.state.serviceRemark }
                />
              </div>
            </Col>
            <Col span={ 5 } style={{ textAlign: 'right' }}>
              <Button
                type='primary'
                // style={{ marginBottom: '10px', marginRight: '10px', marginLeft: '20%' }}
                onClick={ this.findProduct }
              >
                查询
              </Button>
              <Button onClick={ this.resetProduct }>重置</Button>
            </Col>
          </Row>
          <BaseTable
            rowKeyType='productId'
            data={ this.state.totalData } // 所有数据
            dataSource={ this.state.tableData }
            columns={ tableColumns }
            selectedItems={ this.selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
            type={ 'radio' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
            request={ this.requestProductList }
          />
        </Modal>
      </div>
    )
  }
}

export default ChooseProduct
