import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Modal, message } from 'antd'
import './index.less'
import RolesBaseForm from './../../../components/Form/baseForm'
import { users, usersconfig } from './formList'
import { uniqueTree } from './../../../utils/utils'
import {
  post_user_add,
  get_menu_tree,
  get_dep_tree,
  get_roleSelect_list,
  get_user_info,
  post_user_updata
} from './../../../services/api'
let formRef
// let addUserManage = window.location.href.includes("addUserManage");
// let editUserManage = window.location.href.includes("editUserManage");
function OperationUserManage(props) {
  // 获取url里面的数字id 进行查询
  const { location, history } = props
  const pathSnippets = location.pathname.split('/').filter(i => i)
  // 过滤数字类型
  const componentId = pathSnippets.filter(i => {
    return !isNaN(i)
  })
  const Id = componentId[0]
  // -------------------------------------------------------------------------------------
  const [updateList, setUpdateList] = useState({}) // info的数据
  const [userData, setUserData] = useState(users)
  const [deptId, setDeptId] = useState([]) // 部门ID
  const [menuIds, setMenuIds] = useState([]) // 功能权限数组id
  const [editRoleIds, setEditRoleIds] = useState([])
  const [testDate, setTestDate] = useState([]) // 存放所有子节点的数组
  const [menuExpandKeys, setMenuExpandKeys] = useState([]) // 修改角色模块--功能权限树的展开节点
  const [depExpandKeys, setDepExpandKeys] = useState([]) // 修改角色模块--所属部门树的展开节点
  const [editMenuIdList, setEditMenuIdList] = useState([]) // 修改的时候接口返回的权限树的值要存放在数组中
  const [ifchange, setIfchange] = useState(false) // 密码的触发状态
  const [ifTreeChange, setIfTreeChange] = useState(false) // 树节点触发的状态一开始为false

  // 将formList的数据拿到之后传给baseform
  useEffect(() => {
    const test = []
    const requestList = data => {
      data &&
        data.map(item => {
          if (item.nodes && item.nodes.length > 0) {
            requestList(item.nodes)
          } else {
            test.push(item.menuId)
          }
          return null
        })
      setTestDate(test) // 将test数据赋值给变量供下面用
      return test
    }
    const getRules = (val, datas, formVal) => {
      return formVal.map((item, index) => {
        if (item.field === val) {
          if (item.treeData) {
            item.treeData = datas // 树状图
          } else if (item.rules) {
            item.rules = datas // 角色下拉框
          }
        }
        return {
          ...item
        }
      })
    }
    // 获取权限树
    get_menu_tree().then(res => {
      const { responseData } = res.data
      const formList1 = getRules('menuIds', responseData, users)
      setUserData(formList1)
      requestList(responseData)
    })
    // 获取部门树
    get_dep_tree().then(res => {
      const { responseData } = res.data
      const formList2 = getRules('deptId', responseData, users)
      setUserData(formList2)
    })
    get_roleSelect_list().then(res => {
      const { responseData } = res.data
      const rolesVal = responseData.map(item => {
        return {
          id: String(item.roleId),
          rule: item.roleName
        }
      })
      const formList3 = getRules('roleIds', rolesVal, users)
      setUserData(formList3)
    })
  }, [])

  // 获取用户详情
  useEffect(() => {
    // 捕捉到修改页面带过来的参数改变后请求接口
    if (Id) {
      const getRoleInfo = () => {
        get_user_info({ id: Id }).then(res => {
          const data = res.data.responseData
          // let obj1 = JSON.parse(sessionStorage.getItem('userInfo')) ; //获取用户名密码
          setUpdateList({
            username: data.username,
            password: data.password,
            email: data.email,
            status: data.status,
            mobile: data.mobile,
            roleIds: toString(data.roleIds) // 将roleIds转成字符串
          })

          // console.log('------',obj1)
          setEditMenuIdList(data.menuIds)
          const uniqueChild = uniqueTree(data.menuIds, testDate)
          setDepExpandKeys([data.deptId]) // 部门树的展开数据
          setMenuExpandKeys(uniqueChild) // 权限树的展开数据
          setDeptId([data.deptId])
          setMenuIds(uniqueChild)
          setEditRoleIds(data.roleIds) // 在请求详情的接口把roleIds传给子组件做处理
          // 这句代码的作用：刚进页面给value复制，在点击保存的时候就能获取value
          formRef.props.form.setFieldsValue({
            deptId: [data.deptId],
            menuIds: uniqueChild
          })
        })
      }
      getRoleInfo()
    }
  }, [Id, testDate])

  // roleIds数字转字符串
  const toString = data => {
    return (
      data &&
      data.map(item => {
        return item.toString()
      })
    )
  }

  // 从子组件传过来的在树状图中选中的key
  const selectedTreeKeys = (field, checkedKeys) => {
    if (field === 'deptId') {
      setDeptId(checkedKeys)
    } else if (field === 'menuIds') {
      setMenuIds(checkedKeys)
      setIfTreeChange(true) // 如果触发了则让参数变为true
    }
  }

  const addRole = useCallback(
    params => {
      params.deptId = params.deptId[0] // 注意：！！传过去的是个数组 需要转成字符串
      post_user_add({ ...params }).then(res => {
        Modal.success({
          title: '用户新增成功'
        })
        history.push('/authority/userManage')
      })
    },
    [history]
  )
  // 监听到密码的改变
  const passswordChange = useCallback(() => {
    setIfchange(true)
  }, [])

  // 用户修改
  const editRole = useCallback(
    params => {
      if (ifTreeChange) {
        // 传入params.menuIds
        // params.menuIds = params.menuIds
      } else {
        // 传入editMenuIdList
        params.menuIds = editMenuIdList
      }
      params.deptId = params.deptId[0] // 注意：！！传过去的是个数组 需要转成字符串
      if (!ifchange) {
        params.password = null // 如果密码没有修改的情况下，保存传过去之后赋值为空
      }
      // 同时需要对传过来的RoleIds做一下判断，如果是名称的情况下，需要转成数字
      post_user_updata({ ...params, userId: Id }).then(res => {
        Modal.success({
          title: '用户修改成功'
        })
        history.push('/authority/userManage')
      })
    },
    [ifchange, ifTreeChange, editMenuIdList, history, Id] // history ,Id
  )

  // 保存
  const filterSubmit = useCallback(
    values => {
      if (Id) {
        editRole(values)
      } else {
        addRole(values)
      }
    },
    [Id, editRole, addRole]
  )

  // 取消
  const handleReset = () => {
    props.history.push('/authority/userManage')
  }
  const chooseExpandKeys = useCallback((field, param) => {
    if (field === 'menuIds') {
      setMenuExpandKeys(param)
    } else if (field === 'deptId') {
      setDepExpandKeys(param)
    }
  }, [])

  const showMessage = () => {
    message.warning('请完善信息后再提交')
  }

  return (
    <div className='operationUserManage'>
      <Card>
        <RolesBaseForm
          wrappedComponentRef={ inst => (formRef = inst) }
          formList={ userData }
          config={ usersconfig } //  treeData = {treeData}
          filterSubmit={ filterSubmit }
          updateList={ updateList } // 部门列表
          menuIds={ menuIds } // 权限列表
          deptId={ deptId }
          editRoleIds={ editRoleIds } // 角色数组
          selectedTreeKeys={ selectedTreeKeys }
          handleReset={ handleReset }
          menuExpandKeys={ menuExpandKeys } // 定义功能权限的展开节点
          depExpandKeys={ depExpandKeys } // 定义所属部门的展开节点
          chooseExpandKeys={ chooseExpandKeys } // 子组件中展开节点的变化调用的父节点的方法
          showMessage={ showMessage } // 展示提示信息
          passswordChange={ passswordChange }
        />
      </Card>
    </div>
  )
}

export default withRouter(OperationUserManage)
