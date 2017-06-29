import React, {Component} from 'react'
import MyImage from './MyImage'

export default class Droplet extends Component {
  render() {
    return (
      <MyImage 
        src="/droplet.png" 
        row={this.props.row} 
        col={this.props.col} 
        cellSize={this.props.cellSize}
        onClick={() => this.props.onClick(this.props.row, this.props.col)}
      />
    )
  }
}
