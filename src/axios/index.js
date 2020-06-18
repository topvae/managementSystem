/*
 * @Author: ysk
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2020-06-17 11:29:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/axios/index.js
 */
import axios from 'axios'
import { Modal } from 'antd'
let modal = null
export const request = (api, params, method, isLoading = true) => {
  const loading = document.getElementById('ajaxLoading')
  if (isLoading) {
    loading.style.display = 'block'
  }
  // const baseApi = 'http://47.111.9.173';;;
  const data = (method === 'GET') ? 'params' : 'data'
  const logout = () => {
    axios.get('/api/credit-user/user/login/logout')
      .then(function() {
        window.location.href = '/'
      })
  }
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  }
  return new Promise((resolve, reject) => {
    axios({
      url: api,
      method: method,
      [data]: params,
      // baseURL:baseApi,
      headers: headers,
      timeout: 8000
    }).then(res => {
      loading.style.display = 'none'
      const datas = res.data
      const responseCode = datas.responseCode
      const responseMsg = datas.responseMsg
      if (api === '/api/credit-user/user/login/isLogin') {
        resolve(res)
        return
      }
      if (responseCode === 0) {
        resolve(res)
      } else if (responseCode === 10) {
        if (!modal) {
          modal = 1
          Modal.warning({
            title: '提示',
            content: responseMsg,
            onOk: () => {
              logout()
              modal = 0
            },
            onCancel: () => {
              logout()
              modal = 0
            }
          })
        }
      } else {
        if (!modal) {
          modal = 1
          Modal.warning({
            title: '提示',
            content: responseMsg,
            onOk: () => {
              modal = 0
            },
            onCancel: () => {
              modal = 0
            }
          })
        }
      }
    })
      .catch(error => {
        // Modal.warning({
        //   title: '提示',
        //   content: error.message,
        // })
        loading.style.display = 'none'
        console.log(error)
        reject(error)
      })
  })
}
