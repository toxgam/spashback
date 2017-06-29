import React, {Component} from 'react'
import {Image} from 'react-konva'

export default class MyImage extends Component {
  constructor(props) {
    super(props)
    this.state = {image: null}
  }

  render() {
    return (
      <Image
        image={this.state.image}
        x={this.props.cellSize * this.props.col}
        y={this.props.cellSize * this.props.row}
        width={100}
        height={100}
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

  onClick() {
    if (this.props.onClick) {
      this.props.onClick() 
    }
  }
}
