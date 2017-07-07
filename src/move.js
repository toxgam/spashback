import {directions} from './data'

export const bublePop = (board, queue, y, x) => {
  board[y][x] = 0

  for (let i = 0; i < 4; i++) {
    queue.push({row: y, col: x, direction: i})
  }
}

export const fly = (board, thisQueue, changed) => {
  let queue = []
  const size = board.length

  let combo = 0

  thisQueue.forEach(e => {
    const col = e.col + directions[e.direction][0]
    const row = e.row + directions[e.direction][1]

    if (row >= 0 && row < size && col >= 0 && col < size) {
      if (board[row][col] === 0) {
        queue.push({row: row, col: col, direction: e.direction})
      } else {
        board[row][col] += 1
        changed[row][col] = true

        if (board[row][col] > 4) {
          bublePop(board, queue, row, col)
          combo++
        }
      }
    }
  })

  thisQueue.length = 0
  queue.forEach(e => thisQueue.push(e))
  return combo
}
