/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime : 2020-02-14 13:25:17
 * @LastEditors  : Please set LastEditors
 */
import React from 'react'
import './index.less'
import BaseForm from '../../../components/Form'
import { formListOne, config, AddProductconfig, formListTwo, addProductList } from './formList'
import { post_baseProducts_add, get_baseProducts_list, get_avaliableparts_list, post_deleteProducts_list, get_hasProducrtName, post_checkProduct_add, post_verBeforeProcessing, get_options } from './../../../services/api'
import ProductsTable from './productsTable'
import PartsTable from './partsTable'
import moment from 'moment'
import { unique, mapRows, setCreditDate } from '../../../utils/utils'
import { Form, Card, Tabs, Tag, Button, Modal, message, Checkbox, Icon } from 'antd'
import { wrapAuth } from '../../../components/AuthButton'
const AuthButton = wrapAuth(Button)
const TabPane = Tabs.TabPane
const confirm = Modal.confirm

// 搜索一级分类、二级分类的方法
class productConfiguration extends React.Component {
  state = {
    tabkey: '1', // 默认的tabkey
    data: [], // 存放搜索数据
    value: undefined, // 一级二级的输入value
    selectedProductRowKeys: [], // 选中的产品keys
    selectedProductRows: [], // 选中的产品rows
    totalData: {}, // 产品所有的data
    tableData: [], // 产品table所有的data
    selectedProductIds: [], // 选中的产品ids
    selectedPartRowKeys: [], // 选中的零件keys
    selectedPartRows: [], // 选中的零件rows
    parttotalData: {}, // 零件的totaldata
    parttableData: [], // 零件的tabledata
    saveProduct: [], // 产品留存项
    savePart: [], // 零件留存项
    doubleProductArr: [], // 存放产品的双数组
    doublePartArr: [], // 存放零件的双数组
    visible: false,
    ifProductChecked: false, // 点击留存的时候变为true
    ifPartChecked: false,
    turnRed: false, // 点击加工的时候未生效的产品标红
    ifRepeatedData: [], // 递归检查的时候后台返回的数据
    addProcess: false, // 点击加工的时候的标识变量
    alertFormList: [], // 最新搜索框内容
    addFormList: [] // 最新加工搜索框内容
  }
  params = {
    page: 1,
    whetherToDisplayInvalidData: 0 // 显示失效
  }
  addParams = {
    // componentIds: [],           //零件Id数组
    // componentNames: [],         //零件名称数组
    // componentNos: [],           //零件编号数组
    // productIds: [],             //产品id数组
    // productNames: [],           //产品名称数组
    // productNos: [],             //产品编码数组
  }

