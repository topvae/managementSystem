/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-06-17 15:30:40
 * @LastEditors: Please set LastEditors
 */
import { stringify } from 'qs'
import { request } from '../axios/index'

// 证件号和订单号查询接口
export async function get_baseProducts_list(params) {
  return request('https://www.easy-mock.com/mock/5ce51b8e35cff95dda329618/credit/orderList', params, 'GET')
}
// 左侧导航栏接口
// export async function get_menu_tree(params) {
//   return request('https://www.easy-mock.com/mock/5ce51b8e35cff95dda329618/credit/navleft', { ...params }, 'GET', false)
//   // return process.env.NODE_ENV === 'development' ?  request('/api/credit-user/user/sysMenu/menuTree',{...params},'GET',false) : request('/api/credit-user/user/sysMenu/nav',{...params},'GET',false)
//   // https://www.easy-mock.com/mock/5ce51b8e35cff95dda329618/credit/nav
// }

// ------------------------------------零件产品---------------------------------------
// 获取原子零件列表
export async function get_baseParts_list(params) {
  return request('/api/credit-component/component/atomComponentPage', { ...params }, 'POST')
}
// 全量导入
export const allImport_url = '/api/credit-component/component/importComponent'

// 增量导入
export const addImport_url = '/api/credit-component/component/importIncrementComponent'

// 导出
export const exportAtomComponent_url = '/api/credit-component/component/exportAtomComponent'

// 获取零件列表
export async function get_parts_list(params) {
  return request('/api/credit-component/component/componentPage', { ...params }, 'POST', false)
}

// 检测零件是否可以删除
export async function is_delect_parts(params) {
  return request('/api/credit-component/component/componentDeleteDecetc', { ...params }, 'POST')
}

// 零件删除
export async function delect_parts(params) {
  return request('/api/credit-component/component/componentDelete', { ...params }, 'DELETE')
}

// 通过零件No查询具体信息
export async function queryComponentPageByComponentIds(params) {
  return request(`/api/credit-component/component/queryComponentPageByComponentIds?${ stringify(params) }`, {}, 'POST')
}

// // 获取产品list的列表
// export async function get_baseProducts_list(params) {
//   return request('/api/credit-product/product/page', params, 'GET')
// }
// 获取产品配置模块的零件列表
export async function get_avaliableparts_list(params) {
  return request('/api/credit-component/component/avaliableSourceComponentPage', { ...params }, 'POST', false)
}
// 新增产品
export async function post_baseProducts_add(params) {
  return request('/api/credit-product/product/add', { ...params }, 'POST')
}
// 新增产品加工前校验接口
export async function post_verBeforeProcessing(params) {
  return request('/api/credit-product/product/verBeforeProcessing', params, 'POST')
}
// 新增产品递归校验是否存在重复产品接口
export async function post_checkProduct_add(params) {
  return request('/api/credit-product/product/addCheck', { ...params }, 'POST')
}
// 删除产品
export async function post_deleteProducts_list(params) {
  return request('/api/credit-product/product/deleteList', params, 'DELETE')
}
// 查看产品详情
export async function get_Product_info(params) {
  return request('/api/credit-product/product/info', params, 'GET')
}
// 查看产品名称是否存在
export async function get_hasProducrtName(params) {
  return request('/api/credit-product/product/hasProducrtName', params, 'GET', false)
}
// 复制的时候查看产品最大生效时间
export async function get_copy_maxDate(params) {
  return request('/api/credit-product/product/maxDate', params, 'GET')
}
// 产品修改接口
export async function post_Product_edit(params) {
  return request('/api/credit-product/product/update', params, 'POST')
}
// 产品复制接口
export async function post_Product_copy(params) {
  return request('/api/credit-product/product/copy', params, 'POST')
}
// 修改产品递归校验是否存在重复产品接口
export async function post_checkProduct_update(params) {
  return request('/api/credit-product/product/updateCheck', { ...params }, 'POST')
}

