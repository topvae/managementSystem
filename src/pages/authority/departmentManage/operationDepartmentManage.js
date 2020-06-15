import React, { useEffect, useState } from 'react'
import { Card, Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import './index.less'
import RolesBaseForm from './../../../components/Form/baseForm'
import { departments, departmentsconfig } from './formList'
import {
  get_dep_tree,
  post_department_add,
  get_department_info,
  post_department_updata
} from './../../../services/api'
let formRef
let filterSubmit
function OperationDepartmentManage(props) {
  const { location } = props
  const pathSnippets = location.pathname.split('/').filter(i => i)
  const componentId = pathSnippets.filter(i => {
    return !isNaN(i)
  })
  const Id = componentId[0] // 角色管理模块的id
  const [depData, setDepData] = useState(departments)
  const [updateList, setUpdateList] = useState({}) // info的数据
  const [parentIds, setParentIds] = useState([]) // 部门ID
  const [depExpandKeys, setDepExpandKeys] = useState([]) // 修改角色模块--所属部门树的展开节点

  useEffect(() => {
    const getRules = (val, datas, formVal) => {
      return formVal.map((item) => {
        if (item.field === val) {
          item.treeData = datas
        }
        return {
          ...item
        }
      })
    }
    // 获取部门树
    get_dep_tree().then(res => {
      const { responseData } = res.data
      // 第一个参数代表的是field
      const formList2 = getRules('parentIds', responseData, departments)
      setDepData(formList2)
    })
  }, [])

  // 获取用户详情
  useEffect(() => {
    // 捕捉到修改页面带过来的参数改变后请求接口
    if (Id) {
      const getRoleInfo = () => {
        get_department_info({ id: Id }).then(res => {
          const data = res.data.responseData
          setUpdateList({
            name: data.name,
            remark: data.remark
          })
          setParentIds(data.parentIds) // 这会变成了数组
          setDepExpandKeys(data.parentIds) // 部门树的展开数据
          // 这句代码的作用：刚进页面给value复制，在点击保存的时候就能获取value
          formRef.props.form.setFieldsValue({ parentIds: data.parentIds })
        })
      }
      getRoleInfo()
    }
  }, [Id])

  // 从子组件传过来的在树状图中选中的key
  const selectedTreeKeys = (field, checkedKeys) => {
    if (field === 'parentIds') {
      setParentIds(checkedKeys)
    }
  }
  useEffect(() => {
    // 确定
    filterSubmit = values => {
      console.log('父values', values)
      if (Id) {
        editDepartment(values)
      } else {
        addDepartment(values)
      }
    }
    // 新增部门
    const addDepartment = params => {
      post_department_add({ ...params }).then(() => {
        Modal.success({
          title: '部门新增成功'
        })
        props.history.push('/authority/departmentManage')
      })
    }
    // 修改部门
    const editDepartment = params => {
      post_department_updata({ ...params, deptId: Id }).then(() => {
        Modal.success({
          title: '部门修改成功'
        })
        props.history.push('/authority/departmentManage')
      })
    }
  }, [props.history, Id])

  // 取消
  const handleReset = () => {
    props.history.push('/authority/departmentManage')
  }
  // 从子组件传过来的展开的树的数据expand
  const chooseExpandKeys = (field, param) => {
    console.log('fu', field, param)
    setDepExpandKeys(param)
  }
  return (
    <div className='operationDepartmentManage'>
      <Card>
        <RolesBaseForm
          wrappedComponentRef={ inst => (formRef = inst) }
          formList={ depData }
          config={ departmentsconfig }
          filterSubmit={ filterSubmit }
          updateList={ updateList } // 部门列表
          parentIds={ parentIds }
          selectedTreeKeys={ selectedTreeKeys }
          handleReset={ handleReset }
          depExpandKeys={ depExpandKeys } // 定义所属部门的展开节点
          chooseExpandKeys={ chooseExpandKeys } // 子组件中展开节点的变化调用的父节点的方法
        />
      </Card>
    </div>
  )
}

export default withRouter(OperationDepartmentManage)
