// Socket connection
const socket = io.connect("http://localhost:3000");
socket.emit("joined");


// Initialization
const board = document.querySelector("#board");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#turn-info");
const width = 8;

const whitePiece = "<div class='piece' id='white-piece'><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z\"/></svg></div>"
const blackPiece = "<div class='piece' id='black-piece'><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z\"/></svg></div>"

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


// Add a square to the board for each startingPiece
// Every square will be assigned a unique id
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


const squares = document.querySelectorAll(".square");

// Make the checkers moveable
squares.forEach(square => {
    square.addEventListener("dragstart", dragStart);
    square.addEventListener("dragover", dragOver);
    square.addEventListener("drop", dragDrop);
});

// Record the start/end position after element has been moved
let startPositionId;
let opponentPiece;
let draggedElement;

function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute("square-id");
    draggedElement = e.target;
};

function dragOver(e) {
    e.preventDefault();
};

function dragDrop(e) {
    e.stopPropagation();

    const validTurn = draggedElement.firstChild.classList.contains(playerTurn);
    const opponentTurn = playerTurn === "white" ? "black" : "white";
    const opponentPiece = getCapturedPiece(opponentTurn);

    const endPositionId = e.target.getAttribute("square-id");

    console.log("Start Position:", startPositionId);
    console.log("End Position:", endPositionId);

    // Check if it's a valid turn, and if the piece was moved diagonally
    if (validTurn && validMove(e.target)) {
        e.target.append(draggedElement);
        changePlayer();
        return
    } else if (validTurn && validMove(e.target, opponentPiece)) {
        e.target.append(draggedElement);
        opponentPiece.firstChild.remove();
        changePlayer();
        return
    } else {
        infoDisplay.textContent = "Invalid move!";
        setTimeout(() => infoDisplay.textContent = "", 1000);
        return
    }
};


// Change who's turn it is after each move
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


// Flip the board around after a turn
// Reverse/revert the id for each square when it's the other players turn
function reverseIds() {
    squares.forEach((square, i) => square.setAttribute("square-id", (width * width - 1) - i));
};

function revertIds() {
    squares.forEach((square, i) => square.setAttribute("square-id", i));
};


/* ---------------- Temporarily hidden multiplayer functionalities (unfinished) ---------------- */


document.getElementById("loading").hidden = true;
document.getElementById("find").hidden = true;
document.getElementById("name").hidden = true;
document.getElementById("player-info").hidden = true;
document.getElementById("user-info").hidden = true;
document.getElementById("opponent-info").hidden = true;

