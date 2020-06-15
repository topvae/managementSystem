/*
 * @Author: your name
 * @Date: 2019-11-04 10:29:51
 * @LastEditTime : 2020-02-14 14:37:12
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /workspace/credit-admin/src/pages/login/index.js
 */
import React, { Component } from 'react'
import './index.less'
import { Input, Icon, Form, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { get_user_login, is_login } from './../../services/api'
class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        get_user_login({ ...values }).then(res => {
          sessionStorage.clear()
          localStorage.clear()
          localStorage.setItem('creditAdminUserName', values.username)
          window.location.href = '/#/home'
        })
      }
    })
  }

  async componentDidMount() {
    const res = await is_login()
    if (res.data.responseCode === 0) {
      window.location.href = '/#/home'
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div id='login'>
        <img src={ './assets/bgCover.png' } className='bg_cover' alt='' />
        <div className='login-form'>
          <div className='form_title'>
            <img src={ './assets/logo.png' } alt='' />
            <span className='title_right'>信用系统管理平台</span>
          </div>
          <Form onSubmit={ this.handleSubmit } className='form_body'>
            <h3>密码登录</h3>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '请输入用户名' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='请输入用户名'
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入密码' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type='password'
                  placeholder='请输入密码'
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create({ name: 'normal_login' })(withRouter(Login))
