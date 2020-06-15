/*
 * @Author: your name
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2019-12-30 11:52:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/organizationManagement/useOrganization/utils.js
 */

export const ChangeSelectParams = (params) => {
  return params && params.map(item => {
    return {
      id: item.dicId,
      rule: item.fieldMsg
    }
  })
}

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 52, // 权限控制
  resetMenuId: 53 // 权限控制
}

export const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