  componentDidMount() {
    // 请求产品的list
    this.requestProductList()
    const part = localStorage.getItem('productConfiguration-part') ? JSON.parse(localStorage.getItem('productConfiguration-part')) : []
    const product = localStorage.getItem('productConfiguration-product') ? JSON.parse(localStorage.getItem('productConfiguration-product')) : []
    const partkeys = part && part.map(item => {
      return item.componentId
    })
    const productkeys = product && product.map(item => {
      return item.productId
    })
    this.setState({
      savePart: part,
      saveProduct: product,
      selectedPartRowKeys: partkeys,
      selectedProductRowKeys: productkeys
    })
    // 信用主体类型
    const getRules = (val, datas, formVal, type) => {
      return formVal.map((item, index) => {
        if (item.field === val) {
          if (type === '1') {
            item.rules = [
              { id: -1, rule: '全部' },
              ...datas
            ]
          } else {
            item.rules = [
              ...datas
            ]
          }
        }
        return {
          ...item
        }
      })
    }
    // 信用主体类型
    const params = {
      businessIdent: 'all',
      field: 'credit_type'
    }
    get_options(params).then(res => {
      const datas = setCreditDate(res)
      const formList1 = getRules('creditType', datas, formListOne, '1')
      const formList2 = getRules('creditType', datas, addProductList, '2')
      this.setState({
        alertFormList: formList1,
        addFormList: formList2
      })
    })
  }
  // tab改变的时候
  tabChange = (key) => {
    this.setState({
      tabkey: key
    })
    if (key === '1') {
      this.requestProductList() // 请求产品接口
    } else {
      this.requestPartsList() // 请求零件接口
    }
  }
  // 产品请求
  requestProductList = (params) => {
    this.params.page = params
    get_baseProducts_list({ ...this.params })
      .then((res) => {
        const data = res.data
        const tableData = data.responseData.records.map((item, index) => {
          item.key = index
          return item
        })
        this.setState({
          tableData,
          totalData: data.responseData
          // tabkey: "1"
        })
      })
  }
  // 零件list的接口
  requestPartsList = (params) => {
    if (typeof (params) !== 'object') {
      this.params.page = params
    } else {
      this.params = params
      this.params.page = 1
    }
    get_avaliableparts_list({ ...this.params, effectState: 1 })
      .then((res) => {
        const data = res.data
        const parttableData = data.responseData.records.map((item, index) => {
          item.key = index
          return item
        })
        this.setState({
          parttableData,
          parttotalData: data.responseData
        })
      })
  }
  // 产品查询的参数
  handleProductFilterSubmit = (filterParams) => {
    for (const x in filterParams) {
      if (filterParams[x] === -1) {
        filterParams[x] = ''
      }
    }
    filterParams.productName = filterParams.productName.replace(/\s*/g, '')
    filterParams.remark = filterParams.remark.replace(/\s*/g, '')
    this.params = filterParams
    this.requestProductList()
  };
  // 重置产品参数
  resetProductFields = () => {
    this.params = {}
    this.requestProductList()
  }

  // 获取到产品子组件传过来的list中相关参数
  getProductListParams = (selectedProductRowKeys, selectedProductRows, selectedProductIds) => {
    const { doubleProductArr, saveProduct } = this.state
    const { page } = this.params
    // 组合成双数组
    doubleProductArr[page ? page - 1 : 0] = selectedProductRows
    // 扁平化处理的产品一维数组
    const product = mapRows(doubleProductArr)
    // 利用上一次留存项目和现有的选择row拼接+去重
    const concatProductItems = [...saveProduct, ...product]
    const uniqueProductItems = unique(concatProductItems, 'productId') // 去重过后的part
    // 取消勾选之后对应的留存零件也相应的取消
    const filterProductItem = selectedProductRowKeys.map(item => {
      // 根据selectedServeRowKey去判断留存数组中剩下来的item
      return (
        uniqueProductItems.filter(key => {
          return key.productId === item
        })
      )
    })
    this.setState({
      selectedProductRowKeys,
      selectedProductRows,
      selectedProductIds,
      saveProduct: mapRows(filterProductItem)
    })
    localStorage.setItem('productConfiguration-product', JSON.stringify(mapRows(filterProductItem))) // 存储产品
  }

  // 零件查询的参数
  handlePartFilterSubmit = (filterParams) => {
    filterParams.componentName = filterParams.componentName.replace(/\s*/g, '')
    filterParams.purpose = filterParams.purpose.replace(/\s*/g, '')
    this.params = filterParams
    this.requestPartsList()
  };
  // 重置零件参数
  resetPartFields = () => {
    this.params = {}
    this.requestPartsList()
  }

  // 获取到零件子组件传过来的list中相关参数
  getPartListParams = (selectedPartRowKeys, selectedPartRows) => {
    const { doublePartArr, savePart } = this.state// 定义的零件双数组
    const { page } = this.params
    // 组合成双数组
    doublePartArr[page ? page - 1 : 0] = selectedPartRows
    // 扁平化处理的零件的一维数组
    const part = mapRows(doublePartArr)
    // 利用上一次留存项目和现有的选择row拼接+去重
    const concatPartItems = [...savePart, ...part]
    const uniquePartItems = unique(concatPartItems, 'componentId') // 去重过后的part
    // 取消勾选之后对应的留存零件也相应的取消
    const filterPartItem = selectedPartRowKeys.map(item => {
      // 根据selectedServeRowKey去判断留存数组中剩下来的item
      return (
        uniquePartItems.filter(key => {
          return key.componentId === item
        })
      )
    })

    this.setState({
      selectedPartRowKeys,
      selectedPartRows,
      savePart: mapRows(filterPartItem)
    })
    localStorage.setItem('productConfiguration-part', JSON.stringify(mapRows(filterPartItem))) // 存储零件
  }

