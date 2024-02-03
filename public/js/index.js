// Socket connection (unfinished)
const socket = io.connect("http://localhost:3000");
socket.emit("joined");


/* ----------------------------------- Globals ------------------------------------------ */
const board = document.querySelector("#board");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#turn-info");
const width = 8;

let playerTurn = "black";
playerDisplay.textContent = "black";

const startingPieces = [
    '', blackPiece, '', blackPiece, '', blackPiece, '', blackPiece,
    blackPiece, '', blackPiece, '', blackPiece, '', blackPiece, '',
    '', blackPiece, '', blackPiece, '', blackPiece, '', blackPiece,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    whitePiece, '', whitePiece, '', whitePiece, '', whitePiece, '',
    '', whitePiece, '', whitePiece, '', whitePiece, '', whitePiece,
    whitePiece, '', whitePiece, '', whitePiece, '', whitePiece, '',
];


/* ------------------- Add a square to the board for each startingPiece -------------------- */
function createBoard() {
    startingPieces.forEach((piece, i) => {
        const square = document.createElement("div");

        square.classList.add("square");
        square.innerHTML = piece
        square.firstChild?.setAttribute("draggable", true);
        square.setAttribute("square-id", i);

        // Create checker scheme for all 8 rows
        // For even rows, alternate beige and grey checkers
        // For uneven rows, alternative grey and beige checkers
        const row = Math.floor((63 - i) / width) + 1
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "grey");
        } else {
            square.classList.add(i % 2 === 0 ? "grey" : "beige");
        }

        // Color in the pieces
        if (piece === blackPiece) {
            square.firstChild.firstChild.classList.add("black");
        }

        if (piece === whitePiece) {
            square.firstChild.firstChild.classList.add("white");
        }

        board.append(square);
    })
};

createBoard()


/* ------------------------------ Make the checkers moveable -------------------------------- */
const squares = document.querySelectorAll(".square");

squares.forEach(square => {
    square.addEventListener("dragstart", dragStart);
    square.addEventListener("dragover", dragOver);
    square.addEventListener("drop", dragDrop);
});

// Record the start position after element has been moved
let startPos;
let draggedElement;

function dragStart(e) {
    startPos = e.target.parentNode.getAttribute("square-id");
    draggedElement = e.target;
};

function dragOver(e) {
    e.preventDefault();
};

function dragDrop(e) {
    e.stopPropagation();

    // Define game rules
    const validTurn = draggedElement.firstChild.classList.contains(playerTurn);
    const opponentTurn = playerTurn === "white" ? "black" : "white";
    const taken = e.target.classList.contains("piece");
    const mandatoryJump = checkMandatoryJump(opponentTurn);

    const jumpTargets = mandatoryJump.objectConcat();
    const { jumpMoves, capturedPiece } = jumpTargets ?? [];
    const { move, jumpAllowed } = validMove(e.target, jumpMoves);
    console.log(jumpTargets)

    const endPos = Number(e.target.getAttribute("square-id"));

    console.log("Start Position:", startPos);
    console.log("End Position:", endPos);

    // Check if it's a valid turn, and if the piece was moved into an empty black square
    if (!taken && validTurn) {
        // Check if it's a regular move or jump move
        if (move && !jumpAllowed) {
            e.target.append(draggedElement);
            changePlayer();
            checkForWin();
            return;
        }

        if (move && jumpAllowed && jumpMoves.includes(endPos)) {
            infoDisplay.textContent = "Captured!";
            setTimeout(() => infoDisplay.textContent = "", 1000);
            const twoJumpsAllowed = Array.isArray(capturedPiece);

            // Check which opponent's piece to remove based on end position
            if (twoJumpsAllowed && jumpMoves[0] === endPos) {
                e.target.append(draggedElement);
                capturedPiece[0].firstChild.remove();
                changePlayer();
                checkForWin();
                return;
            } else if (twoJumpsAllowed && jumpMoves[1] === endPos) {
                e.target.append(draggedElement);
                capturedPiece[1].firstChild.remove();
                changePlayer();
                checkForWin();
                return;
            }

            e.target.append(draggedElement);
            capturedPiece.firstChild.remove();
            changePlayer();
            checkForWin();
            return;
        };

        infoDisplay.textContent = "You can't go there";
        setTimeout(() => infoDisplay.textContent = "", 1000);
        return;
    }

    infoDisplay.textContent = "invalid move";
    setTimeout(() => infoDisplay.textContent = "", 1000);
    return;
};



/* ------------------------- Change whose turn it is after each move ----------------------------- */
function changePlayer() {
    if (playerTurn === "black") {
        reverseIds()
        playerTurn = "white";
        playerDisplay.textContent = "white";
    } else {
        revertIds()
        playerTurn = "black";
        playerDisplay.textContent = "black";
    }
};


/* ---------------- Flip the board around after a turn by reversing/reverting id's ------------------- */
function reverseIds() {
    squares.forEach((square, i) => square.setAttribute("square-id", (width * width - 1) - i));
};

function revertIds() {
    squares.forEach((square, i) => square.setAttribute("square-id", i));
};


/* ------------------------------------ Check for win ----------------------------------------------- */
function checkForWin() {
    const whites = Array.from(document.querySelectorAll("#white-piece"));
    const blacks = Array.from(document.querySelectorAll("#black-piece"));

    const endRow = [56, 57, 58, 59, 60, 61, 62, 63];

    // Get the remaining pieces that are not stuck in the end row
    const remainingWhites = whites.filter(piece => !endRow.includes(Number(piece.parentElement.getAttribute("square-id"))));
    const remainingBlacks = blacks.filter(piece => !endRow.includes(Number(piece.parentElement.getAttribute("square-id"))));

    if (whites.length === 0 || remainingWhites.length === 0) {
        infoDisplay.innerHTML = "Black player wins!";
        squares.forEach(square => square.firstChild?.setAttribute("draggable", false));
        setTimeout(() => window.location.reload(), 1000);
    }

    if (blacks.length === 0 || remainingBlacks.length === 0) {
        infoDisplay.innerHTML = "White player wins!";
        squares.forEach(square => square.firstChild?.setAttribute("draggable", false));
        setTimeout(() => window.location.reload(), 1000);
    }
};


/* ------------------- Temporarily hidden multiplayer functionalities (unfinished) ------------------- */


document.getElementById("loading").hidden = true;
document.getElementById("find").hidden = true;
document.getElementById("name").hidden = true;
document.getElementById("player-info").hidden = true;
document.getElementById("user-info").hidden = true;
document.getElementById("opponent-info").hidden = true;

