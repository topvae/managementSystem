import React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor from 'react-monaco-editor'
import { get_rule_function } from '../../services/api.js'

class DEditor extends React.Component {
  constructor(props) {
    super(props)
    this.monacoEditorRef = React.createRef()
    this.state = {
      setRuleContent: [], // 规则导入的中文 插入到计算框
      tipList: [], // 储存计算框提示语的首字母
      suggestions: [], // 储存提示语
      calculateValue: this.props.calculateValue,
      width: this.props.width ? this.props.width : '90%'
    }
  }

  componentWillMount() {
    // 拦截判断是否离开当前页面
    window.addEventListener('beforeunload', this.beforeunload)
  }

  componentWillReceiveProps(nextProps) {
    // nextProps.setRuleContent设置成一个数组 每一次读取数组的最后一个元素 然后在光标的位置插入编辑器
    if (this.state.setRuleContent !== nextProps.setRuleContent) {
      this.setState({
        setRuleContent: nextProps.setRuleContent
      })
      const editor = this.monacoEditorRef.current.editor
      const p = editor.getPosition()
      editor.executeEdits('',
        [
          {
            range: new monaco.Range(p.lineNumber,
              p.column,
              p.lineNumber,
              p.column),
            text: nextProps.setRuleContent[nextProps.setRuleContent.length - 1]
          }
        ]
      )
    }
    // 编辑框的值
    if (this.state.calculateValue !== nextProps.calculateValue) {
      this.setState({
        calculateValue: nextProps.calculateValue
      })
    }
  }

  beforeunload() {
    // 如果是刷新页面 清空sessionStorage
    sessionStorage.removeItem('isLoadDEditor')
  }

  // 自定义按键提示的数据请求
  requestList = async() => {
    const list = []
    const tipList = [':']
    const res = await get_rule_function()
    if (res.data.responseCode) return
    const responseData = res.data.responseData
    responseData.map(item => {
      const obj = {}
      obj.label = item.content
      obj.insertText = item.content
      obj.detail = item.symbolName
      list.push(obj)
      tipList.push(item.content.substring(0, 1))
      return null
    })
    this.setState({
      suggestions: list,
      tipList: tipList
    })
  }

  onBlur = () => {
    const { calculateValue } = this.state
    this.props.value(calculateValue)
    if (calculateValue) {
      this.props.isEditorErrFn(false)
    }
  }

  onChangeHandle = (value, e) => {
    // console.log('value', value)
    this.props.value(value)
    this.setState({
      calculateValue: value
    })
  }

  editorDidMountHandle = async(editor, monaco) => {
    // 执行过就不再执行 当页面关闭就重新记录 因为多次执行了这个方法导致重复数据
    const isLoadDEditor = sessionStorage.getItem('isLoadDEditor')
    if (isLoadDEditor !== '1') {
      sessionStorage.setItem('isLoadDEditor', '1')
      await this.requestList()
      const { suggestions, tipList } = this.state
      if (suggestions.length) {
        monaco.languages.registerCompletionItemProvider('plaintext', {
          provideCompletionItems() {
            return {
              suggestions: suggestions.map(item => ({ ...item, kind: monaco.languages.CompletionItemKind.Variable }))
            }
          },
          triggerCharacters: tipList
        })
      }
      //   this.timeouter = setTimeout(() => {
      //     editor.getAction('editor.action.formatDocument').run()
      //   }, 300)
    }
  }

  options = {
    selectOnLineNumbers: true,
    renderSideBySide: false
  }

  render() {
    return (
      <div onBlur={ this.onBlur } style={{ width: '90%' }}>
        <MonacoEditor
          ref={ this.monacoEditorRef }
          width={ this.state.width }
          height='200'
          language='plaintext'
          theme='vs-dark'
          value={ this.state.calculateValue }
          options={ this.options }
          onChange={ this.onChangeHandle }
          editorDidMount={ this.editorDidMountHandle }
        />
      </div>
    )
  }
}

export default DEditor
