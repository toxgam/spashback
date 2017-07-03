import React, {Component} from 'react'
import {Image} from 'react-konva'

export default class MyImage extends Component {
  constructor(props) {
    super(props)
    this.state = {image: null}
  }

  render() {
    const scale = this.props.scale || 1
    const x = this.props.cellSize * this.props.col + (this.props.cellSize - this.props.cellSize * scale) / 2
    const y = this.props.cellSize * this.props.row + (this.props.cellSize - this.props.cellSize * scale) / 2
    // const rotation = this.props.direction * 90 || 0
    // const offset = (this.props.direction) ? {x: this.props.cellSize * scale, y: this.props.cellSize * scale} : undefined

    return (
      <Image
        ref="myImage"
        image={this.state.image}
        x={x}
        y={y}
        width={this.props.cellSize * scale}
        height={this.props.cellSize * scale}
        //rotation={rotation}
        //offset={offset}
        onClick={this.onClick.bind(this)}
      />
    )
  }

  componentDidMount() {
    const imageObj = new window.Image()
    imageObj.src = this.props.src

    imageObj.onload = () => {
      this.setState({image: imageObj})
    }
  }

  to() {
    return this.refs.myImage.to.bind(this.refs.myImage)
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick() 
    }
  }
}
