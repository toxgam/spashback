import React, {Component} from 'react'
import {Image} from 'react-konva'

import {directions} from './data'

const genNum = 6

export default class Bullet extends Component {
  constructor(props) {
    super()
    
    this.state = {
      image: undefined
    }

    this.props = props
    this.count = undefined
    this.x = undefined
    this.y = undefined

    this.fly(props)
  }

  render() {
    const size = this.props.cellSize / 4

    const rotation = this.props.direction * 90

    return (
      <Image
        ref="image"
        image={this.state.image}
        x={this.x}
        y={this.y}
        //rotation={rotation}
        //offset={{
        //    x: 30,
        //    y: 30
        //}}
        width={size}
        height={size}
      />
    )
  }

  fly = (props => {
    const imageObj = new window.Image()

    imageObj.src = "./bullet.svg"

    imageObj.onload = () => {
      this.setState({image: imageObj})
    }

    if (directions[this.props.direction][1] === 0) {
      if (directions[this.props.direction][0] === 1) {
        this.x = props.cellSize * props.col + props.gen * props.cellSize / genNum
      } else {
        this.x = props.cellSize * (props.col + 1) - props.gen * props.cellSize / genNum
      }

      this.y = props.cellSize * (props.row + 0.5)
    } else {
      this.x = props.cellSize * (props.col + 0.5)

      if (directions[this.props.direction][1] === 1) {
        this.y = props.cellSize * props.row + props.gen * props.cellSize / genNum
      } else {
        this.y = props.cellSize * (props.row + 1) - props.gen * props.cellSize / genNum
      }
    }
  })

  componentWillReceiveProps = this.fly

  componentDidUpdate() {
    this.refs.image.to({
      x: this.x + directions[this.props.direction][0] * this.props.cellSize / genNum,
      y: this.y + directions[this.props.direction][1] * this.props.cellSize / genNum,
      duration: 10 / 1000 // pause in sec
    })
    console.log(this.props.row, this.props.col)
    console.log(this.x + directions[this.props.direction][0] * this.props.cellSize / genNum, this.y + directions[this.props.direction][1] * this.props.cellSize / genNum)
  }

  componentDidMount = this.componentDidUpdate
}
