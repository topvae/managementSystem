/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2019-11-04 14:46:45
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import './index.less'
import { Card, Button, Modal, message, Icon } from 'antd'
import { get_service_list, post_service_delete } from '../../../services/api'
import BaseTable from './../../../components/Table/BaseTable'
import BaseForm from '../../../components/Form'
import { formList, config } from './formList'
import { withRouter } from 'react-router-dom'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

// const { TextArea } = Input
const confirm = Modal.confirm
class serviceConfig extends React.Component {
  state = {
    selectedRowKeys: [],
    sortedInfo: null,
    tableData: [], // table的数据
    totalData: {}, // 包含总条数的所有数据  res.data
    selectedServeRowKeys: []
  }
  params = {
    page: 1
  }

  componentDidMount() {
    this.requestList()
  }
  // 请求服务list
  requestList = (params) => {
    this.params.page = params
    get_service_list({ ...this.params, orderBy: 'create_time' })
      .then((res) => {
        const data = res.data.responseData
        const tableData = data.records.map((item, index) => {
          item.key = index
          return item
        })
        this.setState({
          // selectedRowKeys: [0, 1, 2, 3],
          tableData,
          totalData: data
        })
      })
  }
  // 请求删除服务接口（注意：参数去掉括号）
  deleteService = () => {
    const { selectedServeRowKeys } = this.state
    if (selectedServeRowKeys.length === 0) {
      message.error('请选择服务')
    } else {
      confirm({
        title: '确定要删除吗？',
        onOk: () => {
          post_service_delete({ serveIds: selectedServeRowKeys.toString() })
            .then(res => {
              Modal.success({
                title: '服务删除成功'
              })
              this.requestList()
              this.setState({ selectedServeRowKeys: [] })
            })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }

  // 选择表格获取的数据
  selectedItems = (selectedServeRowKeys, selectedServeRows) => {
    this.setState({
      selectedServeRowKeys,
      selectedServeRows
    })
  }

  // 是否展示弹窗
  AddOrEditService = (params, record) => {
    // console.log(params,record)
    if (params === 'add') {
      this.props.history.push({ pathname: '/serviceManagement/queryService/addService' })
    } else if (params === 'copy') {
      this.props.history.push({ pathname: '/serviceManagement/queryService/copyService', state: { record: record }})
      sessionStorage.setItem('serveId', record.serveId)
      sessionStorage.setItem('serveNo', record.serveNo)
    } else if (params === 'edit') {
      this.props.history.push({ pathname: '/serviceManagement/queryService/editService', state: { record: record }})
      sessionStorage.setItem('serveId', record.serveId)
    } else {
      // 查看服务
      this.props.history.push({ pathname: '/serviceManagement/queryService/showServiceDetails' })
      sessionStorage.setItem('serveId', record.serveId)
    }
  }
  // 提交的时候
  handleFilterSubmit = (filterParams) => {
    if (filterParams.effectState === -1) {
      filterParams.effectState = ''
    }
    filterParams.swichCode = filterParams.swichCode.replace(/\s*/g, '')
    filterParams.serveName = filterParams.serveName.replace(/\s*/g, '')
    this.params = filterParams
    this.requestList()
  };
  // 重置表格的时候
  resetFields = () => {
    this.params = {}
    this.requestList()
  }
  // 复制或者修改
  CopyOrEdit = (record) => {
    if (record.effectState === 0) {
      return (<div>
        <AuthButton type='link' className='like_a' onClick={ () => this.AddOrEditService('copy', record) } menu_id={ 75 } style={{ padding: 0 }}>复制</AuthButton>
        <AuthButton type='link' className='like_a' onClick={ () => this.AddOrEditService('edit', record) } menu_id={ 76 } style={{ padding: 0 }}>修改</AuthButton>
      </div>)
    } else if (record.effectState === 1 || record.effectState === 3) {
      return <AuthButton type='link' className='like_a' onClick={ () => this.AddOrEditService('copy', record) } menu_id={ 75 }>复制</AuthButton>
    } else {
      return ''
    }
  }

  render() {
    // 文件类型 fileType 0-json 1-xml 2-txt 3-pdf
    // 加密方式 encryptType 1-是 0-否                 注意：可能会会有修改
    // 加压方式 forcingType 1-是 0-否                                注意：可能会会有修改
    // 传送方式 sendType 0-短信 1-邮件 2-接口
    const fileTypeList = ['json', 'xml', 'txt', 'pdf', '文本', 'excel', 'word'] // 文件类型
    const encryptTypeList = ['否', '是'] // 加密方式
    const forcingTypeList = ['否', '是'] // 加压方式
    const sendTypeList = ['短信', '邮件', '接口'] // 传送方式
    const effectStateList = ['未生效', '已生效', '已失效', '可用不可见'] // 生效状态 0-未生效 1-已生效 2-已失效3-可用不可见
    const stateClass = ['orange-circle', 'green-circle', 'grey-circle', 'grey-circle']
    const tableColumns = [{
      title: '服务编码',
      dataIndex: 'swichCode',
      key: 'swichCode',
      width: 350
    }, {
      title: '服务名称',
      dataIndex: 'serveName',
      width: 300,
      key: 'serveName',
      // eslint-disable-next-line react/display-name
      render: (text, record) =>
        (<span
          className='showAndedit'
          onClick={ () => this.AddOrEditService('showServiceDetails', record) }
        >
          {text}
        </span>)
    }, {
      title: '文件类型',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 200,
      // eslint-disable-next-line react/display-name
      render: (text) => <span> {fileTypeList[text]} </span>
    }, {
      title: '是否加密',
      dataIndex: 'encryptType',
      width: 200,
      key: 'encryptType',
      // eslint-disable-next-line react/display-name
      render: (text) => <span> {encryptTypeList[text]} </span>
    }, {
      title: '是否加压',
      dataIndex: 'forcingType',
      key: 'forcingType',
      width: 200,
      // eslint-disable-next-line react/display-name
      render: (text) => <span> {forcingTypeList[text]} </span>
    }, {
      title: '传送方式',
      dataIndex: 'sendType',
      key: 'sendType',
      width: 200,
      // eslint-disable-next-line react/display-name
      render: (text) => <span> {sendTypeList[text]} </span>
    }, {
      title: '创建人',
      dataIndex: 'originatorName',
      width: 200,
      key: 'originatorName'
    }, {
      title: '生效时间',
      dataIndex: 'effectDate',
      width: 250,
      key: 'effectDate',
      // eslint-disable-next-line react/display-name
      render: (record) => {
        if (JSON.stringify(record).indexOf('T') !== -1) {
          return <span>{record.replace('T', ' ')}</span>
        } else {
          return <span>{record}</span>
        }
      }
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 250,
      key: 'createTime',
      // eslint-disable-next-line react/display-name
      render: (record) => {
        if (JSON.stringify(record).indexOf('T') !== -1) {
          return <span>{record.replace('T', ' ')}</span>
        } else {
          return <span>{record}</span>
        }
      }
    }, {
      title: '服务状态',
      dataIndex: 'effectState',
      width: 250,
      key: 'effectState',
      // eslint-disable-next-line react/display-name
      render: (text) => <span><span className={ `basic-circle ${ stateClass[text] }` }> </span>{effectStateList[text]}</span>
    }, {
      title: '操作',
      dataIndex: 'operator',
      width: 200,
      key: 'operator',
      // eslint-disable-next-line react/display-name
      render: (text, record) => this.CopyOrEdit(record)
    }]
    return (
      <div className='content'>
        <Card bordered={ false } className='searchCard'>
          <BaseForm
            formList={ formList }
            config={ config }
            filterSubmit={ this.handleFilterSubmit }
            resetFields={ this.resetFields }
          />
        </Card>
        <Card bordered={ false } style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <AuthButton type='primary' icon='plus' onClick={ () => this.AddOrEditService('add') } menu_id={ 32 }>新建服务</AuthButton>
            <AuthButton onClick={ this.deleteService } menu_id={ 33 }><Icon type='delete' />删除服务</AuthButton>
          </div>
          <BaseTable
            rowKeyType='serveId'
            data={ this.state.totalData } // 所有数据
            dataSource={ this.state.tableData }
            columns={ tableColumns }
            selectedItems={ this.selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
            type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
            request={ this.requestList }
          />
        </Card>
      </div>
    )
  }
}

export default withRouter(serviceConfig)
