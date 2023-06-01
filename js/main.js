'use strict'


const LIFE = '💓'
const NORMAL = '😀'
const DEAD = '😒'
const WON = '😎'



const gLevel = {
  SIZE: 4,
  MINES: 2,
  LIVES: 3,
  HINTS: 3,
  SAFECLICK: 3
}

const gGame = {
  isOn: false,
  hintIson: false,
  safeClickIson: false,
  manuallyCreateMode: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  mineCount: 0,
  markedMines: 0
}

var gFirstClick
var timerId
var hintIntervalId
var finalScore
var gCountMinesforManually
var gMoveMemoryArray 


function onInit() {

  gGame.isOn = true
  gFirstClick = false
  finalScore = 0 // for Best Score task
  gCountMinesforManually = 10 // for Manually positioned mines task -> board.js
  gMoveMemoryArray = [] // for undo task
  gBoard = createBoard()
  renderBoard(gBoard)
  manageLives()
  manageSmiley(NORMAL)
  
  initializeHighScore()
  saveHighScore()
  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
  console.log(gGame.manuallyCreateMode)
  

  // clearStorage()
  // localStorage.clear()
}


function checkGameOver(i, j) {

  //Duplicated code, will fix later!

  console.log('Check gameover')

  var elModal = document.querySelector('.modal')
  const cell = gBoard[i][j]

  if (cell.isMine && cell.isShown) {
    gLevel.LIVES--
    manageLives()
  }
  if (gGame.shownCount === Math.pow(gLevel.SIZE, 2) - gGame.mineCount) {
    elModal.innerHTML = 'You WON'
    elModal.style.display = 'block'
    gGame.isOn = false
    manageSmiley(WON)
    clearInterval(timerId)
    saveHighScore(finalScore)

  }
  if (gLevel.LIVES === 0) {
    revealMines()
    elModal.innerHTML = 'You LOST'
    elModal.style.display = 'block'
    gGame.isOn = false
    manageSmiley(DEAD)
    clearInterval(timerId)
    saveHighScore(finalScore)
  }

}

function manageLives() {

  var livesHTML = 'Lives: '

  for (var i = 0; i < gLevel.LIVES; i++) {
    livesHTML += LIFE
  }

  document.querySelector('.lives').innerHTML = livesHTML

}

function manageSmiley(emoji) {

  var smiley = document.querySelector('.smiley')
  smiley.innerHTML = emoji
}

function manageDifficulty(elBtn) {

  gLevel.SIZE = elBtn
  if (gLevel.SIZE === 6) {
    gGame.manuallyCreateMode = true
    document.querySelector('.manual').style.display = 'block'
  }
  gGame.isOn = false
  resetStats()
  onInit()

}

function getDiffucaltyLevel() {

  if (gLevel.SIZE === 4) return "Easy"
  else if (gLevel.SIZE === 8) return "Medium"
  else if (gLevel.SIZE === 12) return "Hard"
  else if (gLevel.SIZE === 6) return "Manually"

}

function resetStats() {

  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.mineCount = 0
  gGame.markedMines = 0
  gLevel.LIVES = 3

  clearInterval(timerId)

}

function manageHints(elImg) { 

  elImg.style.backgroundColor = '#111'
  gLevel.HINTS--
  gGame.hintIson = true

}

function safeClick() {

  if (!gLevel.SAFECLICK) return

  document.querySelector('p span').innerHTML = --gLevel.SAFECLICK

  const emptyPos = getEmptyPos()
  renderCell(emptyPos, FLAG, 'coverd')

  setTimeout(() => {
    renderCell(emptyPos, '', 'coverd')
  }, 1000);

}

function undoMove(){

if(gMoveMemoryArray.length === 0) return

var prevMove = gMoveMemoryArray.pop()
gBoard = copyBoard(prevMove)

updateNegsCount()
renderBoard(gBoard)

}

function timer(init = 0) {
  //crappy timer need to improve
  var sec = init;
  var clock = document.querySelector('.clock')
  timerId = setInterval(function () {
    sec += 1;
    clock.innerHTML = 'TIME : ' + sec;
    finalScore++
  }, 1000);


}

function saveHighScore(score) {

  var difficultyLevel = getDiffucaltyLevel()
  if (typeof (Storage) !== "undefined") {
    var existingHighScore = localStorage.getItem(difficultyLevel);
    var displayHighScore = document.querySelector('.best_score')
    if (existingHighScore === null || score > parseInt(existingHighScore)) {
      localStorage.setItem(difficultyLevel, score);
      console.log("New high score reached: " + difficultyLevel + '=>' + score);
    } else {
      console.log("Score is not higher than the existing high score.");
    }
  } else {
    console.log("Local storage is not supported.");
  }

  displayHighScore.innerHTML = 'Best score : ' + existingHighScore

}

function initializeHighScore() {
  var difficultyLevel = getDiffucaltyLevel()
  if (typeof (Storage) !== "undefined") {
    var existingHighScore = localStorage.getItem(difficultyLevel);

    if (existingHighScore === null) {
      localStorage.setItem(difficultyLevel, 0);
    }
  } else {
    console.log("Local storage is not supported.");
  }
}



