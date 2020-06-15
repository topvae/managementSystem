/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2020-04-07 14:41:43
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import Calculate from './calculate.js'
import BaseForm from '../../../../components/Form'
import { Modal } from 'antd'
import { add_parts, copy_save_component, get_parts_detail, updata_parts } from '../../../../services/api'
import './index.less'

function CalculateBox(props) {
  const [saveList, setSaveList] = useState([]) // 可以操作的零件列表
  const [componentNo, setComponentNo] = useState('')
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null) // 回显的时候 二级id
  const [currentOfficeId, setCurrentOfficeId] = useState(null) // 回显的时候 一级id
  // const [editType, setEditType] = useState(null) // 1. 复制  2. 修改
  // const [componentId, setComponentId] = useState('') // 修改或者复制的id  id存在用更新接口  不存在用新增接口
  const [componentContentCn, setComponentContentCn] = useState('') // 回显控制计算框回显
  const [isEditorErr, setIsEditorErr] = useState(false) // 计算框的错误提示是否展示
  const [updateList, setUpdateList] = useState({})
  // const [formListRule, setFormListRule] = useState([{ id: 0, rule: '计算规则1' }, { id: 1, rule: '计算规则2' }, { id: 2, rule: '计算规则3' }])
  const [partsNameList, setPartsNameList] = useState([]) // 保存零件名称
  const [componentNoList, setComponentNoList] = useState([]) // 保存零件编号
  const [formList, setFormList] = useState([])
  const [includeComponents, setIncludeComponents] = useState([])
  const { changeKeepList, getcomponentFieldType } = props

  // 获取url里面的数字id 进行查询
  const pathSnippets = props.location.pathname.split('/').filter(i => i)
  let componentId = pathSnippets.filter(i => {
    return !isNaN(i)
  })
  componentId = componentId[0]

  // 获取进入页面的状态
  let editType = props.editType
  // editType 1: 复制  2: 修改
  if (!editType) {
    editType = sessionStorage.getItem('editType')
  }

  // 根据类型请求数据
  useEffect(() => {
    const getFormList = (flag) => {
      return [
        {
          type: 'INPUT',
          label: '零件名称:',
          field: 'componentName',
          placeholder: '请输入零件名称',
          width: 300,
          required: true,
          requiredMsg: '请输入零件名称',
          validatorType: 'calculatePartsName',
          disabled: flag
        },
        {
          type: 'SELECT',
          label: '一级分类:',
          field: 'officeId',
          placeholder: '请输入一级名称名称查找',
          width: 300,
          required: true,
          requiredMsg: '请输入一级名称名称',
          searchType: 1,
          disabled: flag
        },
        {
          type: 'SELECT',
          label: '二级分类:',
          field: 'departmentId',
          placeholder: '请输入二级名称名称查找',
          width: 300,
          required: true,
          requiredMsg: '请输入二级名称名称',
          searchType: 2,
          disabled: flag
        },
        {
          type: 'INPUT',
          label: '输出外码:',
          field: 'swichCode',
          placeholder: '请输入输出外码',
          width: 300,
          required: true,
          requiredMsg: '请输入输出外码',
          disabled: flag
        },
        {
          type: 'DATE',
          label: '生效时间:',
          field: 'effectDate',
          placeholder: '请输入',
          required: true,
          requiredMsg: '请输入',
          width: 300,
          defaultValue: moment().add(1, 'days').format('YYYY-MM-DD'),
          disabledDate: moment().add(1, 'days').format('YYYY-MM-DD')
        },
        {
          type: 'TEXTAREA',
          label: '备注:',
          field: 'remark',
          placeholder: '请输入',
          width: 400,
          required: true,
          disabled: flag,
          requiredMsg: '请输入'
        },
        {
          type: 'TEXTAREA',
          label: '用途名称:',
          field: 'purpose',
          placeholder: '请输入',
          width: 400,
          disabled: flag,
          required: true,
          requiredMsg: '请输入'
        }
      ]
    }
    // 新增 修改的时候获取详情
    const getPartDetail = () => {
      get_parts_detail({ componentId }).then(res => {
        const responseData = res.data.responseData
        const partsNameList = []
        const componentNoList = []
        // 回显中文格式的计算框内容
        const componentContentCn = responseData.componentContentCn
        getcomponentFieldType(responseData.componentFieldType) // 数据类型
        const obj = {}
        const includeComponents = responseData.includeComponents
        obj.purpose = responseData.purpose
        obj.departmentId = responseData.departmentName
        obj.officeId = responseData.officeName
        obj.remark = responseData.remark
        obj.swichCode = responseData.swichCode // 修改情况： 输出外码不能改
        obj.componentName = responseData.componentName // 修改情况： 零件名称不能改
        obj.effectDate = moment(responseData.effectDate, 'YYYY-MM-DD') // 修改情况： 生效时间不能改
        setIncludeComponents(includeComponents)
        // 复制修改进入时 留存项接口读取 然后放入缓存 供弹框里面读取
        if (includeComponents && (includeComponents.length > 0)) {
          includeComponents.map((item) => {
            partsNameList.push(item.componentName + '-' + item.departmentName + '-' + item.officeName)
            return partsNameList
          })
          includeComponents.map((item) => {
            componentNoList.push(item.componentNo)
            return componentNoList
          })
        }
        setComponentNoList(componentNoList)
        setPartsNameList(partsNameList) // 复制修改进页面  留存项从接口includeComponents取
        setSaveList(includeComponents && includeComponents.length > 0 ? includeComponents : []) // 复制修改的时候 将留存项覆盖掉 读后端提供的数据  因为：所使用到的零件作为了复制修改的留存项，并不是零件列表带入
        setComponentNo(responseData.componentNo) // 当前新增或者修改的时候带过来的零件编号
        setCurrentDepartmentId(responseData.departmentId) // 回显的时  记录一级二级分类id
        setCurrentOfficeId(responseData.officeId)
        setUpdateList(obj)
        setComponentContentCn(componentContentCn)
      })
    }
    let formList
    // 复制或修改
    if (editType === '2' || editType === '1') {
      formList = getFormList(true)
      getPartDetail(parseInt(componentId))
    } else {
      // 新增 获取前一个页面带入的留存项  return 零件中文名称的数组
      formList = getFormList(false)
    }
    setFormList(formList)
  }, [componentId, editType, getcomponentFieldType])

  useEffect(() => {
    if (includeComponents && includeComponents.length > 0) {
      changeKeepList(includeComponents)
    }
  }, [includeComponents, changeKeepList])

  useEffect(() => {
    const getPartObj = (parts) => {
      // 获取留存的零件名称
      const partsNameList = []
      // 获取留存的零件编号
      const componentNoList = []
      if (parts && parts.length > 0) {
        parts.map((item) => {
          partsNameList.push(item.componentName + '-' + item.departmentName + '-' + item.officeName)
          return partsNameList
        })
        // 获取前一个页面带入的留存项  return 零件编号的的数组
        parts.map((item) => {
          componentNoList.push(item.componentNo)
          return componentNoList
        })
        setComponentNoList(componentNoList)
        setSaveList(parts)
        setPartsNameList(partsNameList)
      } else {
        setComponentNoList([])
        setSaveList([])
        setPartsNameList([])
      }
    }
    // 复制或修改
    if (editType === '2' || editType === '1') {
      getPartObj(includeComponents)
      // 留存项有变动 替换includeComponents
      setIncludeComponents(props.partsList)
    } else {
      getPartObj(props.partsList)
    }
  }, [props.partsList, editType, includeComponents])

  // 数据请求 editType 1: 复制  2: 修改
  const request = async(params) => {
    if (componentId && editType === '2') {
      const res = await updata_parts({ ...params })
      const responseData = res.data.responseData
      if (responseData.result) {
        props.history.push({ pathname: '/product/parts' })
      } else {
        Modal.warning({
          title: '提示',
          content: responseData.msg
        })
      }
    } else {
      // copy_save_component: 复制新增
      // add_parts 普通新增
      const res = editType === '1' ? await copy_save_component({ ...params }) : await add_parts({ ...params })
      const responseData = res.data.responseData
      if (responseData.result) {
        props.history.push({ pathname: '/product/parts' })
      } else {
        Modal.warning({
          title: '提示',
          content: responseData.msg
        })
      }
    }
  }

  // 表单提交
  const handleFilterSubmit = (filterParams) => {
    // 添加计算框的内容  提交给后台
    if (componentContentCn) {
      // 将计算框内容处理成后台要的格式 在零件名称前后加$
      // componentContent: 计算框的内容
      // partsNameList: 零件名称
      // getCalculateValue return 一个后端需要的字符串
      // let submitValue = getCalculateValue(componentContentCn, partsNameList)
      // 计算框处理好之后塞进参数列表

      // 中文格式的计算框内容
      filterParams.componentContentCn = componentContentCn
      const newContent = contentReplace(2, componentContentCn)
      // 数字格式的计算框内容
      filterParams.componentContent = newContent
      // 零件类型  0 原子零件  1 组合零件
      filterParams.type = 1

      // 包含的原子零件编号，逗号分隔
      const getComponentNoList = contentReplace(1, componentContentCn)
      filterParams.includeComponents = getComponentNoList.join(',')

      // 零件表达式类型   0 计算框   1 条件表达式
      filterParams.componentContentType = 0

      // 传给后端的时间 格式转换
      filterParams.effectDate = moment(filterParams.effectDate).format('YYYY-MM-DD')

      // 零件的id
      filterParams.componentId = componentId
      // 新增的时候需要给 新增前的旧零件的编号
      filterParams.componentNo = componentNo

      // 一级二级分类没有改变的情况下  读取回显的时候的id
      filterParams.officeId = currentOfficeId
      filterParams.departmentId = currentDepartmentId

      // 数据类型
      filterParams.componentFieldType = props.componentFieldType

      request(filterParams)
    } else {
      setIsEditorErr(true)
    }
  }

  const config = {
    layout: 'inline',
    btnType: 'editSave',
    btnFonts: '保存',
    cancelFn: () => {
      props.history.push('/product/parts')
    },
    btnSpan: 4,
    formListSpan: 24,
    labelAlign: 'right'
  }

  // 获取计算框的value
  const getValue = (componentContentCn) => {
    setComponentContentCn(componentContentCn)
  }

  // 计算框内容中的中文零件名称替换成零件数字编号
  // componentContentCn:计算框内容
  // componentNoList ：零件编号数组
  // partsNameList：留存项零件中文名
  // type  1: 零件编号数组   2：整个计算框内容的零件名称替换成零件编号
  const contentReplace = (type, componentContentCn) => {
    const arr = []
    partsNameList.forEach((item, index) => {
      if (componentContentCn.indexOf(item) !== -1) {
        componentContentCn = componentContentCn.replace(new RegExp(item, 'g'), `${ componentNoList[index] }`)
        componentContentCn = componentContentCn.replace(/\$/g, '')
        if (type === 1) {
          arr.push(componentNoList[index])
        }
      }
    })
    if (type === 1) {
      return arr
    } else {
      return componentContentCn
    }
  }

  const notifyError = (flag) => {
    if (flag) {
      setIsEditorErr(true)
    }
  }

  // 当一级二级分类更改时候 执行
  const getSearchOnChangeValue = (searchType, value) => {
    if (searchType === 1) {
      setCurrentOfficeId(value)
    } else {
      setCurrentDepartmentId(value)
    }
  }

  // saveList 可以操作的零件列表
  // isEditorErr  错误提示是否展示
  // updataCalculateValue  控制计算框的数据回显
  // updateList  控制表单的数据回显
  return (
    <div className='processContent'>
      <Calculate
        calculateValue={ componentContentCn }
        saveList={ saveList }
        value={ getValue }
        isEditorErr={ isEditorErr }
        componentContentCn={ componentContentCn }
        componentFieldType={ props.componentFieldType }
      />
      <BaseForm
        formList={ formList }
        config={ config }
        filterSubmit={ handleFilterSubmit }
        notifyError={ notifyError }
        updateList={ updateList }
        getSearchOnChangeValue={ getSearchOnChangeValue } // 一级分类 二级分类 改变的时候更改组件状态
        searchOneID={ currentOfficeId }
      />
    </div>
  )
}

export default withRouter(CalculateBox)
