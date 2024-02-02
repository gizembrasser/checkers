// Display model that contains checkers rules
const modal = document.getElementById("rules-modal");
const rulesButton = document.getElementById("rules-button");
const span = document.getElementsByClassName("close")[0];

rulesButton.onclick = function () {
    modal.style.display = "block";
};

span.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};