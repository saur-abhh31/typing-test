let passage = ""; // Initialize an empty passage
let startTime;
let timer;
let timeLeft = 900; // Set timer for 15 minutes (900 seconds)

// Fetch the passage from the text file
function fetchPassage() {
    fetch('passage.txt') // Adjust the path as needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            passage = data; // Assign the fetched passage to the variable
            displayPassage(""); // Display the initial passage
        })
        .catch(error => {
            console.error('Error fetching the passage:', error);
        });
}

// Display the initial passage with character-by-character highlighting
function displayPassage(inputText) {
    const passageDisplay = document.getElementById("passageDisplay");
    let displayContent = "";

    // Loop through each character in the passage
    for (let i = 0; i < passage.length; i++) {
        if (i < inputText.length) {
            // Highlight correctly typed characters in green, incorrectly typed in red
            if (inputText[i] === passage[i]) {
                displayContent += `<span class="correct">${passage[i]}</span>`;
            } else {
                displayContent += `<span class="incorrect">${passage[i]}</span>`;
            }
        } else {
            // Show remaining passage text in normal color
            displayContent += passage[i];
        }
    }
    
    passageDisplay.innerHTML = displayContent;
}

// Start the typing test and the timer
function startTest() {
    startTime = new Date().getTime();
    timer = setInterval(updateTimer, 1000); // Update every second
}

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Update the timer display and end the test when time is up
function updateTimer() {
    timeLeft--;
    document.getElementById("timer").innerText = `Time Left: ${formatTime(timeLeft)}`;

    if (timeLeft <= 0) {
        endTest();
    }
}

// Calculate and display results
function calculateResults(userInput) {
    const endTime = new Date().getTime();
    const timeTakenInMinutes = (endTime - startTime) / 60000;

    // Count correct and incorrect characters
    let correctChars = 0;
    let errors = 0;
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === passage[i]) {
            correctChars++;
        } else {
            errors++;
        }
    }

    // Calculate accuracy based on correctly typed characters out of total characters typed
    const accuracy = Math.round((correctChars / userInput.length) * 100); // Accuracy as percentage
    const wpm = Math.round((userInput.trim().split(" ").length) / timeTakenInMinutes); // WPM based on words typed

    const resultDisplay = document.getElementById("result");
    resultDisplay.innerHTML = `WPM: ${wpm} | Accuracy: ${accuracy}% | Errors: ${errors}`;
}

// End test and show results
function endTest() {
    clearInterval(timer);
    const userInput = document.getElementById("typingInput").value;
    
    // Calculate results
    calculateResults(userInput);

    // Redirect to scorecard with parameters
    const endTime = new Date().getTime();
    const timeTakenInMinutes = (endTime - startTime) / 60000;

    const correctChars = Array.from(userInput).filter((char, i) => char === passage[i]).length;
    const errors = userInput.length - correctChars;
    const accuracy = Math.round((correctChars / userInput.length) * 100); // Updated accuracy calculation
    const wpm = Math.round((userInput.trim().split(" ").length) / timeTakenInMinutes); // WPM based on words typed

    window.location.href = `scorecard.html?wpm=${wpm}&accuracy=${accuracy}&errors=${errors}`;
}

// Typing input handler
document.getElementById("typingInput").addEventListener("input", (e) => {
    const input = e.target.value;
    
    // Display character-by-character highlighting
    displayPassage(input);

    // Start timer on first input
    if (input.length === 1 && !startTime) {
        startTest();
    }

    // Automatically end test if user types the exact number of characters in the passage
    if (input.length >= passage.length) {
        endTest();
    }
});

// Initial call to fetch the passage
fetchPassage();
