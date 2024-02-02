// Function that returns all diagonally adjacent squares in front of a certain starting square
function checkDiagonals(start) {
    const row = Math.floor((63 - start) / width) + 1;
    const col = start % width;

    // Get the id for each diagonally adjacent square, store it in the array
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
    const start = Number(startPositionId);

    const squareIds = checkDiagonals(start);

    // Allow either a jump move (2 diagonal squares) or a regular move (1 diagonal square)
    if (mandatoryJump) {
        let jumpMoves = [];

        squareIds.forEach(id => jumpMoves = jumpMoves.concat(checkDiagonals(id)));
        return jumpMoves.includes(Number(end));
    } else {
        return squareIds.includes(Number(end));
    }
};


// Checks whether there's an opponent piece in a square diagonally adjacent, and the square beyond is vacant
// If yes it is mandatory to make a jump move, return the jumping piece and opponent's piece
function checkMandatoryJump(target, opponentTurn) {
    const end = target.getAttribute("square-id");
    const start = Number(startPositionId);

    const squareIds = checkDiagonals(Number(start));

    console.log("Diagonally adjacent square id's:", squareIds);

    for (const id of squareIds) {
        const square = document.querySelector(`[square-id="${id}"]`);
        const takenByOpponent = square.firstChild?.firstChild.classList.contains(opponentTurn);

        if (takenByOpponent) {
            const jumpSquare = document.querySelector(`[square-id="${end}"]`);
            const vacant = !jumpSquare.classList.contains("piece");

            if (square && vacant) {
                return square;
            } else {
                return null;
            }
        }
    }
};