// 产品修改/复制模块 查看是否有相同时间
// 修改复制的时候对生效时间做修改的时候需要请求生效时间是否相同接口
export async function post_Product_sameTime(params) {
  return request('/api/credit-product/product/sameTime', params, 'POST')
}
// 复制产品递归校验是否存在重复产品接口
export async function post_checkProduct_copy(params) {
  return request('/api/credit-product/product/copyCheck', { ...params }, 'POST')
}
// 产品排序
export async function get_propduct_tree(params) {
  return request('/api/credit-product/product/sortQuery', params, 'POST')
}
// 产品排序校验
export async function check_propduct_tree(params) {
  return request('/api/credit-product/product/saveCheck', params, 'POST')
}
// 产品排序修改
export async function update_propduct_tree(params) {
  return request('/api/credit-product/product/saveSort', params, 'POST')
}
// 新增零件
export async function add_parts(params) {
  return request('/api/credit-component/component/saveComponent', { ...params }, 'POST')
}
// 复制新增零件
export async function copy_save_component(params) {
  return request('/api/credit-component/component/copySaveComponent', { ...params }, 'POST')
}

// 更新零件
export async function updata_parts(params) {
  return request('/api/credit-component/component/componentUpdate', { ...params }, 'POST')
}

// 获取零件详情
export async function get_parts_detail(params) {
  return request(`/api/credit-component/component/queryComponentDetailById?${ stringify(params) }`, {}, 'POST')
}

// 查看零件详情（点击零件名称请求）
export async function get_component_detail(params) {
  return request(`/api/credit-component/component/queryComponentById?${ stringify(params) }`, {}, 'POST')
}

// 一级分类
export async function get_officeId_list(params) {
  return request(`/api/credit-organization/office/allOffice?${ stringify(params) }`, {}, 'POST', false)
}

// 二级分类
export async function get_departmentId_list(params) {
  return request(`/api/credit-organization/department/allDepartment?${ stringify(params) }`, {}, 'POST', false)
}

// 机构二级分类
export async function get_departmentName_list(params) {
  return request(`/api/credit-organization/department/allDepartmentName?${ stringify(params) }`, {}, 'POST', false)
}

// 机构二级分类编码
export async function get_departmentCode_list(params) {
  return request(`/api/credit-organization/department/allDepartmentCode?${ stringify(params) }`, {}, 'POST', false)
}

// 服务配置模块
// 获取服务list
export async function get_service_list(params) {
  return request('/api/credit-serve/serve/list', params, 'GET')
}
// 查看服务详情
export async function post_service_details(params) {
  return request('/api/credit-serve/serve/detail', { ...params }, 'GET')
}
// 服务新增
export async function post_service_add(params) {
  return request(`/api/credit-serve/serve/increase`, { ...params }, 'POST')
}
// 服务修改
export async function post_service_edit(params) {
  return request('/api/credit-serve/serve/amend', { ...params }, 'POST')
}
// 服务复制
export async function post_service_copy(params) {
  return request('/api/credit-serve/serve/copyUpdate', { ...params }, 'POST')
}
// 查看服务名称是否唯一（注意：这个接口已经不需要，已经在baseform中请求）
export async function get_service_only(params) {
  return request('/api/credit-serve/serve/checkServeName', params, 'GET')
}
// 批量删除服务
export async function post_service_delete(params) {
  return request(`/api/credit-serve/serve/del?${ stringify(params) }`, {}, 'POST')
}

// 规则列表
export async function get_rule_list(params) {
  return request(`/api/credit-component/ruleTemplate/page`, { ...params }, 'POST')
}

// 删除规则
export async function delete_rule(params) {
  return request(`/api/credit-component/ruleTemplate/delete?${ stringify(params) }`, {}, 'DELETE')
}

// 新增规则
export async function add_rule(params) {
  return request('/api/credit-component/ruleTemplate/save', params, 'POST')
}

// 检验零件直接是否存在包含关系
export async function check_component(params) {
  return request(`/api/credit-component/component/checkComponent?${ stringify(params) }`, {}, 'POST')
}

// 获取计算框支持的函数
export async function get_rule_function() {
  return request('/api/credit-component/rule/ruleSymbols', {}, 'GET')
}

// 规则校验
export async function pre_calcualte(params) {
  return request('/api/credit-component/component/expressParse', params, 'POST')
}

export const download_url = '/api/credit-component/component/downComponentTemplate'

