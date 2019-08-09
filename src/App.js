import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      level: 0,
      lives: 0,
      counter: 0
    }
  }
  // #696D32
  fieldIsNotSelected = (id) => {
    return document.getElementById(id).classList.contains('selected') ? false : true
  }

  startLevel = (id, el) => {
    let field = el.target
    field.classList.add('selected')
    let newLevel = this.state.level + 1
    let lives = this.state.lives + 1
    this.setState({ level: newLevel, lives: lives }, () => this.setNextField(id))
  }

  setNextField = (id) => {
    let x = parseInt(id.split('/')[0])
    let y = parseInt(id.split('/')[1])
    let count = this.state.counter
    count++
    this.setState({ counter: count }, () => this.getNextFields(x, y, count))
  }

  getNextFields = (x, y, count) => {
    let clickableFields = []
    clickableFields.push([x - 3, y], [x + 3, y], [x, y - 3], [x, y + 3], [x - 2, y - 2], [x - 2, y + 2], [x + 2, y - 2], [x + 2, y + 2])
    let fields = []
    clickableFields.map((pos) => {
      if ((pos[0] >= 0 && pos[0] <= 9) && (pos[1] >= 0 && pos[1] <= 9) && this.fieldIsNotSelected(pos[0] + "/" + pos[1])) {
        let clickableFieldsIds = pos[0] + '/' + pos[1]
        fields.push(document.getElementById(clickableFieldsIds))
      }
    })
    if (fields.length === 0) {
      alert('No more selectable fields!')
      return
    }
    let item = fields[Math.floor(Math.random() * fields.length)]
    let countNr = document.createElement('span')
    let text = document.createTextNode(count)
    countNr.classList.add('counter')
    countNr.appendChild(text)
    item.appendChild(countNr)
    if (!item.classList.contains('selected')) {
      item.classList.add('selectable')
    }
    if (this.state.counter < this.state.level) {
      this.setNextField(item.getAttribute('id'))
    } else {
      let count = this.state.counter
      count = 0
      this.setState({ counter: count })
    }
  }

  createGrid = (x) => {
    let grid = []
    for (let row = 0; row < x; row++) {
      for (let col = 0; col < x; col++) {
        let id = row + "/" + col
        grid.push(<div className="cell" key={id} id={id} style={{ width: '8.8vh', height: '8.8vh' }} onClick={this.startLevel.bind(this, id)} ></div>)
      };
    };
    return grid
  };

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="title">Click game</h1>
        </header>

        <main className="App-body">
          {this.createGrid(10)}
        </main>

        <footer className="App-footer">
          <h4 className="game-stats">Game stats:</h4>
          <h6 className="game-stats">Timer: 15 seconds</h6>
          <h6 className="game-stats">Left to click: 15</h6>
          <h6 className="game-stats">Lives: {this.state.lives}</h6>
          <h6 className="game-stats">Level: {this.state.level}</h6>
        </footer>

      </div>
    );
  }
}
