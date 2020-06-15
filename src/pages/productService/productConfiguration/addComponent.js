import React from 'react'
import './index.less'
import BaseForm from '../../../components/Form'
import { formListOne, config, formListTwo } from './formList'
import { unique, mapRows, setCreditDate } from '../../../utils/utils'
import { get_baseProducts_list, get_avaliableparts_list, post_checkProduct_update, post_checkProduct_copy, get_options } from './../../../services/api'
import ProductsTable from './productsTable'
import PartsTable from './partsTable'
import { Form, Tabs, Card, Tag, message, Button } from 'antd'
const TabPane = Tabs.TabPane

class AddComponent extends React.Component {
  state = {
    tabkey: '1', // 默认的tabkey
    data: [], // 存放搜索数据
    value: undefined, // 一级二级的输入value
    selectedProductRowKeys: [], // 选中的产品keys
    selectedProductRows: [], // 选中的产品rows
    selectedProductIds: [], // 选中的产品ids
    selectedPartRowKeys: [], // 选中的零件keys
    selectedPartRows: [], // 选中的零件rows
    selectedPartIds: [], // 选中的零件IDs
    saveList: [], // 留存的list
    totalData: {}, // 产品所有的data
    tableData: [], // 产品table所有的data
    parttotalData: {}, // 零件的totaldata
    parttableData: [], // 零件的tabledata
    requestModal: false, // 打开弹窗请求已生效产品接口参数记号
    doubleProductArr: [], // 存入的产品双数组
    doublePartArr: [], // 存入的零件双数组
    saveProduct: [], // 留存的产品项
    savePart: [], // 留存的零件项
    ifModalOk: false, // 弹框是否点击OK
    productCopy: false,
    productEdit: false,
    ifRepeatedData: [], // 递归检查的时候后台返回的数据
    alertFormList: []
  };
  params = {
    page: 1
  };
  // 提前获取到是复制页面还是修改页面
  componentWillMount() {
    const productCopy = window.location.href.includes('productCopy')
    const productEdit = window.location.href.includes('productEdit')
    if (productCopy) {
      this.setState({
        productCopy
      })
    } else if (productEdit) {
      this.setState({
        productEdit
      })
    }
  }
  // 刚打开弹窗的时候
  componentDidMount() {
    this.props.onRef(this) // 将父组件的this同步到子组件中
    const { editProducts, editComponents } = this.props
    this.requestProductList()
    this.requestPartsList()
    this.showCreditType()
    // 刚打开弹窗的时候初始化留存数据
    if (this.state.saveProduct !== editProducts) {
      const productkeys = editProducts && editProducts.map(item => {
        return item.productId
      })
      this.setState({
        saveProduct: editProducts,
        selectedProductRowKeys: productkeys
      })
    }
    if (this.state.savePart !== editComponents) {
      const partkeys = editComponents && editComponents.map(item => {
        return item.componentId
      })
      this.setState({
        savePart: editComponents,
        selectedPartRowKeys: partkeys
      })
    }
  }
  // 信用主体类型
  showCreditType = () => {
    const getRules = (val, datas, formVal) => {
      return formVal.map((item, index) => {
        if (item.field === val) {
          item.rules = [
            { id: -1, rule: '全部' },
            ...datas
          ]
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
      const formList1 = getRules('creditType', datas, formListOne)
      this.setState({
        alertFormList: formList1
      })
    })
  }
  // 弹窗中的state改变的时候会进来---即勾选产品/零件的时候会进来这个方法中
  componentWillUpdate(props, curState) {
    const { saveProduct, savePart } = this.state
    if (saveProduct !== curState.saveProduct) {
      this.setState({ saveProduct: curState.saveProduct })
    }
    if (savePart !== curState.savePart) {
      this.setState({ savePart: curState.savePart })
    }
  }
  // props改变的时候会进来这个方法  -- 即在复制/修改页面中删除了组件中打开弹窗会同步更新
  componentWillReceiveProps(props) {
    const { editProducts, editComponents } = props
    const { savePart, saveProduct } = this.state
    // 父组件的props发生改变的时候才会走进来这个方法中
    if (saveProduct !== editProducts) {
      const productkeys = editProducts && editProducts.map(item => {
        return item.productId
      })
      this.setState({
        saveProduct: editProducts,
        selectedProductRowKeys: productkeys
      })
    }
    if (savePart !== editComponents) {
      const partkeys = editComponents && editComponents.map(item => {
        return item.componentId
      })
      this.setState({
        savePart: editComponents,
        selectedPartRowKeys: partkeys
      })
    }

  }
  // 父组件点击保存请求子组件方法（在父组件）
  checkUpdateOrCopy = () => {
    const { selectedProductRowKeys, productCopy, productEdit } = this.state
    const productId = sessionStorage.getItem('productId')
    if (productCopy) {
      post_checkProduct_copy({ productId: productId, productIds: selectedProductRowKeys })
        .then(res => {
          this.checkRepeat(res, 'add')
        })
    } else if (productEdit) {
      post_checkProduct_update({ productId: productId, productIds: selectedProductRowKeys })
        .then(res => {
          this.checkRepeat(res, 'add')
        })
    }
  }
  // 递归校验
  checkRepeat = (res, type) => {
    const { saveProduct, savePart } = this.state
    const { closeModal, getProductModalParams, getPartModalParams } = this.props
    const response = res.data.responseData
    if (response.length === 0) {
      if (type === 'add') { // 只有在新增点击保存的时候才会传给父组件留存项目，删除tag的时候不需要传给父组件
        getProductModalParams(saveProduct) // 传给父组件的留存的产品项目
        getPartModalParams(savePart) // 传给父组件的留存的零件项目
        closeModal() // 关闭弹窗
      }
      this.setState({
        ifRepeatedData: response
      })
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
          ifRepeatedData: response
        })
      })
    }
  }
  // tab改变的时候
  tabChange = key => {
    this.setState({
      tabkey: key
    })
    if (key === '1') {
      this.requestProductList() // 请求产品接口
    } else {
      this.requestPartsList() // 请求零件接口
    }
  };
  // 请求查看产品list接口
  requestProductList = params => {
    this.params.page = params
    get_baseProducts_list({ ...this.params, effectState: 1 }).then(res => {
      const data = res.data
      const tableData = data.responseData.records.map((item, index) => {
        item.key = index
        return item
      })
      this.setState({
        tableData,
        totalData: data.responseData
      })
    })
  };
  // 请求零件list接口
  requestPartsList = params => {
    if (typeof params !== 'object') {
      this.params.page = params
    } else {
      this.params = params
      this.params.page = 1
    }
    get_avaliableparts_list({ ...this.params, effectState: 1 }).then(res => {
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
  };
  // 获取到产品子组件传过来的list
  getProductList = (selectedProductRowKeys, selectedProductRows) => {
    const { doubleProductArr, saveProduct } = this.state
    // console.log(selectedProductRows, 'saveProduct')
    const { page } = this.params
    // 组合成双数组
    doubleProductArr[page ? page - 1 : 0] = selectedProductRows
    // 扁平化处理的产品一维数组
    const product = mapRows(doubleProductArr)
    // 利用上一次留存项目和现有的选择row拼接+去重
    const concatProductItems = [...saveProduct, ...product]
    const uniqueProductItems = unique(concatProductItems, 'productId') // 去重过后的product
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
      saveProduct: mapRows(filterProductItem)
    })
  };
  // 获取到零件子组件传过来的list
  getPartList = (selectedPartRowKeys, selectedPartRows) => {
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
  };

  // 产品查询的参数
  handleProductFilterSubmit = filterParams => {
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
  };
  // 零件查询的参数
  handlePartFilterSubmit = filterParams => {
    filterParams.componentName = filterParams.componentName.replace(/\s*/g, '')
    filterParams.purpose = filterParams.purpose.replace(/\s*/g, '')
    this.params = filterParams
    this.requestPartsList()
  };
  // 重置零件参数
  resetPartFields = () => {
    this.params = {}
    this.requestPartsList()
  };
  // 删除tag组件
  handleClose = (removedTag, val) => {
    let { selectedProductRowKeys, selectedPartRowKeys } = this.state
    let { saveProduct, savePart } = this.state
    const { productEdit, productCopy } = this.state
    if (val === 'productId') {
      saveProduct = saveProduct.filter(item => item[val] !== removedTag)
      selectedProductRowKeys = selectedProductRowKeys.filter(item => item !== removedTag)
      // 删除的时候同时请求递归检验的接口
      const productId = sessionStorage.getItem('productId')
      if (productCopy) {
        post_checkProduct_copy({ productId: productId, productIds: selectedProductRowKeys })
          .then(res => {
            this.checkRepeat(res, 'delete')
          })
      } else if (productEdit) {
        post_checkProduct_update({ productId: productId, productIds: selectedProductRowKeys })
          .then(res => {
            this.checkRepeat(res, 'delete')
          })
      }
    } else {
      savePart = savePart.filter(item => item[val] !== removedTag)
      selectedPartRowKeys = selectedPartRowKeys.filter(item => item !== removedTag)
    }
    this.setState({
      saveProduct: saveProduct,
      savePart: savePart,
      selectedProductRowKeys: selectedProductRowKeys,
      selectedPartRowKeys: selectedPartRowKeys
    })
  };
  // 清空留存
  resetSavedItem =() => {
    this.setState({
      saveProduct: [],
      savePart: [],
      selectedProductRows: [],
      selectedPartRows: [],
      selectedPartRowKeys: [],
      selectedProductRowKeys: []
    })
    this.props.getProductModalParams([])
    this.props.getPartModalParams([])
  }
  // 加入标签项
  renderTag = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
      <Button onClick={ this.resetSavedItem }>清空留存</Button>
    </div>
  )
  render() {
    const { saveProduct, savePart, alertFormList } = this.state
    const tabkey = this.state.tabkey
    return (
      <div>
        <BaseForm
          formList={ tabkey === '1' ? alertFormList : formListTwo }
          config={ config }
          filterSubmit={
            tabkey === '1'
              ? this.handleProductFilterSubmit
              : this.handlePartFilterSubmit
          }
          resetFields={
            tabkey === '1' ? this.resetProductFields : this.resetPartFields
          }
        />
        {saveProduct.length === 0 && savePart.length === 0
          ? null : <Card className='wrap'>
            {this.renderTag()}
          </Card>
        }
        <Tabs defaultActiveKey='1' onChange={ this.tabChange }>
          <TabPane tab='产品' key='1'>
            <ProductsTable
              getProductList={ this.getProductList }
              pageType='add' // 区分是新增组件还是产品配置
              totalData={ this.state.totalData }
              tableData={ this.state.tableData }
              request={ this.requestProductList }
              selectedProductRowKeys={ this.state.selectedProductRowKeys }
            />
          </TabPane>
          <TabPane tab='零件' key='2'>
            <PartsTable
              getPartList={ this.getPartList }
              request={ this.requestPartsList }
              totalData={ this.state.parttotalData }
              tableData={ this.state.parttableData }
              selectedPartRowKeys={ this.state.selectedPartRowKeys }
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default Form.create({})(AddComponent)
