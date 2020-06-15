/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2019-12-12 10:23:53
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import { Spin } from 'antd'
// 判断是否重名
// some: 如果该函数对任一项返回true，则返回true。
export const isNameExist = (treeData, name) => {
  return treeData.some(item => {
    return item.title === name
  })
}

//   传入newArr   根据key在总数组中查找出来  将他的rule改成传入的newRule
export const changeArray = (arr, newArr, newRule) => {
  return arr.map(item => {
    if (item.key === newArr.key) {
      item.rule = newRule
    }
    return item
  })
}

// 根据key 替换原先的tree节点
// 修改数组其中一项
// for 改变原数组
export const replaceTreeData = (treeData, newTreeNode) => {
  for (let i = 0, len = treeData.length; i < len; i++) {
    if (treeData[i].children) {
      replaceTreeData(treeData[i].children, newTreeNode)
    }
    if (treeData[i].key === newTreeNode.key) {
      treeData[i] = newTreeNode
    }
  }
  return treeData
}

// 根据id去重
export const unique = (arr, idName) => {
  const obj = {} //  维护不重复id
  const result = [] //  最终数组
  arr.forEach((ele, index) => {
    if (!obj[ele[idName]]) {
      result.push(ele)
      obj[ele[idName]] = true
    }
  })
  return result
}

// 按路由拆分代码
export const MyLoadingComponent = ({ isLoading, error }) => {
  if (isLoading) {
    return <Spin />
  } else if (error) {
    console.log(error)
    return <div>页面出错了。。。</div>
  } else {
    return null
  }
}

// 姓名校验： 中文、英文大小写、下划线、数字，并且开头不能为数字；
const reg = /^[\u4e00-\u9fa5a-zA-Z_][a-zA-Z0-9_\u4e00-\u9fa5]*$/
export const validatorName = (params) => {
  if (params && reg.test(params)) {
    return true
  } else {
    return false
  }
}
// 将接口格式转成封装的参数格式
export const ChangeSelectParams = (params) => {
  return params && params.map(item => {
    return {
      id: item.code,
      rule: item.msg
    }
  })
}
// 将参数转成封装的参数格式
export const setDate = (res) => {
  const data = res.data.responseData
  return ChangeSelectParams(data)
}
// 将参数转成封装的参数格式(预警主体)
export const setCreditDate = (res) => {
  const data = res.data.responseData
  return data && data.map(item => {
    return {
      id: item.dicId,
      rule: item.fieldMsg
    }
  })
}
// 找到formlist中的rulus，传入三个参数，一个是包含的对应项，第二个参数是从接口中拿到的值 第三个参数是查询的formList还是
export const getRules = (val, datas, formVal) => {
  formVal.some((item, index) => {
    if (item.field === val) {
      return (formVal[index].rules = datas)
    }
    return null
  })
}

// 将扁平化以后的数据重组成树型格式
export const toTree = (data) => {
  // 删除 所有 nodes,以防止多次调用
  data.forEach(function(item) {
    delete item.nodes
  })
  // 将数据存储为 以 menuId 为 KEY 的 map 索引数据列
  const map = {}
  data.forEach(function(item) {
    map[item.menuId] = item
  })
  const val = []
  // 以当前遍历项，的parentId,去map对象中找到索引的menuId
  data.forEach(function(item) {
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    const parent = map[item.parentId]
    if (parent) {
      (parent.nodes || (parent.nodes = [])).push(item)
    } else {
      // 如果没有在map中找到对应的索引menuId,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item)
    }
  })
  return val
}

// 去除按钮级别的节点 type : 0：目录  1：菜单   2：按钮
export const deleteBtnNode = (tree) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].nodes) {
      deleteBtnNode(tree[i])
    }
    if (tree[i].type === 2) {
      delete tree[i]
    }
  }
  return tree
}

export const flattenArray = (arr) => {
  let newArr = []
  const fn = (arr) => {
    arr.map(item => {
      if (item.nodes) {
        fn(item.nodes)
      }
      delete item.nodes
      newArr = [...newArr, item]
      return null
    })
    return newArr
  }
  fn(arr)
  return newArr
}

// 树状图数组的去父级id
export const uniqueTree = (uniqueArr, Arr) => {
  const uniqueChild = []
  for (var i in Arr) {
    for (var k in uniqueArr) {
      if (uniqueArr[k] === Arr[i]) {
        uniqueChild.push(uniqueArr[k])
      }
    }
  }
  return uniqueChild
}

// 二维数组的扁平化处理
export const mapRows = (params) => {
  var res = []
  for (var i = 0; i < params.length; i++) {
    if (Array.isArray(params[i])) {
      res = res.concat(mapRows(params[i]))
    } else {
      res.push(params[i])
    }
  }
  return res.filter(Boolean) // 去掉undefined的情况
}
// 判断数组中的每一项是否值相等
export const isAllEqual = (array) => {
  if (array.length > 0) {
    return !array.some(function(value) {
      return value.params !== array[0].params
    })
  } else {
    return true
  }
}

// function find(str,cha,num){
//   var x=str.indexOf(cha)
//   for(var i=0;i<num;i++){
//       x=str.indexOf(cha,x+1)
//   }
//   return x
// }

export const intersect = function() {
  const result = []
  const obj = {}
  for (let i = 0; i < arguments.length; i++) {
    for (let j = 0; j < arguments[i].length; j++) {
      const str = arguments[i][j]
      if (!obj[str]) {
        obj[str] = 1
      } else {
        obj[str]++
        if (obj[str] === arguments.length) {
          result.push(str)
        }
      }
    }
  }
  return result
}
