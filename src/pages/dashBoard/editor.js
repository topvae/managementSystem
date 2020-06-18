/*
 * @Author: your name
 * @Date: 2019-02-19 18:20:13
 * @LastEditTime: 2020-06-18 01:41:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fighting/src/pages/rich/index.js
 */

import React from 'react'
import { Button } from 'antd'
import './editor.less'
import CodeMirror from '@uiw/react-codemirror'
import 'codemirror/addon/display/autorefresh'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/keymap/sublime'
import 'codemirror/theme/eclipse.css'
import 'codemirror/theme/monokai.css'
export default class EditorCodemirror extends React.Component {
  state={
    showRichText: false,
    editorValue: ''
  }

  changeJson = () => {
    const code = {
      a: 'snanckanvjsv',
      b: 'askbasjhvcbasjvsav',
      c: 'askjbaskjbask'
    }
    this.setState({
      rightCode: code
    })
  }
  clearLeft = () => {
    this.editNode.editor.setValue('')
    this.setState({ rightCode: undefined })
  }

  render() {
    return (
      <div>
        <Button type='primary' onClick={ this.changeJson }>转换</Button>
        <Button type='primary' onClick={ this.clearLeft }>清空</Button>
        <div className='outer-box'>
          <div className='inner-box'>
            <CodeMirror
              ref={ (ref) => { this.editNode = ref } }
              onChange={ (editor) => {
                this.setState({ editorValue: editor.getValue() })
              } }
              options={{
                theme: 'eclipse',
                rtlMoveVisually: true,
                lineWrapping: true,
                tabSize: 2,
                keyMap: 'sublime',
                mode: 'json' || 'jsx',
                matchBrackets: true,	// 括号匹配
                lint: true,
                height: '500'
              }}
            />
          </div>
          <div className='inner-box'>
            <CodeMirror
              value={ JSON.stringify(this.state.rightCode, null, 4) }
              options={{
                theme: 'eclipse',
                rtlMoveVisually: true,
                lineWrapping: true,
                tabSize: 2,
                keyMap: 'sublime',
                mode: 'json' || 'jsx',
                readOnly: true,
                matchBrackets: true
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}
