/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2020-04-07 14:40:48
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Button, Modal } from 'antd'
import ConditionTree from './tree'
import Calculate from './calculate.js'
import BaseForm from '../../../../components/Form'
import IntoRuleModal from '../intoRuleModal'
import { isNameExist, changeArray, replaceTreeData } from '../../../../utils/utils'
import SaveRuleModal from '../saveRulesModal'
import { ModalBaseFormConfig, ModalBaseFormFormItemLayout, reuseFormListFormItemLayout, parConditionOne } from './modal'
import { add_parts, copy_save_component, updata_parts, get_parts_detail, pre_calcualte } from '../../../../services/api'
import moment from 'moment'
import { wrapAuth } from '../../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

class Condition extends React.Component {
  state = {
    outputErr: false, // 计算框的错误提示是否展示
    expressionErr: false, // 计算框的错误提示是否展示
    includeComponents: [], // 新增的时候 储存留存项的零件编号   复制修改时候 储存 使用的零件编号
    editType: null, // editType 1: 复制  2: 修改
    componentNoStr: null, // 逗号分隔零件编号
    componentContentType: 1, // 计算框0  条件表达式1
    currentDepartmentId: null, // 回显的时候 二级id
    currentOfficeId: null, // 回显的时候 一级id
    saveRuleVisible: false, // 保存规则modal显隐
    intoRuleVisible: false, // 导入规则modal显隐
    reuseEditTree: null, //  被复用的条件判断
    reuseVisible: false, // 复用条件的弹框
    deleteConditionArr: [], // 待删除的条件
    superiorHide: false, // 上级条件是否隐藏
    checkedKeys: [], // tree 选中项
    isEdit: false, // false：点击新建按钮  true：点击编辑按钮
    partsNameList: [], // 留存的零件名称列表
    // componentNoList: [],             // 加工过程中 使用过的零件编号列表
    partsNameDictionaries: [], // 零件名称与编码的键值对
    treeData: [], // 条件判断tree
    productionCondition: null, // 当前 点击确认 生成的tree
    optionKey: parConditionOne, // 当前点击确定生成的条件 要插入的节点的key
    BaseFormUpdateList: {}, // 表单数据回显
    addModalBaseFormUpdateList: {}, // modal表单数据回显
    visible: false,
    formList: [],
    parCondition: [ // 条件判断的下拉框数据
      {
        id: parConditionOne,
        rule: '空',
        key: parConditionOne // 新建条件 点击确定以后  根据option的下标 把数据插入到具体的children下面
      }
    ]
  }

