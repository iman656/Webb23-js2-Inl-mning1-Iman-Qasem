// import { resultOfGame, , theHiScoList } from "./modules/updateAndDisplay.js";

const formName = document.querySelector('#inputTheName');
const pictures = document.querySelector('#pictures');
const userNameInput = document.querySelector('#userName');
const setUserName = document.querySelector('#userNameOut');
const errorOnUserName = document.querySelector('#errorUserNameOutput');
const yourScore = document.querySelector('#yourScore');
const computerWinsTheGame = document.querySelector('#tryAgainText');
const outForComputerWin = document.querySelector('#tryAgainButton');
const highScoreList = document.querySelector('ol');

outForComputerWin.style.display = 'none';



let playerWin = 0;
let computerMoveWin = 0;
let result;
let playerMove;
let computerMove;
let userName;


getHighScores();


formName.addEventListener('submit', (event) => {
    event.preventDefault();


    userName = userNameInput.value;

    //not -- name
    if (userName.trim() === '') {
        errorNoName();
    }
    else {
        setUserName.innerText = `Hello ${userName}, let's play!`;
        errorOnUserName.innerText = '';

        formName.reset();

        pictures.addEventListener('click', game);
    }

});


//Error UserName.
function errorNoName() {

    errorOnUserName.innerText = `Please enter a username!`;
    setUserName.innerText = '';

    pictures.removeEventListener('click', game);

};


function game(event) {


    playerMove = event.target.id;
    const moves = ["rock", "paper", "scissor"];
    const randomChoiseOfArray = Math.floor(Math.random() * moves.length);
    computerMove = moves[randomChoiseOfArray];



    if (playerMove === 'rock') {
        if (computerMove === 'rock') {
            result = 'tie';
            console.log('tie');
        } else if (computerMove === 'paper') {
            result = 'you lose'
            computerMoveWin++;
            console.log('you lose')
        } else if (computerMove === 'scissor') {
            result = 'you win';
            playerWin++;
            console.log('you win')
        }
    }

    if (playerMove === 'paper') {
        if (computerMove === 'rock') {
            result = 'you win';
            playerWin++
            console.log('you win');
        } else if (computerMove === 'paper') {
            result = 'tie';
            console.log('tie')
        } else if (computerMove === 'scissor') {
            result = 'you lose';
            computerMoveWin++;
            console.log('you lose')
        }
    }

    if (playerMove === 'scissor') {
        if (computerMove === 'rock') {
            result = 'you lose'
            computerMoveWin++;
            console.log('you lose');
        } else if (computerMove === 'paper') {
            result = 'you win';
            playerWin++
            console.log('you win')
        } else if (computerMove === 'scissor') {
            result = 'tie';
            console.log('tie')
        }
    }

    const yourChoise = document.querySelector('#youPicked');
    const computerChoise = document.querySelector('#computerPicked');

    yourChoise.innerText = `You picked: ${playerMove}`
    computerChoise.innerText = `Computer picked: ${computerMove}`;


    if (result === 'you lose') {
        updateHighScore()
            .then(getHighScores())
            .catch(error => console.error('Error för att uppdatera Highscore:', error));
    }

    resultOfGame()

}


// Computer win. 
function resultOfGame() {

    yourScore.innerText = `Your score : ${playerWin}`;

    if (computerMoveWin > 0) {

        computerWinsTheGame.innerText = `You lose. Your score: ${playerWin}. 
        Submit a new username and play again!`
        outForComputerWin.style.display = 'block';

        //finsh game.
        pictures.removeEventListener('click', game);


        outForComputerWin.addEventListener('click', listenOnTryAgainButton);

        playerWin = 0;
        yourScore.innerText = `Your score : ${playerWin} `;
        computerMoveWin = 0;

    }
}


function listenOnTryAgainButton() {

    outForComputerWin.style.display = 'none';
    computerWinsTheGame.innerText = '';

}


//get highscorelistan från backend 
async function getHighScores() {

    try {
        const urlHighScore = 'http://localhost:3000/highscore';

        const response = await fetch(urlHighScore);
        const highScores = await response.json();
        theHiScoList(highScores)

      
    } catch (error) {
        console.log('error fetching data:', error);
    }
}


async function updateHighScore() {

    try {
        const urlHighScore = `http://localhost:3000/highscore`;

        console.log({
            name: userName, score: playerWin
        });

        const updateResponse = await fetch(urlHighScore, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userName, score: playerWin
            })
        });

        const updatedHigScoRes = await updateResponse.json();
        theHiScoList(updatedHigScoRes)

    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}

function theHiScoList(listForHighscore) {
    highScoreList.innerHTML = '';

    listForHighscore.forEach(score => {
        const listItem = document.createElement('li');
        listItem.innerText = `${score.name}: ${score.score}`;
        highScoreList.appendChild(listItem);
    });
}