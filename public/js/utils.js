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


// Function to check if the target position is 1 square diagonally adjacent, and not backwards
// A jump move is disabled by default if there aren't any opponent's piece(s) to capture
function validMove(target, mandatoryJump = false) {
    const start = Number(startPos);
    const targetPos = Number(target.getAttribute("square-id"));

    const squareIds = checkDiagonals(start);

    // Allow either a jump move or a regular move (1 diagonal square)
    // Return legal moves and whether a jump is allowed
    if (mandatoryJump) {
        const jumpMoves = getJumpMoves(start, squareIds);
        console.log("Jump moves:", jumpMoves)
        return { move: jumpMoves.includes(targetPos), jumpAllowed: true };
    } else {
        console.log("Regular moves:", squareIds)
        return { move: squareIds.includes(targetPos), jumpAllowed: false };
    }
};


// Checks whether there's an opponent piece in a square diagonally adjacent, and the square beyond is vacant
// If yes it is mandatory to make a jump move, return the jumping piece and opponent's piece
function checkMandatoryJump(opponentTurn) {
    const start = Number(startPos);

    const squareIds = checkDiagonals(start);

    // For check if surrounding diagonals are taken by opponent(s)
    const mandatoryJump = squareIds.map(id => {
        const square = document.querySelector(`[square-id="${id}"]`);
        const takenByOpponent = square.firstChild?.firstChild.classList.contains(opponentTurn);

        // Calculate where player has to jump to in order to capture opponent
        // For each possible target, check if the square is vacant
        if (takenByOpponent) {
            const targets = getJumpMoves(start, squareIds);

            let vacant = [];
            // If at least one square is vacant, a jump is allowed
            targets.forEach(id => {
                const target = document.querySelector(`[square-id="${id}"]`);
                if (target.firstChild === null) {
                    vacant.push(id);
                }
            });
            // Assign false if there's no vacant squares
            vacant = vacant.length === 0 ? false : vacant;

            return { jumpMoves: vacant, capturedPiece: square };
        }
    });
    return mandatoryJump;
};


// If an array has two objects with the same keys, concatenate their values together into one object
Array.prototype.objectConcat = function () {
    const objects = this.filter(x => typeof x === "object");

    if (objects.length > 1) {
        const result = {};

        const keys = Object.keys(objects[0]);

        keys.forEach(key => {
            const value = objects.map(obj => obj[key]);
            result[key] = value.some(Array.isArray) ? [].concat(...value) : value;
        });

        return result;
    } else {
        return objects[0];
    }
};







