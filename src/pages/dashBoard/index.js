/*
 * @Author: your name
 * @Date: 2020-03-10 14:06:14
 * @LastEditTime: 2020-06-18 22:40:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/home/index.js
 */
import React from 'react'
import { Card } from 'antd'
import EditorCodemirror from './editor'
class DashBoard extends React.Component {
  render() {
    return (
      <Card className='content'>
        <EditorCodemirror />
      </Card>
    )
  }
}
export default DashBoard
