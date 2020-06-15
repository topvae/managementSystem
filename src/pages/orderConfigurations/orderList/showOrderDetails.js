import React, { useState, useCallback, useEffect } from 'react' // useEffect,
import { Card, Table } from 'antd'
import './index.less'
import { get_orders_details } from '../../../services/api'
// const confirm = Modal.confirm;
function ShowOrderDetails(props) {
  const { location } = props
  const pathSnippets = location.pathname.split('/').filter(i => i)

  const componentId = pathSnippets.filter(i => {
    return !isNaN(i)
  })
  const Id = componentId[0] // 订单列表的id
  const [totalData, setTotalDate] = useState([])
  const [tableData, setTableData] = useState([])
  // 请求 静态页面只是用的是之前表格的数据
  const requestList = useCallback(
    () => {
      get_orders_details({ id: Id })
        .then((res) => {
          console.log(res.data.responseData, 'res')
          const data = res.data.responseData
          setTotalDate(data)
          setTableData(data.serves)
        })
    },
    [Id]
  )
  useEffect(() => {
    requestList() // 请求服务list
  }, [requestList])

  // 查看优惠详情
  // let showDiscount = (record) => {
  //   //套餐服务弹出来套餐窗口，非套餐服务弹出来非套餐窗口  实际情况需要根据预警套餐的区分字段做判断
  //   if(record.sendType === 1){
  //     setPackServiceVisible(true)
  //   }else{
  //     setServiceVisible(true)
  //   }
  // }
  const sendTypeList = ['短信', '邮件', '接口'] // 传送方式
  // let typeList = ['普通服务','预警服务'];
  const warnPeriodList = ['周', '月', '季', '半年', '年'] // 预警周期
  // let creditTypeList = ['个人','企业']
  const tableColumns = [
    {
      title: '服务编码',
      dataIndex: 'swichCode',
      key: 'swichCode'
    },
    {
      title: '服务名称',
      dataIndex: 'serveName',
      key: 'serveName'
    },
    // {
    //   title: "价格",
    //   dataIndex: "prices",
    //   key: "prices"
    // },
    // {
    //   title: "优惠详情",
    //   dataIndex: "operator",
    //   key: "operator",
    //   render: (text, record) => (
    //     <span
    //       style={{ color: "#4091f7", cursor: "pointer" }}
    //       // onClick={() => getDetail(record)}
    //     >
    //       详情
    //     </span>
    //   )
    // },
    {
      title: '传送方式',
      dataIndex: 'sendType',
      key: 'sendType',
      // eslint-disable-next-line react/display-name
      render: text => <span> {sendTypeList[text]} </span>
    },
    {
      title: '预警周期',
      dataIndex: 'warnPeriod',
      key: 'warnPeriod',
      // eslint-disable-next-line react/display-name
      render: text => <span> {warnPeriodList[text]} </span>
    }
    // {
    //   title: "信用主体类型",
    //   dataIndex: "creditType",
    //   key: "creditType",
    //   render: text => <span> {creditTypeList[text]} </span>
    // },
    // {
    //   title: "生效时间",
    //   dataIndex: "effectDate",
    //   key: "effectDate"
    // },
    // {
    //   title: "说明",
    //   dataIndex: "remark",
    //   key: "remark",
    //   render: text => <span>{text}</span>
    // }
  ]

  const importanceList = ['', '一般', '重要', '非常重要'] // 重要程度
  const emergencyList = ['', '一般', '紧急', '非常紧急'] // 紧急程度

  return (
    <div className='content'>
      <Card style={{ marginTop: '20px' }}>
        <div className='card'>
          <h3>订单配置信息</h3>
          <div>机构名称：{totalData.dataUseOrganizationName}</div>
          <div className='card_items'>
            <div className='card_item'>生效时间：{totalData.effectDate}</div>
            <div className='card_items'>结束时间：{totalData.endDate}</div>
          </div>
        </div>
      </Card>
      {totalData.type === 1 // 预警服务的时候才会展示这快字段
        ? <div>
          <Card>
            <div className='card'>
              <h3>预警信息</h3>
              <div className='card_items'>
                <div className='card_item'>名单名称：{totalData.rollCallName}</div>
                <div className='card_item'>名单人数：{totalData.rollCallCount}</div>
              </div>

              <div className='card_items'>
                <div className='card_item'>触发预警条件重要程度：{importanceList[totalData.degreeImportance]}</div>
                <div className='card_item'>触发预警条件紧急程度：{emergencyList[totalData.emergencyDegree]}</div>
                <div className='card_items'>首次预警时间：{totalData.firstWarnDate}</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className='card'>
              <h3>预警服务价格详情</h3>
              {totalData.map.map((item, index) => {
                return (<div key={ index }>
                  <h4>{item.serveName}</h4>
                  <div className='card_items'>
                    <div className='card_item'>单周价格：{item.prices.week}</div>
                    <div className='card_item'>单月价格：{item.prices.month}</div>
                    <div className='card_item'>每年价格：{item.prices.year}</div>
                  </div>
                </div>)
              })
              }
            </div>
          </Card>
        </div>
        : null}
      <Card>
        <div className='card'>
          <h3>服务列表</h3>
          <Table dataSource={ tableData } columns={ tableColumns } rowKey={ record => record.serveNo } pagination={ false } />
        </div>
      </Card>
    </div>
  )
}
export default ShowOrderDetails
