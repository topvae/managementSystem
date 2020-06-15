import React, { useState, useEffect, useCallback } from 'react' // { useState, useEffect, useCallback}
import { Card, Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import { uniqueTree } from './../../../utils/utils'
import './index.less'
import { roles, Rolesconfig } from './formList'
import RolesBaseForm from './../../../components/Form/baseForm'
import { post_role_add, get_menu_tree, get_dep_tree, get_roles_info, post_role_updata } from './../../../services/api'
let formRef
function OperationRoleManage(props) {
  const { location, history } = props
  const pathSnippets = location.pathname.split('/').filter(i => i)// 过滤数字类型
  const componentId = pathSnippets.filter(i => {
    return !isNaN(i)
  })
  const Id = componentId[0] // 角色管理模块的id
  // -------------------------------------------------------------------------------------
  const [updateList, setUpdateList] = useState({}) // info的数据
  const [roleData, setRoleData] = useState(roles)
  const [deptId, setDeptId] = useState([]) // 部门ID
  const [menuIdList, setMenuIdList] = useState([]) // 功能权限去父节点后的数组id
  const [testDate, setTestDate] = useState([]) // 存放子节点的数组
  const [menuExpandKeys, setMenuExpandKeys] = useState([]) // 修改角色模块--功能权限树的展开节点
  const [depExpandKeys, setDepExpandKeys] = useState([]) // 修改角色模块--所属部门树的展开节点
  const [editMenuIdList, setEditMenuIdList] = useState([]) // 修改的时候接口返回的权限树的值要存放在数组中
  const [ifTreeChange, setIfTreeChange] = useState(false) // 树节点触发的状态一开始为false

  useEffect(() => {
    const test = []
    const requestList = (data) => {
      data && data.map(item => {
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
          item.treeData = datas
        }
        return {
          ...item
        }
      })
    }
    // 获取权限树
    get_menu_tree().then(res => {
      const { responseData } = res.data
      const formList1 = getRules('menuIdList', responseData, roles)
      setRoleData(formList1)
      requestList(responseData)
    })
    // 获取部门树
    get_dep_tree().then(res => {
      const { responseData } = res.data
      const formList2 = getRules('deptId', responseData, roles)
      setRoleData(formList2)
    })
  }, [])
  // 获取用户详情
  useEffect(() => {
    // 捕捉到修改页面带过来的参数改变后请求接口
    if (Id) {
      const getRoleInfo = () => {
        get_roles_info({ id: Id })
          .then(res => {
            const data = res.data.responseData
            setUpdateList({
              roleName: data.roleName,
              remark: data.remark
            })

            // 这块代码是为了从数据中取出来的tree去掉父组件的id
            setEditMenuIdList(data.menuIdList)
            const uniqueChild = uniqueTree(data.menuIdList, testDate)
            setDeptId([data.deptId]) // 将部门树的数据给子组件传递过去
            setDepExpandKeys([data.deptId]) // 部门树的展开数据
            setMenuIdList(uniqueChild) // 将权限树给子组件传过去
            setMenuExpandKeys(uniqueChild) // 权限树的展开数据
            // console.log("dkcbakcbakd",uniqueChild);
            // 这句代码的作用：刚进页面给value复制，在点击保存的时候就能获取value
            formRef.props.form.setFieldsValue({ deptId: [data.deptId], menuIdList: uniqueChild })
          })
      }
      getRoleInfo()
    }
  }, [Id, testDate])

  // 从子组件传过来的在树状图中选中的key
  const selectedTreeKeys = useCallback(
    (field, checkedKeys, halfCheckedKeys) => {
      if (field === 'menuIdList') {
        setMenuIdList(checkedKeys)
        setIfTreeChange(true) // 如果触发了则让参数变为true
      } else if (field === 'deptId') {
        setDeptId(checkedKeys)
      }
    }, [])

  // 新增和修改对keys的处理不同，新增的时候是根据onCheck事件拼接好父节点
  // 修改的时候如果没有触发onCheck事件则保存过来的值还是只有子节点 所以要在修改的时候进行二次拼接

  // 新增角色方法
  const addRole = useCallback(
    (params) => {
      params.deptId = params.deptId[0] // 注意：！！传过去的是个数组 需要转成字符串
      post_role_add({ ...params })
        .then(res => {
          Modal.success({
            title: '角色新增成功'
          })
          history.push('/authority/roleManage')
        })
    }, [history])

  // 修改角色
  const editRole = useCallback(
    params => {
      if (ifTreeChange) {
      // 传入params.menuIds
      // params.menuIdList = params.menuIdList
      } else {
      // 传入editMenuIdList
        params.menuIdList = editMenuIdList
      }
      params.deptId = params.deptId[0] // 注意：！！传过去的是个数组 需要转成字符串
      post_role_updata({ ...params, roleId: Id })
        .then(res => {
          Modal.success({
            title: '角色修改成功'
          })
          history.push('/authority/roleManage')
        })
    }, [ifTreeChange, editMenuIdList, Id, history])

  // 保存

  const filterSubmit = useCallback((values) => {
    if (Id) {
      editRole(values)
    } else {
      addRole(values)
    }
  }, [Id, editRole, addRole])

  // 取消
  const handleReset = () => {
    props.history.push('/authority/roleManage')
  }
  // 从子组件传过来的展开的树的数据expand
  // const chooseExpandKeys =(field,param)=> {
  //   console.log('fu',field,param)
  //   if(field === 'menuIdList'){
  //     setMenuExpandKeys(param)
  //   }else if(field === 'deptId'){
  //     setDepExpandKeys(param)
  //   }
  // }
  // 从子组件传过来的展开的树的数据expand
  const chooseExpandKeys = useCallback(
    (field, param) => {
      if (field === 'menuIdList') {
        setMenuExpandKeys(param)
      } else if (field === 'deptId') {
        setDepExpandKeys(param)
      }
    }, [])

  return (
    <div className='operationRoleManage'>
      <Card>
        <RolesBaseForm
          wrappedComponentRef={ (inst) => (formRef = inst) }
          formList={ roleData }
          config={ Rolesconfig } //  treeData = {treeData}
          filterSubmit={ filterSubmit }
          updateList={ updateList } // 部门列表
          menuIdList={ menuIdList } // 权限列表
          deptId={ deptId }
          selectedTreeKeys={ selectedTreeKeys }
          handleReset={ handleReset }
          menuExpandKeys={ menuExpandKeys } // 定义功能权限的展开节点
          depExpandKeys={ depExpandKeys } // 定义所属部门的展开节点
          chooseExpandKeys={ chooseExpandKeys } // 子组件中展开节点的变化调用的父节点的方法
        />
      </Card>
    </div>
  )
}

export default withRouter(OperationRoleManage)
