

'use strict';

var selectableWords =           // Word list
    [
        "CSHARP",
        "CPLUSPLUS",
        "RUBYONRAILS",
        "PYTHON",
        "JAVASCRIPT",
        "ANSIC",
        "COBOL",
        "FORTRAN",
        "VISUALBASIC",
        "COMPILER",
        "ALGORITHM",
        "QBASIC",
        "ASPNET",
        "FRAMEWORK",
        "FULLSTACK",
        "HANGMAN"
    ];

const maxTries = 10;            // Maximum number of tries player has

var guessedLetters = [];        // Stores the letters the user guessed
var currentWordIndex;           // Index of the current word in the array
var guessingWord = [];          // This will be the word we actually build to match the current word
var remainingGuesses = 0;       // How many tries the player has left
var hasFinished = false;        // Flag for 'press any key to try again'     
var wins = 0;                   // How many wins has the player racked up

// Game sounds
var keySound = new Audio('./assets/sounds/typewriter-key.wav');
var chompSound = new Audio('./assets/sounds/chomp.wav');
var popSound = new Audio('./assets/sounds/pop.wav');
var winSound = new Audio('./assets/sounds/you-win.wav');
var growlSound = new Audio('./assets/sounds/growl.mp3')
//var loseSound = new Audio('./assets/sounds/you-lose.wav');



// Reset our game-level variables
function resetGame() {
    remainingGuesses = maxTries;
    
    // round the random number down to the nearest whole.
    currentWordIndex = Math.floor(Math.random() * (selectableWords.length));
    
    // Clear arrays
    guessedLetters = [];
    guessingWord = [];

    // clear hangman images
    document.getElementById("hangmanImage").src = "assets/images/0.png";

    // Build the guessing word and clear
    for (var i = 0; i < selectableWords[currentWordIndex].length; i++) {
        guessingWord.push("_");
    }   

    // Hide game over and win images/text
    document.getElementById("pressKeyTryAgain").style.cssText= "display: none";
    document.getElementById("gameover-image").style.cssText = "display: none";
    document.getElementById("youwin-image").style.cssText = "display: none";

    // Show display
    updateDisplay();
};

//  Updates the display on the HTML Page

// check remaining guesses to play popping sounds
function checkPop (){
        if  (remainingGuesses = 2 || 4 || 5 || 6 || 7 || 8 || 10){
        popSound.play();
        }
}


function updateDisplay() {

    
    document.getElementById("totalWins").innerText = wins;

    // Display how much of the word we've already guessed on screen.
    // Printing the array would add commas (,) - so we concatenate a string from each value in the array.
    var guessingWordText = "";
    for (var i = 0; i < guessingWord.length; i++) {
        guessingWordText += guessingWord[i];
    }

    //
    document.getElementById("currentWord").innerText = guessingWordText;
    document.getElementById("remainingGuesses").innerText = remainingGuesses;
    document.getElementById("guessedLetters").innerText = guessedLetters;
};


// Updates the image depending on how many guesses
function updateHangmanImage() {
    document.getElementById("hangmanImage").src = "assets/images/" + (maxTries - remainingGuesses) + ".png";
};

// This function takes a letter and finds all instances of 
// appearance in the string and replaces them in the guess word.
function evaluateGuess(letter) {
    // Array to store positions of letters in string
    var positions = [];

    // Loop through word finding all instances of guessed letter, store the indicies in an array.
    for (var i = 0; i < selectableWords[currentWordIndex].length; i++) {
        if(selectableWords[currentWordIndex][i] === letter) {
            positions.push(i);
        }
    }

    // if there are no indicies, remove a guess and update the hangman image
    if (positions.length <= 0) {
        remainingGuesses--;
        updateHangmanImage();
            if ([2,3,4,5,6,8].includes(remainingGuesses)){
                popSound.play();
            }
            if ([1,7,9].includes(remainingGuesses)){
                growlSound.play();
            }
    } else {
        // Loop through all the indicies and replace the '_' with a letter.
        for(var i = 0; i < positions.length; i++) {
            guessingWord[positions[i]] = letter;
        }
    }
    
};
// Checks for a win by seeing if there are any remaining underscores in the guessingword we are building.
function checkWin() {
    if(guessingWord.indexOf("_") === -1) {
        document.getElementById("youwin-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText= "display: block";
        wins++;
        winSound.play();
        hasFinished = true;
    }
};


// Checks for a loss
function checkLoss()
{
    if(remainingGuesses <= 0) {
        popSound.play();
        chompSound.play();
        document.getElementById("gameover-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText = "display:block";
        hasFinished = true;
    }
}

// Makes a guess
function makeGuess(letter) {
    if (remainingGuesses > 0) {
        // Make sure we didn't use this letter yet
        if (guessedLetters.indexOf(letter) === -1) {
            guessedLetters.push(letter);
            evaluateGuess(letter);
        }
    }
    
};


// Event listener
document.onkeydown = function(event) {

    // If we finished a game, dump one keystroke and reset.
    if(hasFinished) {
        resetGame();
//        growlSound.play();
        hasFinished = false;
    } else {
        // Check to make sure a-z was pressed.
        if(remainingGuesses < 1) {
            makeGuess(event.key.toUpperCase());
            updateDisplay();
            checkWin();
            checkLoss();
        } else {
            keySound.play();
            makeGuess(event.key.toUpperCase());
            updateDisplay();
            checkWin();
            checkLoss();
        }
    }
};