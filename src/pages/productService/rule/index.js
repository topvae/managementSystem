import React from 'react'
import './index.less'
import { Card, Modal, Button, Tooltip } from 'antd'
// import PartsModal from './Modal.js';
import BaseForm from '../../../components/Form'
import BaseTable from './../../../components/Table/BaseTable'
import { formList, config } from './formList'
import { get_rule_list, delete_rule } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

class Rule extends React.Component {
  state = {
    tableData: [], // list数据
    totalData: [], // 所有数据
    selectedRowKeys: [], // 选中项的 key 数组
    selectedRows: [], // 选中的数组
    selectedIds: [], // 选中的数组id
    visible: false, // 控制弹框显隐
    editId: null, // 需要修改的id
    updateList: {}
  };

  //   ----------------------------------------- 分页数据交互  -----------------------------------------

  // 分页请求参数
  params = {
    page: 1
  }

  tableColumns = [
    {
      title: '规则名称',
      dataIndex: 'templateName',
      key: 'templateName'
    },
    {
      title: '规则分类',
      dataIndex: 'templateType',
      key: 'templateType'
    },
    {
      title: '规则内容',
      dataIndex: 'content',
      key: 'content',
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

    },
    {
      title: '创建人',
      dataIndex: 'operatorName',
      key: 'operatorName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true
      // render: (record) => {
      //   if(JSON.stringify(record).indexOf('T') !== -1){
      //     return <span>{record.replace('T', ' ')}</span>
      //   }else{
      //     return <span>{record}</span>
      //   }
      // },
    }
    // {
    //     title: '操作',
    //     dataIndex: 'operation',
    //     key: 'operation',
    //     render: (text,record,index) => {
    //         return (
    //             <div>
    //                 <span className="edit" onClick={()=>{this.showModal(record)}}>修改</span>
    //             </div>
    //         )
    //     }
    // }
  ]

  // 分页数据请求
  requestList = async(page) => {
    this.params.page = page
    const res = await get_rule_list({ ...this.params })
    if (res.data.responseCode) return
    const totalData = res.data.responseData
    const records = res.data.responseData.records
    const tableData = records.map((item, index) => {
      item.key = index
      return item
    })
    this.setState({
      tableData,
      totalData
    })
    // .then((res) => {
    //     if(res.data.responseCode) return
    //     let totalData = res.data.responseData;
    //     let records = res.data.responseData.records;
    //     let tableData = records.map((item, index) => {
    //         item.key = index;
    //         return item;
    //     })
    //     this.setState({
    //         tableData,
    //         totalData,
    //     })
    // })
  }

  // 后端时间排序
  onChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter)
    const { order } = sorter

    this.params.orderBy = 'create_time'
    // console.log(order,'order')
    if (order === 'descend') {
      // 降序
      this.params.asc = false
    } else if (order === 'ascend') {
      // order === 'ascend'
      // 升序
      this.params.asc = true
    }
    this.requestList()
  }

  // 选择表格获取的数据
  selectedItems = (selectedRowKeys, selectedRows, selectedIds) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
      selectedIds
    })
  }

  // 零件删除
  formDelete = () => {
    let { selectedIds } = this.state

    if (selectedIds.length === 0) {
      Modal.warning({
        title: '删除规则提示',
        content: '请选择需要删除的规则'
      })
    } else {
      Modal.confirm({
        title: '删除规则提示',
        content: ' 删除规则后，将无法恢复，是否确认删除？',
        cancelText: '取消',
        okText: '确定',
        onOk: async() => {
          selectedIds = selectedIds.join(',')
          const res = await delete_rule({ deleteIds: selectedIds })
          if (res.data.responseCode) return
          const responseData = res.data.responseData
          if (responseData) {
            Modal.success({
              title: '提醒',
              content: '删除成功',
              onOk: () => {
                this.requestList()
              }
            })
            this.setState({ selectedIds: [] })
          } else {
            Modal.warning({
              title: '提醒',
              content: responseData.responseMsg
            })
          }
        }
      })
    }
  }

  // 重置表格的时候
  resetFields = () => {
    this.params = {}
    this.requestList()
  }

  // 查询表单
  handleFilterSubmit = (filterParams) => {
    filterParams.content = filterParams.content.replace(/\s*/g, '')
    filterParams.templateName = filterParams.templateName.replace(/\s*/g, '')
    filterParams.templateType = filterParams.templateType.replace(/\s*/g, '')
    this.params = filterParams
    // console.log(this.params)
    this.requestList()
  };

  // 点击修改
  // showModal = (record) => {
  //     if(record){
  //         this.setState({
  //             visible: true,
  //             editId:record.id
  //         });
  //     }
  //   };

  // nextProps 子组件通知父组件 改变 弹框的 状态未关闭
  closeModal = (flag) => {
    this.setState({
      visible: flag
    })
  }

  componentDidMount() {
    this.requestList()
  }

  render() {
    const { totalData, tableData } = this.state

    return (
      <div className='ruleContent'>
        <Card bordered={ false } className='searchCard'>
          <BaseForm
            formList={ formList }
            config={ config }
            filterSubmit={ this.handleFilterSubmit }
            resetFields={ this.resetFields }
          />
        </Card>
        <Card bordered={ false } className='searchResult'>
          <AuthButton onClick={ this.formDelete } style={{ marginBottom: 20 }} menu_id={ 36 }>删除</AuthButton>
          <BaseTable
            rowKeyType='templateId'
            data={ totalData } // 所有数据
            dataSource={ tableData } // list数据
            columns={ this.tableColumns }
            onChange={ this.onChange }
            selectedItems={ this.selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
            type={ 'checkbox' } // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
            request={ this.requestList }
          />
        </Card>
        {/* <PartsModal visible={ this.state.visible } closeModal={this.closeModal}  editId={ this.state.editId }/> */}
      </div>
    )
  }
}

export default Rule
