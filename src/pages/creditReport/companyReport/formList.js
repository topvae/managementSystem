/*
 * @Author: your name
 * @Date: 2020-02-17 13:39:37
 * @LastEditTime: 2020-02-27 16:04:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/creditReport/personalReport/formList.js
 */
export const changeSelectParams = (params) => {
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
  handleMenuId: 178, // 权限控制
  resetMenuId: 179 // 权限控制
}
