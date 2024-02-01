// Function that returns all diagonally adjacent squares in front of a certain starting square
function checkDiagonals(start) {
    const row = Math.floor((63 - start) / width) + 1;
    const col = start % width;

    // Get the id for the diagonally adjacent squares, store it in the array
    const diagonalSquares = [];

    // Check top-left
    if (row > 1 && col > 0) {
        diagonalSquares.push((width - (row - 1)) * width + col - 1);
    }

    // Check top-right
    if (row > 1 && col < 7) {
        diagonalSquares.push((width - (row - 1)) * width + col + 1);
    }

    return diagonalSquares;
};


// Function to check if the move is 1 square diagonally adjacent, and not backwards
// A jump move of 2 squares is disabled by default if there aren't any opponent's piece(s) to capture
function validMove(target, mandatoryJump = false) {
    const end = target.getAttribute("square-id");
    const start = parseInt(startPositionId);

    const startRow = Math.floor((63 - start) / width) + 1;
    const endRow = Math.floor((63 - end) / width) + 1;
    const startCol = start % width;
    const endCol = end % width;

    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);

    // Allow either a jump move (2 diagonal squares) or a regular move (1 diagonal square)
    if (mandatoryJump) {
        return rowDiff === 2 && colDiff === 2 && endRow < startRow;
    } else {
        return rowDiff === 1 && colDiff === 1 && endRow < startRow;
    }
};


// Function that checks whether there is an opponent piece in a square diagonally adjacent
// If yes it is mandatory to make a jump move
function checkMandatoryJump(opponentTurn) {
    const start = parseInt(startPositionId);

    const squareIds = checkDiagonals(start);

    console.log("Diagonally adjacent square id's:", squareIds);

    for (const id of squareIds) {
        const square = document.querySelector(`[square-id="${id}"]`);
        const takenByOpponent = square.firstChild?.firstChild.classList.contains(opponentTurn);

        if (takenByOpponent) {
            const opponentPiece = square;

            if (opponentPiece) {
                return opponentPiece;
            } else {
                return null;
            }
        }
    };
};








