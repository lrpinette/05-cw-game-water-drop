// Game state variables
let gameActive = false;  // Tracks if game is currently running
let gameInterval;        // Stores the interval that creates drops
let gameTimer;           // Stores the timer for the game duration

// Initialize score variable
let score = 0;
let timeLeft = 60; // Initialize the timer

// Event listener for the start button
document.getElementById('start-btn').addEventListener('click', startGame);

// Function to update the score display
function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
}

// Function to update the timer display
function updateTimerDisplay() {
    document.getElementById('timer').textContent = timeLeft;
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval); // Stop creating drops
    clearInterval(gameTimer); // Stop the timer
    gameActive = false;
    document.getElementById('start-btn').disabled = false;

    // Wait for all remaining drops to be removed
    const checkDropsInterval = setInterval(() => {
        const remainingDrops = document.querySelectorAll('.water-drop');
        if (remainingDrops.length === 0) {
            clearInterval(checkDropsInterval); // Stop checking for drops

            // Determine the message based on the final score
            const message = score > 0 
                ? "Congratulations! You collected clean water! :)" 
                : "Oh no! Looks like you missed getting clean water :(";

            // Display the game-over box with the final score and message
            const gameOverBox = document.getElementById('game-over-box');
            document.getElementById('final-score').innerHTML = `Game Over!<br>Your final score is: ${score}.<br>${message}`;
            gameOverBox.classList.remove('hidden');
            gameOverBox.style.display = 'block';
        }
    }, 100); // Check every 100ms
}

// Event listener for the play-again button
document.getElementById('play-again-btn').addEventListener('click', () => {
    // Reset the game state
    document.getElementById('game-over-box').style.display = 'none';
    document.getElementById('game-over-box').classList.add('hidden');
    startGame();
});

// Game initialization function
function startGame() {
    // Prevent multiple game instances
    if (gameActive) return;
    
    // Set up initial game state
    gameActive = true;
    score = 0; // Reset score
    timeLeft = 60; // Reset timer
    updateScoreDisplay();
    updateTimerDisplay();
    document.getElementById('start-btn').disabled = true;
    
    // Start creating drops every 1000ms (1 second)
    gameInterval = setInterval(createDrop, 1000);
    
    // Countdown timer
    gameTimer = setInterval(() => {
        timeLeft -= 1;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(gameTimer); // Stop the timer
            endGame(); // End the game
        }
    }, 1000);
}

// Function to create and manage individual water drops
function createDrop() {
    const drop = document.createElement('div');
    
    // Randomly determine if this drop is good or bad (20% chance of bad)
    const isBadDrop = Math.random() < 0.2;
    drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';
    
    // Create random size variation for visual interest
    const scale = 0.8 + Math.random() * 0.7;  // Results in 80% to 150% of original size
    drop.style.transform = `scale(${scale})`;
    
    // Position drop randomly along the width of the game container
    const gameWidth = document.getElementById('game-container').offsetWidth;
    const randomX = Math.random() * (gameWidth - 40);
    drop.style.left = `${randomX}px`;
    
    // Set drop animation speed
    drop.style.animationDuration = '4s';
    
    // Click handler to update score and remove drops
    drop.addEventListener('click', () => {
        if (isBadDrop) {
            score -= 1; // Decrement score for bad drops
        } else {
            score += 1; // Increment score for good drops
        }
        updateScoreDisplay();
        drop.remove();
    });
    
    // Add drop to game container
    document.getElementById('game-container').appendChild(drop);
    
    // Remove drop if it reaches bottom without being clicked
    drop.addEventListener('animationend', () => {
        if (!isBadDrop) {
            score -= 1; // Penalize for missing good drops
            updateScoreDisplay();
        }
        drop.remove();
    });
}
