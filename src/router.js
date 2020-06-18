/*
 * @Author: your name
 * @Date: 2020-02-17 16:25:42
 * @LastEditTime: 2020-06-18 16:51:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /credit-admin/src/router.js
 */
import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import App from './App.js'
import Admin from './admin'
import Home from './pages/home'
// import LogDetails from './../src/pages/systemManagement/operationLogs/details'
import { routerList } from './config/routerConfig'
import { MyLoadingComponent } from './utils/utils'
const Login = Loadable({
  loader: () => import('./pages/login'),
  loading: MyLoadingComponent
})

class Routers extends React.Component {
  state = {
    menuTreeList: []
  }

  componentDidUpdate() {
    if (this.state.menuTreeList.length === 0) {
      const tree = this.props.getMenuTree.getTree.flattenTree // 获取权限列表  // 权限列表扁平化 深拷贝不影响数据
      this.setState({
        menuTreeList: tree
      })
    }
  }

  render() {
    // const { menuTreeList } = this.state
    // console.log(routerList, '--routerList')
    return (
      <HashRouter>
        <App>
          <Switch>
            <Route path='/' exact component={ Login }></Route>
            {/* <Route path="/login" exact component={Login}></Route>  */}
            <Route path='/' render={ () =>
              (<Admin>
                <Switch>
                  <Route path='/home' exact component={ Home }></Route>
                  <Route path='/' exact component={ Home }></Route>
                  {/* <Route path='/systemManagement/operationLogs/details' exact component={ LogDetails }></Route> */}
                  {/* {
                    menuTreeList.length > 0 && menuTreeList.map(item => {
                      // url存在就是目录，菜单，点击按钮进入的二级菜单
                      if (item.url) {
                        const menuId = item.menuId
                        // 根据后端传递的menuId与自定义的routerList的menuId匹配 获取component
                        const filterRouter = routerList.filter(routerListItem => routerListItem.menuId === menuId)
                        return filterRouter.length > 0 && <Route key={ filterRouter[0].menuId } path={ filterRouter[0].path } exact component={ filterRouter[0].component }></Route>
                      }
                      return null
                    })
                  } */}
                  {routerList.length > 0 && routerList.map(item => {
                    return <Route key={ item.path } path={ item.path } exact component={ item.component }></Route>
                  })}
                </Switch>
              </Admin>)
            }></Route>
            <Redirect to='/' />
          </Switch>
        </App>
      </HashRouter>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { getMenuTree: state }
}

export default connect(
  mapStateToProps
)(Routers)
