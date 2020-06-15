/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2019-11-28 10:21:23
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import './index.less'
import { Card, Upload, Button, Icon, Modal } from 'antd'
import BaseTable from './../../../components/Table/BaseTable'
import BaseForm from '../../../components/Form'
import { formList, config, tableColumns } from './formList'
import { get_baseParts_list, download_url, allImport_url, addImport_url, exportAtomComponent_url } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

class Parts extends React.Component {
  state = {
    uploadProps: {}, // 上传文件接口
    current: 1,
    tableData: [], // 表格list数据
    responseData: {}, // 包含总条数的所有数据  res.data
    showModal: false, // 弹框是否展示
    uploadType: 1, // 0成功 1失败
    addErrorMsg: '', // 上传失败文案
    fileName: '', // 文件名称
    fileList: [], // 全量导入列表
    addfileList: [], // 增量导入
    isAllFile: '', // 判断全量和增量
    isShowSuccess: false,
    isShowErr: false,
    rowErrMsg: '', // 弹框第几行出错文案
    addSuccessMsg: '' // excel文件上传成功文案
  }

  // 分页请求参数
  params = {
    page: 1
  }

  // 查询表单 从子组件获取查询内容 进行请求
  handleFilterSubmit = (filterParams) => {
    filterParams.componentName = filterParams.componentName.replace(/\s*/g, '')
    this.params = filterParams
    this.requestList()
  };

  // 数据请求
  requestList = async(page) => {
    this.params.page = page
    const res = await get_baseParts_list({ ...this.params, pageSize: 10 })
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    const records = res.data.responseData.records
    const tableData = records.map((item, index) => {
      item.key = index
      return item
    })
    this.setState({
      tableData,
      responseData: responseData
    })
  }

