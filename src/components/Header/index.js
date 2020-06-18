/*
 * @Author: your name
 * @Date: 2019-11-19 18:03:22
 * @LastEditTime: 2020-06-17 11:29:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/components/Header/index.js
 */
import React from 'react'
import { Row, Col } from 'antd'
import './index.less'
// import Bread from '../Breadcrumb'
import { withRouter } from 'react-router-dom'
import { get_user_logout } from './../../services/api'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: localStorage.getItem('creditAdminUserName')
    }
  }
  quite =() => {
    get_user_logout().then(res => {
      sessionStorage.removeItem('defaultSelectedKeys')
      sessionStorage.removeItem('openKeys')
      sessionStorage.clear()
      localStorage.clear()
      window.location.href = '/'
    })
  }
  render() {
    return (
      <div className='header'>
        <Row className='header-top'>
          <Col span={ 24 } >
            <span>欢迎 {this.state.userName} </span>
            <span className='quit' onClick={ this.quite }>退出</span>
          </Col>
        </Row>
        {/* <Row className='breadCrumb'>
          <Col span={ 24 } className='breadcrumb-title'>
            <Bread />
          </Col>
        </Row> */}
      </div>
    )
  }
}
export default withRouter(Header)
