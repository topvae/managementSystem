import React, { useState, useEffect, useCallback } from 'react'
import './index.less'
import { Card, Modal } from 'antd'
import ServiceAlertForm from '../../../components/Form/baseForm'
import { withRouter } from 'react-router-dom'
import {
  AlertServiceformList,
  AlertServiceconfig,
  hideAlertServiceconfig
} from './formList'
import {
  get_serve_details,
  post_serve_add,
  post_serve_copy,
  post_serve_update
} from '../../../services/api'
import { setDate } from './../../../utils/utils'
import {
  getServeSendType,
  getServeState,
  getServeWarnPeriod
} from './selectRequests.js'
import moment from 'moment'
let formRef
function AddOrEditAlertService(props) {
  const [updateList, setUpdateList] = useState({})
  const [productName, setProductName] = useState()
  const [productNo, setProductNo] = useState()
  const [alertServiceform, setalertServiceform] = useState([])
  const [checkBoxChecked, setCheckBoxChecked] = useState(false)

  useEffect(() => {
    const showServiceDetails = () => {
      if (!window.location.href.includes('addService')) {
        // 只有查看/复制/修改页面的时候请求接口赋值
        // 注意：updateList是请求接口出来的
        const serveId = sessionStorage.getItem('warnServeId')
        get_serve_details({ warnServeId: serveId }).then(res => {
          const data = res.data.responseData
          setUpdateList({
            warnServeName: data.warnServeName,
            warnPeriod: data.warnPeriod,
            sendType: data.sendType,
            fileType: data.fileType,
            merge: data.merge,
            forcing: data.forcing,
            encrypt: data.encrypt,
            warnContent: data.warnContent, // 这块的生成应该需要请求接口
            remark: data.remark,
            effectDate: moment(data.effectDate),
            availableNotVisibleDate: data.availableNotVisibleDate
              ? moment(data.availableNotVisibleDate)
              : moment().add(1, 'days')
          })
          setProductName(data.productName)
          setProductNo(data.productNo)
          // setDisabledDate(data.effectDate);
          // 服务状态可用不可见，接口有值的情况下，checkBoxChecked为选中状态，否则不能选中
          setCheckBoxChecked(!!data.availableNotVisibleDate)
        })
      }
    }
    showServiceDetails()
  }, [])

  useEffect(() => {
    const getRules = (val, datas, formVal) => {
      return formVal.map((item, index) => {
        if (item.field === val) {
          item.rules = datas
        }
        return {
          ...item
        }
      })
    }
    // 发送类型
    getServeSendType().then(res => {
      const datas = setDate(res)
      const formList1 = getRules('sendType', datas, AlertServiceformList)
      setalertServiceform(formList1)
    })
    // 服务状态
    getServeState().then(res => {
      const datas = setDate(res)
      const formList1 = getRules('effectState', datas, AlertServiceformList)
      setalertServiceform(formList1)
    })
    // 预警周期
    getServeWarnPeriod().then(res => {
      const datas = setDate(res)
      const formList1 = getRules('warnPeriod', datas, AlertServiceformList)
      setalertServiceform(formList1)
    })
  }, [])

  // 显示产品方法  从baseform中调用父组件的方法 由chooseProduct->baseForm->addOrEditService
  const showProductNo = (paramsNo, paramsName, paramsRemark) => {
    setProductNo(paramsNo)
    setProductName(paramsName)
    formRef.props.form.setFieldsValue({ 'remark': paramsRemark })
  }
  // 勾选方法  从baseform中调用父组件的方法 baseForm->addOrEditService
  const CheckboxChange = e => {
    setCheckBoxChecked(e.target.checked)
  }
  const handleFilterSubmit = useCallback(
    filterParams => {
      // console.log("filterParams", filterParams);
      const addService = filterParams => {
        post_serve_add({ ...filterParams }).then(res => {
          Modal.success({
            title: '服务新增成功'
          })
          props.history.push('/serviceManagement/warningService')
        })
      }
      // 服务修改保存
      const editService = filterParams => {
        // console.log(filterParams, "filterParams");
        // 在修改的时候首先先判断下中文是否都转成了数字

        post_serve_update({
          ...filterParams,
          warnServeId: sessionStorage.getItem('warnServeId')
        }).then(res => {
          Modal.success({
            title: '服务修改成功'
          })
          props.history.push('/serviceManagement/warningService')
        })
      }

      // 服务复制保存  需要传入预警服务编号 服务编号
      const copyService = filterParams => {
        filterParams.warnServeNo = sessionStorage.getItem('warnServeNo')
        filterParams.warnServeId = sessionStorage.getItem('warnServeId')
        filterParams.swichCode = sessionStorage.getItem('swichCode')
        post_serve_copy({
          ...filterParams,
          warnServeNo: sessionStorage.getItem('warnServeNo')
        }).then(res => {
          Modal.success({
            title: '服务复制成功'
          })
          props.history.push('/serviceManagement/warningService')
        })
      }
      if (window.location.href.includes('editService')) {
        editService(filterParams)
      } else if (window.location.href.includes('copyService')) {
        copyService(filterParams)
      } else if (window.location.href.includes('addService')) {
        addService(filterParams)
      }
    },
    [props.history]
  )
  // 新增服务

  // 重置的时候跳转到服务list页面
  const handleReset = () => {
    props.history.push('/serviceManagement/warningService')
  }
  return (
    <div className='content'>
      <Card className='alertService'>
        <ServiceAlertForm
          wrappedComponentRef={ (inst) => (formRef = inst) }
          formList={ alertServiceform }
          config={
            window.location.href.includes('showServiceDetails')
              ? hideAlertServiceconfig
              : AlertServiceconfig
          }
          filterSubmit={ handleFilterSubmit }
          handleReset={ handleReset }
          updateList={ updateList }
          productName={ productName } // 传给子组件的产品名称
          productNo={ productNo } // 传给子组件编号
          showProductNo={ showProductNo } // chooseProduct传给baseForm然后在传给editService
          checkBoxChecked={ checkBoxChecked } // 勾选框改变的布尔值
          CheckboxChange={ CheckboxChange } // 勾选框改变的方法
        />
      </Card>
    </div>
  )
}

export default withRouter(AddOrEditAlertService)
