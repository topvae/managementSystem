/*
 * @Author: your name
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2020-06-17 15:12:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/setupProxy.js
 */
const proxy = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(proxy('/api', {
    target: process.env.NODE_ENV === 'development' ? 'http://47.111.20.132:8400 ' : null,
    changeOrigin: true
  }))
}

// //"https://www.easy-mock.com/mock/5ce51b8e35cff95dda329618/credit"
// //'http://47.111.9.173:9000'
// //http://172.16.17.86:7300  超超接口
// http://47.111.20.132:8400 测试环境
// http://47.96.122.16/#/  展示内容
