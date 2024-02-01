// Function to check if the move is 1 square diagonally adjacent, and not backwards
// A jump move of 2 squares is disabled if there aren't any opponent's piece(s) to capture
function validMove(target, opponentPiece = false) {
    const end = target.getAttribute("square-id");
    const start = parseInt(startPositionId);

    const startRow = Math.floor((63 - start) / width) + 1;
    const endRow = Math.floor((63 - end) / width) + 1;
    const startCol = start % width;
    const endCol = end % width;

    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);

    // Allow either a jump move (2 diagonal squares) or a regular move (1 diagonal square)
    if (opponentPiece) {
        return rowDiff === 2 && colDiff === 2 && endRow < startRow;
    } else {
        return rowDiff === 1 && colDiff === 1 && endRow < startRow;
    }

};


// Function that checks whether there is an opponent piece in a square diagonally adjacent
function getCapturedPiece(opponentTurn) {
    const start = parseInt(startPositionId);
    const row = Math.floor((63 - start) / width) + 1;
    const col = start % width;

    // Get the id for every diagonally adjacent square to the target, store it in the array
    const squareIds = [];

    // Check top-left
    if (row > 1 && col > 0) {
        squareIds.push((width - (row - 1)) * width + col - 1);
    }

    // Check top-right
    if (row > 1 && col < 7) {
        squareIds.push((width - (row - 1)) * width + col + 1);
    }

    // Check bottom-left
    if (row < width && col > 0) {
        squareIds.push((width - (row + 1)) * width + col - 1);
    }

    // Check bottom-right
    if (row < width && col < 7) {
        squareIds.push((width - (row + 1)) * width + col + 1);
    }

    console.log("Diagonally adjacent square id's:", squareIds);

    for (const id of squareIds) {
        const square = document.querySelector(`[square-id="${id}"]`);
        const takenByOpponent = square.firstChild?.firstChild.classList.contains(opponentTurn);

        if (takenByOpponent) {
            const opponentPiece = square;;

            // Check if the square beyond the opponent's piece is vacant
            if (opponentPiece) {
                return opponentPiece;
            } else {
                return null;
            }
        }
    };
};





