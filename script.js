document.getElementById('start-game').addEventListener('click', () => {
    const gridSize = parseInt(document.getElementById('grid-size').value);
    const winStreak = parseInt(document.getElementById('win-streak').value);

    if (winStreak > gridSize) {
        alert('Win streak cannot be greater than grid size.');
        return;
    }

    createBoard(gridSize);
    resetGame();
});

function createBoard(size) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 50px)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }
}

let currentPlayer = 'X';
let gameActive = true;
const boardState = [];

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('result').textContent = '';
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    boardState.length = 0;
}

function handleCellClick(event) {
    const cell = event.target;
    if (cell.textContent !== '' || !gameActive) return;

    const gridSize = parseInt(document.getElementById('grid-size').value);
    const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
    const row = Math.floor(cellIndex / gridSize);
    const col = cellIndex % gridSize;

    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (!boardState[row]) boardState[row] = [];
    boardState[row][col] = currentPlayer;

    if (checkWin(row, col, currentPlayer)) {
        document.getElementById('result').textContent = `${currentPlayer} wins!`;
        gameActive = false;
    } else if (checkDraw()) {
        document.getElementById('result').textContent = `It's a draw!`;
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin(row, col, player) {
    const winStreak = parseInt(document.getElementById('win-streak').value);
    return (
        countInDirection(row, col, 1, 0, player) + countInDirection(row, col, -1, 0, player) >= winStreak - 1 || // Horizontal
        countInDirection(row, col, 0, 1, player) + countInDirection(row, col, 0, -1, player) >= winStreak - 1 || // Vertical
        countInDirection(row, col, 1, 1, player) + countInDirection(row, col, -1, -1, player) >= winStreak - 1 || // Diagonal \
        countInDirection(row, col, 1, -1, player) + countInDirection(row, col, -1, 1, player) >= winStreak - 1 || // Diagonal /
        checkRectangles(player, winStreak) // Rectangular patterns
    );
}

function countInDirection(row, col, rowDir, colDir, player) {
    const gridSize = parseInt(document.getElementById('grid-size').value);
    let count = 0;

    for (let i = 1; i < gridSize; i++) {
        const newRow = row + i * rowDir;
        const newCol = col + i * colDir;
        if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) break;
        if (boardState[newRow] && boardState[newRow][newCol] === player) {
            count++;
        } else {
            break;
        }
    }
    return count;
}

function checkRectangles(player, winStreak) {
    const gridSize = parseInt(document.getElementById('grid-size').value);
    for (let row = 0; row <= gridSize - winStreak; row++) {
        for (let col = 0; col <= gridSize - winStreak; col++) {
            if (isRectangle(row, col, winStreak, player)) {
                return true;
            }
        }
    }
    return false;
}

function isRectangle(startRow, startCol, size, player) {
    for (let row = startRow; row < startRow + size; row++) {
        for (let col = startCol; col < startCol + size; col++) {
            if (!boardState[row] || boardState[row][col] !== player) {
                return false;
            }
        }
    }
    return true;
}

function checkDraw() {
    const cells = document.querySelectorAll('.cell');
    return Array.from(cells).every(cell => cell.textContent !== '');
}
