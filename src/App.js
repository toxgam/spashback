import React, { Component } from 'react'
import {Stage, Layer} from 'react-konva'

import Board from './Board'

class App extends Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Board />
        </Layer>
      </Stage>
    )
  }
}

export default App;
