import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      level: 1,
      lives: 0,
      counter: 0,
      clickCount: 1
    }
  }
  // #696D32

  filterClicks = (id, el) => {
    console.log(this.state.clickCount)
    let selectable = document.getElementsByClassName('selectable')
    if (selectable.length === 0) {
      this.clearBoard()
      return this.startLevel(id, el)
    } else if (el.target.classList.contains('selectable')) {
      let fieldCount = parseInt(el.target.getAttribute('count'))
      if (fieldCount === this.state.clickCount) {
        el.target.classList.remove('selectable')
        el.target.classList.add('selected')
        el.target.classList.add('selected')
        let count = this.state.clickCount
        count++
        this.setState({ clickCount: count })
        if (selectable.length === 0) {
          this.setState({ clickCount: 1 })
          this.clearBoard()
          let newLevel = this.state.level + 1
          this.setState({ level: newLevel })
          alert('Congratulations! You passed level ' + this.state.level + '!')
        }
      } else {
        let newLevel = this.state.level - 1;
        this.setState({level: newLevel})
        this.clearBoard()
        alert('You missed the correct field! Back to level ' + this.state.level + '!')
      }
    } else {
      alert('Wrong field! You failed!')
    }
  }

  clearBoard = () => {
    let selected = document.getElementsByClassName('selected')
    let selectable = document.getElementsByClassName('selectable')
    let child = document.getElementsByClassName('counter')
    while (child[0]) {
      child[0].parentNode.removeChild(child[0])
    }
    while (selected[0]) {
      selected[0].removeAttribute('count')
      selected[0].classList.remove('selected')
    }
    while (selectable[0]) {
      selectable[0].classList.remove('selectable')
    }
    return
  }

  startLevel = (id, el) => {
    let field = el.target
    field.classList.add('selected')
    // let newLevel = this.state.level + 1
    // this.setState({ level: newLevel }, () => this.setNextField(id))
    this.setNextField(id)
  }

  setNextField = (id) => {
    let x = parseInt(id.split('/')[0])
    let y = parseInt(id.split('/')[1])
    let count = this.state.counter
    count++
    this.setState({ counter: count }, () => this.getNextFields(x, y, count))
  }

  fieldIsNotSelected = (id) => {
    return document.getElementById(id).classList.contains('selected') || document.getElementById(id).classList.contains('selectable')  ? false : true
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
      return fields
    })
    if (fields.length === 0) {
      alert('No more selectable fields!')
      return
    }
    this.generateClickableFields(fields, count)
  }

  generateClickableFields = (fields, count) => {
    let field = fields[Math.floor(Math.random() * fields.length)]
    field.setAttribute('count', count)
    let countNum = document.createElement('span')
    let text = document.createTextNode(count)
    countNum.classList.add('counter')
    countNum.appendChild(text)
    field.appendChild(countNum)
    if (!field.classList.contains('selected')) {
      field.classList.add('selectable')
    }
    if (this.state.counter < this.state.level) {
      this.setNextField(field.getAttribute('id'))
    }
    else {
      // reset counter?
      let counter = 0
      this.setState({ counter: counter })
    }
  }


  createGrid = (x) => {
    let grid = []
    for (let row = 0; row < x; row++) {
      for (let col = 0; col < x; col++) {
        let id = row + "/" + col
        grid.push(<div className="cell" key={id} id={id} style={{ width: '8.8vh', height: '8.8vh' }} onClick={this.filterClicks.bind(this, id)} ></div>)
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
          <h4 className="stats-title">Game stats:</h4>
          <div className="stats">
            <h6 className="game-stats">Timer: 15 seconds</h6>
            <h6 className="game-stats">Left to click: 15</h6>
            <h6 className="game-stats">Lives: {this.state.lives}</h6>
            <h6 className="game-stats">Level: {this.state.level}</h6>
          </div>
        </footer>

      </div>
    );
  }
}
