import { get_serve_sendType, get_serve_state, get_serve_warnPeriod, get_serve_fileType } from './../../../services/api'
// 发送方式
export async function getServeSendType() {
  return await get_serve_sendType()
}
// 服务状态
export async function getServeState() {
  return await get_serve_state()
}
// 预警周期
export async function getServeWarnPeriod() {
  return await get_serve_warnPeriod()
}

// 文件类型
export async function getServeFileType() {
  return await get_serve_fileType()
}
