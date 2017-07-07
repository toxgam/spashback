import React, {Component} from 'react'
import {Group, Line, Text} from 'react-konva'

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

const boardEmpty = (board => {
  const array = board.reduce((a, b) => { return a.concat(b) })
  return array.reduce((a, b) => { return a + b }) === 0
})

const reset = (changed => {
  for (let i = 0; i < changed.length; i++) {
    for (let j = 0; j < changed[i].length; j++) {
      changed[i][j] = false
    }
  }
})

const noChange = (changed => {
  changed.reduce((ret, e) => {return ret || e.reduce((ret,f) => {return ret || f}, false)}, false)
})

const genNum = 6
const loopNum = 0

export default class Board extends Component {
  constructor(props) {
    super(props)

    if (localStorage.getItem("level") === null) {
      localStorage.level = 0
      localStorage.score = 5
    }

    this.level = parseInt(localStorage.level)
    this.score = parseInt(localStorage.score)

    if (this.level > 1) {
      this.level = 1
    }

    this.state = {
      board: game.board[this.level],
      queue: [],
      changed: Array(game.size).fill('dummy').map(() => Array(game.size).fill(false)),
      generation: undefined,
      loopCount: undefined
    }

    this.size = game.size
    this.windowSize = Math.min(window.innerWidth, window.innerHeight)
  }

  onDropletClick = (row, col) => {
    const board = this.state.board
    const queue = this.state.queue
    const changed = this.state.changed

    this.score--

    board[row][col] += 1
    changed[row][col] = true

    if (board[row][col] > 4) {
      bublePop(board, queue, row, col)
    }

    const loop = (maxGeneration, loopCount, generationCount, onDone) => {
      if (generationCount < 0) {
        loopCount -= 1
        generationCount = maxGeneration
      }

      if (loopCount < 0) {
        onDone()
        return
      }
      
      this.setState({
        board, 
        queue, 
        changed, 
        generation: maxGeneration - generationCount, 
        loopCount: loopNum - loopCount
      })
      setTimeout(loop.bind(this, maxGeneration, loopCount, generationCount - 1, onDone), 10)
    }

    const onDone = () => {
      reset(changed)
      if (fly(board, queue, changed) >= 2) {
        this.score++
      }

      if (queue.length > 0 && !noChange(changed)) {
        start()
      } else {
        this.setState({board, queue})
        if (boardEmpty(this.state.board)) {
          alert(`level ${this.level + 1} completed`)
          localStorage.level = this.level + 1
          localStorage.score = this.score
          window.location = window.location
        } else if (this.score <= 0) {
          alert("You lose")
          localStorage.removeItem("level")
          localStorage.removeItem("score")
          window.location = window.location
        }
      }
    }

    const start = () => {
      loop(genNum - 1, loopNum, genNum - 1, onDone.bind(this))
    }

    start()
  }

  render() {
    const displaySize = this.windowSize * 0.8
    const cellSize = displaySize / this.size
    const array = [...Array(this.size + 1).keys()]

    return (
      <Group>
        <Text text={"Droplet: " + this.score} align="left" padding={10} />
        <Text text={"Score: " + (this.level + 1)} width={displaySize} align="right" padding={10} />
        <Group x={this.windowSize  * 0.1} y={this.windowSize * 0.1}>
          {array.map(idx =>
            <MyLine key={idx}
              points={[0, idx * cellSize, displaySize, idx * cellSize]}
              color="black"
              width={5}
            />
          )}

          {array.map(idx =>
            <MyLine key={idx}
              points={[idx * cellSize, 0, idx * cellSize, displaySize]}
              color="black"
              width={5}
            />
          )}

          {this.renderDroplets(cellSize)}

          {this.renderBullets(cellSize)}
        </Group>
      </Group>
    )
  }

  renderDroplets(cellSize) {
    const ret = []

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        ret.push(
          <Droplet 
            key={`${row}-${col}`}
            row={row}
            col={col}
            value={this.state.board[row][col]}
            gen={this.state.changed[row][col] ? this.state.generation : undefined}
            cellSize={cellSize}
            onClick={this.onDropletClick.bind(this)}
          />
        )
      }
    }

    return ret         
  }

  renderBullets(cellSize) {
    const ret = []

    for (let i = 0; i < this.state.queue.length; i++) {
      const e = this.state.queue[i]

      if (!this.state.changed[e.row][e.col]) {
        ret.push(
          <Bullet 
            row={e.row}
            col={e.col}
            direction={e.direction}
            gen={this.state.generation + this.state.loopCount * genNum}
            cellSize={cellSize}
          />
        )
      }
    }

    return ret         
  }
}