export const importPart_url = '/api/credit-data/data/importPart'

// ------------------------------------信用报告---------------------------------------
// 信用报告查询

export async function query_credit_report_list(params) {
  return request('/api/credit-serve/credit/report/query', params, 'POST')
}
// 模糊查询生效产品集合
export async function query_product_list(params) {
  return request('/api/credit-product/product/queryProductList', params, 'POST')
}
// 查询原因列表
export async function add_reason(params) {
  return request('/api/credit-serve/credit/report/addReason', params, 'POST')
}
// 查询原因列表
export async function list_reason(params) {
  return request('/api/credit-serve/credit/report/listReason', params, 'POST')
}
// 更新查询原因
export async function update_reason(params) {
  return request('/api/credit-serve/credit/report/updateReason', params, 'POST')
}
// 删除查询原因
export async function report_delete(params) {
  return request('/api/credit-serve/credit/report/deleteReason', params, 'DELETE')
}

// ------------------------------------预警服务---------------------------------------
// 服务的发送方式
export async function get_serve_sendType() {
  return request('/api/credit-serve/warn/serve/sendType', {}, 'GET')
}
// 服务状态
export async function get_serve_state() {
  return request('/api/credit-serve/warn/serve/serveState', {}, 'GET')
}
// 预警周期
export async function get_serve_warnPeriod() {
  return request('/api/credit-serve/warn/serve/warnPeriod', {}, 'GET')
}
// 文件类型
export async function get_serve_fileType() {
  return request('/api/credit-serve/warn/serve/fileType', {}, 'GET')
}
// 预警服务的list
export async function post_serve_list(params) {
  return request('/api/credit-serve/warn/serve/list', { ...params }, 'POST')
}
// 预警详情
export async function get_serve_details(params) {
  return request('/api/credit-serve/warn/serve/detail', { ...params }, 'GET')
}
// 新增预警服务
export async function post_serve_add(params) {
  return request(`/api/credit-serve/warn/serve/save`, { ...params }, 'POST')
}
// 复制预警服务
export async function post_serve_copy(params) {
  return request(`/api/credit-serve/warn/serve/copy`, { ...params }, 'POST')
}
// 修改预警服务
export async function post_serve_update(params) {
  return request(`/api/credit-serve/warn/serve/update`, { ...params }, 'POST')
}
// 删除预警服务
export async function delete_serve_list(params) {
  return request('/api/credit-serve/warn/serve/delete', params, 'DELETE')
}

// ------------------------------------机构管理---------------------------------------

// 业务发生机构列表
export async function get_office_page_list(params) {
  return request('/api/credit-organization/office/officePageList', { ...params }, 'POST')
}

// save-业务发生机构列表_
export async function office_save(params) {
  return request('/api/credit-organization/office/save', { ...params }, 'POST')
}

// update-业务发生机构列表
export async function office_update(params) {
  return request('/api/credit-organization/office/update', { ...params }, 'POST')
}

// delete-业务发生机构列表
export async function office_delete(params) {
  return request(`/api/credit-organization/office/batchDelete?${ stringify(params) }`, {}, 'POST')
}

// 业务发生机构列表导入模板
export const import_Office_url = '/api/credit-organization/office/importOffice'

export const download_office_template = '/api/credit-organization/office/downloadOfficeTemplate'

// 二级分类列表
export async function secondaryClassification_list(params) {
  return request('/api/credit-organization/department/list', { ...params }, 'POST')
}
// 二级分类新增
export async function secondaryClassification_add(params) {
  return request('/api/credit-organization/department/save', { ...params }, 'POST')
}
// 请求二级分类详情
export async function get_secondaryClass_info(params) {
  return request('/api/credit-organization/department/detail', params, 'GET')
}
// 修改二级分类
export async function secondaryClassification_update(params) {
  return request('/api/credit-organization/department/update', { ...params }, 'POST')
}
// 删除二级分类
export async function delete_secondaryClass_list(params) {
  return request('/api/credit-organization/department/delete', params, 'DELETE')
}
// 数据提供机构列表查询
export async function get_source_page_list(params) {
  return request('/api/credit-organization/source/pageList', { ...params }, 'POST')
}

