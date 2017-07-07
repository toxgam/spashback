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

export default class Board extends Component {
  state = {
    windowSize: Math.min(window.innerWidth, window.innerHeight),
    size: game.size,
    board: game.board,
    queue: [],
    changed: Array(game.size).fill('dummy').map(() => Array(game.size).fill(false)),
    generation: undefined,
    loopCount: undefined
  }

  onDropletClick = (row, col) => {
    const board = this.state.board
    const queue = this.state.queue
    const changed = this.state.changed

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
      
      this.setState({board, queue, changed, generation: maxGeneration - generationCount, loopCount: 2 - loopCount})
      setTimeout(loop.bind(this, maxGeneration, loopCount, generationCount - 1, onDone), 500)
    }

    const onDone = () => {
      reset(changed)
      fly(board, queue, changed)

      if (queue.length > 0 && !noChange(changed)) {
        start()
      } else {
        this.setState({board, queue})
      }
    }

    const start = () => {
      loop(5, 2, 5, onDone.bind(this))
    }

    start()

    if (boardEmpty) {
      console.log("Congrat!")
    }
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

        {this.renderBullets(cellSize)}

        {/*<Bullet 
          //key={`33`}
          row={3}
          col={3}
          direction={0}
          gen={this.state.generation}
          cellSize={cellSize}
        />

          <Bullet
            //key={`34`}
            row={3}
            col={3}
            direction={1}
            gen={this.state.generation}
            cellSize={cellSize}
          />*/}

      </Group>
    )
  }

  renderDroplets(cellSize) {
    const ret = []

    for (let row = 0; row < this.state.size; row++) {
      for (let col = 0; col < this.state.size; col++) {
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
            gen={this.state.generation + this.state.loopCount * 6}
            cellSize={cellSize}
          />
        )
      }
    }

    return ret         
  }
}
