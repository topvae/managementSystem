/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-06-17 11:36:13
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import './index.less'
import BaseForm from '../../../components/Form'
import BaseTable from './../../../components/Table/BaseTable'
import { formList, config } from './formList'
import { total } from './../../../mockData' // 模拟的假数据
import { get_baseProducts_list } from './../../../services/api'
// import ProductsTable from './productsTable'
// import { unique, mapRows, setCreditDate } from '../../../utils/utils'
import { Form, Card, Button, Modal } from 'antd'
// 搜索一级分类、二级分类的方法
class productConfiguration extends React.Component {
  state = {
    data: [], // 存放搜索数据
    totalData: total.responseData, // 产品所有的data {}
    tableData: total.responseData.records, // 产品table所有的data
    visible: false
  }
  params = {
    page: 1
  }

  componentDidMount() {
    // 请求产品的list
    // this.requestProductList()
  }

  // 产品请求
  requestProductList = params => {
    this.params.page = params
    get_baseProducts_list({ ...this.params }).then(res => {
      const data = res.data
      const tableData = data.responseData.records.map((item, index) => {
        item.key = index
        return item
      })
      this.setState({
        tableData,
        totalData: data.responseData
        // tabkey: '1'
      })
    })
  }
  // 重置产品参数
  resetProductFields = () => {
    this.params = {}
    this.requestProductList()
  }
  // 查询
  handleProductFilterSubmit = filterParams => {
    for (const x in filterParams) {
      if (filterParams[x] === -1) {
        filterParams[x] = ''
      }
    }
    filterParams.dingdan = filterParams.dingdan.replace(/\s*/g, '')
    filterParams.shanghu = filterParams.shanghu.replace(/\s*/g, '')
    // filter.start = moment(filter.start)
    // filter.end = moment(filter.end)
    this.params = filterParams
    this.requestProductList()
  }
  // 查看详情
  showDetails = () => {
    this.setState({ visible: true })
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  render() {
    const columns = [
      {
        title: '证件号',
        dataIndex: 'dingdan',
        key: 'dingdan'
      },
      {
        title: '网通号',
        dataIndex: 'shanghu',
        key: 'shanghu'
      },
      {
        title: '开始时间',
        dataIndex: 'start',
        key: 'start'
      },
      {
        title: '结束时间',
        dataIndex: 'end',
        key: 'end'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          if (record.dingdan) {
            return (
              <Button type='primary' onClick={ () => this.showDetails(record) }>
                订单查询
              </Button>
            )
          } else {
            return null
          }
        }
      }
    ]
    const columns1 = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: '籍贯',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: '职业',
        dataIndex: 'job',
        key: 'job'
      }
    ]
    const innerData = [
      { id: 1, name: '许嵩', age: 34, address: '安徽合肥', job: '歌手' },
      { id: 2, name: '丁禹兮', age: 25, address: '上海', job: '演员' },
      { id: 3, name: '许光汉', age: 30, address: '台湾', job: '演员' },
      { id: 4, name: '宋威龙', age: 21, address: '东北', job: '演员' }
    ]
    return (
      <div className='content'>
        <Card bordered={ false } className='searchCard'>
          {/* 筛选条件的选择框 */}
          <BaseForm
            formList={ formList }
            config={ config }
            filterSubmit={ this.handleProductFilterSubmit }
            resetFields={ this.resetProductFields }
          />
        </Card>
        <Card bordered={ false } style={{ marginTop: '20px' }}>
          <div>
            <BaseTable
              rowKeyType='orderId'
              data={ this.state.totalData }
              dataSource={ this.state.tableData }
              columns={ columns }
              request={ this.requestProductList }
            />
          </div>
        </Card>
        <Modal
          width={ 800 }
          className='productTable'
          title={ '订单详情' }
          visible={ this.state.visible }
          maskClosable={ false }
          onCancel={ this.handleCancel }
          footer={ null }
        >
          <div style={{ padding: '10px 0' }}>
            <BaseTable
              rowKeyType='id'
              data={ innerData }
              dataSource={ innerData }
              columns={ columns1 }
              request={ this.requestProductList }
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default Form.create({})(productConfiguration)
