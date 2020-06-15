/*
 * @Author: your name
 * @Date: 2019-11-04 14:10:10
 * @LastEditTime: 2020-03-12 09:10:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/productService/partsProcess/index.js
 */
import React, { useState, useEffect, useCallback } from 'react'
import './index.less'
import { Card, Tabs, Button, Select } from 'antd'
import SaveList from './saveList'
import SaveListModal from './saveList/saveModal.js'
import Loadable from 'react-loadable'
import { MyLoadingComponent } from '../../../utils/utils'
const TabPane = Tabs.TabPane
const Option = Select.Option

const CalculateBox = Loadable({
  loader: () => import('./calculate'),
  loading: MyLoadingComponent
})

const Condition = Loadable({
  loader: () => import('./condition'),
  loading: MyLoadingComponent
})

function PartsProcess(props) {
  // 留存项分两种情况 新增一个对象partKeepList 存缓存 复制修改状态一个对象partKeepListEdit 存缓存
  // 以下的G页面代表计算框或者条件判读页面
  // 零件加工新增的时候 会把留存项带入 展示在G页面
  // 零件加工新增的时候会把存在sessionStorage的editType字段清空    ''：新增    1：复制    2：修改
  // 零件复制修改的时候  G页面的留存项的会被代替 数据来自后端接口  includeComponents字段  这字段储存这加工页面所使用到的零件对象
  // 零件复制修改的时候  editType由router传参数  sessionStorage再储存 进页面后判断router是否能读取到editType  读不到就取sessionStorage的editType   1：复制    2：修改
  // 零件复制修改的时候  在零件列表页面被选中的那条中拿componentContentType  存sessionStorage 进G页面后  读取sessionStorage里的componentContentType 0 跳转到计算框  1 跳转到条件判断

  const [activeKey, setActiveKey] = useState('1')
  const [partsList, setPartsList] = useState([])
  const [editType, setEditType] = useState(null)
  const [visible, setVisible] = useState(false)
  const componentId = props.match.params.id // 当前复制或修改的id
  const { params } = props.location
  const componentContentType = sessionStorage.getItem('componentContentType') // 0 跳转到计算框  1 跳转到条件判断
  const [componentFieldType, setComponentFieldType] = useState('20') // 数据类型
  const [selectFlag, setSelectFlag] = useState(false)
  const type = sessionStorage.getItem('editType')

  useEffect(() => {
    // 进页面的状态  editType  1 复制 2 修改 零件列表跳入 router带的参数
    if (params !== undefined) {
      setEditType(params.type)
      sessionStorage.setItem('editType', params.type)
    } else {
      setEditType(type)
    }
    // 复制 修改进入的时候 留存项由接口里读取
    if (type === '1' || type === '2') {
      setActiveKey(`${ parseInt(componentContentType) + 1 }`)
    } else {
      // 新增进入 取缓存的留存项
      const partsList = JSON.parse(localStorage.getItem('processKeepList'))
      // console.log('localStorage', partsList)
      setPartsList(partsList)
    }
  }, [params, componentContentType, type])

  useEffect(() => {
    if (type === '1' || type === '2') {
      setSelectFlag(true)
    }
  }, [partsList, type])

  const callback = (key) => {
    setActiveKey(key)
  }

  const openModal = () => {
    setVisible(true)
  }

  const close = (partsList, isOpen) => {
    if (partsList instanceof Array) {
      setPartsList(partsList)
    }
    if (isOpen !== 'open') {
      setVisible(false)
    }
  }

  const changeKeepList = useCallback((partsList) => {
    setPartsList(partsList)
  }, [])

  const componentFieldTypeChange = useCallback((value) => {
    setComponentFieldType(value)
  }, [])

  const getcomponentFieldType = useCallback((value) => {
    setComponentFieldType(value)
  }, [])

  return (
    <div className='partsProcessContent'>
      <Card bordered={ false } style={{ marginBottom: 20 }}>
        <div className='keepList'>
          <div>
            <span>数据类型：</span>
            <Select value={ componentFieldType } style={{ width: 90 }} onChange={ componentFieldTypeChange } disabled={ selectFlag }>
              <Option key='20' value='20'>整型</Option>
              <Option key='21' value='21'>浮点</Option>
              <Option key='22' value='22'>字符串</Option>
              <Option key='23' value='23'>日期</Option>
              <Option key='24' value='24'>时间</Option>
            </Select>
          </div>
          <Button type='primary' icon='plus' onClick={ openModal } style={{ marginLeft: '32px' }}>新增</Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <SaveList partsList={ partsList } editType={ editType } changeKeepList={ changeKeepList } />
        </div>
      </Card>
      <Card bordered={ false }>
        <Tabs activeKey={ activeKey } onChange={ callback }>
          {
            (componentContentType === '0' || !componentId) && <TabPane tab='计算框' key='1' >
              <CalculateBox partsList={ partsList } editType={ editType } changeKeepList={ changeKeepList } componentFieldType={ componentFieldType } getcomponentFieldType={ getcomponentFieldType } />
            </TabPane>
          }
          {
            (componentContentType === '1' || !componentId) && <TabPane tab='添加判断' key='2' >
              <Condition partsList={ partsList } editType={ editType } changeKeepList={ changeKeepList } componentFieldType={ componentFieldType } getcomponentFieldType={ getcomponentFieldType } />
            </TabPane>
          }
        </Tabs>
      </Card>
      <SaveListModal partsList={ partsList } editType={ editType } visible={ visible } close={ close } ></SaveListModal>
    </div>
  )
}

export default PartsProcess
