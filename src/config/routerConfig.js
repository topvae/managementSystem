import Loadable from 'react-loadable'
import { MyLoadingComponent } from '../utils/utils'

// // 原子零件
// const BaseParts = Loadable({
//   loader: () => import('../pages/productService/baseParts'),
//   loading: MyLoadingComponent
// })
// 聚合查询 Aggregation
const Aggregation = Loadable({
  loader: () => import('../pages/aggregation'),
  loading: MyLoadingComponent
})
// dashboard
const DashBoard = Loadable({
  loader: () => import('../pages/dashBoard'),
  loading: MyLoadingComponent
})
// // 零件加工
const Parts = Loadable({
  loader: () => import('../pages/productService/parts'),
  loading: MyLoadingComponent
})

// // 新建,复制，修改零件
// const PartsProcess = Loadable({
//   loader: () => import('../pages/productService/partsProcess'),
//   loading: MyLoadingComponent
// })

// // 产品配置
const PartConfiguration = Loadable({
  loader: () => import('../pages/productService/productConfiguration'),
  loading: MyLoadingComponent
})

// // 产品修改
// const ProductEdit = Loadable({
//   loader: () => import('../pages/productService/productConfiguration/productEdit'),
//   loading: MyLoadingComponent
// })

// // 产品排序
// const ProductSort = Loadable({
//   loader: () => import('../pages/productService/productConfiguration/productSort'),
//   loading: MyLoadingComponent
// })

// // 规则查询
// const Rule = Loadable({
//   loader: () => import('../pages/productService/rule'),
//   loading: MyLoadingComponent
// })

// // 查询服务
// const queryService = Loadable({
//   loader: () => import('../pages/serviceManagement/queryService'),
//   loading: MyLoadingComponent
// })

// // 新增/修改/复制服务
// const AddOrEditService = Loadable({
//   loader: () => import('../pages/serviceManagement/queryService/addOrEditService'),
//   loading: MyLoadingComponent
// })

// // 预警服务
// const warningService = Loadable({
//   loader: () => import('../pages/serviceManagement/warningService'),
//   loading: MyLoadingComponent
// })

// // 新增/修改/复制预警服务
// const AddOrEditWarningService = Loadable({
//   loader: () => import('../pages/serviceManagement/warningService/addOrEditAlertService'),
//   loading: MyLoadingComponent
// })

// // 业务发生机构
// const BusinessOrganization = Loadable({
//   loader: () => import('../pages/organizationManagement/businessOrganization'),
//   loading: MyLoadingComponent
// })

// // 二级分类
// const SecondaryClassification = Loadable({
//   loader: () => import('../pages/organizationManagement/businessOrganization/secondaryClassification'),
//   loading: MyLoadingComponent
// })

// // 数据提供机构
// const DataOrganization = Loadable({
//   loader: () => import('../pages/organizationManagement/dataOrganization'),
//   loading: MyLoadingComponent
// })

// // 使用机构
// const UseOrganization = Loadable({
//   loader: () => import('../pages/organizationManagement/useOrganization'),
//   loading: MyLoadingComponent
// })

// 角色管理
const RoleManage = Loadable({
  loader: () => import('../pages/authority/roleManage'),
  loading: MyLoadingComponent
})

// 新建角色  修改角色
const OperationRoleManage = Loadable({
  loader: () => import('../pages/authority/roleManage/operationRoleManage'),
  loading: MyLoadingComponent
})

// // 部门管理
// const DepartmentManage = Loadable({
//   loader: () => import('../pages/authority/departmentManage'),
//   loading: MyLoadingComponent
// })

// // 新建部门 修改部门
// const OperationDepartmentManage = Loadable({
//   loader: () => import('../pages/authority/departmentManage/operationDepartmentManage'),
//   loading: MyLoadingComponent
// })

// 用户管理
const UserManage = Loadable({
  loader: () => import('../pages/authority/userManage'),
  loading: MyLoadingComponent
})

// 新建 修改用户
const OperationUserManage = Loadable({
  loader: () => import('../pages/authority/userManage/operationUserManage'),
  loading: MyLoadingComponent
})

// // 数据字典
// const DataDictionary = Loadable({
//   loader: () => import('../pages/systemManagement/dictionary'),
//   loading: MyLoadingComponent
// })


// // 操作日志
const OperationLogs = Loadable({
  loader: () => import('../pages/operationLogs'),
  loading: MyLoadingComponent
})

