import React, {Component} from 'react'
import {Image} from 'react-konva'

export default class Droplet extends Component {
  constructor(props) {
    super()
    
    this.state = {
      image: undefined
    }

    this.props = props
    this.count = undefined
  }

  render() {
    const size = this.props.cellSize * 9
    const x = this.props.cellSize * this.props.col + 10
    const y = this.props.cellSize * this.props.row + 10

    return (
      <Image
        image={this.state.image}
        x={x}
        y={y}
        width={size}
        height={size}
        onClick={this.props.onClick.bind(this, this.props.row, this.props.col)}
      />
    )
  }

  componentWillMount() {
    const imageObj = new window.Image()

    imageObj.src = "./" + this.props.value + "to" + this.props.value + "/" + 0 + ".svg"

    imageObj.onload = () => {
      this.setState({image: imageObj})
    }
  }

  componentWillReceiveProps(nextProps) {
    const imageObj = new window.Image()

    if (nextProps.gen !== undefined) {
      const dir = this.props.value + "to" + nextProps.value
      imageObj.src = "./" + dir + "/" + nextProps.gen + ".svg"
    } else {
      imageObj.src = "./" + this.props.value + "to" + this.props.value + "/" + 0 + ".svg"
    }

    imageObj.onload = () => {
      this.setState({image: imageObj})
    }
  }
}
