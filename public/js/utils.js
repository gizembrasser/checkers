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


// Check possible jump moves of 2 diagonal squares
function getJumpMoves(start, regularMoves) {
    let jumpMoves = [];

    // Account for squares at the egde of the board
    const rightCol = [0, 8, 16, 24, 32, 40, 48, 56];
    const leftCol = [7, 15, 23, 31, 39, 47, 55, 63];

    if (regularMoves.length > 1) {
        regularMoves.forEach(id => jumpMoves = jumpMoves.concat(checkDiagonals(id)));
        jumpMoves.splice(1, jumpMoves.length - 2);
    }

    if (rightCol.includes(start)) {
        jumpMoves = checkDiagonals(regularMoves);
        jumpMoves.splice(0, 1);
    }

    if (leftCol.includes(start)) {
        jumpMoves = checkDiagonals(regularMoves);
        jumpMoves.splice(1);
    }

    return jumpMoves;
};


// Function to check if the move is 1 square diagonally adjacent, and not backwards
// A jump move is disabled by default if there aren't any opponent's piece(s) to capture
function validMove(target, mandatoryJump = false) {
    const end = target.getAttribute("square-id");
    const start = Number(startPositionId);

    const squareIds = checkDiagonals(start);

    // Allow either a jump move or a regular move (1 diagonal square)
    // Return legal moves and whether a jump is allowed
    if (mandatoryJump) {
        const jumpMoves = getJumpMoves(start, squareIds);
        console.log("Jump moves:", jumpMoves)
        return { move: jumpMoves.includes(Number(end)), jumpAllowed: true };
    } else {
        console.log("Regular moves:", squareIds)
        return { move: squareIds.includes(Number(end)), jumpAllowed: false };
    }
};


// Checks whether there's an opponent piece in a square diagonally adjacent, and the square beyond is vacant
// If yes it is mandatory to make a jump move, return the jumping piece and opponent's piece
function checkMandatoryJump(opponentTurn) {
    const start = Number(startPositionId);
    const piece = document.querySelector(`[square-id="${start}"]`);

    const squareIds = checkDiagonals(Number(start));

    // For check if surrounding diagonals are taken by opponent(s)
    for (const id of squareIds) {
        const square = document.querySelector(`[square-id="${id}"]`);
        const takenByOpponent = square.firstChild?.firstChild.classList.contains(opponentTurn);

        // Calculate where player has to jump to in order to capture opponent
        // For each possible target, check if the square is vacant
        if (takenByOpponent) {
            const targets = getJumpMoves(start, squareIds);

            // If at least one square is vacant, a jump is allowed
            const vacant = targets.some((id) => {
                const target = document.querySelector(`[square-id="${id}"]`);
                return (target.firstChild !== null) ? false : true;
            })

            if (vacant) {
                return {
                    jumpMoves: targets,
                    capturedPiece: square,
                    playerPiece: piece
                }
            } else {
                return null;
            }
        }
    }
};