  componentDidMount() {
    let formList
    // 为了解决eslint报错 但是不想改业务代码
    let { editType } = this.props
    const { partsList } = this.props
    // 获取url里面的数字id 进行查询
    const { location } = this.props
    const pathSnippets = location.pathname.split('/').filter(i => i)
    // 过滤数字类型
    const componentId = pathSnippets.filter(i => {
      return !isNaN(i)
    })
    if (!editType) {
      editType = sessionStorage.getItem('editType')
    }
    // editType 1: 复制  2: 修改
    if (editType === '2' || editType === '1') {
      formList = this.getFormList(true)
      this.getPartDetail(parseInt(componentId))
    } else {
      formList = this.getFormList(false)
      this.getPartObj(partsList)
    }
    this.setState({
      formList,
      editType,
      componentId: componentId[0]
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.partsList !== nextProps.partsList) {
      this.setState({
        partsList: nextProps.partsList
      })
      this.getPartObj(nextProps.partsList)
    }
  }

  baseFormConfig = {
    layout: 'inline',
    btnType: 'editSave',
    btnFonts: '保存',
    cancelFn: () => {
      this.props.history.push('/product/parts')
    },
    btnSpan: 4,
    formListSpan: 24
  }

  addBaseFormListConfig = {
    layout: 'inline',
    btnType: 'editSave',
    btnFonts: '保存',
    cancelFn: () => {
      this.setState({
        visible: false,
        outputCnValue: '',
        expressionCnValue: '',
        outputErr: false,
        expressionErr: false
      })
    },
    btnSpan: 4,
    formListSpan: 24
  }

  getFormList = (flag) => {
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
        placeholder: '请输入备注',
        width: 400,
        required: true,
        requiredMsg: '请输入备注',
        disabled: flag
      },
      {
        type: 'TEXTAREA',
        label: '用途名称:',
        field: 'purpose',
        placeholder: '请输入用户名称',
        width: 400,
        required: true,
        requiredMsg: '请输入用户名称',
        disabled: flag
      }
    ]
  }

  // 表单提交
  handleFilterSubmit = (filterParams) => {
    let includeList = []
    const { treeData, componentId, currentDepartmentId, currentOfficeId, componentNo, componentContentType, partsNameDictionaries } = this.state
    if (treeData.length > 0) {
      const treeDataStr = JSON.stringify(treeData)
      filterParams.componentContent = treeDataStr
      filterParams.componentContentCn = treeDataStr
      // 零件类型  0 原子零件  1 组合零件
      filterParams.type = 1

      // 包含的原子零件编号，逗号分隔
      //
      // 将treeData里面涉及到的零件编号提取出来
      // 扁平化
      this.newArr = []
      const flattenArr = this.flatten(treeData)
      flattenArr.forEach(item => {
        // partsNameDictionaries: 留存项零件名称与零件编号的键值对
        for (const key in partsNameDictionaries) {
          if (item.expressionCn.indexOf(key) !== -1) {
            includeList.push(partsNameDictionaries[key])
          }
          if (item.outputCn.indexOf(key) !== -1) {
            includeList.push(partsNameDictionaries[key])
          }
        }
      })
      includeList = Array.from(new Set(includeList))
      filterParams.includeComponents = includeList.join(',')

      // 零件表达式类型   0 计算框   1 条件表达式
      filterParams.componentContentType = componentContentType
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
      filterParams.componentFieldType = this.props.componentFieldType
      this.request(filterParams)
    } else {
      Modal.warning({
        title: '提示',
        content: ' 请新建条件'
      })
    }

    // this.props.history.push({ pathname: '/product/parts' })
  }

  // 数据请求
  request = async(params) => {
    const { componentId, editType } = this.state
    if (componentId && editType === '2') {
      const res = await updata_parts({ ...params })
      const responseData = res.data.responseData
      if (responseData.result) {
        this.props.history.push({ pathname: '/product/parts' })
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
        this.props.history.push({ pathname: '/product/parts' })
        // message.success('操作成功', 1, () => {
        //   this.props.history.push({ pathname: '/product/parts' })
        // })
      } else {
        Modal.warning({
          title: '提示',
          content: responseData.msg
        })
      }
    }
  }

  getPartObj = (partsList) => {
    if (partsList && partsList.length > 0) {
      // 获取留存的零件名称
      const partsNameList = []
      // 获取留存的零件编号
      // let componentNoList = []
      const partsNameDictionaries = []
      // 保存零件名称
      partsList && partsList.map((item) => {
        partsNameList.push(item.componentName + '-' + item.departmentName + '-' + item.officeName)
        return partsNameList
      })
      // 保存零件名称与编号的键值对
      partsList && partsList.map((item) => {
        partsNameDictionaries[item.componentName + '-' + item.departmentName + '-' + item.officeName] = item.componentNo
        return partsNameDictionaries
      })
      this.setState({
        includeComponents: partsList,
        partsNameDictionaries,
        partsNameList
      })
    } else {
      this.setState({
        includeComponents: [],
        partsNameDictionaries: [],
        partsNameList: []
      })
    }
  }

  getPartDetail = async(componentId) => {
    const partsNameDictionaries = []
    const res = await get_parts_detail({ componentId })
    const responseData = res.data.responseData
    if (responseData.componentContentType === 0) return
    const componentContent = JSON.parse(responseData.componentContentCn) // 回显的trssDate
    // 将trssDate扁平化
    this.newArr = []
    const flattenArr = this.flatten(componentContent)
    // 循环每一项 取出零件名称  设置上级条件
    flattenArr.map(item => {
      this.setParCondition(item)
      return null
    })
    const obj = {}
    obj.purpose = responseData.purpose
    obj.departmentId = responseData.departmentName
    obj.officeId = responseData.officeName
    obj.remark = responseData.remark
    obj.swichCode = responseData.swichCode // 修改情况： 输出外码不能改
    obj.componentName = responseData.componentName // 修改情况： 零件名称不能改
    obj.effectDate = moment(responseData.effectDate, 'YYYY-MM-DD') // 修改情况： 生效时间不能改
    const includeComponents = responseData.includeComponents
    // 复制修改进入时 留存项接口读取 然后放入缓存 供弹框里面读取
    this.props.changeKeepList(includeComponents)
    this.props.getcomponentFieldType(responseData.componentFieldType) // 数据类型
    // 复制修改进页面  从接口拿includeComponents   保存零件名称与编号的键值对
    includeComponents && includeComponents.map((item) => {
      partsNameDictionaries[item.componentName + '-' + item.departmentName + '-' + item.officeName] = item.componentNo
      return partsNameDictionaries
    })
    this.setState({
      partsNameDictionaries,
      includeComponents: includeComponents,
      componentNo: responseData.componentNo,
      currentDepartmentId: responseData.departmentId, // 回显的时  记录一级二级分类id
      currentOfficeId: responseData.officeId,
      BaseFormUpdateList: obj,
      treeData: componentContent
    })
  }

  getTryResult = async() => {
    const { treeData, partsNameDictionaries } = this.state
    let includeList = []
    this.newArr = []
    const flattenArr = this.flatten(treeData)
    flattenArr.forEach(item => {
      for (const key in partsNameDictionaries) {
        if (item.expressionCn.indexOf(key) !== -1) {
          includeList.push(partsNameDictionaries[key])
        }
        if (item.outputCn.indexOf(key) !== -1) {
          includeList.push(partsNameDictionaries[key])
        }
      }
    })
    includeList = Array.from(new Set(includeList))
    const componentNoStr = includeList.join(',')
    const res = await pre_calcualte({
      express: JSON.stringify(treeData),
      componentNos: componentNoStr,
      componentContentType: 1, // 0：计算框   1：条件判断
      componentFieldType: this.props.componentFieldType // 数据类型
    })
    return res.data
  }

  // 规则校验
  tryFn = async() => {
    const res = await this.getTryResult()
    if (res.responseData) {
      Modal.success({
        title: '规则校验结果',
        content: '规则校验通过',
        okText: '确定'
      })
    } else {
      Modal.warn({
        title: '规则校验结果',
        content: res.responseMsg,
        okText: '确定'
      })
    }
  }

  // 处理tree
  getTree = () => {
    const { treeData } = this.state
    if (treeData.length > 0) {
      const tree = this.searchKey(treeData)
      this.setState({
        treeData: tree,
        visible: false,
        outputCnValue: '',
        expressionCnValue: '',
        outputErr: false,
        expressionErr: false
      })
    } else {
      const productionCondition = this.replaceProductionCondition()
      this.setState({
        treeData: [].concat(productionCondition),
        visible: false,
        outputCnValue: '',
        expressionCnValue: '',
        outputErr: false,
        expressionErr: false
      })
    }
  }

  // 递归寻找节点插入的位置 生成最终的tree
  searchKey = (treeData) => {
    // 为了解决eslint报错 但是不想改业务代码
    const { optionKey } = this.state
    let { productionCondition } = this.state
    // some函数 输入什么就输出什么 return treeData;很重要
    treeData.some((item) => {
      // 如果是顶级 直接拼接
      if (optionKey === parConditionOne) {
        productionCondition = this.replaceProductionCondition()
        treeData = treeData.concat(productionCondition)
        return treeData
      }
      // 如果有子集  递归
      if (item.children) {
        this.searchKey(item.children)
      }
      // 如果根据optionKey 找到了要插入的位置
      if (item.key === optionKey) {
        if (!item.children) {
          item.children = []
        }
        productionCondition = this.replaceProductionCondition()
        item.children.push(productionCondition)
        return treeData
      }
      return null
    })
    return treeData
  }

  // 每次设置新的tree的obj的之前 都将它的中文零件名称替换成零件编码
  replaceProductionCondition = (editTreeObj) => {
    // 为了解决eslint报错 但是不想改业务代码
    let { productionCondition } = this.state
    const { partsNameDictionaries } = this.state
    // let list = [];
    if (editTreeObj) {
      productionCondition = editTreeObj
    }
    let expressionCn = productionCondition.expressionCn
    let outputCn = productionCondition.outputCn
    for (const key in partsNameDictionaries) {
      if (expressionCn.indexOf(key) !== -1) {
        expressionCn = expressionCn.replace(new RegExp(key, 'g'), `${ partsNameDictionaries[key] }`)
        // list.push(partsNameDictionaries[key])
      }
      if (outputCn.indexOf(key) !== -1) {
        outputCn = outputCn.replace(new RegExp(key, 'g'), `${ partsNameDictionaries[key] }`)
        // list.push(partsNameDictionaries[key])
      }
    }
    // for (const key in partsNameDictionaries) {
    //   if (outputCn.indexOf(key) !== -1) {
    //     outputCn = outputCn.replace(new RegExp(key, "g"), `${partsNameDictionaries[key]}`)
    //   }
    // }
    // 去重
    // this.setState(preState => ({
    //   componentNoList: Array.from(new Set(preState.componentNoList.concat(list)))
    // }),()=>{
    // })
    // productionCondition.expression = expressionCn
    productionCondition.expression = expressionCn.replace(new RegExp('\\$', 'g'), '')
    productionCondition.output = outputCn.replace(new RegExp('\\$', 'g'), '')
    return productionCondition
  }

  //  -------------------------------------------- 来自子组件 strat -------------------------------------------------------
  // 获取所有tree的勾选项
  getCheckedKeys = (checkedKeys) => {
    this.setState({
      checkedKeys
    })
  }

  //  获取option改变的key
  handleChange = (optionValue) => {
    this.setState({
      // optionKey:this.state.parCondition[optionValue].key
      optionKey: parseInt(optionValue)
    })
  }

  //  -------------------------------------------- 来自子组件 end -------------------------------------------------------

  //  -------------------------------------------- 提取出去start -------------------------------------------------------

  //  数组扁平化
  newArr = []
  flatten = (arr) => {
    arr.map(item => {
      if (item.children) {
        this.flatten(item.children)
      }
      this.newArr.push(item)
      return null
    })
    return this.newArr
  }

  // 如果父级变了 从原来的数组对象里删除  并且重新插入
  // treeData: 总的treeData  要删除的editTree
  // deleteAndReplaceTreeData = (treeData, newTreeNode) => {
  //   treeData = treeData.filter(item => {
  //     if (item.children) {
  //       this.deleteAndReplaceTreeData(item.children, newTreeNode)
  //     }
  //     return item.key !== newTreeNode.key
  //   })
  //   return treeData
  // }

  //  -------------------------------------------- 提取出去end -------------------------------------------------------

  //  -------------------------------------------- 本组件方法 start -------------------------------------------------------

  // 修改tree
  editConditionTree = () => {
    const { treeData, checkedKeys } = this.state
    // this.setState({
    //   optionKey: parConditionOne
    // })
    if (checkedKeys.length === 0) {
      Modal.warning({
        title: '提示',
        content: ' 请选择需要修改的条件'
      })
      return
    }
    if (checkedKeys.length > 1) {
      Modal.warning({
        title: '提示',
        content: '只能选择一项修改'
      })
      return
    }
    this.newArr = []
    const flattenArr = this.flatten(treeData)
    const editTree = flattenArr.filter(item => {
      return item.key === parseInt(checkedKeys[0])
    })
    // 将setState改为同步
    setTimeout(() => {
      this.setState({
        visible: true,
        isEdit: true,
        superiorHide: true
      })
      this.setState({
        outputCnValue: editTree[0].outputCn,
        expressionCnValue: editTree[0].expressionCn,
        editTree: editTree[0],
        addModalBaseFormUpdateList: {
          title: editTree[0].title
        }
      })
    })
  }

  // 设置上级条件
  setParCondition = (fieldsValue) => {
    const { parCondition } = this.state
    const obj = {}
    obj.id = fieldsValue.key
    obj.rule = fieldsValue.title
    obj.key = fieldsValue.key
    const res = parCondition.findIndex((item) => {
      return item.rule === fieldsValue.title
    })
    if (res === -1) {
      parCondition.push(obj)
      this.setState({
        parCondition
      })
    }
  }

  // 当一级二级分类更改时候 执行
  getSearchOnChangeValue = (searchType, value) => {
    if (searchType === 1) {
      this.setState({
        currentOfficeId: value
      })
    } else {
      this.setState({
        currentDepartmentId: value
      })
    }
  }

  //  -------------------------------------------- 本组件方法 end -------------------------------------------------------

  //  -------------------------------------------- 复用modal  start -------------------------------------------------------
  // 复用条件
  reuse = () => {
    // checkedKeys 选中的条件数组
    // treeData   总的树形结构的数组
    // 为了解决eslint报错 但是不想改业务代码
    let { checkedKeys } = this.state
    const { treeData } = this.state
    this.setState({
      optionKey: parConditionOne
    })
    if (checkedKeys.length === 0) {
      Modal.warning({
        title: '提示',
        content: ' 请选择需要复用的条件'
      })
      return
    }
    if (checkedKeys.length > 1) {
      Modal.warning({
        title: '提示',
        content: '只能选择一项复用'
      })
    } else {
      // 扁平化
      this.newArr = []
      const flattenArr = this.flatten(treeData)
      checkedKeys = parseInt(checkedKeys[0])
      // editTree : 被复用条件的提取
      const reuseEditTree = flattenArr.filter(item => {
        return item.key === checkedKeys
      })
      setTimeout(() => {
        this.setState({
          visible: false,
          reuseVisible: true,
          reuseEditTree: reuseEditTree[0]
        })
      }, 0)
    }
  }

  // 复用弹框点击ok事件
  reuseOnOk = () => {
    const formRef = this.reuseFormRef.props.form
    const { optionKey, treeData, reuseEditTree } = this.state
    formRef.validateFields((err, values) => {
      if (!err) {
        this.setState({
          checkedKeys: []
        })
        const fieldsValue = formRef.getFieldsValue()
        // 条件名称存在就不保存
        this.newArr = []
        const flattenArr = this.flatten(treeData)
        const isNameExistFlag = isNameExist(flattenArr, fieldsValue.reuseName)
        if (isNameExistFlag) {
          Modal.warning({
            title: '提示',
            content: ' 条件名称已存在'
          })
          return
        }
        this.setState({
          reuseEditTree: {
            ...reuseEditTree,
            children: [],
            title: fieldsValue.reuseName
          }
        }, () => {
          // 复用相当于新增
          this.setCondition(this.state.reuseEditTree, optionKey)
        })
      }
    })
  }

  // 复用弹框点击取消事件
  reuseOnCancel = () => {
    this.setState({
      reuseVisible: false
    })
  }
  //  -------------------------------------------- 复用modal  end -------------------------------------------------------

  //  -------------------------------------------- 删除modal  start -------------------------------------------------------
  isDoDeleteConditionFlag = true;
  deleteCondition = () => {
    const { checkedKeys, treeData } = this.state
    if (checkedKeys.length === 0) {
      Modal.warning({
        title: '提示',
        content: ' 请选择需要删除的条件'
      })
      return
    } else if (checkedKeys.length > 1) {
      Modal.warning({
        title: '提示',
        content: '一次只能删除一个条件'
      })
    } else {
      const deleteConditionItem = parseInt(checkedKeys[0])
      this.isDoDeleteCondition(treeData, deleteConditionItem)
      if (this.isDoDeleteConditionFlag) {
        Modal.confirm({
          title: '提示',
          content: '确认删除吗?',
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            this.doDeleteCondition(treeData, deleteConditionItem)
            this.setState({
              treeData,
              checkedKeys: []
            })
          }
        })
      } else {
        Modal.warning({
          title: '提示',
          content: '请先删除其子节点'
        })
      }
    }
  }

  // 是否可以删除
  isDoDeleteCondition = (treeData, deleteConditionItem) => {
    for (var i = 0; i < treeData.length; i++) {
      if (treeData[i].children) {
        this.isDoDeleteCondition(treeData[i].children, deleteConditionItem)
      }
      if (treeData[i].key === deleteConditionItem) {
        if (treeData[i].children && treeData[i].children.length > 0) {
          this.isDoDeleteConditionFlag = false
          break
        } else {
          this.isDoDeleteConditionFlag = true
        }
      }
    }
  }

  // 删除
  doDeleteCondition = (treeData, deleteConditionItem) => {
    for (var i = treeData.length; i > 0; i--) {
      if (treeData[i - 1].key === deleteConditionItem) {
        treeData.splice(i - 1, 1)
        // 删除节点的时候 同时删除对应的上级条件
        const newParCondition = this.deleteParCondition(deleteConditionItem)
        this.setState({
          parCondition: newParCondition
        })
      } else {
        if (treeData[i - 1].children) {
          this.doDeleteCondition(treeData[i - 1].children, deleteConditionItem)
        }
      }
    }
  }

  // 删除节点的时候 删除对应的上级条件
  deleteParCondition = (deleteCondition) => {
    const { parCondition } = this.state
    return parCondition.filter(item => item.key !== deleteCondition)
  }

  //  -------------------------------------------- 删除modal  end -------------------------------------------------------

  //   ------------------------------------------- 规则modal start  ----------------------------------------------------------

  // 规则保存
  saveRuleFn = async() => {
    const res = await this.getTryResult()
    if (res.responseData) {
      this.setState({
        saveRuleVisible: true
      })
    } else {
      Modal.warn({
        title: '规则校验结果',
        content: res.responseMsg,
        okText: '确定'
      })
    }
  }

   // 保存规则modal关闭的回调
   saveRuleClose = (flag) => {
     this.setState({
       saveRuleVisible: flag
     })
   }

  // 导入规则
  intoRule = () => {
    this.setState({
      intoRuleVisible: true
    })
  }

  // 导入规则modal关闭的回调
  intoRuleClose = (flag, content) => {
    this.setState({
      intoRuleVisible: flag
    })
    // 已勾点击确定情况
    if (content) {
      this.setState({
        parCondition: [ // 条件判断的下拉框数据
          {
            id: parConditionOne,
            rule: '空',
            key: parConditionOne // 新建条件 点击确定以后  根据option的下标 把数据插入到具体的children下面
          }
        ]
      })
      setTimeout(() => {
        content = JSON.parse(content)
        // 将trssDate扁平化
        this.newArr = []
        const flattenArr = this.flatten(content)
        // 循环每一项 取出零件名称  设置上级条件
        flattenArr.map(item => {
          this.setParCondition(item)
          return null
        })
        this.setState({
          treeData: content,
          visible: false,
          checkedKeys: []
        })
      })
    }
  }

  //   ------------------------------------------- 规则modal end  ----------------------------------------------------------

  //  -------------------------------------------- 新增modal  start -------------------------------------------------------
  // 新增 fieldsValue   当前点击确定生成的条件   optionKey  当前点击确定生成的条件 要插入的节点的key
  setCondition = (fieldsValue, optionKey) => {
    const getKey = new Date().getTime()
    fieldsValue.key = getKey
    this.setParCondition(fieldsValue) // 设置上级条件
    this.setState({
      productionCondition: fieldsValue,
      optionKey,
      visible: false,
      reuseVisible: false,
      outputCnValue: '',
      expressionCnValue: '',
      outputErr: false,
      expressionErr: false
    }, () => {
      this.getTree()
    })
  }

  // 新建条件
  newCondition = () => {
    this.setState({
      optionKey: parConditionOne,
      visible: true,
      outputCnValue: '',
      expressionCnValue: '',
      outputErr: false,
      expressionErr: false,
      addModalBaseFormUpdateList: {},
      isEdit: false,
      superiorHide: false
    })
  }
  // 新增与修改弹框确定事件
  baseFormListSubmit = (fieldsValue) => {
    const { optionKey, isEdit, editTree, treeData, parCondition, expressionCnValue, outputCnValue } = this.state
    if (!expressionCnValue) {
      this.setState({
        expressionErr: true
      })
      return
    }
    if (!outputCnValue) {
      this.setState({
        outputErr: true
      })
      return
    }
    this.setState({
      checkedKeys: []
    })
    if (isEdit) {
      this.newArr = []
      const flattenArr = this.flatten(treeData)
      // 编辑时，对比条件名称的时候 需要把自身从数组中删除，不与自身对比是否重复，只跟其他项去比较
      const editFlattenArr = flattenArr.filter(item => item.key !== editTree.key)
      const isNameExistFlag = isNameExist(editFlattenArr, fieldsValue.title)
      if (isNameExistFlag) {
        Modal.warning({
          title: '提示',
          content: ' 条件名称已存在'
        })
        return
      }
      //  编辑确定后 更改此项的上级条件的名称 title
      const newParCondition = changeArray(parCondition, editTree, fieldsValue.title)
      this.setState({
        parCondition: newParCondition
      })
      // 修改选中的节点 生成新节点
      const editTreeObj = { // 新节点
        ...editTree, // 选中的节点
        expressionCn: expressionCnValue, // 判断条件计算框
        outputCn: outputCnValue, // 条件为真计算框
        title: fieldsValue.title
      }
      const productionCondition = this.replaceProductionCondition(editTreeObj)
      // 替换原先的tree
      // let newTree = replaceTreeData(treeData, editTreeObj)
      const newTree = replaceTreeData(treeData, productionCondition)
      this.setState({
        treeData: newTree,
        visible: false,
        outputCnValue: '',
        expressionCnValue: '',
        outputErr: false,
        expressionErr: false
      })
    } else {
      this.newArr = []
      const flattenArr = this.flatten(treeData)
      const isNameExistFlag = isNameExist(flattenArr, fieldsValue.title)
      if (isNameExistFlag) {
        Modal.warning({
          title: '提示',
          content: ' 条件名称已存在'
        })
        return
      }
      // 新增
      fieldsValue.expressionCn = expressionCnValue
      fieldsValue.outputCn = outputCnValue
      this.setCondition(fieldsValue, optionKey)
    }
  }

  //  -------------------------------------------- 新增modal  end -------------------------------------------------------
  //  -------------------------------------------- 计算框方法  start -------------------------------------------------------

  //  -------------------------------------------- 计算框方法  end -------------------------------------------------------

  setExpressionErr = (flag) => {
    this.setState({
      expressionErr: flag
    })
  }

  setOutputErr = (flag) => {
    this.setState({
      outputErr: flag
    })
  }

  render() {
    const {
      formList, treeData, reuseVisible, expressionCnValue, outputCnValue, intoRuleVisible, saveRuleVisible,
      componentContentType, currentOfficeId, visible, expressionErr, outputErr
    } = this.state
    const reuseFormList = [
      {
        type: 'SELECT_OPTIONS',
        label: '上级条件:',
        field: 'reuseSuperior',
        placeholder: '请选择复用条件位置',
        formItemLayout: reuseFormListFormItemLayout,
        width: 200,
        required: true,
        requiredMsg: '请选择复用条件位置',
        rules: this.state.parCondition,
        initialValue: parConditionOne
      },
      {
        type: 'INPUT',
        label: '条件名称:',
        field: 'reuseName',
        placeholder: '请输入',
        formItemLayout: reuseFormListFormItemLayout,
        width: 200,
        required: true,
        requiredMsg: '请输入'
        // initialValue: "1"
      }
    ]

    const baseFormList = [
      {
        type: 'SELECT_OPTIONS',
        label: '上级条件',
        field: 'superior',
        placeholder: '请选择上级条件',
        width: 400,
        formItemLayout: ModalBaseFormFormItemLayout,
        required: true,
        requiredMsg: '请输入上级条件',
        rules: this.state.parCondition,
        hide: this.state.superiorHide,
        initialValue: parConditionOne
      },
      {
        type: 'INPUT',
        label: '条件名称',
        field: 'title',
        placeholder: '请输入条件名称',
        width: 400,
        formItemLayout: ModalBaseFormFormItemLayout,
        required: true,
        requiredMsg: '请输入条件名称'
        // initialValue: "1"
      }
    ]
    return (
      <div className='conditionContent'>
        <div>
          <Button type='primary' onClick={ this.newCondition }>新建</Button>
          <Button onClick={ this.editConditionTree }>修改</Button>
          <Button onClick={ this.reuse }>复用</Button>
          <Button onClick={ this.deleteCondition }>删除</Button>
        </div>
        {visible && <div className='operation'>
          <div style={{ marginBottom: 20, display: 'flex', width: '100%' }}>
            {/* 判断条件 */}
            <Calculate
              calculateValue={ expressionCnValue }
              value={ (value) => { this.setState({ 'expressionCnValue': value }) } }
              componentContentCn={ expressionCnValue }
              title='判断条件'
              isEditorErr={ expressionErr }
              setErr={ this.setExpressionErr }
              componentFieldType={ this.props.componentFieldType }
            />
            {/* 条件为真 */}
            <Calculate
              calculateValue={ outputCnValue }
              value={ (value) => { this.setState({ 'outputCnValue': value }) } }
              componentContentCn={ outputCnValue }
              title='条件为真'
              isEditorErr={ outputErr }
              setErr={ this.setOutputErr }
              componentFieldType={ this.props.componentFieldType }
            />
          </div>
          <BaseForm
            filterSubmit={ this.baseFormListSubmit }
            formList={ baseFormList }
            config={ this.addBaseFormListConfig }
            handleChange={ this.handleChange }
            updateList={ this.state.addModalBaseFormUpdateList }
          />
        </div>}
        {
          (treeData && treeData.length > 0) && <div className='treeDataWrap'>
            <ConditionTree
              checkedKeys={ this.state.checkedKeys }
              getCheckedKeys={ this.getCheckedKeys }
              treeData={ treeData } />
          </div>}
        <div className='conditionFunction'>
          <AuthButton type='link' style={{ padding: 0 }} menu_id={ 135 } className='tryCondition' onClick={ this.tryFn }>规则校验</AuthButton>
          <AuthButton type='link' style={{ padding: 0 }} menu_id={ 134 } className='saveRule' onClick={ this.saveRuleFn }>规则保存</AuthButton>
          <AuthButton type='link' style={{ padding: 0 }} menu_id={ 136 } className='saveRule' onClick={ this.intoRule }>导入规则</AuthButton>
        </div>
        <BaseForm
          formList={ formList }
          config={ this.baseFormConfig }
          filterSubmit={ this.handleFilterSubmit }
          updateList={ this.state.BaseFormUpdateList }
          getSearchOnChangeValue={ this.getSearchOnChangeValue } // 一级分类 二级分类 改变的时候更改组件状态
          currentOfficeId={ currentOfficeId }
        />
        {/* 复用 */}
        <Modal
          title='复用条件'
          centered
          onOk={ this.reuseOnOk }
          onCancel={ this.reuseOnCancel }
          okText='确定'
          cancelText='取消'
          visible={ reuseVisible }
          destroyOnClose={ true }
          maskClosable
        >
          <BaseForm
            wrappedComponentRef={ (inst) => (this.reuseFormRef = inst) }
            formList={ reuseFormList }
            config={ ModalBaseFormConfig }
            handleChange={ this.handleChange }
          />
        </Modal>
        <SaveRuleModal content={ JSON.stringify(treeData) } saveRuleVisible={ saveRuleVisible } close={ this.saveRuleClose } componentContentType={ componentContentType } />
        <IntoRuleModal intoRuleVisible={ intoRuleVisible } close={ this.intoRuleClose } type='condition' componentContentType={ componentContentType } />
      </div>
    )
  }
}
export default withRouter(Condition)
