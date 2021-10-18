import React, { Component } from 'react';
import './App.css';

function Hole(props){
  // hole in grid is button wrapped in 2 divs for styling
  return <div className="Hole"><div className={props.value}><button className="piece" /></div></div>
}

function Slat(props){
  // slat is a column in the grid
  // the column is an array of holes with key/value pairs
    return <div className="Slat" onClick={() => props.handleClick()}>
      {[...Array(props.holes.length)].map((x, j) => 
        <Hole key={j} value={props.holes[j]}></Hole>)}
      </div>
 }

// check if all 4 components are the same
function checkLine(a,b,c,d) {
  return ((a !== null) && (a === b) && (a === c) && (a === d));
}

// check winner by iterating through state of board
function checkWinner(bs) {
console.log(bs);
  for (let c = 0; c < 7; c++)
      for (let r = 0; r < 4; r++)
          if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
              return bs[c][r] + ' wins!'
  for (let r = 0; r < 6; r++)
       for (let c = 0; c < 4; c++)
           if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
               return bs[c][r] + ' wins!'
  return "";
}

class Grid extends Component {
  // constructor
  constructor() {
    super();
    // start with empty board, red starts, and all squares available
    this.state = {
      boardState: new Array(7).fill(new Array(6).fill(null)),
      playerTurn: 'Red',
      gameSelected: false,
      winner: '',
      remainingSquares: 42,
    }
  }

  // set up board once 'Play Game' button is clicked
  selectedGame(){
    this.setState({
       gameSelected: true, 
       boardState: new Array(7).fill(new Array(6).fill(null)),
       remainingSquares: 42,
    })
  }

  // readjust slat to make move
  makeMove(slatID){
    // create copy of board
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    if (boardCopy[slatID].indexOf(null) !== -1) {
      // change colour of filled hole
      let newSlat = boardCopy[slatID].reverse()
      newSlat[newSlat.indexOf(null)] = this.state.playerTurn
      newSlat.reverse()
      // decrement available holes
      const newRemaining = this.state.remainingSquares - 1;
      // set new board to copy, switch playerTurn
      this.setState({
        playerTurn: (this.state.playerTurn === 'Red') ? 'Yellow' : 'Red',
        boardState: boardCopy,
        remainingSquares: newRemaining,
      })
      console.log(this.state.remainingSquares)
    }
  }

  // allow make move if there is no winner
  handleClick(slatID) {
    if(this.state.winner === ''){
      this.makeMove(slatID)
    }
  }
  
  // check for winner or no remaining squares
  componentDidUpdate(){
    // if player has won game, set winner state
    let winner = checkWinner(this.state.boardState)
    if(this.state.winner !== winner){
      this.setState({winner: winner})
    }
    // if no open squares remain, set winner to Nobody
    if (this.state.remainingSquares===0) {
      alert("All holes are full");
      this.selectedGame();
    }
  }

  render(){
    // display winner message if winner exists
    let winnerMessageStyle
    if(this.state.winner !== ""){
      winnerMessageStyle = "winnerMessage appear"
    } else {
      winnerMessageStyle = "winnerMessage"
    }

    // put slats together to build grid
    let slats = [...Array(this.state.boardState.length)].map((x, i) => 
      <Slat 
          key={i}
          holes={this.state.boardState[i]}
          handleClick={() => this.handleClick(i)}
      ></Slat>
    )

    // return board if Play Game has been clicked
    // return Play Game button if no game is selected or if there is winner
    return (
      <div>
        {this.state.gameSelected &&
          <div className="Board">
            {slats}
          </div>
        }
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== '') &&
          <div>
            <button className="playButton" onClick={() => this.selectedGame()}>Play Game</button>
          </div>
        }
      </div>
    )
  }
}
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Game">
          <Grid />
        </div>
      </div>
    );
  }
}

export default App;