// 数据提供机构save
export async function source_save(params) {
  return request('/api/credit-organization/source/save', { ...params }, 'POST')
}

// 数据提供机构 updata
export async function source_updata(params) {
  return request('/api/credit-organization/source/update', { ...params }, 'POST')
}

// 数据提供机构删除
export async function delete_source_page(params) {
  return request(`/api/credit-organization/source/batchDelete?${ stringify(params) }`, {}, 'DELETE')
}

// 数据提供启动
export async function source_start(params) {
  return request(`/api/credit-organization/source/start?${ stringify(params) }`, {}, 'POST', false)
}

// 数据提供关闭
export async function source_shutdown(params) {
  return request(`/api/credit-organization/source/shutdown?${ stringify(params) }`, {}, 'POST', false)
}

// 数据使用机构列表查询
export async function get_data_use_organization(params) {
  return request('/api/credit-organization/dataUseOrganization/pageList', { ...params }, 'POST')
}

// 数据使用机构保存
export async function save_data_use_organization(params) {
  return request('/api/credit-organization/dataUseOrganization/save', { ...params }, 'POST')
}

// 数据使用机构更新
export async function update_data_use_organization(params) {
  return request('/api/credit-organization/dataUseOrganization/update', { ...params }, 'POST')
}

// 数据使用机构删除
export async function delete_data_use_organization(params) {
  return request(`/api/credit-organization/dataUseOrganization/batchDelete?${ stringify(params) }`, {}, 'DELETE')
}

// 数据提供启动
export async function data_start(params) {
  return request(`/api/credit-organization/dataUseOrganization/start?${ stringify(params) }`, {}, 'POST', false)
}

// 数据提供关闭
export async function data_shutdown(params) {
  return request(`/api/credit-organization/dataUseOrganization/shutdown?${ stringify(params) }`, {}, 'POST', false)
}

// --------------------------------------------用户角色管理---------------------------------------

// 菜单权限
export async function get_menu_tree(params) {
  return request('/api/credit-user/user/sysMenu/menuTree', { ...params }, 'GET', false)
}
// export async function get_menu_tree(params) {
//   return request('https://www.easy-mock.com/mock/5ce51b8e35cff95dda329618/credit/navleft', { ...params }, 'GET', false)
//   // return process.env.NODE_ENV === 'development' ?  request('/api/credit-user/user/sysMenu/menuTree',{...params},'GET',false) : request('/api/credit-user/user/sysMenu/nav',{...params},'GET',false)
//   // https://www.easy-mock.com/mock/5ce51b8e35cff95dda329618/credit/nav
// }

// 部门权限
export async function get_dep_tree(params) {
  return request('/api/credit-user/user/sysDept/deptTree', { ...params }, 'GET')
}
// --------------------------------------角色管理模块-----------------------------

// 角色管理列表页list
export async function get_roles_list(params) {
  return request('/api/credit-user/user/sysRole/page', params, 'GET')
}
// 新增角色
export async function post_role_add(params) {
  return request(`/api/credit-user/user/sysRole/add`, { ...params }, 'POST')
}
// 角色详情
export async function get_roles_info(params) {
  return request('/api/credit-user/user/sysRole/info', params, 'GET')
}
// 修改角色
export async function post_role_updata(params) {
  return request(`/api/credit-user/user/sysRole/update`, { ...params }, 'POST')
}
// 删除角色
export async function post_role_delete(params) {
  return request(`/api/credit-user/user/sysRole/deleteList`, params, 'DELETE')
}
// --------------------------------------部门管理模块-----------------------------
// 部门管理列表页list
export async function get_department_list(params) {
  return request('/api/credit-user/user/sysDept/page', params, 'GET')
}
// 新增部门
export async function post_department_add(params) {
  return request(`/api/credit-user/user/sysDept/add`, { ...params }, 'POST')
}
// 部门详情
export async function get_department_info(params) {
  return request('/api/credit-user/user/sysDept/info', params, 'GET')
}
// 修改部门
export async function post_department_updata(params) {
  return request(`/api/credit-user/user/sysDept/update`, { ...params }, 'POST')
}
// 删除部门
export async function post_department_delete(params) {
  return request(`/api/credit-user/user/sysDept/deleteList`, params, 'DELETE')
}
// --------------------------------------用户管理-----------------------------------------
// 获取角色
export async function get_roleSelect_list(params) {
  return request('/api/credit-user/user/sysRole/list', params, 'GET')
}
// 用户管理列表页list
export async function get_users_list(params) {
  return request('/api/credit-user/user/sysUser/page', params, 'GET')
}
// 新增用户
export async function post_user_add(params) {
  return request(`/api/credit-user/user/sysUser/add`, { ...params }, 'POST')
}
// 查看用户详情
export async function get_user_info(params) {
  return request('/api/credit-user/user/sysUser/info', params, 'GET')
}
// 修改用户
export async function post_user_updata(params) {
  return request(`/api/credit-user/user/sysUser/update`, { ...params }, 'POST')
}
// 删除用户
export async function post_user_delete(params) {
  return request(`/api/credit-user/user/sysUser/deleteList`, params, 'DELETE')
}
// 用户登陆
export async function get_user_login(params) {
  return request(`/api/credit-user/user/login/login?${ stringify(params) }`, {}, 'POST')
}
// 用户登出
export async function get_user_logout() {
  return request('/api/credit-user/user/login/logout', {}, 'GET')
}