  // 上传文件
  uploadChange = (info) => {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1)
    fileList = fileList.map(file => {
      if (file.response) {
        this.filter(file)
        // file.url = file.response.url;
      }
      return file
    })
    this.setState({
      fileList: fileList
    })
  }

  // 增量导入
  uploadAddChange = (info) => {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1)
    fileList = fileList.map(file => {
      if (file.response) {
        this.filter(file)
        // file.url = file.response.url;
      }
      return file
    })
    this.setState({
      addfileList: fileList
    })
  }

  //  上传文件后 提取后端提供数据
  filter = (file) => {
    const { name, response, uid, status } = file
    const fileName = name.substring(0, name.lastIndexOf('.'))
    if (status === 'done') {
      if (response.responseCode !== 0) {
        // Modal.error({
        //   title: response.responseMsg
        // })
        this.setState({
          uploadType: 1,
          showModal: true,
          addErrorMsg: response.responseMsg,
          fileName: fileName
        })
      } else {
        // Modal.success({
        //   title: response.responseMsg
        // })
        this.setState({
          uploadType: 0,
          showModal: true,
          addErrorMsg: response.responseMsg,
          fileName: fileName
        })
        this.params = {}
        this.requestList()
      }
    } else if (status === 'error') {
      // Modal.error({
      //   title: '上传失败'
      // })
      this.setState({
        uploadType: 1,
        showModal: true,
        addErrorMsg: '文件上传失败',
        fileName: fileName
      })
    }
    return { name, url: response.data, uid, status }
  };

  // 文件上传前 拦截器
  beforeUpload = (file) => {
    // 截取文件名后缀
    const name = file.name
    const suffix = name.substring(name.lastIndexOf('.'))
    const fileName = name.substring(0, name.lastIndexOf('.'))
    // 判断是否为excel
    if (suffix !== '.xls') {
      // Modal.error({
      //   title: '请上传后缀是xls文件格式的文件'
      // })
      this.setState({
        uploadType: 1,
        showModal: true,
        addErrorMsg: '请上传后缀是xls文件格式的文件',
        fileName: fileName
      })
      return false
    }
    // 转换为兆
    // if (file.size / 1024 / 1024 > 2) {
    //     Modal.error({
    //         title: `${file.name} 文件大于2MB，无法上传`,
    //     });
    //     return false;
    // }
  }

  // 判断全量和增量
  addAllFile = () => {
    this.setState({
      isAllFile: '全量导入'
    })
  }

  addPartFile = () => {
    this.setState({
      isAllFile: '增量导入'
    })
  }

  // 关闭弹窗
  handleCancel = e => {
    this.setState({
      showModal: false
    })
  }

  // 选择表格获取的数据
  selectedItems = (selectedRowKeys, selectedRows, selectedIds) => {
    // console.log(selectedRowKeys, selectedRows, selectedIds)
  }

  // 后端排序
  onChange = (pagination, filters, sorter) => {
    const { current } = this.state
    this.setState({
      current: pagination.current // 储存上一次分页的页码
    })
    if (current === pagination.current) {
      const { order } = sorter
      this.params.orderBy = 'create_time'
      if (order === 'descend') {
        // 降序
        this.params.asc = false
      } else {
        // order === 'ascend'
        // 升序
        this.params.asc = true
      }
      this.requestList()
    }
  }

  // 原子零件模板下载
  download = () => {
    window.location.href = download_url
  }
  // 原子零件导出
  export = () => {
    window.location.href = exportAtomComponent_url
  }
  // 重置表格的时候
  resetFields = () => {
    this.params = {}
    this.requestList()
  }

  componentDidMount() {
    this.requestList()
  }

  render() {
    const { responseData, tableData, showModal, uploadType, addErrorMsg, isAllFile, fileName } = this.state
    const uploadProps = {
      action: allImport_url,
      onChange: this.uploadChange,
      multiple: false,
      beforeUpload: this.beforeUpload
    }
    const uploadAddProps = {
      action: addImport_url,
      onChange: this.uploadAddChange,
      multiple: false,
      beforeUpload: this.beforeUpload
    }
    return (
      <div className='basePartsContent'>
        <Card bordered={ false } className='searchCard'>
          <BaseForm
            formList={ formList }
            config={ config }
            filterSubmit={ this.handleFilterSubmit }
            resetFields={ this.resetFields }
          />
        </Card>
        <Card bordered={ false } className='searchResult'>
          <div className='btnWrap'>
            <AuthButton menu_id={ 17 } className='download' onClick={ this.download } type='primary'>
              <Icon type='cloud-download' />模版下载
            </AuthButton>
            <Upload { ...uploadProps } fileList={ this.state.fileList } className='Upload'>
              <AuthButton menu_id={ 155 } onClick={ this.addAllFile } >
                <Icon type='file-sync' className='Upload' /> 全量导入
              </AuthButton>
            </Upload>
            <Upload { ...uploadAddProps } fileList={ this.state.addfileList } className='Upload'>
              <AuthButton menu_id={ 156 } onClick={ this.addPartFile } >
                <Icon type='folder-add' /> 增量导入
              </AuthButton>
            </Upload>
            <AuthButton menu_id={ 157 } onClick={ this.export }>
              <Icon type='download' /> 导出
            </AuthButton>
            <div>
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>文件格式支持excel</div>
          <BaseTable
            rowKeyType='componentId'
            data={ responseData } // 所有数据
            dataSource={ tableData } // list数据
            columns={ tableColumns }
            onChange={ this.onChange }
            selectedItems={ this.selectedItems } // 子组件传来的所有参数，顺序为：selectedRowKeys, selectedRows, selectedIds
            // 2种类型，{'checkbox'}多选 {'radio'}单选 不写type默认没有选框
            request={ this.requestList }
            scroll={{ x: 1900 }}
          />
          {/* <Modal
            title='上传文件'
            className='upload-files'
            visible={ true }
            onOk={ () => this.setModal1Visible(false) }
            onCancel={ () => this.setModal1Visible(false) }
          >
            <p>some contents...</p>
            <p>some contents...</p>
            <p>some contents...</p>
          </Modal> */}
        </Card>
        <Modal
          title='上传文件'
          visible={ showModal }
          // style={ modalStyle }
          footer={ null }
          onCancel={ this.handleCancel }
          className='modalContent'
        >
          { uploadType === 0 && <div className='tipContent'>
            <div className='modalLeft'>
              <span><Icon type='file' theme='filled' style={{ color: '#1890FF', marginRight: '8px' }} /></span>
              <span>{fileName}</span>
              <span className='squareButton'>{isAllFile}</span>
            </div>
            <div className='modalRight'>
              <div className='modalTop'>
                <span><Icon type='check-circle' theme='filled' style={{ color: '#52c41a' }} /></span>
                <span style={{ color: '#52c41a', marginLeft: '8px' }} >上传成功</span>
              </div>
              <div className='modalBottom'>{ addErrorMsg }</div>
            </div>
          </div> }
          { uploadType === 1 && <div className='tipContent'>
            <div className='modalLeft'>
              <span><Icon type='file' theme='filled' style={{ color: '#1890FF', marginRight: '8px' }} /></span>
              <span>{fileName}</span>
              <span className='squareButton'>{isAllFile}</span>
            </div>
            <div className='modalRight'>
              <div className='modalTop'>
                <span><Icon type='close-circle' theme='filled' style={{ color: '#f5222d' }} /></span>
                <span style={{ color: '#f5222d', marginLeft: '8px' }} >上传失败</span>
              </div>
              <div className='modalBottom'>{ addErrorMsg }</div>
            </div>
          </div> }
        </Modal>
      </div>
    )
  }
}

export default Parts
