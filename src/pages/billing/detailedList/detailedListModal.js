import React, { useState, useEffect, useCallback, useRef } from 'react'
import './index.less'
import { Modal, Select, Form, Input, DatePicker, TimePicker, InputNumber, message } from 'antd'
import { formItemLayout } from './utils'
import moment from 'moment'
import { save_serve_config, serve_all_list, update_serve_config, serve_config_detail } from '../../../services/api'

const { RangePicker } = DatePicker

import { IconFont } from './../../../config/iconConfig'

function DetailedListModal(props) {
  const { TextArea } = Input
  const { getFieldDecorator, setFieldsValue } = props.form
  const [optionsData, setOptionsData] = useState([])
  const [options, setOptions] = useState([])
  const [visible, setVisible] = useState(false)
  const [serveConfigId, setServeConfigId] = useState(false) // 是否修改状态
  const [timeArr, setTimeArr] = useState([])
  const [dateArr, setDateArr] = useState([])
  const [serveNo, setServeNo] = useState()
  const [type, setType] = useState()
  const [serveDisabled, setServeDisabled] = useState(true)
  const [errTimeKey, setErrTimeKey] = useState([]) // 如果开始时间大于等于结束时间 就把 所在timeArr的下标存进去 展示文案的时间匹配是否存在这个下标 有的话就报错
  const [errDateKey, setErrDateKey] = useState([]) // 如果开始日期大于等于结束日期 就把 所在timeArr的下标存进去 展示文案的时间匹配是否存在这个下标 有的话就报错
  const { Option } = Select
  const format = 'HH:mm'
  const dateFormat = 'YYYY-MM-DD'
  const errDateKeyRef = useRef(errDateKey)
  const errTimeKeyRef = useRef(errTimeKey)

  useEffect(() => {
    setVisible(props.visible)
    setServeConfigId(props.serveConfigId)
    setServeDisabled(props.serveDisabled)
  }, [props.visible, props.serveConfigId, props.serveDisabled])

  useEffect(() => {
    if (optionsData && optionsData.length > 0) {
      const options = optionsData.map(d => <Option key={ d.value } type={ d.type }>{d.text}</Option>)
      if (options) {
        setOptions(options)
      }
    }
  }, [optionsData])

  useEffect(() => {
    async function fetchData() {
      const res = await serve_config_detail({ serveConfigId })
      const responseData = res.data.responseData
      if (responseData) {
        const timeList = responseData.timeList || []
        const dateList = responseData.dateList || []
        setServeNo(responseData.serveNo)
        setType(responseData.type)
        setFieldsValue({
          serveNo: responseData.serveName,
          prices: responseData.prices,
          remark: responseData.remark
        })
        const newTimeList = timeList.map((item, index) => {
          item.key = index
          return item
        })
        const newDateList = dateList.map((item, index) => {
          item.key = index
          return item
        })
        setTimeArr(newTimeList)
        setDateArr(newDateList)
      }
    }
    if (visible && serveConfigId && serveConfigId !== -1) {
      fetchData()
    } else {
      setFieldsValue({})
    }
  }, [visible, serveConfigId, setFieldsValue])

  const handleSearch = useCallback(value => {
    let timeout
    let currentValue
    const params = {}
    function fetch(value, callback) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      currentValue = value
      function fake() {
        params.serveName = value.replace(/\s*/g, '')
        serve_all_list(params)
          .then(res => {
            if (currentValue === value) {
              const { responseData } = res.data
              const data = []
              responseData.forEach(r => {
                data.push({
                  value: r.serveNo,
                  text: r.serveName,
                  type: r.type
                })
              })
              callback(data)
            }
          })
      }
      timeout = setTimeout(fake, 300)
    }
    if (value) {
      fetch(value, data => {
        setOptionsData(data)
      })
    } else {
      setOptionsData([])
    }
  }, [])

  const selectOnChange = (value, opt) => {
    setServeNo(value)
    setType(opt.props.type)
  }

  // textArea校验字数
  const validateTextArea = (rule, value, callback) => {
    if (value && value.length > 50) {
      callback('不能超过50个字符')
    } else {
      callback()
    }
  }

  const onOk = () => {
    // 判断时间是否有交集方法
    const check = (a, b, x, y) => {
      if (y < a || b < x) {
        return false
      } else {
        return true
      }
    }
    // 判断时间是否有交集方法
    const checkTime = (a, b, x, y) => {
      const times1 = []
      const times2 = []
      // if (a < b) {
      //   // 未跨天
      //   times1.push([a, b])
      // } else {
      //   // 跨天
      //   times1.push([a, '24:00'], ['00:00', b])
      // }

      // if (x < y) {
      //   times2.push([x, y])
      // } else {
      //   times2.push([x, '24:00'], ['00:00', y])
      // }
      if (a < x) {
        times1.push([a, b])
        times2.push([x, y])
      } else {
        times1.push([x, y])
        times2.push([a, b])
      }
      let flag = false
      // 循环比较时间段是否冲突
      for (let i = 0; i < times1.length; i++) {
        if (flag) break
        for (let j = 0; j < times2.length; j++) {
          if (check(times1[i][0], times1[i][1], times2[j][0], times2[j][1])) {
            flag = true
            break
          }
        }
      }
      if (flag) {
        if (times1.length === 1 && times2.length === 1) {
          return {
            flag,
            msg: `发生冲突: ${ times1[0][0] }-${ times1[0][1] } 与 ${ times2[0][0] }-${ times2[0][1] }`
          }
        } else if (times1.length === 1 && times2.length === 2) {
          return {
            flag,
            msg: `发生冲突: ${ times1[0][0] }-${ times1[0][1] } 与 ${ times2[0][0] }-${ times2[1][1] }`
          }
        } else if (times1.length === 2 && times2.length === 1) {
          return {
            flag,
            msg: `发生冲突: ${ times1[0][0] }-${ times1[1][1] } 与 ${ times2[0][0] }-${ times2[0][1] }`
          }
        } else if (times1.length === 2 && times2.length === 2) {
          return {
            flag,
            msg: `发生冲突: ${ times1[0][0] }-${ times1[1][1] } 与 ${ times2[0][0] }-${ times2[1][1] }`
          }
        } else {
          return {
            flag
          }
        }
      } else {
        return {
          flag
        }
      }
    }

    // 判断日期是否有交集方法
    const checkDate = (startDate1, endDate1, startDate2, endDate2) => {
      if (endDate1 >= startDate2 && startDate1 <= endDate2) {
        return {
          flag: true,
          msg: `发生冲突: ${ startDate1 }~${ endDate1 } 与 ${ startDate2 }~${ endDate2 }`
        }
      } else {
        return {
          flag: false,
          msg: `未发生冲突: ${ startDate1 }~${ endDate1 } 与 ${ startDate2 }~${ endDate2 }`
        }
      }
    }
    props.form.validateFields(async(err, values) => {
      if (!err) {
        const currentTime = timeArr.map(item => {
          return {
            startTime: item.startTime,
            endTime: item.endTime
          }
        })
        const currentDate = dateArr.map(item => {
          return {
            startDate: item.startDate,
            endDate: item.endDate
          }
        })

        // 是否有空项
        const isTimeArrEmpty = timeArr.some(item => {
          return !item.startTime || !item.endTime || !item.timeDiscount
        })
        const isDateArrEmpty = dateArr.some(item => {
          return !item.startDate || !item.endDate || !item.dateDiscount
        })
        values.serveNo = serveNo
        values.type = type
        if (errTimeKey.length > 0 || errDateKey.length > 0) {
          message.error('时间或日期配置有误')
          return
        }
        if (isTimeArrEmpty) {
          Modal.error({
            title: '提示',
            content: '时间和日期配置未填写完整',
            onOk: () => { }
          })
          return
        }
        if (isDateArrEmpty) {
          Modal.error({
            title: '提示',
            content: '时间和日期配置未填写完整。',
            onOk: () => { }
          })
          return
        }
        // 判断时间是否有交集
        for (let i = 0; i < currentTime.length; i++) {
          const currentA = currentTime[i]
          for (let j = 0; j < currentTime.length; j++) {
            if (i === j) {
              continue
            }
            const currentB = currentTime[j]
            const res = checkTime(currentA.startTime, currentA.endTime, currentB.startTime, currentB.endTime)
            if (res.flag) {
              Modal.warning({
                title: '提示',
                content: res.msg,
                onOk: () => { }
              })
              return
            }
          }
        }
        // 判断日期是否有交集
        for (let i = 0; i < currentDate.length; i++) {
          const currentA = currentDate[i]
          for (let j = 0; j < currentDate.length; j++) {
            if (i === j) {
              continue
            }
            const currentB = currentDate[j]
            const res = checkDate(currentA.startDate, currentA.endDate, currentB.startDate, currentB.endDate)
            if (res.flag) {
              // 弹出报错
              Modal.success({
                title: '提示',
                content: res.msg,
                onOk: () => { }
              })
              return
            }
          }
        }
        // 只有日期 输出日期
        // 只有时间 输出时间
        // 时间 日期 都有 交叉结合输出
        let arr = []
        if (timeArr.length === 0 && dateArr.length > 0) {
          values.list = dateArr
        } else if (timeArr.length > 0 && dateArr.length === 0) {
          values.list = timeArr
        } else if (timeArr.length > 0 && dateArr.length > 0) {
          dateArr.map(dateItem => {
            timeArr.map(timeItem => {
              arr = [
                ...arr,
                {
                  ...dateItem,
                  ...timeItem
                }
              ]
              return arr
            })
            return arr
          })
          values.list = arr
        } else {
          values.list = []
        }
        // 新增
        if (serveConfigId === -1) {
          const res = await save_serve_config({ ...values })
          Modal.success({
            title: '提示',
            content: res.data.responseMsg,
            onOk: () => { }
          })
        } else {
          // 修改更新
          const res = await update_serve_config({ ...values, serveConfigId })
          Modal.success({
            title: '提示',
            content: res.data.responseMsg,
            onOk: () => { }
          })
        }
        setVisible(false)
        props.close(false, 'updata')
        clearArr()
      }
    })
  }

  const clearArr = () => {
    setTimeArr([])
    setDateArr([])
    setErrTimeKey([])
    setErrDateKey([])
  }

  const onCancel = () => {
    clearArr()
    setVisible(false)
    props.close(false)
  }

  const selectOnFocus = () => {
    setOptionsData([])
    setOptions([])
  }

  const addTime = () => {
    setTimeArr(
      [
        ...timeArr,
        {
          key: timeArr.length++,
          startTime: '',
          endTime: '',
          timeDiscount: ''
        }
      ]
    )
  }

  const addDate = () => {
    setDateArr(
      [
        ...dateArr,
        {
          key: dateArr.length++,
          startDate: '',
          endDate: '',
          dateDiscount: ''
        }
      ]
    )
  }

  const timeInputNumberOnChange = (value, key) => {
    timeArr.forEach(item => {
      if (key === item.key) {
        item.timeDiscount = value
      }
    })
    setTimeArr([...timeArr])
  }

  const dateInputNumberOnChange = (value, key) => {
    dateArr.forEach(item => {
      if (key === item.key) {
        item.dateDiscount = value
      }
    })
    setDateArr([...dateArr])
  }

  const deleteTimeConfig = (key) => {
    // 删除前重置报错数组里面的key，因为删除了以后timeArr下标变化了
    setErrTimeKey([])
    // 删除对应数组 并且重置key
    const filterTimeArr = timeArr.filter(item => key !== item.key)
    const resetTimeArr = filterTimeArr.map((item, index) => {
      return {
        ...item,
        key: index
      }
    })
    setTimeArr([...resetTimeArr])
    resetTimeArr.forEach(item => {
      // 开始时间 > 结束时间 || 开始时间 === 结束时间
      const flag = item.startTime && item.endTime
      if (flag && (item.startTime > item.endTime)) {
        // 错误的情况，就将错误的下标放入数组
        setErrTimeKey([...new Set([...errTimeKeyRef.current, item.key])])
      }
    })
  }

  const deleteDateConfig = (key) => {
    // 删除前重置报错数组里面的key，因为删除了以后dateArr下标变化了
    setErrDateKey([])
    // 删除对应数组 并且重置key
    const filterDateArr = dateArr.filter(item => key !== item.key)
    const resetDateArr = filterDateArr.map((item, index) => {
      return {
        ...item,
        key: index
      }
    })
    setDateArr([...resetDateArr])
    resetDateArr.forEach(item => {
      // 开始时间 > 结束时间 || 开始时间 === 结束时间
      const flag = item.startDate && item.endDate
      if (flag && (item.startDate > item.endDate)) {
        // 错误的情况，就将错误的下标放入数组
        setErrDateKey([...new Set([...errDateKeyRef.current, item.key])])
      }
    })
  }

  const dateChange = (time, timeString, key) => {
    dateArr.forEach(item => {
      if (key === item.key) {
        item.startDate = timeString[0]
        item.endDate = timeString[1]
        if (timeString[0] > timeString[1]) {
          // 错误的情况，就将错误的下标放入数组
          setErrDateKey([...new Set([...errDateKey, item.key])])
        } else {
          // 如果不错误，就将下标过滤出去
          const filterErrKey = errDateKey.filter(item => {
            return item !== key
          })
          setErrDateKey(filterErrKey)
        }
      }
    })
    setDateArr([...dateArr])
  }

  const timeChange = (time, timeString, key, type) => {
    timeArr.forEach(item => {
      if (key === item.key) {
        if (type === 'start') {
          item.startTime = timeString
          if (!item.endTime) return
          // 开始时间 > 结束时间 || 开始时间 === 结束时间
          if (timeString > item.endTime) {
            // 错误的情况，就将错误的下标放入数组
            setErrTimeKey([...new Set([...errTimeKey, item.key])])
          } else {
            // 如果不错误，就将下标过滤出去
            const filterErrKey = errTimeKey.filter(item => {
              return item !== key
            })
            setErrTimeKey(filterErrKey)
          }
        }
        if (type === 'end') {
          item.endTime = timeString
          if (!item.startTime) return
          // 开始时间 > 结束时间 || 开始时间 === 结束时间
          if (item.startTime > timeString) {
            // 错误的情况，就将错误的下标放入数组
            setErrTimeKey([...new Set([...errTimeKey, item.key])])
          } else {
            // 如果不错误，就将下标过滤出去
            const filterErrKey = errTimeKey.filter(item => {
              return item !== key
            })
            setErrTimeKey(filterErrKey)
          }
        }
      }
    })
    setTimeArr([...timeArr])
  }

  return (
    <Modal
      destroyOnClose={ true }
      className='detailedListModal'
      title='详单配置'
      centered
      visible={ visible }
      onOk={ onOk }
      onCancel={ onCancel }
      okText='确定'
      cancelText='取消'
      maskClosable={ false }
      width={ 600 }
    >
      <Form { ...formItemLayout } className='detailedListForm'>
        <Form.Item label='服务名称'>
          {getFieldDecorator('serveNo', {
            rules: [
              {
                required: true,
                message: '请输入服务名称'
              }
            ]
          })(
            <Select
              getPopupContainer={ triggerNode => triggerNode.parentNode }
              disabled={ serveDisabled }
              showSearch
              defaultActiveFirstOption={ false }
              showArrow={ false }
              filterOption={ false }
              onSearch={ handleSearch }
              notFoundContent={ null }
              onFocus={ selectOnFocus }
              onChange={ selectOnChange }
            >
              { options }
            </Select>
          )}
        </Form.Item>
        <Form.Item label='原价'>
          {getFieldDecorator('prices', {
            rules: [
              {
                required: true,
                pattern: new RegExp(/^(([1-9]\d*)|\d)(\.\d{1,2})?$/, 'g'),
                message: '请输入正确的金额'
              }
            ],
            getValueFromEvent: (event) => {
              return event.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
            }
          })(
            <Input
              placeholder='请输入'
              type='number'
            />
          )}
        </Form.Item>
        <Form.Item label='备注'>
          {getFieldDecorator('remark', {
            rules: [
              {
                // 如果TEXTAREA类型是制定的就不校验字符个数
                validator: validateTextArea
              }
            ]
          })(
            <TextArea
              placeholder='请输入'
            />
          )}
        </Form.Item>
        <div className='timeConfig'>
          <div className='title'>
            <p>时间配置</p>
            <span className='like_a' onClick={ addTime }>+ 增加</span>
          </div>
          <div>
            <div>
              {
                timeArr.length > 0 && timeArr.map((item) => {
                  return (
                    <div key={ item.key } className='cardStyle'>
                      <div>
                        <span style={{ marginLeft: 28 }}>时间：</span>
                        <TimePicker value={ item.startTime ? moment(item.startTime, format) : null } format={ format }
                          onChange={ (time, timeString) => timeChange(time, timeString, item.key, 'start') } style={{ marginRight: 20 }}
                          placeholder='开始时间'
                        />
                        <TimePicker value={ item.endTime ? moment(item.endTime, format) : null } format={ format }
                          onChange={ (time, timeString) => timeChange(time, timeString, item.key, 'end') }
                          placeholder='结束时间'
                        />
                        {
                          errTimeKey.indexOf(item.key) !== -1 && <div className='timeTip'>结束时间需大于等于开始时间</div>
                        }
                        <div style={{ marginTop: 20 }}>
                          <span>系数折扣：</span>
                          <InputNumber min={ 0 } max={ 1 } step={ 0.01 } onChange={ (value) => timeInputNumberOnChange(value, item.key) } value={ item.timeDiscount } />
                        </div>
                      </div>
                      <IconFont type='zhengxin-shanchu' className='icon' onClick={ () => deleteTimeConfig(item.key) } />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className='dateConfig'>
          <div className='title'>
            <p>日期配置</p>
            <span className='like_a' onClick={ addDate }>+ 增加</span>
          </div>
          <div>
            <div>
              {
                dateArr.length > 0 && dateArr.map((item) => {
                  return (
                    <div key={ item.key } className='cardStyle'>
                      <div>
                        <span style={{ marginLeft: 28 }}>日期：</span>
                        <RangePicker value={ (item.startDate && item.endDate) ? [moment(item.startDate, dateFormat), moment(item.endDate, dateFormat)] : null } format={ dateFormat } onChange={ (time, timeString) => dateChange(time, timeString, item.key) } style={{ marginRight: 20 }} />
                        {
                          errDateKey.indexOf(item.key) !== -1 && <div className='timeTip'>结束时间需大于等于开始时间</div>
                        }
                        <div style={{ marginTop: 20 }}>
                          <span>系数折扣：</span>
                          <InputNumber min={ 0 } max={ 1 } step={ 0.01 } type='number' onChange={ (value) => dateInputNumberOnChange(value, item.key) } value={ item.dateDiscount } />
                        </div>
                      </div>
                      <IconFont type='zhengxin-shanchu' className='icon' onClick={ () => deleteDateConfig(item.key) } />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default Form.create({})(DetailedListModal)
