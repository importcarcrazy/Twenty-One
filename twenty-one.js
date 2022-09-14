var dealerSum = 0;
var yourSum = 0;
var score = 10;

var dealerAceCount = 0;
var yourAceCount = 0; 

var hidden;
var deck;

var canHit = true; //allows the player (you) to draw while yourSum <= 21

function deal() {
    createDeck();
    shuffleDeck();
    startGame();
}
function newGame() {
    location.reload();
}

window.onload = function () {
    createDeck();
    shuffleDeck();
    deal();
    document.getElementById("tally").innerText = score;
}

function createDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    

    //countPlayer();

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("deal").addEventListener("click", deal);
    document.getElementById("newGame").addEventListener("click", newGame);
}

function hit() {
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }
    //countPlayer();

}

function countPlayer(){
    yourSum = reduceAce(yourSum, yourAceCount);
    document.getElementById("your-sum").innerText = yourSum;
}

function gameEnd(){

}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    //both you and dealer <= 21
    if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > 21 && dealerSum > 21) {
        message = "Push.";
    }
    else if (yourSum > 21) {
        message = "You Lose!";
        score--;
    }
    else if (dealerSum > 21) {
        message = "You win!";
        score++;
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        score++;
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        score--;
    }
    let gameMessage = "";
    if (score >= 21) {
        gameMessage = "YOU'VE WON THE GAME!";
    }
    else if (score <= 0) {
        gameMessage = "YOU'VE LOST HE GAME";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("results").innerText = message;
    countPlayer();
    document.getElementById("tally").innerText = score;
//    gameEnd();
    document.getElementById("gameResults").innerText = gameMessage;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
   return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}