// --------------------------------------系统管理-----------------------------------------
// 数据字典新增接口
export async function add_sys_dic(params) {
  return request('/api/credit-user/user/sysDataDic/add', { ...params }, 'POST')
}
// 数据字典删除接口
export async function delete_sys_dic(params) {
  return request('/api/credit-user/user/sysDataDic/deleteList', params, 'DELETE')
}
// 数据字典修改接口
export async function update_sys_dic(params) {
  return request('/api/credit-user/user/sysDataDic/update', { ...params }, 'POST')
}
// 数据字典列表接口
export async function get_sys_dic_list(params) {
  return request('/api/credit-user/user/sysDataDic/page', { ...params }, 'GET')
}
// 数据字典详情接口
export async function get_sys_dic_info(params) {
  return request('/api/credit-user/user/sysDataDic/info', { ...params }, 'GET')
}
// 内容管理新增接口
export async function add_sys_content(params) {
  return request('/api/credit-user/user/content/add', { ...params }, 'POST')
}
// 内容管理删除接口
export async function delete_sys_content(params) {
  return request(`/api/credit-user/user/content/del?${ stringify(params) }`, {}, 'POST')
}
// 内容管理修改接口
export async function update_sys_content(params) {
  return request('/api/credit-user/user/content/edit', { ...params }, 'POST')
}
// 内容管理列表接口
export async function get_sys_content_list(params) {
  return request('/api/credit-user/user/content/list', { ...params }, 'GET')
}
// 内容管理详情接口
export async function get_sys_content_info(params) {
  return request('/api/credit-user/user/content/detail', { ...params }, 'GET')
}
// 操作日志查询
export async function opt_log_summary_list(params) {
  return request('/api/credit-user/log/optLogSummary/list', { ...params }, 'POST')
}
// 操作日志查看
export async function opt_log_summary_detail(params) {
  return request(`/api/credit-user/log/optLogSummary/detail?${ stringify(params) }`, {}, 'POST')
}
// 操作日志导入详情
export async function opt_log_summary_importList(params) {
  return request('/api/credit-user/log/optLogSummary/importList', { ...params }, 'POST')
}
// 操作日志导入详情查看
export async function opt_log_summary_importDetail(params) {
  return request(`/api/credit-user/log/optLogSummary/importDetail?${ stringify(params) }`, {}, 'POST')
}
// -------------------------------------订单配置------------------------------------------
// 服务列表
export async function get_services_list(params) {
  return request('/api/credit-serve/serve/order/serveList', { ...params }, 'GET')
}
// 订单列表
export async function get_orders_list(params) {
  return request('/api/credit-serve/serve/order/page', { ...params }, 'GET')
}
// 查看订单详情
export async function get_orders_details(params) {
  return request('/api/credit-serve/serve/order/detail', { ...params }, 'GET')
}
// 新增订单--选择机构名称
export async function get_organization_list(params) {
  return request('/api/credit-organization/dataUseOrganization/selectList', { ...params }, 'GET')
}
// 新增订单-保存
export async function add_order_list(params) {
  return request('/api/credit-serve/serve/order/addOrder', { ...params }, 'POST')
}
// 数据使用机构下的名单
export async function get_credit_mumbers(params) {
  return request('/api/credit-serve/serve/order/getCreditSubjectList', { ...params }, 'GET')
}
// 数据使用机构下的人数
export async function get_credit_count(params) {
  return request('/api/credit-serve/serve/order/getCreditSubjectPersonCount', { ...params }, 'GET')
}
// 获取默认的价目表
export async function get_default_price(params) {
  return request('/api/credit-serve/serve/order/getPrice', params, 'GET')
}
// 订单作废
export async function post_order_cancel(params) {
  return request(`/api/credit-serve/serve/order/cancellation?${ stringify(params) }`, {}, 'POST')
}
// 查看订单服务构成
export async function get_order_services(params) {
  return request('/api/credit-serve/serve/order/examineOrder', params, 'GET')
}
// 计算预警服务价格
export async function post_order_calculate(params) {
  return request('/api/credit-serve/serve/order/calculate', params, 'POST')
}
// 修改订单
export async function post_order_update(params) {
  return request('/api/credit-serve/serve/order/update', params, 'POST')
}
// 下载服务
export async function get_prices_dowmload(params) {
  return request('/api/credit-serve/serve/order/serveExcel3', params, 'POST')
}

