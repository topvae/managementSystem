import React from 'react'
import './index.less'
import { Card, Tabs, Modal, Button, Form, message } from 'antd'
import AddComponent from './addComponent'
import {
  get_Product_info,
  // post_Product_edit,
  // post_Product_copy,
  get_options
} from './../../../services/api'
import BaseForm from '../../../components/Form'
import BaseTable from './../../../components/Table/BaseTable'
import { setCreditDate } from '../../../utils/utils'
import moment from 'moment'
import axios from 'axios'
// import { addProductList } from './formList'
import { withRouter } from 'react-router-dom'
// import { unique } from './../../../utils/utils'
import { AddProductconfig } from './formList'
const { TabPane } = Tabs

class ProductEdit extends React.Component {
  state = {
    visible: false,
    productId: sessionStorage.getItem('productId'), // 产品ID
    productNo: sessionStorage.getItem('productNo'), // 产品编号
    productInfo: {}, // 产品详情的信息
    topProductInfo: {}, // 传给baseform的详情信息
    selectedProductRows: [], // modal弹窗选中的产品rows
    selectedPartRows: [], // modal弹窗选中的零件rows
    concatProducts: [], // 编辑页面+modal选中的item拼接好的产品数组
    concatComponents: [], // 编辑页面+modal选中的item拼接好的零件数组
    tabKey: 1, // 默认的tabkey
    selectedPresentProductRowKeys: [], // 编辑页面选中的产品keys
    selectedPresentProductRows: [], // 编辑页面选中的产品Rows
    selectedPresentPartRowKeys: [], // 编辑页面选中的零件keys
    selectedPresentPartRows: [], // 编辑页面选中的零件Rows
    // MaxData: '', // 复制页面的最大时间
    ifModalOk: false, // 是否点击弹窗的OK
    checkedPass: false, // 点击保存判断核验是否通过
    ifPropsDeleteChanged: false,
    addProductList: [],
    rules: []
  }
  params = {
    productId: sessionStorage.getItem('productId'), // 产品ID
    componentIds: [], // 零件Id数组
    componentNames: [], // 零件名称数组
    componentNos: [], // 零件编号数组
    productIds: [], // 产品id数组
    productNames: [], // 产品名称数组
    productNos: [], // 产品编码数组
    baseFormValue: {}, // baseform中的变化的value
    productNo: sessionStorage.getItem('productNo')
  }

  componentDidMount() {
    const params = {
      businessIdent: 'all',
      field: 'credit_type'
    }
    get_options(params).then(res => {
      const rules = setCreditDate(res)
      this.setState({
        rules
      })
    })
    this.showProductDetails()
  }

  // 请求查看产品详情接口
  showProductDetails = () => {
    const configurationList = ['组合']
    get_Product_info({ id: this.state.productId }).then(res => {
      const data = res.data.responseData
      this.setState({
        productInfo: data,
        concatProducts: data.products, // 刚进页面的时候concatProducts就是products
        concatComponents: data.components, // 刚进页面的时候concatComponents就是components
        topProductInfo: {
          productName: data.productName,
          creditType: data.creditType,
          configuration: configurationList[data.configuration],
          swichCode: data.swichCode,
          effectDate: moment(data.effectDate),
          // effectDate: window.location.href.includes('productCopy') ? null : moment(data.effectDate), // 刚进页面的时候复制页面需要清空日期
          remark: data.remark
        }
      })
    })
  }
  // 在复制页面获取产品的最大生效时间
  // getCopyMaxDate = () => {
  //   if (window.location.href.includes('productCopy')) {
  //     get_copy_maxDate({ productNo: this.state.productNo }).then(res => {
  //       this.setState({
  //         MaxData: res.data.responseData
  //       })
  //     })
  //   }
  // };
  // 改变tab的时候
  tabChange = key => {
    this.setState({
      tabKey: key
    })
  };
  // 新增组件modal打开
  addComponent = () => {
    this.setState({
      visible: true,
      ifModalOk: false
      // ifPropsDeleteChanged: false
    })
  };
  // 删除零件或者产品需要判断是零件还是产品之后请求接口
  deleteComponentOrPart = () => {
    // 为了解决eslint报错 但是不想改业务代码
    let { concatProducts, concatComponents } = this.state
    const { selectedPresentProductRowKeys, selectedPresentPartRowKeys } = this.state
    if (selectedPresentProductRowKeys.length === 0 && selectedPresentPartRowKeys.length === 0) {
      message.error('请至少选择一条记录进行删除')
    }
    selectedPresentProductRowKeys.map(item1 => {
      return (concatProducts = concatProducts.filter(
        item2 => item2.productId !== item1
      ))
    })
    selectedPresentPartRowKeys.map(item1 => {
      return (concatComponents = concatComponents.filter(
        item2 => item2.componentId !== item1
      ))
    })
    this.setState({
      concatProducts,
      concatComponents,
      ifPropsDeleteChanged: true
    })
  };
  // 取消Modal的时候
  handleCancel = () => {
    this.setState({
      visible: false
    })
  };
  // 如果子组件检验通过之后才能保存
  changeModal = (params) => {
    if (params) {
      this.setState({
        visible: false
      })
    }
  }
  changeFatherIfok = () => {
    this.setState({
      ifModalOk: false
    })
  }
  changeDeleteProps = () => {
    this.setState({
      ifPropsDeleteChanged: false
    })
  }
  // 点击保存按钮的时候状态情况
  handleOk = () => {
    this.child.checkUpdateOrCopy()
  };
  // 子组件调用关闭弹窗的方法
  closeModal = () => {
    this.setState({
      visible: false
    })
  }
  // Modal点击OK的时候addComponent组件中的数据 （modal里选中的数据传给外层）
  getProductModalParams = (product) => {
    this.setState({
      concatProducts: product
    })
  }
  getPartModalParams = (part) => {
    this.setState({
      concatComponents: part
    })
  }

