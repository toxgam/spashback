import React, {Component} from 'react'
import MyImage from './MyImage'

export default class Bullet extends Component {
  render() {
    return (
      <MyImage 
        src="/droplet.png" 
        row={this.props.row} 
        col={this.props.col}
      />
    )
  }
}
