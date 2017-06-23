import React, {Component} from 'react'
import {Group, Line, Text, Rect} from 'react-konva'

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

const MyText = ({id, boardSize, board, cellSize}) => {
  const row = Math.floor((id - 1) / boardSize)
  const col = (id - 1) % boardSize

  return (
    <Text
      x={cellSize * col + cellSize / 2}
      y={cellSize * row + cellSize / 2}
      text={board[row][col]}
      fontSize={30}
      fill='blue'
    />
  )
}

const sleep = (miliseconds) => {
  const currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
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

  onMouseDown = (e) => {
    const cellSize = this.state.windowSize / this.state.size

    const x = Math.floor(e.evt.x / cellSize)
    const y = Math.floor(e.evt.y / cellSize)

    let board = this.state.board
    let queue = this.state.queue

    board[y][x] += 1

    if (board[y][x] > 4) {
      bublePop(board, queue, y, x)
    }

    this.setState({board, queue})

    setInterval(this.tick, 1000)
  }

  render () {
    const cellSize = this.state.windowSize / this.state.size
    const array = [...Array(this.state.size + 1).keys()]
    const data = Array(this.state.size).fill(Array(this.state.size).fill(0))

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

        {data.map((e, i) => (e.map((e1, i1) => (
          <MyText 
            id={i * this.state.size + i1 + 1}
            boardSize={this.state.size}
            board={this.state.board}
            cellSize={cellSize}
          />
        ))))}

        <Rect
          x={0}
          y={0}
          width={this.state.windowSize}
          height={this.state.windowSize}
          onMouseDown={this.onMouseDown}
        />
      </Group>
    )
  }
}