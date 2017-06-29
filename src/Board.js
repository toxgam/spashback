import React, {Component} from 'react'
import {Group, Line} from 'react-konva'

import Droplet from './Droplet'
import Bullet from './Bullet'
import {game} from './data'
import {bublePop, fly} from './move'

const MyLine = ({points, color, width}) => {
  return (
    <Line
      points={points}
      stroke={color}
      strokeWidth={width}
      lineCap="round"
      lineJoin="round"
    />
  )
}

export default class Board extends Component {
  state = {
    windowSize: Math.min(window.innerWidth, window.innerHeight),
    size: game.size,
    board: game.board,
    queue: []
  }

  tick = () => {
    let board = this.state.board
    let queue = this.state.queue

    if (queue.length > 0) {
      fly(board, queue)
      this.setState({board, queue})
    }
  }

  onDropletClick = (row, col) => {
    const board = this.state.board
    const queue = this.state.queue

    board[row][col] += 1

    if (board[row][col] > 4) {
      bublePop(board, queue, row, col)
    }

    this.setState({board, queue})

    setInterval(this.tick, 1000)
  }

  render() {
    const cellSize = this.state.windowSize / this.state.size
    const array = [...Array(this.state.size + 1).keys()]

    return (
      <Group>
        {array.map(idx =>
          <MyLine key={idx}
            points={[0, idx * cellSize, this.state.windowSize, idx * cellSize]}
            color="black"
            width={5}
          />
        )}

        {array.map(idx =>
          <MyLine key={idx}
            points={[idx * cellSize, 0, idx * cellSize, this.state.windowSize]}
            color="black"
            width={5}
          />
        )}

        {this.renderDroplets(cellSize)}

        {/*{this.state.queue.map((e, i) => (
          <Bullet 
            id={i}
            boardSize={this.state.size}
            queue={this.state.queue}
            cellSize={cellSize}
          />
        ))}*/}
      </Group>
    )
  }

  renderDroplets(cellSize) {
    const ret = []

    for (let row = 0; row < this.state.size; row++) {
      for (let col = 0; col < this.state.size; col++) {
        if (this.state.board[row][col] > 0) {
          ret.push(
            <Droplet 
              key={`${row}-${col}`}
              row={row}
              col={col}
              cellSize={cellSize}
              onClick={this.onDropletClick.bind(this)}
            />
          )
        }
      }
    }

    return ret          
  }
}