  // 选中编辑页面当前产品相关参数
  selectedProductItems = (selectedPresentProductRowKeys, selectedPresentProductRows) => {
    this.setState({
      selectedPresentProductRowKeys,
      selectedPresentProductRows
    })
  };
  // 选中编辑页面零件相关参数
  selectedPartItems = (selectedPresentPartRowKeys, selectedPresentPartRows) => {
    this.setState({
      selectedPresentPartRowKeys,
      selectedPresentPartRows
    })
  }
  // 请求保存的时候在请求拆分数据，同时给baseform传递信号
  saveOrCopy = () => {
    this.save.props.form.validateFields((err, values) => {
      if (!err) {
        // 这块写修改的逻辑，请求修改的接口   这块是通过baseform传给handleFilterSubmit方法参数
        this.departList(this.state.concatProducts) // 拆分产品
        this.departList(this.state.concatComponents) // 拆分组件
        values.configuration = 0 // 默认传过去是0
        // 复制或者修的时候将插件的日期格式转成字符串
        values.effectDate = moment(values.effectDate).format('YYYY-MM-DD')
        // 如果
        this.handleFilterSubmit(values)
      }
    })
  };
  // 数组去重
  unique = arr => {
    return Array.from(new Set(arr))
  }
  // 点击保存将拼接好的数组拆分成多个参数
  departList = param => {
    if (param) {
      param.map(item => {
        // 参数： productId  productName productNo componentId componentNo componentName
        item.componentId && this.params.componentIds.push(item.componentId)
        item.componentName && this.params.componentNames.push(item.componentName)
        item.componentNo && this.params.componentNos.push(item.componentNo)
        item.productId && this.params.productIds.push(item.productId)
        item.productName && this.params.productNames.push(item.productName)
        item.productNo && this.params.productNos.push(item.productNo)
        return this.params
      })
    }
  };
  // 从baseform传过来的参数  在这块拿到参数之后请求接口，需要做判断
  handleFilterSubmit = filterParams => {
    this.params.baseFormValue = filterParams
    const { concatComponents, concatProducts } = this.state
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    }
    if (window.location.href.includes('productEdit')) {
      // 请求修改接口
      if (concatComponents.length === 0 && concatProducts.length === 0) {
        message.error('产品组成不能为空')
      } else {
        axios({
          url: '/api/credit-product/product/update',
          method: 'post',
          data: { ...this.params, ...this.params.baseFormValue },
          headers: headers,
          timeout: 8000
        }).then(res => {
          this.params = {
            productId: sessionStorage.getItem('productId'), // 产品ID
            componentIds: [], // 零件Id数组
            componentNames: [], // 零件名称数组
            componentNos: [], // 零件编号数组
            productIds: [], // 产品id数组
            productNames: [], // 产品名称数组
            productNos: [], // 产品编码数组
            baseFormValue: {}, // baseform中的变化的value
            productNo: sessionStorage.getItem('productNo')
          }
          const datas = res.data
          const responseCode = datas.responseCode
          const responseMsg = datas.responseMsg
          if (responseCode === 0) {
            Modal.success({
              title: '产品修改成功'
            })
            this.props.history.push({ pathname: '/product/configuration' })
          } else {
            Modal.warning({
              title: '提示',
              content: responseMsg
            })
          }
        })
        // post_Product_edit({ ...this.params, ...this.params.baseFormValue }).then(
        //   res => {
        //     // 请求成功后跳转到上一层刷新list
        //     Modal.success({
        //       title: '产品修改成功'
        //     })
        //     this.props.history.push({ pathname: '/product/configuration' })
        //   }
        // )
      }
    } else {
      // 请求复制接口
      if (concatComponents.length === 0 && concatProducts.length === 0) {
        message.error('产品组成不能为空')
      } else {
        this.params.beCopiedId = this.params.productId
        // delete this.params.productId
        axios({
          url: '/api/credit-product/product/copy',
          method: 'post',
          data: { ...this.params, ...this.params.baseFormValue },
          headers: headers,
          timeout: 8000
        }).then(res => {
          this.params = {
            productId: sessionStorage.getItem('productId'), // 产品ID
            componentIds: [], // 零件Id数组
            componentNames: [], // 零件名称数组
            componentNos: [], // 零件编号数组
            productIds: [], // 产品id数组
            productNames: [], // 产品名称数组
            productNos: [], // 产品编码数组
            baseFormValue: {}, // baseform中的变化的value
            productNo: sessionStorage.getItem('productNo')
          }
          const datas = res.data
          const responseCode = datas.responseCode
          const responseMsg = datas.responseMsg
          if (responseCode === 0) {
            Modal.success({
              title: '产品复制成功'
            })
            this.props.history.push({ pathname: '/product/configuration' })
          } else {
            Modal.warning({
              title: '提示',
              content: responseMsg
            })
          }
        })
        // post_Product_copy({
        //   ...this.params,
        //   ...this.params.baseFormValue
        // }).then(res => {
        //   Modal.success({
        //     title: '产品复制成功'
        //   })
        //   this.props.history.push({ pathname: '/product/configuration' })
        // })
      }
    }
  };

  dateChange =(dateString) => {
    this.params.effectDate = dateString
  }
  // 校验生效日期的方法
  // validator =(rule, value, callback) => {
  //   if (this.params.effectDate) {
  //     post_Product_sameTime({
  //       productNo: this.state.productNo, effectDate: this.params.effectDate
  //     }).then(res => {
  //       if (res.data.responseData) {
  //         // true的情况下可以正常保存，否则false的情况下不能保存
  //         callback()
  //       } else {
  //         callback('生效时间已存在')
  //       }
  //     })
  //   } else {
  //     callback()
  //   }
  // }
  // 返回
  back = () => {
    this.props.history.push({ pathname: '/product/configuration' })
  };

  render() {
    const { topProductInfo, productInfo, concatProducts, concatComponents, rules } = this.state
    // let baseEditOrCopyUrl = window.location.href;
    // 可以根据baseEditOrCopyUrl判断productEdit是否存在，存在是修改，否则是复制
    const addProductList = [
      {
        type: 'INPUT',
        label: '产品名称:',
        field: 'productName',
        placeholder: '请输入',
        required: true,
        requiredMsg: '请输入产品名称',
        width: 400,
        disabled: true
      },
      {
        type: 'SELECT_OPTIONS',
        label: '组合方式:',
        field: 'configuration',
        required: true,
        requiredMsg: '请输入组合方式',
        placeholder: '请输入',
        width: 400,
        rules: [{ id: '0', rule: '组合' }],
        disabled: true
      },
      {
        type: 'SELECT_OPTIONS',
        label: '信用主体类型:',
        field: 'creditType',
        required: true,
        requiredMsg: '请选择信用主体类型',
        placeholder: '请选择',
        width: 400,
        rules
      },
      {
        type: 'INPUT',
        label: '产品外码:',
        field: 'swichCode',
        placeholder: '请输入',
        required: true,
        requiredMsg: '请输入产品外码',
        width: 400,
        disabled: true
      },
      {
        type: 'DATE',
        label: '生效时间:',
        field: 'effectDate',
        placeholder: '请输入',
        required: true,
        requiredMsg: '请选择生效时间',
        width: 400,
        defaultValue: moment(),
        // disabledDate: baseEditOrCopyUrl.includes("productCopy")
        //   ? this.state.MaxData  //复制页面传最大date
        //   : moment()            //修改的时候可以修改生效时间，时间最小是明天
        //   .add(1, "days")
        //   .format("YYYY-MM-DD") ,
        disabledDate: moment().add(1, 'days').format('YYYY-MM-DD') // 修改的时候可以修改生效时间，时间最小是明天
        // validatorType: 'productEffectDate'
      },
      {
        type: 'TEXTAREA',
        label: '备注信息:',
        field: 'remark',
        placeholder: '请输入',
        required: true,
        requiredMsg: '请输入备注信息',
        width: 400,
        disabled: true
      }
    ]
    const productColumn = [
      {
        title: '产品名称',
        key: 'productName',
        dataIndex: 'productName',
        width: 200
      },
      {
        title: '创建人',
        key: 'originatorName',
        dataIndex: 'originatorName',
        width: 200
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
        width: 200
      }, {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: 200
      }
    ]
    const partColumn = [
      {
        title: '零件名称',
        dataIndex: 'componentName',
        key: 'componentName'
      },
      {
        title: '一级分类',
        dataIndex: 'officeName',
        key: 'officeName'
      },
      {
        title: '二级分类',
        dataIndex: 'departmentName',
        key: 'departmentName'
      },
      {
        title: '用途',
        dataIndex: 'purpose',
        key: 'purpose'
      }
    ]
    return (
      <div className='content'>
        <Card bordered={ false }>
          <BaseForm
            wrappedComponentRef={ ref => { this.save = ref } }
            formList={ addProductList }
            config={ AddProductconfig }
            updateList={ topProductInfo }
            dateChange={ this.dateChange }
            // validator={ this.validator }
            // productNo ={this.state.productNo}

          />
          <div className='item_style'>
            <Button type='primary' onClick={ this.addComponent }>
              新增组件
            </Button>
            <Button onClick={ this.deleteComponentOrPart }>删除组件</Button>{' '}
            {/* 删除组件的时候需要判断是零件还是产品 */}
          </div>

          <div className='table'>
            <Tabs defaultActiveKey='1' onChange={ this.tabChange }>
              <TabPane tab='组成产品' key='1'>
                <BaseTable
                  rowKeyType='productId'
                  data={ productInfo } // 所有数据
                  dataSource={ concatProducts }
                  columns={ productColumn }
                  selectedItems={ this.selectedProductItems }
                  type={ 'checkbox' }
                  hidePagination={ true }
                />
              </TabPane>
              <TabPane tab='组成零件' key='2'>
                <BaseTable
                  rowKeyType='componentId'
                  data={ productInfo } // 所有数据
                  dataSource={ concatComponents }
                  columns={ partColumn }
                  selectedItems={ this.selectedPartItems }
                  type={ 'checkbox' }
                  hidePagination={ true }
                />
              </TabPane>
            </Tabs>
          </div>
          <div style={{ textAlign: 'center', marginTop: '45px' }}>
            <Button type='primary' onClick={ this.saveOrCopy } >
              保存修改
            </Button>
            <Button onClick={ this.back }>取消</Button>
          </div>
          <Modal
            className='addComponent'
            destroyOnClose={ true }
            title='新增组件'
            visible={ this.state.visible }
            onOk={ this.handleOk }
            okText='添加选择'
            onCancel={ this.handleCancel }
            maskClosable={ false }
          >
            <AddComponent
              getProductModalParams={ this.getProductModalParams } // 从子组件弹窗传过来的留存的产品
              getPartModalParams={ this.getPartModalParams } // 从子组件弹窗传过来的留存的零件
              editProducts={ concatProducts } // 复制/修改页面编辑拼接好的所有产品
              editComponents={ concatComponents } // 复制/修改页面编辑拼接好的所有零件
              closeModal={ this.closeModal }
              onRef={ (ref) => { this.child = ref } }
            />
          </Modal>
        </Card>
      </div>
    )
  }
}

// export default withRouter(ProductEdit);
export default Form.create({})(withRouter(ProductEdit))
