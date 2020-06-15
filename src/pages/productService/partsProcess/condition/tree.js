import React from 'react'
import './index.less'
import { Row, Col, Tree } from 'antd'

const { TreeNode } = Tree

class ConditionTree extends React.Component {
  state = {
    checkedKeys: [],
    treeData: [],
    gData: null
  }

  x = 3;
  y = 2;
  z = 1;
  gData = [];

  generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0'
    const tns = _tns || this.gData

    const children = []
    for (let i = 0; i < this.x; i++) {
      const key = `${ preKey }-${ i }`
      tns.push({ title: key, key })
      if (i < this.y) {
        children.push(key)
      }
    }
    if (_level < 0) {
      return tns
    }
    const level = _level - 1
    children.forEach((key, index) => {
      tns[index].children = []
      return this.generateData(level, key, tns[index].children)
    })
  };

  onDrop = info => {
    const dropKey = info.node.props.eventKey
    const dragKey = info.dragNode.props.eventKey
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr)
        }
        if (item.children) {
          return loop(item.children, key, callback)
        }
      })
    }
    const data = [...this.state.gData]

    // Find dragObject
    let dragObj
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || []
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj)
      })
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || []
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.unshift(dragObj)
      })
    } else {
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }

    this.setState({
      gData: data
    })
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={ item.title } key={ item.key } dataRef={ item }>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode { ...item } key={ item.key } />
    })
  }

  componentWillReceiveProps(nextProps) {
    const { treeData, checkedKeys } = nextProps
    const oldTreeData = this.state.treeData
    this.setState({
      checkedKeys
    })
    if (treeData !== oldTreeData) {
      this.setState({
        treeData
      })
    }
  }

  componentDidMount() {
    this.generateData(this.z)
    this.setState({
      treeData: this.props.treeData
    })
  }

  onCheck = checkedKeys => {
    this.setState({ checkedKeys: checkedKeys.checked })
    this.props.getCheckedKeys(checkedKeys.checked)
  };

  render() {
    const { treeData, checkedKeys } = this.state
    return (
      <Row className='conditionContent'>
        <Col span={ 24 }>
          {
            treeData.length
              ? <Tree
                checkable
                checkStrictly
                onCheck={ this.onCheck }
                checkedKeys={ checkedKeys }
                onDragEnter={ this.onDragEnter }
                onDrop={ this.onDrop }
              >

                {this.renderTreeNodes(treeData)}
              </Tree> : (
                'loading...'
              )
          }
        </Col>
      </Row>
    )
  }
}

export default ConditionTree
