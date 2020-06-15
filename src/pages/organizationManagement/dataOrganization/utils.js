/*
 * @Author: ysk
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2019-12-30 11:54:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/organizationManagement/dataOrganization/utils.js
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
  handleMenuId: 48, // 权限控制
  resetMenuId: 49 // 权限控制
}

export const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