export const order_serveExcel = '/api/credit-serve/serve/order/serveExcel'

// --------------------------------------是否登陆-----------------------------------------
export async function is_login() {
  return request('/api/credit-user/user/login/isLogin', {}, 'GET', false)
}

// --------------------------------------详单-----------------------------------------
// 新增详单配置
export async function save_serve_config(params) {
  return request('/api/credit-serve/serve/serveConfig/saveServeConfig', { ...params }, 'POST')
}

// 详单list
export async function config_price_list(params) {
  return request('/api/credit-serve/serve/serveConfig/configPriceList', { ...params }, 'POST')
}

// 详单优惠详情
export async function config_discount_list(params) {
  return request('/api/credit-serve/serve/serveConfig/configDiscountList', { ...params }, 'GET')
}

// 服务名称下拉列表
export async function serve_all_list(params) {
  return request('/api/credit-serve/serve/serveConfig/serveAllList', { ...params }, 'GET', false)
}

// 更新详单信息
export async function update_serve_config(params) {
  return request('/api/credit-serve/serve/serveConfig/updateServeConfig', { ...params }, 'POST')
}

// 服务配置删除
export async function serve_config_delete(params) {
  return request('/api/credit-serve/serve/serveConfig/delete', [...params], 'DELETE')
}

// 更新详单配置
export async function serve_config_detail(params) {
  return request('/api/credit-serve/serve/serveConfig/detail', { ...params }, 'GET')
}

// --------------------------------------名单导入-----------------------------------------
// 名单列表
export async function get_name_list(params) {
  return request('/api/credit-serve/serve/creditSubjectList/list', { ...params }, 'POST')
}

// 新增名单
export async function save_credit_subject(params) {
  return request('/api/credit-serve/serve/creditSubjectList/saveCreditSubject', { ...params }, 'POST')
}

// 下拉列表
export async function option_list(params) {
  return request('/api/credit-organization/dataUseOrganization/nameList', { ...params }, 'GET')
}

// 下载文件模板
export const file_template = '/api/credit-serve/serve/creditSubjectList/fileTemplate'

// 查看文件详情
export async function file_list(params) {
  return request('/api/credit-serve/serve/creditSubjectList/fileList', { ...params }, 'GET')
}

// 查看名单列表
export async function person_list(params) {
  return request('/api/credit-serve/serve/creditSubjectList/personList', { ...params }, 'POST')
}

// 数据字典删除接口
export async function delete_credit_person(params) {
  return request(`/api/credit-serve/serve/creditSubjectList/deleteCreditPerson?${ stringify(params) }`, {}, 'DELETE')
}

// ----------------------------   所有接口必须加上  /api  后端端口 转发到 /api 上面   --------------------------------

