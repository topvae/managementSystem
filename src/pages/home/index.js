/*
 * @Author: your name
 * @Date: 2020-03-10 14:06:14
 * @LastEditTime: 2020-04-09 09:15:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/home/index.js
 */
import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { is_login } from '../../services/api.js'

function LoginHome(props) {
  const { history } = props
  useEffect(() => {
    async function fetchData() {
      const res = await is_login()
      if (res.data.responseCode === 0) {
        history.push('/home')
      }
    }
    fetchData()
  }, [history])

  return (
    <div className='welcome'>
      <img src='./assets/welcomeBg.png' alt='' />
      欢迎
    </div>
  )
}

export default withRouter(LoginHome)
