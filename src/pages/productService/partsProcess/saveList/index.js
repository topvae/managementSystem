/*
 * @Description: In User Settings Edit
 * @Author: ysk
 * @Date: 2019-09-26 16:35:46
 * @LastEditTime: 2019-12-12 10:19:53
 * @LastEditors: Please set LastEditors
 */
import React, { useState, useEffect } from 'react'
import './index.less'
import { Tag, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function SaveList(props) {
  const [partKeepListEdit, setPartKeepListEdit] = useState([])
  const { partsList } = props

  useEffect(() => {
    // if (partsList && partsList.length > 0) {
    setPartKeepListEdit(partsList)
    // } else {
    // setPartKeepListEdit([])
    // }
  }, [partsList])

  const onCopy = () => {
    message.success('复制成功', 0.5)
  }

  // 单个删除留存
  const log = (e, deleteID) => {
    e.stopPropagation()
    const arr = partKeepListEdit.filter(item => {
      return item.componentId !== deleteID
    })
    setPartKeepListEdit(arr)
    props.changeKeepList(arr)
  }

  const tagClick = (e) => {}

  return (
    <div>
      {
        partKeepListEdit && partKeepListEdit.map((item) => {
          return (
            <CopyToClipboard text={ '$' + item.componentName + '-' + item.departmentName + '-' + item.officeName + '$' + ' ' } onCopy={ onCopy } key={ item.componentId }>
              <Tag style={{ marginBottom: 10 }} color='blue' data-str={ item } closable onClose={ (e) => log(e, item.componentId) } onClick={ (e) => tagClick(e) }>
                {item.componentName + '-' + item.departmentName + '-' + item.officeName}
              </Tag>
            </CopyToClipboard>
          )
        })
      }
      {/* <div className='tip'>注：点击标签进行复制，ctrl+v粘贴</div> */}
    </div>
  )
}

export default SaveList
