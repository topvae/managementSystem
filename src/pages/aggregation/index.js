/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-29 10:42:36
 * @LastEditTime: 2020-06-17 11:29:09
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
// import { Menu } from 'antd'
import ReactEcharts from 'echarts-for-react/lib/index'
import BaseLine from './../../components/BaseEcharts/BaseLine'
import { Card } from 'antd'
// 搜索一级分类、二级分类的方法
const xAxisData = {
  day: ['10.00', '10.30', '11.30', '12.00', '12.30', '13.00'],
  week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  quater: ['第一季度', '第二季度', '第三季度'],
  sixMonth: ['前6个月', '后6个月'],
  year: ['第一年', '第二年']
}
const series = [{ name: '正常数', type: 'line', data: [20, 10, 25, 20, 36, 20, 29] },
  { name: '异常数', type: 'line', data: [16, 13, 21, 17, 30, 18, 25] }]
const legend = {
  data: ['正常数', '异常数'],
  right: 0
}
const series2 = [{ name: '正常数', type: 'line', data: [2, 6, 3, 11, 4, 7, 6], smooth: true, areaStyle: {}}]
class Aggregation extends React.Component {
  state = {
    data: [], // 存放搜索数据
    // totalData:total.responseData, // 产品所有的data {}
    // tableData:total.responseData.records, // 产品table所有的data
    visible: false
  }
  params = {
    page: 1
  }

  componentDidMount() {
    // 请求产品的list
    // this.requestProductList()
  }
  getOption2 =() => {
    return {
      title: {
        left: 'center',
        text: '报错信息占比'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : <br />({d}%) {c}'
      },
      color: ['#62b7f1', '#72d0e6', '#f6e091', '#8ace65', '#539cdc'],
      series: [
        {
          type: 'pie',
          radius: '65%',
          center: ['50%', '40%'],
          selectedMode: 'single',
          label: { // 饼图图形上的文本标签
            normal: {
              show: true
              // formatter: function(a) {
              //   return a.data.name + <br/>+ a.percent+'%' + a.value
              // }
            }
          },
          data: [
            { value: 1548, name: '表总行数告警次数' },
            { value: 535, name: '增量行数告警次数' },
            { value: 510, name: '新增表告警次数' },
            { value: 634, name: '无规律表告警次数' },
            { value: 735, name: '删除表告警次数 ' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }

  render() {
    return (
      <div className='content'>
        <Card bordered={ false } className='searchCard'>
          {/* 筛选条件的选择框 */}
          {/* <BaseForm
            formList={ formList }
            config={ config }
            filterSubmit={ this.handleProductFilterSubmit}
            resetFields={ this.resetProductFields}
          /> */}
          <div style={{ width: '100%', margin: '30px 0' }}>
            <BaseLine
              title={ '错误率统计' }
              color={ ['#43a0f0', '#eaa845'] }
              series={ series }
              xAxisData={ xAxisData['week'] }
              legend={ legend }
            />
          </div>
          <div style={{ width: '100%', margin: '30px 0' }}>
            <BaseLine
              title={ '访问量统计' }
              color={ ['#43a0f0'] }
              series={ series2 }
              xAxisData={ xAxisData['week'] }
            />
          </div>
          <div>
            <ReactEcharts option={ this.getOption2() } style={{ width: '100%', height: '380px' }} />
          </div>
        </Card>
      </div>
    )
  }
}

export default Aggregation
