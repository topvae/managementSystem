/*
 * @Author: your name
 * @Date: 2020-02-17 12:43:37
 * @LastEditTime: 2020-03-19 17:37:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/pages/creditReport/companyReport/index.js
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Card, Button, Modal, Icon } from 'antd'
import BaseForm from '../../../components/Form'
import { config, changeSelectParams } from './formList'
import { query_product_list, get_options, query_credit_report_list } from '../../../services/api'
import { wrapAuth } from '../../../components/AuthButton'
import './index.less'
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${ pdfjs.version }/pdf.worker.js`

const AuthButton = wrapAuth(Button)
let timeout

function CompanyReport() {
  const [noSearch, setNoSearch] = useState(true) // 是否展示 搜索为空的样式
  const [numPages, setNumPages] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [formList, setFormList] = useState([])
  const [url, setUrl] = useState()
  const [dicId, setDicId] = useState()
  const [updateList, setUpdateList] = useState()
  const [searchInputNumber, setSearchInputNumber] = useState()
  const [searchInputText, setSearchInputText] = useState()
  const host = process.env.NODE_ENV === 'development' ? 'http://47.99.203.15' : '/file'

  useEffect(() => {
    async function fetchData() {
      const res = await get_options({ 'businessIdent': 't_credit_subject_company', 'field': 'company_id_number_type' })
      const data = res.data.responseData
      if (data) {
        const options = changeSelectParams(data)
        setFormList([
          {
            type: 'SELECT_SEARCH',
            label: '产品名称',
            field: 'productNo',
            placeholder: '请输入',
            width: 170,
            required: true,
            requiredMsg: '请输入'
          }, {
            type: 'INPUT',
            label: '信用主体',
            field: 'creditSubjectName',
            placeholder: '请输入',
            required: true,
            requiredMsg: '请输入',
            width: 170
          }, {
            type: 'SELECT_OPTIONS',
            label: '证件类型',
            field: 'idType',
            placeholder: '请输入',
            required: true,
            requiredMsg: '请输入',
            width: 170,
            rules: options
          }, {
            type: 'INPUT',
            label: '证件号码',
            field: 'idNumber',
            placeholder: '请输入',
            required: true,
            requiredMsg: '请输入',
            width: 170
          }
        ])
        const companyReport = JSON.parse(sessionStorage.getItem('companyReport'))
        if (!companyReport) return
        const { url, text, idNumber, creditSubjectName, idType, value } = companyReport
        if (url) {
          setUrl(host + url)
          setNoSearch(false)
        } else {
          setNoSearch(true)
        }
        setUpdateList({
          productNo: text,
          creditSubjectName,
          idNumber,
          idType
        })
        setSearchInputNumber(value)
        setSearchInputText(text)
      }
    }

    // 根据接口取个人或者企业的id
    // fieldCode:0 --> 个人
    // fieldCode：1 --> 企业
    async function getServe() {
      const params = {
        businessIdent: 'all',
        field: 'credit_type'
      }
      const res = await get_options(params)
      const creditTypeResponseData = res.data.responseData
      if (creditTypeResponseData) {
        const fieldCode = creditTypeResponseData.filter(item => item.fieldCode === '1')
        setDicId(fieldCode[0].dicId)
      }
    }

    fetchData()
    getServe()

  }, [host])

  // 查询表单
  const handleFilterSubmit = (params) => {
    params.creditType = dicId
    params.productNo = searchInputNumber
    Modal.confirm({
      title: '提示',
      content: '确认已获得授权？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setNoSearch(true)
        setSession(params)
        query_credit_report_list({ ...params }).then(res => {
          const responseData = res.data.responseData
          if (responseData.url) {
            setNumPages(null)
            setUrl(host + responseData.url)
            setNoSearch(false)
            // 搜索后，加入 url 缓存
            setSession(params, responseData.url)
          }
        })
      },
      onCancel: () => {}
    })
  }

  const setSession = (params, url) => {
    let obj
    // 正常搜索后进入
    if (url) {
      // 获取下拉中文保存下来
      obj = {
        ...params,
        text: searchInputText,
        value: searchInputNumber,
        url
      }
    } else {
      // 不需要存url
      obj = {
        ...params,
        text: searchInputText,
        value: searchInputNumber
      }
    }
    sessionStorage.setItem('companyReport', JSON.stringify(obj))
  }

  // 重置表格的时候
  const resetFields = () => {
    sessionStorage.removeItem('companyReport')
    setNoSearch(true)
  }

  const exportReport = () => {
    if (noSearch) {
      Modal.warning({
        title: '提示',
        content: '请先查出信用报告再导出'
      })
    } else {
      window.location.href = url
    }
  }

  const selectInputFetch = useCallback((value, callback) => {
    let currentValue
    const params = {}
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    const fake = () => {
      params.productName = value.replace(/\s*/g, '')
      params.creditType = dicId // 企业查询
      currentValue = value
      query_product_list(params)
        .then(res => {
          if (currentValue === value) {
            const { responseData } = res.data
            const data = []
            responseData.forEach(r => {
              data.push({
                value: r.productNo,
                text: r.productName
              })
            })
            callback(data)
          }
        })
    }
    timeout = setTimeout(fake, 300)
  }, [dicId])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const left = () => {
    pageNumber > 1 ? setPageNumber(pageNumber - 1) : null
  }

  const right = () => {
    pageNumber < numPages ? setPageNumber(pageNumber + 1) : null
  }

  const selectSearch = (option) => {
    setSearchInputNumber(option.value)
    setSearchInputText(option.children)
  }

  return (
    <div className='companyReport'>
      <Card bordered={ false } className='searchCard'>
        <BaseForm
          formList={ formList }
          config={ config }
          filterSubmit={ handleFilterSubmit }
          resetFields={ resetFields }
          selectInputFetch={ selectInputFetch } // input边输边请求的接口方法
          updateList={ updateList }
          selectSearch={ selectSearch }
        />
      </Card>
      <Card bordered={ false } className='searchResult'>
        <Row style={{ marginBottom: 20 }}>
          <Col span={ 18 }>
            <AuthButton type='primary' onClick={ exportReport } className='export' menu_id={ 180 }>导出报告</AuthButton>
          </Col>
        </Row>
        { noSearch && <div className='noSearch'>
          <img src='./assets/noSearch.png' />
          <p>请输入查询项~</p>
        </div> }
        { !noSearch &&
        <div className='pdf'>
          <div className='operation'>
            { numPages && <Icon className='icon' type='left' onClick={ left } /> }
            <Document
              file={ url }
              onLoadSuccess={ onDocumentLoadSuccess }
            >
              <Page width={ 900 } pageNumber={ pageNumber } />
            </Document>
            { numPages && <Icon className='icon' type='right' onClick={ right } /> }
          </div>
          { numPages && <p> { pageNumber } / { numPages }</p> }
        </div> }
      </Card>
    </div>
  )
}

export default CompanyReport
