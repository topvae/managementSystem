import { connect } from 'react-redux'

export default connect(
  (state, ownProps) => {
    return { menu: state }
  }
)

