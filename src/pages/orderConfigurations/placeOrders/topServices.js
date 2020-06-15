/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2019-10-10 12:02:04
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useCallback, useEffect } from 'react' // { , useEffect, }
import { Card, Icon, Modal, Form, message } from 'antd'
import { withRouter } from 'react-router-dom'
import ChooseService from './index'
import './index.less'
// import { get_orders_details } from "./../../../services/api";
function TopServices(props) {
  const { location, FatherTopServices, FatherServiceKeys, FatherSetServicesDate, FatherEffectState, getTopServices } = props
  const param = location.pathname
  const [topServices, setTopServices] = useState([]) // 新增服务--选择的服务
  const [serviceKeys, setServiceKeys] = useState([]) // 服务的keys
  const [visible, setVisible] = useState(false)
  const [ifModalOk, setIfModalOk] = useState(false)
  const [selectedRows, setSelectedRows] = useState([]) // 选中的selectedServeRows

  // 新增的时候传过来的服务
  useEffect(() => {
    if (param.includes('addOrder')) {
      const servicesDate = JSON.parse(sessionStorage.getItem('selectedService'))
      const servicekeys = JSON.parse(
        sessionStorage.getItem('selectedServicekeys')
      )
      setTopServices(servicesDate)
      getTopServices(servicesDate) // 传给父组件服务
      setServiceKeys(servicekeys)
    }
  }, [param, getTopServices])

  // 转换成传给后台的格式service
  useEffect(() => {
    const service =
    topServices &&
    topServices.map(item => {
      return {
        serveNo: item.serveNo,
        type: item.type
      }
    })
    // setServicesDate(service); //将循环出来的item存放在servicesDate
    FatherSetServicesDate(service)
  }, [topServices, FatherSetServicesDate])

  useEffect(() => {
    if (param.includes('editOrder')) {
      setTopServices(FatherTopServices)
      setServiceKeys(FatherServiceKeys)
      // setIfContainWarnService(FatherIfContainWarnService)
    }
  }, [param, FatherTopServices, FatherServiceKeys])

  // 点击按钮删除下订单上面的服务
  const deleteServiceItem = useCallback(
    params => {
      const filteredServices = topServices.filter(
        item => item.serveConfigId !== params.serveConfigId
      )
      const filteredKeys = serviceKeys.filter(
        item => item !== params.serveConfigId
      )
      setTopServices(filteredServices)
      getTopServices(filteredServices)
      setServiceKeys(filteredKeys)
      // 注意：要改变session处理！！！！
    },
    [topServices, serviceKeys, getTopServices]
  )

  // 选择器中的服务改变的时候调用的方法
  const showServices = useCallback(params => {
    setTopServices(params)
  }, [])

  // 从modal中选择服务
  const showServiceKeys = useCallback(params => {
    setServiceKeys(params)
  }, [])

  // 选择服务
  const chooseService = () => {
    setVisible(true)
  }
  const handleCancel = () => {
    setVisible(false)
  }
  const closeModal = () => {
    setIfModalOk(false)
  }
  // modal点击确定的时候
  const handleOk = () => {
    const warnServiceRows = selectedRows.filter(item => item.creditType !== -1)// 筛选出所有的预警服务
    const sameCreditType = warnServiceRows.every(item => item.creditType === warnServiceRows[0].creditType)

    if (sameCreditType) {
      setIfModalOk(true) // 给自组件传过去
      setTimeout(() => {
        setVisible(false)
      })
      getTopServices(selectedRows)
    } else {
      message.warning('请选择信用主体类型一致的服务组成订单')
    }
    // 调用父组件的方法传过去值
  }

  const FatherSelectedRows = useCallback((params) => {
    setSelectedRows(params)
  }, [])
  // 展示下订单上面的服务
  const showTopService = useCallback(
    params => {
      const sendTypeList = ['短信', '邮件', '接口'] // 传送方式
      const warnPeriodList = ['周', '月', '季', '半年', '年'] // 预警周期
      return (
        params &&
        params.map((item, index) => {
          return (
            <Card
              className='service_title'
              style={{ width: '250px' }}
              key={ index }
            >
              <div className='delete'>
                <Icon
                  type='delete'
                  onClick={ () => deleteServiceItem(item) }
                  style={{ display: FatherEffectState ? 'none' : 'inline' }}
                />
              </div>
              <h3>
                <img
                  src={
                    item.type === 1
                      ? './assets/iconRed.png'
                      : './assets/iconBlue.png'
                  }
                  style={{ paddingRight: '10px' }}
                  alt=''
                />
                {item.serveName}
              </h3>
              <div className='card_item'>
                <div className='card_item_length'>
                  <div className='sendType'>传送方式</div>
                  <h3>{sendTypeList[item.sendType]}</h3>
                </div>
                {item.type === 1 ? ( // ---------这快实际情况需要根据后台字段改
                  <div className='card_item_length'>
                    <div className='sendType'>预警周期</div>
                    <h3>{warnPeriodList[item.warnPeriod]}</h3>
                  </div>
                ) : null}
              </div>
            </Card>
          )
        })
      )
    },
    [deleteServiceItem, FatherEffectState]
  )

  return (
    <div>
      <div className='add_order'>
        <Card
          className='card_style'
          bordered={ false }
          title='选择服务'
          extra={
            <span className='card_title' onClick={ chooseService } style={{ display: FatherEffectState ? 'none' : 'inline' }}>
              <Icon type='menu' style={{ paddingRight: '10px' }} />
              编辑
            </span>
          }
        >
          {showTopService(topServices)}
        </Card>
        <Modal
          title='选择服务'
          destroyOnClose={ true }
          width={ 1400 }
          maskClosable={ false }
          visible={ visible }
          onOk={ handleOk }
          okText='选择服务'
          onCancel={ handleCancel }
          bodyStyle={{ padding: '0px' }}
        >
          <ChooseService
            ifModalOk={ ifModalOk }
            showServices={ showServices }
            visible={ visible }
            showServiceKeys={ showServiceKeys } // 新增的时候从子组件传过来的方法
            topServices={ topServices } // 修改传给子组件的服务
            serviceKeys={ serviceKeys }
            FatherSelectedRows={ FatherSelectedRows }
            closeModal={ closeModal }
          />
        </Modal>
      </div>
    </div>
  )
}
export default Form.create()(withRouter(TopServices))
