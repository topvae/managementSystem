/*
 * @Author: your name
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2019-12-05 11:30:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/organizationManagement/businessOrganization/utils.js
 */

import { Modal } from 'antd'

export const ChangeSelectParams = (params) => {
  return params && params.map(item => {
    return {
      id: item.dicId,
      rule: item.fieldMsg
    }
  })
}

// 文件上传前 拦截器
export const beforeUpload = (file) => {
  // 截取文件名后缀
  const name = file.name
  const suffix = name.substring(name.lastIndexOf('.'))
  // 判断是否为excel
  if (suffix !== '.xls') {
    Modal.error({
      title: '请上传后缀是xls文件格式的文件'
    })
    return false
  }
}

export const config = {
  layout: 'inline',
  btnType: 'search',
  btnSpan: 4,
  handleMenuId: 41, // 权限控制
  resetMenuId: 42 // 权限控制
}

export const modalConfig = {
  layout: 'inline',
  btnType: 'search',
  hideBtn: true,
  formListSpan: 24
}

export const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
}
