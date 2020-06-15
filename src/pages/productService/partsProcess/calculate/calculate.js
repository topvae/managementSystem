/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2020-03-12 09:23:34
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect } from 'react'
import './index.less'
import { Modal, Button } from 'antd'
// import Editor from '../../../../components/Editor';
// import MonacoEditor from 'react-monaco-editor';
import SaveRuleModal from '../saveRulesModal'
import IntoRuleModal from '../intoRuleModal'
import Loadable from 'react-loadable'
import { MyLoadingComponent } from '../../../../utils/utils'
import { pre_calcualte } from '../../../../services/api'
import { wrapAuth } from '../../../../components/AuthButton'
const AuthButton = wrapAuth(Button)

const Editor = Loadable({
  loader: () => import('../../../../components/Editor'),
  loading: MyLoadingComponent
})

function Calculate(props) {
  const editorRef = React.createRef()
  const [setRuleContent, setSetRuleContent] = useState([]) // 规则导入的中文 在光标的位置插入功能用的字段
  const [partsNameList, setPartsNameList] = useState([]) // 留存的零件中文名称
  const [componentNoList, setComponentNoList] = useState([]) // 留存的零件编号数组
  // const [componentNoStr, setComponentNoStr] = useState('') // 留存的零件编号 逗号分隔字符串
  const [componentContentType] = useState(0) // 计算框0  条件判断1
  const [componentContentCn, setComponentContentCn] = useState('') // 计算框的内容
  const [isEditorErr, setIsEditorErr] = useState(false) // 控制计算框的报错
  // const [saveList, setSaveList] = useState([]) // 留存项
  const [saveRuleVisible, setSaveRuleVisible] = useState(false)
  const [intoRuleVisible, setIntoRuleVisible] = useState(false)

  useEffect(() => {
    setComponentContentCn(props.componentContentCn)
    if (props.componentContentCn) {
      setIsEditorErr(false)
    } else {
      setIsEditorErr(props.isEditorErr)
    }
  }, [props.componentContentCn, props.isEditorErr, componentContentCn])

  useEffect(() => {
    const saveList = props.saveList || []
    if (saveList.length > 0) {
      const partsNameList = []
      const componentNoList = []
      saveList.map((item) => {
        partsNameList.push(item.componentName + '-' + item.departmentName + '-' + item.officeName)
        return partsNameList
      })
      saveList.map((item) => {
        componentNoList.push(item.componentNo)
        return componentNoList
      })
      setPartsNameList(partsNameList)
      setComponentNoList(componentNoList)
      // setSaveList(saveList)
    } else {
      setPartsNameList([])
      setComponentNoList([])
      // setSaveList([])
    }
  }, [props.saveList])

  // 计算框报错信息
  const isEditorErrFn = (flag) => {
    setIsEditorErr(flag)
  }

  // 将计算框的值传递出去
  const getValue = (componentContentCn) => {
    // console.log(componentContentCn)
    setComponentContentCn(componentContentCn)
    props.value(componentContentCn)
  }

  // const log = (e) => {
  //   e.stopPropagation()
  // }

  // const onCopy = () => {
  //   message.success('复制成功', 0.5)
  // }

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

  const getTryResult = async() => {
    const componentNoList = contentReplace(1, componentContentCn)
    const express = contentReplace(2, componentContentCn)
    const res = await pre_calcualte({
      componentContentCn, // 中文表达式 不需要去除#
      express: express.replace(/\$/g, ''), // 英文表达式 去除所有#
      componentNos: componentNoList.join(','), // 使用到的编号 逗号隔开
      componentContentType: 0, // 0：计算框   1：条件判断
      componentFieldType: props.componentFieldType // 数据类型
    })
    return res.data
  }

  // 规则校验
  const tryFn = async() => {
    const res = await getTryResult()
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

  // 导入规则modal显示
  const intoRule = () => {
    setIntoRuleVisible(true)
  }

  // 导入规则modal关闭的回调
  const intoRuleClose = (flag, content) => {
    setSetRuleContent([...setRuleContent, content])
    setIntoRuleVisible(flag)
  }

  // 保存规则modal显示
  const saveRuleFn = async() => {
    const res = await getTryResult()
    if (res.responseData) {
      setSaveRuleVisible(true)
    } else {
      Modal.warn({
        title: '规则校验结果',
        content: res.responseMsg,
        okText: '确定'
      })
    }
  }

  // 保存规则modal关闭的回调
  const saveRuleClose = (flag) => {
    setSaveRuleVisible(flag)
  }

  // options = {
  //   selectOnLineNumbers: true,
  //   renderSideBySide: false
  // }

  return (
    <div className='editorWrap'>
      <div className='calculateWrap'>
        <span style={{ color: '#f5222d' }}>*&nbsp;</span>   <span style={{ minWidth: 60 }}>计算框： </span>
        <div style={{ width: '100%', overflow: 'scroll' }}>
          <Editor
            ref={ editorRef }
            value={ getValue }
            calculateValue={ componentContentCn }
            isEditorErrFn={ isEditorErrFn }
            setRuleContent={ setRuleContent }
          ></Editor>
        </div>
      </div>
      <div style={{ marginLeft: 64 }}>
        {
          isEditorErr && <div className='editorErr'>请输入正确的内容</div>
        }
      </div>
      <div className='calculateFunction'>
        <AuthButton type='link' style={{ padding: 0 }} menu_id={ 135 } className='tryCalculate' onClick={ tryFn }>规则校验</AuthButton>
        <AuthButton type='link' style={{ padding: 0 }} menu_id={ 134 } className='saveRule' onClick={ saveRuleFn }>规则保存</AuthButton>
        <AuthButton type='link' style={{ padding: 0 }} menu_id={ 136 } className='intoRule' onClick={ intoRule }>导入规则</AuthButton>
      </div>
      <SaveRuleModal content={ componentContentCn } saveRuleVisible={ saveRuleVisible } close={ saveRuleClose } componentContentType={ componentContentType } />
      <IntoRuleModal intoRuleVisible={ intoRuleVisible } close={ intoRuleClose } type='calculate' componentContentType={ componentContentType } />
    </div>
  )
}

export default Calculate
