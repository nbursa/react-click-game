import React, { Component } from 'react';
import './App.scss';

const initialState = {
  level: 1,
  lives: 1,
  counter: 0,
  clickCount: 1,
  modal: false
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      level: 1,
      lives: 1,
      counter: 0,
      clickCount: 1,
      modal: false,
      modalText: '',
      timer: 2
    }
  }
  // #696D32


  filterClicks = (id, el) => {
    // console.log(this.state.clickCount)
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
          let lives = this.state.lives + 1;
          this.setState({ lives: lives })
          let modalText = <div>
            <h4>Congratulations!</h4>
            <h3>You passed level <span> {this.state.level}</span></h3>
            <h3>Lives count is <span> {this.state.lives + 1}</span></h3>
          </div>
          this.setState({ modal: !this.state.modal, modalText: modalText })
        }
      } else {
        this.errored()
      }
    } else {
      // alert('Wrong field! You failed!')
      this.errored()
    }
  }

  setTO = (timeout) => {
    // let selectable = document.getElementsByClassName('selectable')
    // console.log(selectable.length)
    // this.setTO(selectable.length * 2000)
    setTimeout(() => {
      return this.errored();
    }, timeout);
  }

  errored = () => {
    let selectable = document.getElementsByClassName('selectable');
    let newLives = this.state.lives - selectable.length;
    newLives < 1 ? this.setState(initialState) : this.setState({ lives: newLives });
    this.clearBoard();
    let modal = !this.state.modal;
    let modalTxt = <div>
      <h4>You missed the correct field!</h4>
      <h3>Back to level <span> {this.state.level}</span></h3>
      <h3>Lives left <span> {(newLives < 1 ? 1 : newLives)}</span></h3>
    </div>
    this.setState({ modal: modal, modalText: modalTxt });
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
    // let selectable = document.getElementsByClassName('selectable').length + 1
    // console.log('start ', selectable)
    // this.setTO(selectable * 2000)
    this.setNextField(id)
    let selectable = document.getElementsByClassName('selectable').length + 1
    console.log('start ', selectable)
  }

  setNextField = (id) => {
    let x = parseInt(id.split('/')[0])
    let y = parseInt(id.split('/')[1])
    let count = this.state.counter
    count++
    this.setState({ counter: count }, () => this.getNextFields(x, y, count))
    let selectable = document.getElementsByClassName('selectable') + 1
    console.log('setnextfield ', selectable.length)
  }

  fieldIsNotSelected = (id) => {
    return document.getElementById(id).classList.contains('selected') || document.getElementById(id).classList.contains('selectable') ? false : true
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
    // let selectable = document.getElementsByClassName('selectable') + 1
    // console.log('getnextfields ', selectable.length)
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

  toggleModal = () => {
    let state = !this.state.modalText;
    this.setState({ modal: state })
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
    let modalState = this.state.modal;

    return (
      <div className="App">

        <header className="App-header">
          <h1 className="title">Click game</h1>
        </header>

        <main className="App-body">
          {this.createGrid(10)}

          {
            modalState && (
              <div className="modal-backdrop" onClick={() => this.toggleModal()}>
                <div className="modal">
                  {/* <div className="modal-header">
                      <span className="close" onClick={() => this.toggleModal()}></span>
                    </div> */}
                  <div className="modal-body">{this.state.modalText}</div>
                  <div className="modal-footer"></div>
                </div>
              </div>
            )
          }
        </main>

        <footer className="App-footer">
          <h4 className="stats-title">Game stats:</h4>
          <div className="stats">
            <h6 className="game-stats">Timer: <span className="game-stats-value">15</span> seconds</h6>
            <h6 className="game-stats">Left to click: <span className="game-stats-value">{document.getElementsByClassName('selectable').length}</span></h6>
            <h6 className="game-stats">Lives: <span className="game-stats-value">{this.state.lives}</span></h6>
            <h6 className="game-stats">Level: <span className="game-stats-value">{this.state.level}</span></h6>
          </div>
        </footer>

      </div>
    );
  }
}