  // 加入标签项
  renderTag = () => (
    <div>
      <div>
        {this.state.saveProduct && this.state.saveProduct.map(item => {
          return (
            <Tag
              key={ item.productId }
              color={ (item.effectState !== 1 && this.state.turnRed) || (this.state.ifRepeatedData.length > 0 && item.ifRepeated) ? 'red' : 'green' }
              closable
              onClose={ () => this.handleClose(item.productId, 'productId') }
            >
              {item.productName}
            </Tag>
          )
        })}
      </div>
      <div style={{ marginTop: '10px' }}>
        { this.state.savePart && this.state.savePart.map((item, index) => {
          return (
            <Tag
              key={ item.componentId }
              color='blue'
              closable
              onClose={ () => this.handleClose(item.componentId, 'componentId') }
            >{item.componentName}</Tag>
          )
        })}
      </div>
    </div>
  )
  // 删除tag组件
  handleClose = (removedTag, val) => {
    let { selectedProductRowKeys, selectedPartRowKeys, saveProduct, savePart } = this.state
    const { addProcess } = this.state
    if (val === 'productId') {
      saveProduct = saveProduct.filter(item => item[val] !== removedTag)
      selectedProductRowKeys = selectedProductRowKeys.filter(item => item !== removedTag)
      // 选中要加工的产品--点击加工--点击删除tags的时候才会请求接口
      addProcess ? post_checkProduct_add({ productIds: selectedProductRowKeys })
        .then(res => {
          this.checkRepeat(res, 'del')
        }) : null
      localStorage.setItem('productConfiguration-product', JSON.stringify(mapRows(saveProduct)))
    } else {
      savePart = savePart.filter(item => item[val] !== removedTag)
      selectedPartRowKeys = selectedPartRowKeys.filter(item => item !== removedTag)
      localStorage.setItem('productConfiguration-part', JSON.stringify(mapRows(savePart)))
    }
    this.setState({
      saveProduct: saveProduct,
      savePart: savePart,
      selectedProductRowKeys: selectedProductRowKeys,
      selectedPartRowKeys: selectedPartRowKeys
    })
  };
  saveRelated = {
    // 清空留存缓存
    resetSavedItem: () => {
      this.setState({
        saveProduct: [],
        savePart: [],
        selectedProductRows: [],
        selectedPartRows: [],
        selectedPartRowKeys: [],
        selectedProductRowKeys: []
      })
      localStorage.setItem('productConfiguration-product', [])
      localStorage.setItem('productConfiguration-part', [])
    }
  }
  // 删除产品，只能删除产品，不能删除零件
  deleteProductList = (idParams) => {
    let flag = true
    const { saveProduct, selectedProductRowKeys } = this.state
    let id
    if (saveProduct && saveProduct.length === 0 && !idParams) {
      flag = false
      message.error('请至少选择一个产品进行删除')
    }
    if (idParams) {
      id = idParams
    } else {
      id = selectedProductRowKeys
    }
    if (flag) {
      confirm({
        title: '确定要删除吗？',
        onOk: () => {
          post_deleteProducts_list(id)
            .then(res => {
              // 先过滤删除项目之后在和留存项目进行匹配
              const filteredSelectedRowKeys = selectedProductRowKeys.filter(item => !id.includes(item))
              const filterProductDeleteItem = filteredSelectedRowKeys.map(item => {
                return (
                  saveProduct.filter(key => {
                    return key.productId === item
                  })
                )
              })
              this.requestProductList()
              Modal.success({
                title: '产品删除成功'
              })
              // 产品删除成功的时候缓存的留存项目需要刷新
              this.setState({
                saveProduct: mapRows(filterProductDeleteItem)
              })
              localStorage.setItem('productConfiguration-product', JSON.stringify(mapRows(filterProductDeleteItem)))
            })
        },
        onCancel() {
          // console.log('Cancel')
        }
      })
    }
  }
  // 加工 点击加工的时候要只保留已生效产品和零件
  addProcess = async() => {
    const { saveProduct, selectedProductRowKeys, savePart } = this.state
    // 所有产品已生效的情况下进行重复递归校验--零件的话无需请求接口
    if (saveProduct.length > 0) {
      const data = await post_verBeforeProcessing(selectedProductRowKeys)
      const newSaveProduct = data.data.responseData
      this.setState({
        saveProduct: newSaveProduct
      })
      const state = newSaveProduct.every(item => item.effectState === 1)
      if (!state) {
        message.error('请选择已生效的产品进行加工')
        this.setState({
          turnRed: true
        })
      } else {
        post_checkProduct_add({ productIds: selectedProductRowKeys })
          .then(res => {
            this.checkRepeat(res)
          })
      }
    } else {
      // 只含有零件
      this.departSaveList(savePart)
      this.setState({
        visible: true
      })
    }
    // }
    // 点击加工的时候需要有一个可控的变量,通过这个变量去控制删除，点击加工之后在点击删除才请求递归筛选接口
    this.setState({
      addProcess: true
    })
  }
  // 点击加工的时候判断是否有重复的项
  checkRepeat = (res, type) => {
    const { saveProduct, savePart, addProcess } = this.state
    const response = res.data.responseData
    // 将后台返回的值存起来
    if (response.length === 0) {
      this.setState({
        ifRepeatedData: response
      })
      // 删除也要走这个方法，如果不控制的话，会删一次就打开一次弹窗操作
      if (addProcess && type !== 'del') {
        this.setState({
          visible: true
        })
      }
      // 已经生效的产品+已经生效的零件的拼接
      const concatProductAndPart = saveProduct.concat(savePart)
      // 点击加工的时候调用拼接参数数组的方法
      this.departSaveList(concatProductAndPart)
    } else {
      message.error('所选产品中包含重复产品')
      // 将重复的产品标红--根据后台返回的response和选中的ID匹配
      saveProduct.forEach(item1 => {
        response.forEach(item2 => {
          if (item1.productId === item2.productId) {
            item1.ifRepeated = true
          }
        })
        this.setState({
          ifRepeatedData: response,
          saveProduct
        })
      })
    }
  }
  // 将拼接好的数组拆分成多个参数
  departSaveList = (param) => {
    if (param) {
      this.addParams.componentIds = []
      this.addParams.componentNames = []
      this.addParams.componentNos = []
      this.addParams.productIds = []
      this.addParams.productNames = []
      this.addParams.productNos = []
      param.map(item => {
        // 参数： productId  productName productNo componentId componentNo componentName
        item.componentId && this.addParams.componentIds.push(item.componentId)
        item.componentName && this.addParams.componentNames.push(item.componentName)
        item.componentNo && this.addParams.componentNos.push(item.componentNo)
        item.productId && this.addParams.productIds.push(item.productId)
        item.productName && this.addParams.productNames.push(item.productName)
        item.productNo && this.addParams.productNos.push(item.productNo)
        return this.addParams
      })
    }
  }
  // 点击加工--弹窗OK的时候请求接口
  addProduct = (values) => {
    post_baseProducts_add({ ...this.addParams, ...values })
      .then(res => {
        if (res.data.responseCode === 0) {
          // 关闭的时候请求接口，同时清空留存的值,也清空勾选的值
          this.setState({
            visible: false
          })
          Modal.success({
            title: '产品创建成功',
            onOk: () => {
              window.location.reload()
            }
          })
        }
      })
  }
  // 保存时候如果有产品的情况下，需要先进行一下递归校验，如果校验成功之后才能请求保存的接口
  handleOk = () => {
    // const { selectedProductRowKeys, saveProduct } = this.state
    this.save.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.effectDate) {
          // 将moment的格式转成正常的格式
          values.effectDate = moment(values.effectDate).format('YYYY-MM-DD')
        }
        this.addProduct(values) // 请求是否含有名称成功后请求添加产品接口
      }
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  // 显示失效产品
  productcheckboxChange = (e) => {
    if (e.target.checked) {
      this.params.whetherToDisplayInvalidData = 1 // 显示失效产品
      this.requestProductList()
    } else {
      this.params.whetherToDisplayInvalidData = 0 // 不显示失效产品
      this.requestProductList()
    }
  }
  validator = (rule, value, callback) => {
    get_hasProducrtName({ productName: value })
      .then(res => {
        if (!res.data.responseData) {
          callback()
        } else {
          callback('名称已存在')
        }
      }
      )
  }

  render() {
    const { tabkey, saveProduct, savePart, alertFormList, addFormList } = this.state
    return (
      <div className='content'>
        <Card bordered={ false } className='searchCard'>
          {/* 筛选条件的选择框 */}
          <BaseForm
            formList={ tabkey === '2' ? formListTwo : alertFormList }
            config={ config }
            filterSubmit={ tabkey === '1' ? this.handleProductFilterSubmit : this.handlePartFilterSubmit }
            resetFields={ tabkey === '1' ? this.resetProductFields : this.resetPartFields }
          />
        </Card>
        {saveProduct.length === 0 && savePart.length === 0
          ? null : <Card bordered={ false } className='wrap'>
            <div style={{ float: 'right' }}>
              <AuthButton type='primary' icon='plus' onClick={ this.addProcess } menu_id={ 26 }>加工</AuthButton>
              <AuthButton onClick={ this.saveRelated.resetSavedItem } menu_id={ 27 }>清空留存</AuthButton>
            </div>
            {this.renderTag()}
          </Card>
        }
        <Card bordered={ false } style={{ marginTop: '20px' }}>
          <div className='table_header'>
            <div>
              {
                tabkey === '1' // 只有在产品列表才有删除按钮
                  ? <AuthButton onClick={ () => this.deleteProductList() } menu_id={ 29 }><Icon type='delete' />删除</AuthButton> : null
              }
            </div>
            <div>
              <Checkbox onChange={ this.productcheckboxChange }>显示失效产品</Checkbox>
            </div>
          </div>
          <Tabs defaultActiveKey='1' onChange={ this.tabChange }>
            <TabPane tab='产品' key='1'>
              <ProductsTable
                getProductList={ this.getProductListParams }
                pageType='index'
                totalData={ this.state.totalData }
                tableData={ this.state.tableData }
                request={ this.requestProductList }
                ifProductChecked={ this.state.ifProductChecked }
                selectedProductRowKeys={ this.state.selectedProductRowKeys }
                deleteProductList={ this.deleteProductList }
              />
            </TabPane>
            <TabPane tab='零件' key='2'>
              <PartsTable
                getPartList={ this.getPartListParams }
                request={ this.requestPartsList }
                totalData={ this.state.parttotalData }
                tableData={ this.state.parttableData }
                ifPartChecked={ this.state.ifPartChecked }
                selectedPartRowKeys={ this.state.selectedPartRowKeys }
              />
            </TabPane>
          </Tabs>
        </Card>
        {/* 加工新增产品模块 */}
        <Modal
          // width={640}
          className='addProduct'
          title={ '新增产品' }
          destroyOnClose={ true }
          maskClosable
          visible={ this.state.visible }
          onOk={ this.handleOk }
          okText='提交'
          onCancel={ this.handleCancel }
        >
          <div>
            <BaseForm
              wrappedComponentRef={ ref => { this.save = ref } }
              formList={ addFormList }
              config={ AddProductconfig }
              validator={ this.validator }
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default Form.create({})(productConfiguration)
