import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Router from './router'
import { Provider } from 'react-redux'
import configureStore from './redux/store/configureStore'
import * as serviceWorker from './serviceWorker'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const App = (
  <ConfigProvider locale={ zh_CN }>
    <Provider store={ configureStore }>
      <Router />
    </Provider>
  </ConfigProvider>
)

ReactDOM.render(App, document.getElementById('root'))

serviceWorker.unregister()
