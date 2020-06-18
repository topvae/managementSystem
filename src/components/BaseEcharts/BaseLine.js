/*
 * @Author: Amy
 * @Date: 2020-03-23 11:07:05
 * @LastEditTime: 2020-06-17 15:28:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /citydata-discern/src/components/BaseEcharts/BaseLine.js
 */

import React from 'react'
// import { Menu, Popover } from 'antd'
// import { connect } from 'dva'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react/lib/index'
const defaultStyle = { width: '100%', height: '420px' }
const defaultGrid = { x: 30, y: 50, x2: 0, y2: 60 }
class BaseLine extends React.Component {
  state = {
  }
  getSeries =(series) => {
    return series && series.map(item => {
      return {
        name: item.name,
        type: 'line',
        data: item.data,
        itemStyle: item.itemStyle ? item.itemStyle : null,
        smooth: item.smooth ? item.smooth : false,
        areaStyle: item.areaStyle ? {} : null
      }
    })
  }
  getOption =() => {
    const option = {
      color: this.props.color, // 颜色数组
      tooltip: {
        trigger: 'axis'
      },
      title: {
        left: 'center',
        text: this.props.title
      },
      legend: this.props.legend ? this.props.legend : null, // 图例说明
      grid: this.props.grid ? this.props.grid : defaultGrid, // 图标的偏移数据
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.props.xAxisData
      },
      dataZoom: [{
        type: 'slider', // 图表下方的伸缩条
        show: this.props.ifShowZoom ? this.props.ifShowZoom : true, // 是否显示
        realtime: true, // 拖动时，是否实时更新系列的视图
        start: 0, // 伸缩条开始位置（1-100），可以随时更改
        end: 100 // 伸缩条结束位置（1-100），可以随时更改
      }],
      yAxis: {
        type: 'value'
      },
      series: this.getSeries(this.props.series)
    }
    return option
  }
  render() {
    return (
      <ReactEcharts option={ this.getOption() } style={ this.props.style ? this.props.style : defaultStyle } />
    )
  }
}
BaseLine.propTypes = {
  color: PropTypes.array.isRequired, // 颜色
  legend: PropTypes.object, // 图例说明 默认null
  grid: PropTypes.object, // 图标偏移信息 有默认值
  xAxisData: PropTypes.array.isRequired, // x轴的data
  ifShowZoom: PropTypes.bool, // 是否显示表下的滑动条 默认显示
  series: PropTypes.array.isRequired, // 内容参数
  style: PropTypes.object // 样式 有默认值
}

export default BaseLine