// // 日志详情
// const LogDetails = Loadable({
//   loader: () => import('../pages/systemManagement/operationLogs/details'),
//   loading: MyLoadingComponent
// })

// // 内容管理
// const contentManage = Loadable({
//   loader: () => import('../pages/systemManagement/content'),
//   loading: MyLoadingComponent
// })

// // 数据字典
// const DetailedList = Loadable({
//   loader: () => import('../pages/billing/detailedList'),
//   loading: MyLoadingComponent
// })

// // 订单配置模块
// // 下订单
// const PlaceOrders = Loadable({
//   loader: () => import('../pages/orderConfigurations/placeOrders'),
//   loading: MyLoadingComponent
// })
// // 下订单
// const OrderList = Loadable({
//   loader: () => import('../pages/orderConfigurations/orderList'),
//   loading: MyLoadingComponent
// })
// // 下订单按钮
// const AddOrder = Loadable({
//   loader: () => import('../pages/orderConfigurations/placeOrders/addOrder'),
//   loading: MyLoadingComponent
// })
// // 查看订单
// const ShowOrderDetails = Loadable({
//   loader: () => import('../pages/orderConfigurations/orderList/showOrderDetails'),
//   loading: MyLoadingComponent
// })
// // 名单导入
// const ImportNameList = Loadable({
//   loader: () => import('../pages/orderConfigurations/nameList'),
//   loading: MyLoadingComponent
// })

// // 个人信用报告
// const PersonalReport = Loadable({
//   loader: () => import('../pages/creditReport/personalReport'),
//   loading: MyLoadingComponent
// })

// // 企业信用报告
// const CompanyReport = Loadable({
//   loader: () => import('../pages/creditReport/companyReport'),
//   loading: MyLoadingComponent
// })

// // 查询原因
// const ReasonsReport = Loadable({
//   loader: () => import('../pages/creditReport/reasons'),
//   loading: MyLoadingComponent
// })

// 循环请求的权限列表，在本地list根据menuId做匹配，匹配出component做组件
export const routerList = [
  {
    menuId: 1,
    path: '/product',
    name: '产品管理',
    component: PartConfiguration
  }, {
    menuId: 6,
    path: '/product/parts',
    name: '零件列表',
    component: Parts
  }, {
    menuId: 7,
    path: '/product/configuration',
    name: '产品配置',
    component: PartConfiguration
  },
  {
    menuId: 3,
    path: '/aggregation',
    name: '聚合查询',
    component: Aggregation
  },
  {
    menuId: 4,
    path: '/authority',
    name: '用户角色管理',
    component: RoleManage
  }, 
  {
    menuId: 2,
    path: '/dashboard',
    name: 'DashBoard',
    component: DashBoard
  },
  {
    menuId: 56,
    path: '/authority/roleManage',
    name: '角色管理',
    component: RoleManage
  },
  // {
  //   menuId: 57,
  //   path: '/authority/departmentManage',
  //   name: '部门管理',
  //   component: DepartmentManage
  // },
   {
    menuId: 58,
    path: '/authority/userManage',
    name: '用户管理',
    component: UserManage
  },
  {menuId: 61, path: '/authority/roleManage/addRoleManage', name: '新增角色', component: OperationRoleManage},
  {menuId: 79, path: '/authority/roleManage/editRoleManage/:id', name: '修改角色', component: OperationRoleManage},
  // {menuId: 65, path: '/authority/departmentManage/addDepartmentManage', name: '新增部门', component: OperationDepartmentManage},
  // {menuId: 87, path: '/authority/departmentManage/editDepartmentManage/:id', name: '修改部门', component: OperationDepartmentManage},
  {menuId: 69, path: '/authority/userManage/addUserManage', name: '新增用户', component: OperationUserManage},
  {menuId: 80, path: '/authority/userManage/editUserManage/:id', name: '修改用户', component: OperationUserManage},
  // {
  //   menuId: 81,
  //   path: '/systemManagement',
  //   name: '系统管理',
  //   component: DataDictionary
  // },
  // {menuId: 82, path: '/systemManagement/dictionary', name: '数据字典', component: DataDictionary},
  {menuId: 164, path: '/operationLogs', name: '操作日志', component: OperationLogs},
  // {menuId: 173, path: '/systemManagement/operationLogs/details', name: '日志详情', component: LogDetails},
  // {menuId: 163, path: '/systemManagement/content', name: '内容管理', component: contentManage},
]
