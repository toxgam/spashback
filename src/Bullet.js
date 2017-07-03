import React, {Component} from 'react'

import MyImage from './MyImage'
import {directions} from './data'

export default class Bullet extends Component {
  scale = 0.5

  render() {
    const name = "bullet" + this.props.direction + ".png"
    
    return (
      <MyImage 
        ref="myImage"
        src={name}
        row={this.props.row} 
        col={this.props.col}
        direction={this.props.direction}
        cellSize={this.props.cellSize}
        scale={this.scale}
      />
    )
  }

  componentDidMount() {
    const margin = this.props.cellSize * (1 - this.scale) / 2
    const x = this.props.cellSize * (this.props.col + directions[this.props.direction][0]) + margin
    const y = this.props.cellSize * (this.props.row + directions[this.props.direction][1]) + margin

    this.refs.myImage.to()({
      x,
      y,
      duration: 1
    })
  }
}
