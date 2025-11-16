const carA = document.getElementById('carA');
const carB = document.getElementById('carB');
const startButton = document.getElementById('startButton');
const messageDisplay = document.getElementById('message');
const trackWidth = 600; 
const finishLine = trackWidth - 40; // Subtract car width (40px)

let isRaceActive = false;
let raceInterval;

function resetRace() {
    // Resets the positions, message, and enables the start button
    carA.style.left = '0px';
    carB.style.left = '0px';
    messageDisplay.textContent = 'Ready! Press the Right Arrow Key (→) to move Car A!';
    startButton.disabled = false;
    startButton.textContent = 'Start Race';
    isRaceActive = false;
}

// Function to move the user car forward
function moveUserCar() {
    const move = 20; // User moves a fixed 20px per key press
    let currentPos = parseInt(carA.style.left) || 0;
    let newPos = currentPos + move;

    if (newPos >= finishLine) {
        newPos = finishLine;
        // Do NOT call endRace() here, let the main check handle it
    }
    carA.style.left = newPos + 'px';
    return newPos;
}

// Function for the AI opponent (Car B) to move randomly
function moveAICar(carElement) {
    // AI move is randomized (1 to 3 units, scaled up)
    const move = Math.floor(Math.random() * 3) + 1; 
    let currentPos = parseInt(carElement.style.left) || 0;
    let newPos = currentPos + move * 15; 

    if (newPos >= finishLine) {
        newPos = finishLine;
    }
    carElement.style.left = newPos + 'px';
    return newPos;
}

// Function to determine the final winner message (FIXED LOGIC)
function getWinnerMessage(posA, posB) {
    const aFinished = posA >= finishLine;
    const bFinished = posB >= finishLine;

    if (aFinished && bFinished) {
        // Both finished, check who went further/first
        return (posA > posB) ? '🎉 You Win! (Car A) 🎉' : 
               (posB > posA) ? '❌ AI Wins! (Car B) ❌' : 
               '🤝 It\'s a Tie!';
    } else if (aFinished) {
        // Only A finished
        return '🎉 You Win! (Car A) 🎉';
    } else if (bFinished) {
        // Only B finished
        return '❌ AI Wins! (Car B) ❌';
    }
    // Should not happen if endRace is called correctly, but for safety:
    return 'Race still active or unknown error.';
}

// Function to stop the race and display results
function endRace() {
    clearInterval(raceInterval); // Stop the AI movement interval
    isRaceActive = false;
    startButton.disabled = false;
    startButton.textContent = 'Play Again';
    
    // Crucially, get the final positions for winner check
    const posA = parseInt(carA.style.left);
    const posB = parseInt(carB.style.left);
    
    messageDisplay.textContent = getWinnerMessage(posA, posB);

    document.removeEventListener('keydown', handleKeyPress);
}

// The main race loop for the AI opponent
function raceStep() {
    const posB = moveAICar(carB);
    const posA = parseInt(carA.style.left);
    
    // Check if AI won
    if (posB >= finishLine) {
        endRace();
        return;
    }
    // Check if user won in the middle of AI step (rare, but possible)
    if (posA >= finishLine) {
        endRace();
    }
}

// Handles user input (key press)
function handleKeyPress(event) {
    if (!isRaceActive) return;

    // Check for the Right Arrow key (key code 39 or key value 'ArrowRight')
    if (event.key === 'ArrowRight' || event.keyCode === 39) {
        event.preventDefault(); // Prevents browser scrolling
        const posA = moveUserCar();
        
        // Check if user won immediately after moving
        if (posA >= finishLine) {
            endRace();
        }
    }
}

function startRace() {
    resetRace();
    startButton.disabled = true;
    messageDisplay.textContent = 'Use the RIGHT ARROW KEY (→) to race!';
    isRaceActive = true;
    
    // Start the AI's movement interval
    raceInterval = setInterval(raceStep, 500); 

    // Add the keyboard listener when the race starts
    document.addEventListener('keydown', handleKeyPress);
}

// Attach the startRace function to the button click event
startButton.addEventListener('click', startRace);

// Initialize the display on page load
resetRace();