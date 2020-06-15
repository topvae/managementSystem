import Loadable from 'react-loadable'
import { MyLoadingComponent } from '../utils/utils'

// 原子零件
const BaseParts = Loadable({
  loader: () => import('../pages/productService/baseParts'),
  loading: MyLoadingComponent
})

// 零件加工
const Parts = Loadable({
  loader: () => import('../pages/productService/parts'),
  loading: MyLoadingComponent
})

// 新建,复制，修改零件
const PartsProcess = Loadable({
  loader: () => import('../pages/productService/partsProcess'),
  loading: MyLoadingComponent
})

// 产品配置
const PartConfiguration = Loadable({
  loader: () => import('../pages/productService/productConfiguration'),
  loading: MyLoadingComponent
})

// 产品修改
const ProductEdit = Loadable({
  loader: () => import('../pages/productService/productConfiguration/productEdit'),
  loading: MyLoadingComponent
})

// 产品排序
const ProductSort = Loadable({
  loader: () => import('../pages/productService/productConfiguration/productSort'),
  loading: MyLoadingComponent
})

// 规则查询
const Rule = Loadable({
  loader: () => import('../pages/productService/rule'),
  loading: MyLoadingComponent
})

// 查询服务
const queryService = Loadable({
  loader: () => import('../pages/serviceManagement/queryService'),
  loading: MyLoadingComponent
})

// 新增/修改/复制服务
const AddOrEditService = Loadable({
  loader: () => import('../pages/serviceManagement/queryService/addOrEditService'),
  loading: MyLoadingComponent
})

// 预警服务
const warningService = Loadable({
  loader: () => import('../pages/serviceManagement/warningService'),
  loading: MyLoadingComponent
})

// 新增/修改/复制预警服务
const AddOrEditWarningService = Loadable({
  loader: () => import('../pages/serviceManagement/warningService/addOrEditAlertService'),
  loading: MyLoadingComponent
})

// 业务发生机构
const BusinessOrganization = Loadable({
  loader: () => import('../pages/organizationManagement/businessOrganization'),
  loading: MyLoadingComponent
})

// 二级分类
const SecondaryClassification = Loadable({
  loader: () => import('../pages/organizationManagement/businessOrganization/secondaryClassification'),
  loading: MyLoadingComponent
})

// 数据提供机构
const DataOrganization = Loadable({
  loader: () => import('../pages/organizationManagement/dataOrganization'),
  loading: MyLoadingComponent
})

// 使用机构
const UseOrganization = Loadable({
  loader: () => import('../pages/organizationManagement/useOrganization'),
  loading: MyLoadingComponent
})

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

// 部门管理
const DepartmentManage = Loadable({
  loader: () => import('../pages/authority/departmentManage'),
  loading: MyLoadingComponent
})

// 新建部门 修改部门
const OperationDepartmentManage = Loadable({
  loader: () => import('../pages/authority/departmentManage/operationDepartmentManage'),
  loading: MyLoadingComponent
})

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

// 数据字典
const DataDictionary = Loadable({
  loader: () => import('../pages/systemManagement/dictionary'),
  loading: MyLoadingComponent
})


// 操作日志
const OperationLogs = Loadable({
  loader: () => import('../pages/systemManagement/operationLogs'),
  loading: MyLoadingComponent
})

// 日志详情
const LogDetails = Loadable({
  loader: () => import('../pages/systemManagement/operationLogs/details'),
  loading: MyLoadingComponent
})

// 内容管理
const contentManage = Loadable({
  loader: () => import('../pages/systemManagement/content'),
  loading: MyLoadingComponent
})

// 数据字典
const DetailedList = Loadable({
  loader: () => import('../pages/billing/detailedList'),
  loading: MyLoadingComponent
})

// 订单配置模块
// 下订单
const PlaceOrders = Loadable({
  loader: () => import('../pages/orderConfigurations/placeOrders'),
  loading: MyLoadingComponent
})
// 下订单
const OrderList = Loadable({
  loader: () => import('../pages/orderConfigurations/orderList'),
  loading: MyLoadingComponent
})
// 下订单按钮
const AddOrder = Loadable({
  loader: () => import('../pages/orderConfigurations/placeOrders/addOrder'),
  loading: MyLoadingComponent
})
// 查看订单
const ShowOrderDetails = Loadable({
  loader: () => import('../pages/orderConfigurations/orderList/showOrderDetails'),
  loading: MyLoadingComponent
})
// 名单导入
const ImportNameList = Loadable({
  loader: () => import('../pages/orderConfigurations/nameList'),
  loading: MyLoadingComponent
})

// 个人信用报告
const PersonalReport = Loadable({
  loader: () => import('../pages/creditReport/personalReport'),
  loading: MyLoadingComponent
})

// 企业信用报告
const CompanyReport = Loadable({
  loader: () => import('../pages/creditReport/companyReport'),
  loading: MyLoadingComponent
})

// 查询原因
const ReasonsReport = Loadable({
  loader: () => import('../pages/creditReport/reasons'),
  loading: MyLoadingComponent
})

