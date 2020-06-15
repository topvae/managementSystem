/*
 * @Author: your name
 * @Date: 2020-02-17 13:39:37
 * @LastEditTime: 2020-02-27 16:02:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/creditReport/personalReport/formList.js
 */

export const config = {
  btnType: 'search',
  btnSpan: 4,
  layout: 'inline',
  handleMenuId: 175, // 权限控制
  resetMenuId: 176 // 权限控制
}

export const changeSelectParams = (params) => {
  return params && params.map(item => {
    return {
      id: item.dicId,
      rule: item.fieldMsg
    }
  })
}
