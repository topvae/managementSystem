/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2020-03-10 15:05:20
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import './index.less'
import { message, Modal } from 'antd'
import Loadable from 'react-loadable'
import { MyLoadingComponent } from '../../../../utils/utils'
import { pre_calcualte } from '../../../../services/api'

const Editor = Loadable({
  loader: () => import('../../../../components/Editor'),
  loading: MyLoadingComponent
})

class Calculate extends React.Component {
  constructor() {
    super()
    this.editorRef = React.createRef()
  }

  state = {
    setRuleContent: [], // 规则导入的中文 插入到计算框
    partsNameList: [], // 留存的零件中文名称
    componentNoList: [], // 留存的零件编号数组
    componentNoStr: '', // 留存的零件编号 逗号分隔字符串
    componentContentType: 0, // 计算框0  条件判断1
    componentContentCn: '', // 计算框的内容
    isEditorErr: false, // 控制计算框的报错
    saveList: [], // 留存项
    title: ''
  }

  componentDidMount() {
    this.setState({
      title: this.props.title
    })
  }

  componentDidUpdate(nextProps) {
    if (nextProps.isEditorErr !== this.state.isEditorErr) {
      this.setState({
        isEditorErr: this.props.isEditorErr
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isEditorErr, saveList, componentContentCn } = nextProps
    if (componentContentCn !== this.state.componentContentCn) {
      this.setState({
        componentContentCn
      })
    }
    if (this.state.saveList !== saveList && saveList && saveList.length > 0) {
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
      this.setState({
        partsNameList,
        componentNoList,
        saveList
      })
    }
    if (this.state.isEditorErr !== isEditorErr) {
      this.setState({
        isEditorErr
      })
    }
    //  计算框有内容 报错就消失
    if (this.state.componentContentCn) {
      this.setState({
        isEditorErr: false
      })
    }
  }

  // 计算框报错信息
  isEditorErrFn = (flag) => {
    this.setState({
      isEditorErr: flag
    })
    this.props.setErr(flag)
  }

  // 将计算框的值传递出去
  getValue = (componentContentCn) => {
    this.setState({
      componentContentCn
    })
    this.props.value(componentContentCn)
  }

  log = (e) => {
    e.stopPropagation()
  }

  onCopy = () => {
    message.success('复制成功', 0.5)
  }

  // 计算框内容中的中文零件名称替换成零件数字编号
  // componentContentCn:计算框内容
  // componentNoList ：零件编号数组
  // partsNameList：留存项零件中文名
  // type  1: 零件编号数组   2：整个计算框内容的零件名称替换成零件编号
  contentReplace = (type) => {
    const arr = []
    const { componentNoList, partsNameList } = this.state
    let { componentContentCn } = this.state
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

  getTryResult = async() => {
    const componentNoList = this.contentReplace(1)
    const express = this.contentReplace(2)
    const res = await pre_calcualte({
      componentContentCn: this.state.componentContentCn, // 中文表达式 不需要去除#
      express: express.replace(/\$/g, ''), // 英文表达式 去除所有#
      componentNos: componentNoList.join(','), // 使用到的编号 逗号隔开
      componentContentType: 0 // 0：计算框   1：条件判断
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

  // 导入规则modal显示
  intoRule = () => {
    this.setState({
      intoRuleVisible: true
    })
  }

  // 导入规则modal关闭的回调
  intoRuleClose = (flag, content) => {
    this.setState({
      setRuleContent: [...this.state.setRuleContent, content],
      intoRuleVisible: flag
    })
  }

  // 保存规则modal显示
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

  options = {
    selectOnLineNumbers: true,
    renderSideBySide: false
  }

  render() {
    const { setRuleContent, title } = this.state
    return (
      <div style={{ width: '600px' }}>
        <div className='editorWrap'>
          <span style={{ color: '#f5222d' }}>*&nbsp;</span>
          <span style={{ minWidth: 84 }}>{ title }： </span>
          <Editor
            ref={ this.editorRef }
            value={ this.getValue }
            calculateValue={ this.state.componentContentCn }
            isEditorErrFn={ this.isEditorErrFn }
            setRuleContent={ setRuleContent }
          ></Editor>
        </div>
        {
          this.state.isEditorErr && <div className='editorErr'>请输入正确的内容</div>
        }
      </div>
    )
  }
}

export default Calculate
