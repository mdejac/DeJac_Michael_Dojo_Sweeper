const _LEVEL = [
    {
      'row': 8,
      'col': 8,
      'width': '256px',
      'ninjas': 10
    },
    {
      'row': 16,
      'col': 16,
      'width': '512px',
      'ninjas': 40
    },
    {
      'row': 16,
      'col': 30,
      'width': '960px',
      'ninjas': 99
    }
];

let difficulty = 0;
let alive = true;
let tile_count = _LEVEL[difficulty].row * _LEVEL[difficulty].col;
let theDojo = new Array(_LEVEL[difficulty].row);
let playing_field = [];


function render(theDojo) {
  let result = "";
  for(let i=0; i<theDojo.length; i++) {
    for(let j=0; j<theDojo[i].length; j++) {
      result += `<button class="tatami" onclick="clickTile(${i}, ${j}, this)" oncontextmenu="setFlag(this)"></button>`;
    }
  }
  the_dojo.style.width = _LEVEL[difficulty].width;
  the_dojo.innerHTML =  result + 
    `<div id="controls">
        <button id="reset_button" onclick="reset()">restart</button>
        <label for="difficulty_selection">
          <p>Difficulty</p>
          <select id="difficulty_selection" onchange="reset(this.value)">
            <option>small</option>
            <option>medium</option>
            <option>large</option>
          </select>
        </label>
    </div>`;

  difficulty_selection.value = difficulty == 0 ? 'small' : difficulty == 1 ? 'medium' : 'large';
  playing_field = document.querySelectorAll('.tatami');
}
    

function clickTile(row, col, element) {
  if (alive && element.innerText != '🥷'){
    if (theDojo[row][col] == 0){
      clearTile(row, col); 
      if (tile_count == 0){
        endGame(row,col);
      } 
    } else if (alive){
      alive = false;
      endGame(row, col);
    }
  } 
}

function clearTile(row, col) {
  if (row < 0 || row >= _LEVEL[difficulty].row || col < 0 || col >= _LEVEL[difficulty].col || playing_field[row*_LEVEL[difficulty].col+col].style.backgroundColor == 'lightgray'){
    return;
  }
  playing_field[row*_LEVEL[difficulty].col+col].innerText = countBombs(row, col);
  playing_field[row*_LEVEL[difficulty].col+col].style.backgroundColor = 'lightgray'
  playing_field[row*_LEVEL[difficulty].col+col].style.boxShadow = "inset 2px 2px 5px black"
  tile_count--;
  if (playing_field[row*_LEVEL[difficulty].col+col].innerText == ''){
    for (let y=-1; y<=1; y++){
      for (let x=-1; x<=1; x++){
        clearTile(row+y, col+x);
      }
    }
  }
}

function countBombs(row, col){
  let count = 0;
  for (let y = row -1; y <= row + 1; y++){
    for (let x = col -1; x <= col + 1; x++){
      if ( y >= 0 && y <= _LEVEL[difficulty].row-1 && x >= 0 && x <= _LEVEL[difficulty].col-1 && theDojo[y][x] == '1'){
        count++
      }
    }
  }
  return count == 0 ? '' : count;
}

function endGame(row, col){
  for (let y = 0; y < _LEVEL[difficulty].row; y++){
    for (let x = 0; x < _LEVEL[difficulty].col; x++){
      if (theDojo[y][x] == 1) {
        playing_field[y*_LEVEL[difficulty].col + x].innerText = "🥷"
      } else if (playing_field[y*_LEVEL[difficulty].col + x].innerText == "🥷"){
        playing_field[y*_LEVEL[difficulty].col + x].innerText = "X"
      }
    }
  }
  if (!alive){
    playing_field[row*_LEVEL[difficulty].col + col].style.backgroundColor = "red";
  }
  alive = false;
}

document.oncontextmenu = function(e){
  e.preventDefault();
}

function setFlag(el){
  if (alive && el.style.backgroundColor != "lightgray") {
    el.innerText = el.innerText == '' ? '🥷' : el.innerText == '🥷' ? '❓' : ''; 
  }
}

function buildLevel(){
  for (let row = 0; row < _LEVEL[difficulty].row; row++){
    theDojo[row] = [];
    for (let col = 0; col < _LEVEL[difficulty].col; col++){
      theDojo[row][col] = 0;
    }
  }
}

function addNinjas(){
  let row, col = 0;
  for (let x = 0; x < _LEVEL[difficulty].ninjas; x++){
    row = Math.floor(Math.random() * _LEVEL[difficulty].row);
    col = Math.floor(Math.random() * _LEVEL[difficulty].col);
    if (theDojo[row][col] == 0){
      theDojo[row][col] = 1;
    } else {
      x--;
    }
  }
  tile_count-=_LEVEL[difficulty].ninjas;
}

function reset() {
  difficulty = difficulty_selection.value == 'small' ? 0 : difficulty_selection.value == 'medium' ? 1 : 2;
  alive = true;
  tile_count = _LEVEL[difficulty].row * _LEVEL[difficulty].col;
  theDojo = new Array(_LEVEL[difficulty].row);
  playing_field = [];
  startGame();
}

function startGame(){
  buildLevel();
  addNinjas();
  render(theDojo);
}

startGame();




