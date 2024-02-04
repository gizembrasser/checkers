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
function getJumpMoves(opponentPiece) {
    const start = Number(startPos);
    const opponentId = Number(opponentPiece.getAttribute("square-id")) || null;
    const edges = [8, 24, 40, 56, 58, 60, 62, 1, 3, 5, 7, 23, 39, 55];

    let jumpMoves = [];

    // Calculate jump target based on start and opponent position
    switch (opponentId) {
        case start + width - 1:
            jumpMoves.push(opponentId + width - 1);
            break;
        case start + width + 1:
            jumpMoves.push(opponentId + width + 1);
            break;
    };

    // Jump move is possible unless the opponent is at the edge
    return !edges.includes(opponentId) ? jumpMoves : [];
};


// Function to check if the target position is 1 square diagonally adjacent, and not backwards
// A jump move is disabled by default if there aren't any opponent piece(s) to capture
function validMove(target, mandatoryJump = false) {
    const start = Number(startPos);

    const squareIds = checkDiagonals(start);

    // Allow either a jump move or a regular move (1 diagonal square)
    // Return legal moves and whether a jump is allowed
    if (mandatoryJump) {
        console.log("Jump moves:", mandatoryJump);
        return { move: mandatoryJump.includes(target), jumpAllowed: true };
    } else {
        console.log("Regular moves:", squareIds)
        return { move: squareIds.includes(target), jumpAllowed: false };
    }
};


// Check whether there's an opponent piece in a square diagonally adjacent, and the square beyond is vacant
// If yes it is mandatory to make a jump move, return vacant target square and opponent's piece
function checkMandatoryJump(opponent) {
    const start = Number(startPos);

    const squareIds = checkDiagonals(start);

    // Check if surrounding diagonals are taken by opponent(s)
    const mandatoryJump = squareIds.map(id => {
        const square = document.querySelector(`[square-id="${id}"]`);
        const takenByOpponent = square.firstChild?.firstChild.classList.contains(opponent);

        // Calculate where player has to jump to in order to capture opponent
        // For each possible target, check if the square is vacant
        if (takenByOpponent) {
            const targets = getJumpMoves(square);

            let vacant = [];
            // If the square beyond is vacant, a jump move is allowed
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


// If an array has multiple objects with the same keys, concatenate their values together into one object
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







