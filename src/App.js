import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      level: 0,
      selected: false,
      startFieldClass: 'start-field',
      selectableClass: 'selectable'
    }
  }

  testSelectableFields = () => {
    let elements = document.getElementsByClassName('cell')
    for (let i = 0; i < elements.length; i++) {
      let isSelectable = elements[i].classList.contains('selectable');
      console.log(isSelectable)
      return isSelectable
    }
  }

  fildIsAvailable = (id) => {
    return document.getElementById(id).classList.contains('selectable') ? false : true
  }

  setNewField = (id, el) => {
    // console.log('set new field')
    if (this.state.level === 0) {
      el.target.classList.add('start-field')
      el.target.style.backgroundColor = 'black'
      this.setNextFields(id)
    } else if (this.state.level > 0 && el.target.classList.contains('selectable')) {
      el.target.style.backgroundColor = 'black'
      el.target.classList.remove('selectable')
      this.setNextFields(id)
    } else {
      alert('This is not selectable!')
    }
  }

  setNextFields = (id) => {
    let x = parseInt(id.split('/')[0])
    let y = parseInt(id.split('/')[1])
    let newLevel = this.state.level + 1
    this.setState({ level: newLevel })
    this.getNextField(x, y)
  }

  getNextField = (x, y) => {
    // console.log('get next field')
    let clickableFields = []
    clickableFields.push([x - 3, y], [x + 3, y], [x, y - 3], [x, y + 3], [x - 2, y - 2], [x - 2, y + 2], [x + 2, y - 2], [x + 2, y + 2])
    let fields = []
    clickableFields.map((pos) => {
      if ((pos[0] >= 0 && pos[0] <= 9) && (pos[1] >= 0 && pos[1] <= 9) && this.fildIsAvailable(pos[0] + "/" + pos[1])) {
        let clickableFieldsIds = pos[0] + '/' + pos[1]
        fields.push(document.getElementById(clickableFieldsIds))
        return fields;
      }
    })
    let item = fields[Math.floor(Math.random() * fields.length)]
    item.style.backgroundColor = 'lightgray'
    item.classList.add('selectable')
  }

  createGrid = (x) => {
    let grid = []
    for (let row = 0; row < x; row++) {
      for (let col = 0; col < x; col++) {
        let id = row + "/" + col
        grid.push(<div className={this.state.selected ? 'cell selected' : 'cell'} key={id} id={id} style={{ width: '8.8vh', height: '8.8vh', backgroundColor: 'white' }} onClick={this.setNewField.bind(this, id)} ></div>)
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
          <h6 className="game-stats">Lives: 15</h6>
          <h6 className="game-stats">Level: {this.state.level}</h6>
        </footer>

      </div>
    );
  }
}
