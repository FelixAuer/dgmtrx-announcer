console.log("Disc Golf Announcer: Monitoring scores...");

// === Configuration ===
const REFRESH_INTERVAL = 60000; // 10 seconds for faster debugging

//let toggleAutoReload = true; // Toggle to control automatic page reload
let toggleAutoReload = true; // Toggle to control automatic page reload

// === Function to extract scores from the table ===
function getScores() {
    const players = {};

    // Get the par values from the first row in the table body
    const parValues = [];
    const parRow = document.querySelector("tbody tr:nth-child(1)"); // The first row contains the par values
    const parCells = parRow.querySelectorAll("td");

    // Extract the par values for holes 1 to 18 (starting from index 2)
    for (let i = 3; i < parCells.length - 4; i++) { // Subtract 2 for the last 2 columns
        const par = parCells[i].textContent.trim();
        parValues.push(par);
    }

    // Extract the hole names from the header
    const holeNames = [];
    const headerCells = document.querySelectorAll("thead th");
    const lastScoreIndex = headerCells.length - 4; // Calculate the last score index (2 columns after the last score)
    for (let i = 5; i <= lastScoreIndex; i++) {
        const holeName = headerCells[i].textContent.trim();
        holeNames.push(holeName);
    }

    // Now, gather the score data for each player
    document.querySelectorAll("tbody tr[id^='id']").forEach(row => {
        const nameElement = row.querySelector(".player-cell");
        const played = row.querySelector("td[title='Played holes']"); // Last completed hole
        const scoreElement = row.querySelector(`td:nth-last-child(2)`); // Total score (second last column)
        const scoreCells = row.querySelectorAll("td"); // All cells with scores (birdie, bogey, etc.)

        if (nameElement && scoreElement) {
            const name = nameElement.textContent.trim();
            const totalScore = scoreElement.textContent.trim();
            const playedHoles = played.textContent.trim();
            const place = scoreCells[0].textContent.trim();

            // Initialize the player object with an empty score record for each hole
            if (!players[name]) {
                players[name] = {
                    place,
                    totalScore,
                    playedHoles,
                    holeScores: {} // Initialize empty hole scores
                };
            }

            // Loop through all hole columns to track the score for each hole
            for (let i = 0; i < parValues.length; i++) {
                const scoreCell = scoreCells[i + 5]; // Hole numbers start at index 4
                if (scoreCell && scoreCell.textContent.trim()) {
                    const score = scoreCell.textContent.trim();
                    const par = parValues[i];
                    const holeName = holeNames[i]; // Get hole name from the header

                    // Store the score, par, and hole name for the hole
                    players[name].holeScores[holeName] = {score, par};
                }
            }
        }
    });

    return players;
}

// === Detect changes after a score update ===
function checkForUpdates(currentScores) {
    let selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || {};
    const previousScores = JSON.parse(localStorage.getItem('previousScores')) || {};
    localStorage.setItem('previousScores', JSON.stringify(currentScores));

    for (const player in currentScores) {
        console.log(player);
        let isFollowed = selectedPlayers.includes(player)
        let isCool = false
        let newHole = false;

        const prev = previousScores[player] || {};
        const curr = currentScores[player];

        // Check for changes in each individual hole score
        for (const holeName in curr.holeScores) {
            const prevHoleScore = prev.holeScores ? prev.holeScores[holeName] : null;
            const currHoleScore = curr.holeScores[holeName];

            // If the score for a hole has changed or is new, notify about it
            if (!prevHoleScore || prevHoleScore.score !== currHoleScore.score) {
                console.log("new hole for " + player)
                newHole = true;
                const result = getScoreResult(currHoleScore.score, currHoleScore.par);
                if (currHoleScore.score - currHoleScore.par <= -2) {
                    isCool = true;
                }
                if (isFollowed || isCool) {
                    let playerStats = {
                        name: player,
                        totalScore: curr.totalScore,
                        place: curr.place,
                        holesPlayed: curr.playedHoles,
                        result: result,
                        par: currHoleScore.par,
                        lastScore: currHoleScore.score,
                        hole: holeName,
                        isFollowed: isFollowed,
                        isCool: isCool,
                    };
                    speak(generateTTSMessage(playerStats));
                }
            }
        }
    }
}

function getRandomString(array) {
    // Ensure the array is not empty
    if (array.length === 0) {
        return null; // Or throw an error if you prefer
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * array.length);

    // Return the string at the random index
    return array[randomIndex];
}

