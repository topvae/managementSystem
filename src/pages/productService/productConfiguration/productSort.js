import React, { useEffect, useState } from 'react'
import { Card, Button, Form, Tree, Modal, message } from 'antd'
import './index.less'
import {
  get_propduct_tree,
  update_propduct_tree,
  check_propduct_tree
} from './../../../services/api'
import { IconFont } from './../../../config/iconConfig'
const { TreeNode } = Tree
const { confirm } = Modal
function OperationDepartmentManage(props) {
  const { location } = props
  const { getFieldDecorator } = props.form
  const pathSnippets = location.pathname.split('/').filter(i => i)
  const componentId = pathSnippets.filter(i => {
    return !isNaN(i)
  })
  const Id = componentId[0] // 角色管理模块的id
  const [treeData, setTreeData] = useState([]) // tree数据
  const [dragKey, setDragKey] = useState('') // 当前节点的key
  const [expandedKeys, setExpandedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  useEffect(() => {
    const arr = []
    const getAllKeys = (data) => {
      data && data.map((item, index) => {
        if (item.nodes) {
          getAllKeys(item.nodes)
        }
        arr.push(String(item.id))
        return null
      })
      return arr
    }
    // 获取部门树
    if (Id) {
      get_propduct_tree({ productId: Id }).then(res => {
        const { responseData } = res.data
        const allKeys = getAllKeys(responseData)
        setTreeData(responseData)
        setExpandedKeys(allKeys)
      })
    }
  }, [Id])
  // 取消
  const handleReset = () => {
    props.history.push('/product/configuration')
  }
  const handleSort = (data) => {
    return data && data.map((item, index) => {
      if (item.nodes) {
        handleSort(item.nodes)
      }
      item.orderNum = index + 1
      return {
        ...item
      }
    })
  }
  // 请求保存接口
  const savRequst = (finalArr) => {
    const sortObj = finalArr[0]
    update_propduct_tree(sortObj).then(res => {
      Modal.success({
        title: '保存成功',
        onOk: () => {
          props.history.push({ pathname: '/product/configuration' })
        }
      })
    })
    setTreeData(finalArr)
  }
  // 校验弹框
  const showConfirm = (dataMsg, finalArr) => {
    confirm({
      title: '提示',
      content: dataMsg + '顺序有矛盾，确定保存吗？',
      onOk() {
        savRequst(finalArr)
      },
      onCancel() {
        // console.log('Cancel')
      }
    })
  }
  // 点击保存
  const saveSort = async() => {
    const newArr = handleSort(treeData)
    const finalArr = newArr.map(item => {
      item.orderNum = 0
      return {
        ...item
      }
    })
    const sortObj = finalArr[0]
    const res = await check_propduct_tree(sortObj)
    const responseData = res.data.responseData
    if (responseData.length > 0) {
      const data = responseData.map(item => {
        return '零件' + item
      })
      const dataMsg = data.join('、')
      showConfirm(dataMsg, finalArr)
    } else {
      savRequst(finalArr)
    }
  }
  // tree
  const renderList = (data) => {
    return data && data.map(item => {
      if (item.nodes && item.nodes.length !== 0) {
        return (<TreeNode title={ item.assemblyName } key={ item.id } icon={ Number(item.id) === Number(dragKey) ? <IconFont type='zhengxin-yidong' /> : null }>
          {renderList(item.nodes)}
        </TreeNode>)
      }
      return <TreeNode title={ item.assemblyName } key={ item.id } icon={ Number(item.id) === Number(dragKey) ? <IconFont type='zhengxin-yidong' /> : null }></TreeNode>
    })
  }
  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }
  const onDragEnd = info => {
    setDragKey('')
  }
  const onDragStart = info => {
    const dropKey = info.node.props.eventKey
    setDragKey(dropKey)
  }
  let id = ''
  const getPid = (data, dragKey) => {
    for (let i = 0; i < data.length; i++) {
      if (Number(data[i].id) === Number(dragKey)) {
        id = data[i].pid
        return id
      }
      if (data[i].nodes) {
        getPid(data[i].nodes, dragKey)
      }
    }
    return id
  }
  let dropNodes = []
  const getDropNodes = (data, dropKey) => {
    for (let i = 0; i < data.length; i++) {
      if (Number(data[i].id) === Number(dropKey)) {
        dropNodes = data[i].nodes
        return dropNodes
      }
      if (data[i].nodes && data[i].nodes.length !== 0) {
        getDropNodes(data[i].nodes, dropKey)
      }
    }
    return dropNodes
  }
  const onDrop = info => {
    // console.log(info, 'info')
    const dropKey = info.node.props.eventKey // 移动的位置
    const dragKey = info.dragNode.props.eventKey // 当前这个
    const dropChildren = info.node.props.children || [] // 移动位置的子集
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
    const dragPid = getPid(treeData, dragKey)
    const dropPid = getPid(treeData, dropKey)
    const loop = (data, key, callback) => {
      if (dragPid === dropPid) {
        data.forEach((item, index, arr) => {
          if (Number(item.id) === Number(key)) {
            return callback(item, index, arr)
          }
          if (item.nodes) {
            return loop(item.nodes, key, callback)
          }
        })
      } else {
        message.warning('请选择同级进行拖拽')
      }
    }
    const data = [...JSON.parse(JSON.stringify(treeData))]
    // Find dragObject
    let dragObj
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })
    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.nodes = item.nodes || []
        // where to insert 示例添加到尾部，可以是随意位置
        item.nodes.push(dragObj)
      })
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.nodes = item.nodes || []
        // where to insert 示例添加到头部，可以是随意位置
        item.nodes.unshift(dragObj)
      })
    } else {
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (ar) {
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
    }
    // console.log(data, 'data')
    // console.log(treeData, 'treeData')
    const dropNodes = getDropNodes(data, dropKey)
    // console.log(dropNodes, 'dropNodes')
    if (dropNodes.length === dropChildren.length) {
      setTreeData(data)
    } else {
      message.warning('请选择同级进行拖拽')
      setTreeData(treeData)
    }
  }
  return (
    <div className='operationDepartmentManage'>
      <Card bordered={ false } bodyStyle={{ padding: '0px 32px 20px 32px' }}>
        <div className='add_order_title'>产品排序</div>
        <div className='add_order_button'>
          <div className='save'>
            <Button type='primary' onClick={ saveSort }>
              保存
            </Button>
            <Button onClick={ handleReset }>取消</Button>
          </div>
        </div>
      </Card>
      <Form className='login-form'>
        <div>
          <Card className='card_style' bordered={ false }>
            <div className='item_style'>
              <Form.Item style={{ width: '350px', margin: '0 auto' }}>
                {getFieldDecorator('productIds', {
                  rules: []
                })(
                  <Tree
                    autoExpandParent={ autoExpandParent }
                    onExpand={ onExpand }
                    expandedKeys={ expandedKeys }
                    draggable
                    blockNode
                    onDragStart={ onDragStart }
                    onDragEnd={ onDragEnd }
                    onDrop={ onDrop }
                    showIcon
                  >
                    {renderList(treeData)}
                  </Tree>
                )}
              </Form.Item>
            </div>
          </Card>
        </div>
      </Form>
    </div>
  )
}

export default Form.create({})(OperationDepartmentManage)
