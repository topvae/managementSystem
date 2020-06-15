import React from 'react'
import './index.less'
import { Card, Modal } from 'antd'
import moment from 'moment'
import ServiceForm from './../../../components/Form/baseForm'
import { withRouter } from 'react-router-dom'
import { post_service_edit, post_service_add, post_service_copy, post_service_details } from '../../../services/api'
import { ServiceformList, Serviceconfig, hideServiceconfig } from './formList'
class AddOrEditService extends React.Component {
  state = {
    checkBoxChecked: false
  }
  componentDidMount() {
    if (!window.location.href.includes('addService')) {
      this.showServiceDetails()
    }
  }
  // 只有在复制和修改页面的时候请求接口赋值
  showServiceDetails = () => {
    const serveId = sessionStorage.getItem('serveId')
    post_service_details({ serveId: serveId }).then(res => {
      const data = res.data.responseData
      this.setState(
        {
          updateList: {
            serveName: data.serveName,
            sendType: data.sendType,
            fileType: data.fileType,
            forcingType: data.forcingType,
            encryptType: data.encryptType,
            remark: data.remark,
            effectDate: moment(data.effectDate),
            availableNotVisibleDate: data.availableNotVisibleDate ? moment(data.availableNotVisibleDate) : moment().add(1, 'days')
          },
          productName: data.productName,
          productNo: data.productNo,
          // 服务状态可用不可见，接口有值的情况下，checkBoxChecked为选中☑️状态，否则不能选中
          checkBoxChecked: !!data.availableNotVisibleDate
        }
      )
    })
  };

  // 时间改变方法   从baseform中调用父组件的方法（注释的地方会影响两个时间） baseForm->addOrEditService
  dateChange =(date, dateString) => {
    // console.log(dateString)
    this.setState({
      // updateList: {
      //   effectDate: moment(dateString),
      //   // availableNotVisibleDate: dateString
      // },
    })
  }
  // 显示产品方法  从baseform中调用父组件的方法 由chooseProduct->baseForm->addOrEditService
  showProductNo = (paramsNo, paramsName) => {
    this.setState({
      productNo: paramsNo,
      productName: paramsName
    })
  }
  // 勾选方法  从baseform中调用父组件的方法 baseForm->addOrEditService
  CheckboxChange =(e) => {
    this.setState({
      checkBoxChecked: e.target.checked
    })
  }
  // 在这里判断是复制还是修改
  handleFilterSubmit = (filterParams) => {
    if (window.location.href.includes('editService')) {
      this.editService(filterParams)
    } else if (window.location.href.includes('copyService')) {
      this.copyService(filterParams)
    } else if (window.location.href.includes('addService')) {
      this.addService(filterParams)
    }
  };
  // 重置的时候跳转到服务list页面
  handleReset =() => {
    this.props.history.push('/serviceManagement/queryService')
  }

  // 新增服务
  addService = (filterParams) => {
    post_service_add({ ...filterParams })
      .then(res => {
        Modal.success({
          title: '服务新增成功'
        })
        this.props.history.push('/serviceManagement/queryService')
      })
  }

  // 服务修改保存
  editService = (filterParams) => {
    post_service_edit({
      ...filterParams,
      serveId: sessionStorage.getItem('serveId')
    })
      .then(res => {
        Modal.success({
          title: '服务修改成功'
        })
        this.props.history.push('/serviceManagement/queryService')
      })
  }
  // 服务复制保存
  copyService = (filterParams) => {
    post_service_copy({
      ...filterParams,
      serveNo: sessionStorage.getItem('serveNo')
    })
      .then(res => {
        Modal.success({
          title: '服务复制成功'
        })
        this.props.history.push('/serviceManagement/queryService')
      })
  }
  // 复制的方法保存

  render() {
    // 注意：updateList是请求接口出来的
    return (
      <div className='content'>
        <Card className='service'>
          <ServiceForm
            formList={ ServiceformList }
            config={
              window.location.href.includes('showServiceDetails')
                ? hideServiceconfig
                : Serviceconfig
            }
            filterSubmit={ this.handleFilterSubmit }
            handleReset={ this.handleReset }
            updateList={ this.state.updateList } // 传给公共组件的updateList
            productName={ this.state.productName } // 传给子组件的产品名称
            productNo={ this.state.productNo } // 传给子组件编号
            // dateChange = {this.dateChange}
            showProductNo={ this.showProductNo } // chooseProduct传给baseForm然后在传给editService
            checkBoxChecked={ this.state.checkBoxChecked } // 勾选框改变的布尔值
            CheckboxChange={ this.CheckboxChange } // 勾选框改变的方法
          />
        </Card>
      </div>
    )
  }
}

export default withRouter(AddOrEditService)