function generateTTSMessage(playerStats) {
    let text = "";
    if (playerStats.isCool) {
        text += getRandomString(["Wow! ", "Irre! ", "I wear narrisch! "])
    }
    if (playerStats.lastScore - playerStats.par === -1) {
        text += getRandomString(["", "", "", "", "", "", "", "", "", " Nice! ", " Top! ", " Jawohl! "])
    }
    if (playerStats.lastScore - playerStats.par === 1) {
        text += getRandomString(["", "", "", "", "", "", "", "", "", " Uh! ", " Auweh! ", " Uff! "])
    }
    if (playerStats.lastScore - playerStats.par === 2) {
        text += getRandomString(["", "", "", "", "", "", " Das tut weh! ", " Na geh! ", " Auweh! "])
    }
    if (playerStats.lastScore - playerStats.par > 2) {
        text += getRandomString(["", "", "", " Na scheiße! ", " Ay ay ay! ", " So ein Dreck! "])
    }
    text += playerStats.name;
    text += getRandomString([": ", " spielt", " hat"])
    text += " " + playerStats.result + " " + getRandomString(["auf Bahn", "auf der", "auf Loch", "bei Hole"])
    text += " "
    text += playerStats.hole + " (par " + playerStats.par + ")"
    if (playerStats.holesPlayed === "F") {
        text += getRandomString([
            ". Die Runde ist damit mit einem Score von " + playerStats.totalScore + " am " + playerStats.place + ". Platz beendet.",
            "Und beendet die Runde mit " + playerStats.totalScore + " am " + playerStats.place + ". Platz beendet.",
            "Insgesamt wird das der " + playerStats.place + ". Platz mit einem Gesamtscore von " + playerStats.totalScore + "."
        ])
    } else {
        text += getRandomString([
            ". Gesamtscore: " + playerStats.totalScore,
            "und steht damit auf " + playerStats.totalScore,
            "und steht damit insgesamt auf " + playerStats.totalScore,
            ". Über die Runde damit auf " + playerStats.totalScore,
        ])
        text += getRandomString([
            " und am " + playerStats.place + ". Platz.",
            ". Aktuell ist das der " + playerStats.place + ". Platz.",
            " und steht am " + playerStats.place + ". Platz.",
            " und liegt damit am " + playerStats.place + ". Platz.",
        ])

    }
    return text;
}

// === Function to determine if the player's score is above, below, or equal to par ===
function getScoreResult(score, par) {
    const scoreInt = parseInt(score);
    const parInt = parseInt(par);
    const scoreDiff = scoreInt - parInt;

    // Check for Ace (Hole-in-one)
    if (scoreInt === 1) {
        return "ace";
    }

    // Map the difference in score to the appropriate result
    switch (scoreDiff) {
        case -3:
            return "albatross";
        case -2:
            return "eagle";
        case -1:
            return "birdie";
        case 0:
            return "par";
        case 1:
            return "bogey";
        case 2:
            return "double bogey";
        case 3:
            return "triple bogey";
        case 4:
            return "quadruple bogey";
        case 5:
            return "mega bogey plus " + scoreDiff;
        default:
            return "bogey"; // Default to bogey for any other difference
    }
}

// === Function to refresh the page and then check for updates ===
function refreshPageAndCheck() {
    if (!toggleAutoReload) {
        console.log("Auto reload disabled for debugging.");
        return; // Skip the page reload if the toggle is false
    }

    console.log("🔄 Refreshing page to check for score updates...");

    // Refresh the page
    location.reload();

    // Wait for the page to reload and then fetch new scores
    setTimeout(() => {
        console.log("✅ Page reloaded. Checking for new scores...");
        const currentScores = getScores();
        checkForUpdates(currentScores); // Check for updates after refresh
    }, 1000); // Wait 1 second after page reload to allow the content to load
}

function speak(text) {
    console.log(`Speaking: ${text}`); // Log the text to be spoken
    const speech = new SpeechSynthesisUtterance(text);
    speech.volume = 1; // Volume level (0 to 1)
    speech.rate = 1; // Speed of speech (1 is normal speed)
    speech.pitch = 1; // Pitch level (1 is normal pitch)
    speechSynthesis.speak(speech); // Trigger the speech
}

// === Start Monitoring ===
setInterval(refreshPageAndCheck, REFRESH_INTERVAL); // Refresh every 10 seconds

// === Initial Score Fetch ===
setTimeout(() => {
    console.log("✅ Initial score check...");
    const initialScores = getScores();
    checkForUpdates(initialScores); // Check for updates after the initial fetch
}, 500);

if (!window.speechSynthesis) {
    console.log("Speech Synthesis not supported in this browser.");
} else {
    console.log("Speech Synthesis is supported.");
}

function addSpeechButton() {
    const button = document.createElement('button');
    button.innerText = 'Announce Scores';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', () => {
        // Call the function to speak a score update
        const currentScores = getScores();
        checkForUpdates(currentScores);
    });

    document.body.appendChild(button);
}

function addPlayerCheckboxes() {
    let savedSelectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || [];

    document.querySelectorAll("tbody tr[id^='id']").forEach(row => {
        const nameElement = row.querySelector(".player-cell");
        if (nameElement) {
            const playerName = nameElement.textContent.trim();

            // Create a checkbox next to each player's name
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = playerName; // Use player name as ID
            checkbox.checked = savedSelectedPlayers.includes(playerName); // Set based on saved state

            // Create a label for the checkbox
            const label = document.createElement('label');
            label.setAttribute('for', playerName);

            // Append the checkbox and label next to the player's name
            nameElement.appendChild(checkbox);
            nameElement.appendChild(label);

            // Add event listener to update SELECTED_PLAYERS array when checkbox is toggled
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    // Add to the selected players list
                    savedSelectedPlayers.push(playerName);
                } else {
                    // Remove from the selected players list
                    savedSelectedPlayers = savedSelectedPlayers.filter(player => player !== playerName);
                }

                // Save the updated selected players to localStorage
                localStorage.setItem('selectedPlayers', JSON.stringify(savedSelectedPlayers));

                console.log(`Selected players: ${savedSelectedPlayers.join(', ')}`);
            });
        }
    });
}

// Call this function to add checkboxes when the page is loaded
addPlayerCheckboxes();