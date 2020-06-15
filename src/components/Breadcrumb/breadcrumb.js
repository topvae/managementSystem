/*
 * @Author: your name
 * @Date: 2019-11-18 14:16:50
 * @LastEditTime: 2020-01-03 10:58:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/components/Breadcrumb/breadcrumb.js
 */

// 例子：
// /orderConfiguration/orderList  是列表 列表里面有一个修改
// /orderConfiguration/orderList/editOrder/45  点击修改跳转，为了有一个面包屑 多加一层editOrder路径 再写参数id：45； editOrder/45
// 详细写法：
// '/orderConfiguration/orderList': '订单列表',
// '/orderConfiguration/orderList/editOrder': '修改订单',
const breadcrumbNameMap = {

  '/product': '产品管理',
  '/product/baseParts': '原子零件',
  '/product/parts': '零件加工',
  '/product/parts/partsProcess': '新建零件',
  '/product/rule': '规则查询',
  '/product/configuration': '产品配置',
  '/serviceManagement/queryService/addService': '新增服务',
  // '/serviceManagement/queryService/showServiceDetails': '查看服务',
  '/serviceManagement/queryService/editService': '修改服务',
  '/serviceManagement/queryService/copyService': '复制服务',
  '/serviceManagement/queryService/showServiceDetails': '查看服务',
  '/product/configuration/productEdit': '产品修改',
  '/product/configuration/productCopy': ' 产品复制',
  '/product/configuration/productSort': ' 产品排序',

  '/serviceManagement': '服务管理',
  '/serviceManagement/queryService': '查询服务',
  '/serviceManagement/warningService': '预警服务',
  '/serviceManagement/warningService/showServiceDetails': '查看服务',
  '/serviceManagement/warningService/addService': '新增服务',
  '/serviceManagement/warningService/editService': '修改服务',
  '/serviceManagement/warningService/copyService': '复制服务',
  '/organizationManagement': '机构管理',
  '/organizationManagement/businessOrganization': '业务发生机构',
  '/organizationManagement/businessOrganization/configuration': '机构配置',
  '/organizationManagement/businessOrganization/secondaryClassification': '二级分类',
  '/organizationManagement/dataOrganization': '数据提供机构',
  '/organizationManagement/useOrganization': '使用机构',

  '/authority': '权限管理',
  '/authority/roleManage': '角色管理',
  '/authority/roleManage/addRoleManage': '新增角色',
  '/authority/roleManage/editRoleManage': '修改角色',
  '/authority/departmentManage': '部门管理',
  '/authority/departmentManage/addDepartmentManage': '新增部门',
  '/authority/departmentManage/editDepartmentManage': '修改部门',
  '/authority/userManage': '用户管理',
  '/authority/userManage/addUserManage': '新增用户',
  '/authority/userManage/editUserManage': '修改用户',

  '/systemManagement': '系统管理',
  '/systemManagement/dictionary': '数据字典',
  '/systemManagement/operationLogs': '操作日志',
  '/systemManagement/operationLogs/details': '日志详情',
  '/systemManagement/content': '内容管理',
  '/billing': '计费管理',
  '/billing/detailedList': '详单参数配置管理',

  '/orderConfiguration': '订单配置',
  '/orderConfiguration/placeOrders': '下订单',
  '/orderConfiguration/orderList': '订单列表',
  '/orderConfiguration/orderList/showOrderDetails': '查看订单',
  '/orderConfiguration/placeOrders/addOrder': '新增订单',
  '/orderConfiguration/orderList/editOrder': '修改订单',
  '/orderConfiguration/import': '名单导入',

  '/creditReport': '信用报告',
  '/creditReport/personalReport': '个人报告查询',
  '/creditReport/companyReport': '企业报告查询',
  '/creditReport/reasons': '查询原因管理'
}
export default breadcrumbNameMap
