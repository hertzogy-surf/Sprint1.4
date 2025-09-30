console.log('minesweeper')

const IMG_FLAG = `<img src="img/flag.png">`
const IMG_MINE = `<img src="img/mine.jpeg">`



const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gInterval = null

var gBoard


function onInit(size) {
    console.log('hi')
    gLevel.SIZE = size ** 0.5
    gGame.isOn = true
    gGame.secsPassed = 0
    gGame.markedCount = 0

    if (gInterval) {
        clearInterval(gInterval)
        gInterval = null
    }

    gBoard = buildBoard(gLevel.SIZE)
    setMinesOnBoard()
    console.log(gBoard)


    setMinesTd()
    setTimerTd()

    setMinesNegsCount()
    renderBoard()


}

function setMinesOnBoard() {
    var idOnBoard = []
    for (var i = 1; i <= gLevel.SIZE ** 2; i++) {
        idOnBoard.push(i)
    }
    var randIdxes = []

    switch (gLevel.SIZE) {
        case 4:
            gLevel.MINES = 2
            break;
        case 5:
            gLevel.MINES = 7
            break;
        case 6:
            gLevel.MINES = 12
            break;
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdx = getRandomIntInclusive(0, idOnBoard.length - 1)
        randIdxes.push(idOnBoard[randIdx])
        idOnBoard.splice(randIdx, 1)
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            for (var k = 0; k < gBoard.length; k++) {
                if (gBoard[k][j].id === randIdxes[i]) gBoard[k][j].isMine = true
            }
        }
    }
    console.log(randIdxes)
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function setMinesTd() {
    var elTdMines = document.querySelector('#mines')
    elTdMines.innerText = gLevel.MINES
}

function setTimerTd() {
    var elTdTimer = document.querySelector('#timer')
    elTdTimer.innerText = gGame.secsPassed
}

function buildBoard(size) {
    var board = []
    var id = 0
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            id++
            board[i].push(createGameObject(id))
        }
    }
    return board
}

function createGameObject(id) {
    return { id: id, minesAroundCount: 4, isRevealed: false, isMine: false, isMarked: false }
}

function setMinesNegsCount() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            var currCell = gBoard[i][j]
            if (currCell.isMine) continue
            currCell.minesAroundCount = 0

            for (var k = i - 1; k <= i + 1; k++) {
                if (k < 0 || k === gBoard.length) continue
                for (var l = j - 1; l <= j + 1; l++) {
                    if (l < 0 || l === gBoard[0].length) continue
                    if (gBoard[k][l].isMine) currCell.minesAroundCount++
                }
            }

        }
    }

}

function renderBoard() {

    var elBody = document.querySelector('.body')
    var strHtml = ``

    for (var i = 0; i < gLevel.SIZE; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < gLevel.SIZE; j++) {
            strHtml += `<td class="cell cell-${i}-${j} unrevealed" onclick="onCellClicked(this, event, ${i}, ${j})">${gBoard[i][j].minesAroundCount}</td>`
        }
        strHtml += `</tr>`

    }
    elBody.innerHTML = strHtml

}

function setTimer() {

    gGame.secsPassed++
    setTimerTd()
}

function onCellClicked(elCell, ev, i, j) {
    if (!gGame.isOn) return

    if (!gInterval) {
        gInterval = setInterval(setTimer, 1000)

    }


    if (ev.ctrlKey) {
        markCell(elCell, i, j)
    }
    else {
        revealCell(elCell, i, j)
        expandReveal(i, j)
    }
}

function markCell(elCell, i, j) {
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        elCell.innerHTML = IMG_FLAG
    } else {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        elCell.innerHTML = ''
    }

    //setMinesTd()
    var elMines = document.querySelector('#mines')
    elMines.innerText = gLevel.MINES - gGame.markedCount
}

function revealCell(elCell, i, j) {

    gBoard[i][j].isRevealed = true
    gGame.revealedCount++
    elCell.classList.remove('unrevealed')
    if (gBoard[i][j].minesAroundCount !== 0) {

        elCell.classList.add('revealed')
    }
    else {
        elCell.classList.add('revealed-zero')
    }
    if (gBoard[i][j].isMine) {
        elCell.innerHTML = IMG_MINE
        clearInterval(gInterval)
        gInterval = null
        gGame.isOn = false
        return
    }

}

function checkGameOver() {

}

function expandReveal(i, j) {
    console.log('hi')
    for (var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k === gBoard.length) continue
        for (var l = j - 1; l <= j + 1; l++) {

            if (l < 0 || l === gBoard.length) continue
            if (k === i && l === j) continue
            if (gBoard[k][l].isMine) continue
            var classSelector = `.cell-${k}-${l}`
            var elCell = document.querySelector(classSelector)
            revealCell(elCell, k, l)
            
        }
    }
} d