import {fly, bublePop, boardEmpty} from './move'

const size = 5

const random = ((n) => {
  return Math.floor(Math.random() * (n + 1))  
})

const click = ((board, i, j) => {
  board[i][j]++

  const queue = []
  const changed = Array(size).fill('dummy').map(() => Array(size).fill(false))
  
  if (board[i][j] > 4) {
    bublePop(board, queue, i, j)
  }

  while (queue.length > 0) {
    fly(board, queue, changed)
  }
})

const unclick = ((board, i, j) => {
  if (board[i][j] === 0) {
    board[i][j] = 4
  } else {
    board[i][j]--
  }
})

export const gameBoard = ((level, thisMove) => {
  const move = Math.floor(level / 5) + 3

  const board = Array(size).fill('dummy').map(() => Array(size).fill(0))

  const feasible = ((thisBoard, move) => {
    if (boardEmpty(thisBoard)) {
      return true
    }

    if (move === 0) {
      return false
    }

    const board = Array(size).fill('dummy').map(() => Array(size).fill(0))
    board.map((e, i) => {
      return e.map((f, j) => {
        return thisBoard[i][j]
      })
    })

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] > 0) {
          click(board, i, j)

          if (feasible(board, move - 1)) {
            unclick(board, i, j)
            return true
          }

          board.map((e, i) => {
            return e.map((f, j) => {
              board[i][j] = thisBoard[i][j]
            })
          })
        }
      }
    }

    return false
  })

  do {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        board[i][j] = random(4)
      }
    }
  } while (feasible(board, move))

  return board
})