// 循环请求的权限列表，在本地list根据menuId做匹配，匹配出component做组件
export const routerList = [
  {
    menuId: 1,
    path: '/product',
    name: '产品管理',
    component: BaseParts
  }, {
    menuId: 5,
    path: '/product/baseParts',
    name: '原子零件',
    component: BaseParts
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
  }, {
    menuId: 9,
    path: '/product/rule',
    name: '规则查询',
    component: Rule
  }, {
    menuId: 20,
    path: '/product/parts/partsProcess',
    name: '新建零件',
    component: PartsProcess
  },
  {menuId: 71, path: '/product/parts/:id', name: '零件加工', component: PartsProcess},
  {menuId: 72, path: '/product/parts/:id', name: '零件加工', component: PartsProcess},
  {menuId: 73, path: '/product/configuration/productCopy', name: '产品复制', component: ProductEdit},
  {menuId: 74, path: '/product/configuration/productEdit', name: '产品修改', component: ProductEdit},
  {menuId: 186, path: '/product/configuration/productSort/:id', name: '产品排序', component: ProductSort},
  {menuId: 32, path: '/serviceManagement/queryService/addService', name: '新增服务', component: AddOrEditService},
  {menuId: 75, path: '/serviceManagement/queryService/copyService', name: '复制服务', component: AddOrEditService},
  {menuId: 76, path: '/serviceManagement/queryService/editService', name: '修改服务', component: AddOrEditService},
  {
    menuId: 2,
    path: '/serviceManagement',
    name: '服务管理',
    component: warningService
  },{
    menuId: 8,
    path: '/serviceManagement/queryService',
    name: '查询服务',
    component: queryService
  }, 
  {
    menuId: 10,
    path: '/serviceManagement/warningService',
    name: '预警服务',
    component: warningService
  },
  {menuId: 39, path: '/serviceManagement/warningService/addService', name: '新增服务', component: AddOrEditWarningService},
  {menuId: 77, path: '/serviceManagement/warningService/editService', name: '修改服务', component: AddOrEditWarningService},
  {menuId: 78, path: '/serviceManagement/warningService/copyService', name: '复制服务', component: AddOrEditWarningService},
  {
    menuId: 3,
    path: '/organizationManagement',
    name: '机构管理',
    component: BusinessOrganization
  }, {
    menuId: 11,
    path: '/organizationManagement/businessOrganization',
    name: '业务发生机构',
    component: BusinessOrganization
  }, 
  {menuId: 154, path: '/organizationManagement/businessOrganization/configuration', name: '机构配置', component: BusinessOrganization },
  {menuId: 148, path: '/organizationManagement/businessOrganization/secondaryClassification', name: '二级分类', component: SecondaryClassification },
  {
    menuId: 12,
    path: '/organizationManagement/dataOrganization',
    name: '数据提供机构',
    component: DataOrganization
  }, {
    menuId: 13,
    path: '/organizationManagement/useOrganization',
    name: '数据使用机构',
    component: UseOrganization
  },
  {
    menuId: 4,
    path: '/authority',
    name: '用户角色管理',
    component: RoleManage
  }, {
    menuId: 56,
    path: '/authority/roleManage',
    name: '角色管理',
    component: RoleManage
  }, {
    menuId: 57,
    path: '/authority/departmentManage',
    name: '部门管理',
    component: DepartmentManage
  }, {
    menuId: 58,
    path: '/authority/userManage',
    name: '用户管理',
    component: UserManage
  },
  {menuId: 61, path: '/authority/roleManage/addRoleManage', name: '新增角色', component: OperationRoleManage},
  {menuId: 79, path: '/authority/roleManage/editRoleManage/:id', name: '修改角色', component: OperationRoleManage},
  {menuId: 65, path: '/authority/departmentManage/addDepartmentManage', name: '新增部门', component: OperationDepartmentManage},
  {menuId: 87, path: '/authority/departmentManage/editDepartmentManage/:id', name: '修改部门', component: OperationDepartmentManage},
  {menuId: 69, path: '/authority/userManage/addUserManage', name: '新增用户', component: OperationUserManage},
  {menuId: 80, path: '/authority/userManage/editUserManage/:id', name: '修改用户', component: OperationUserManage},
  {
    menuId: 81,
    path: '/systemManagement',
    name: '系统管理',
    component: DataDictionary
  },
  {menuId: 82, path: '/systemManagement/dictionary', name: '数据字典', component: DataDictionary},
  {menuId: 164, path: '/systemManagement/operationLogs', name: '操作日志', component: OperationLogs},
  {menuId: 173, path: '/systemManagement/operationLogs/details', name: '日志详情', component: LogDetails},
  {menuId: 163, path: '/systemManagement/content', name: '内容管理', component: contentManage},
  {
    menuId: 89,
    path: '/billing',
    name: '计费管理',
    component: DetailedList
  },
  {menuId: 90, path: '/billing/detailedList', name: '详单参数配置管理', component: DetailedList},
  {
    menuId: 91,
    path: '/orderConfiguration',
    name: '订单配置',
    component: PlaceOrders
  },
  {
    menuId: 92,
    path: '/orderConfiguration/placeOrders',
    name: '下订单',
    component: PlaceOrders
  },
  {menuId: 105, path: '/orderConfiguration/placeOrders/addOrder', name: '下订单', component: AddOrder},
  {
    menuId: 93,
    path: '/orderConfiguration/orderList',
    name: '订单列表',
    component: OrderList
  },
  {menuId: 111, path: '/orderConfiguration/orderList/editOrder/:id', name: '查看订单', component: AddOrder},
  {menuId: 112, path: '/orderConfiguration/orderList/showOrderDetails/:id', name: '查看订单', component: ShowOrderDetails},
  {menuId: 94, path: '/orderConfiguration/import', name: '名单导入', component: ImportNameList},
  {
    menuId: 159,
    path: '/creditReport',
    name: '信用报告',
    component: OrderList
  },
  {menuId: 160, path: '/creditReport/personalReport', name: '个人报告查询', component: PersonalReport},
  {menuId: 161, path: '/creditReport/companyReport', name: '企业报告查询', component: CompanyReport},
  {menuId: 162, path: '/creditReport/reasons', name: '查询原因管理', component: ReasonsReport}
]
