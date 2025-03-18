chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "NEW_ANNOUNCEMENT") {
        const word = message.text;
        speakAnnouncement(word);
    }
    if (message.type === "NEW_DATA") {
        // @ts-ignore
        document.querySelector("#id_results").outerHTML = message.htmlData;
        await addPlayerCheckboxes()
    }
});

function speakAnnouncement(word: string): void {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
    console.log(`🔊 Speaking: ${word}`);
}

async function addPlayerCheckboxes() {
    // Retrieve previously saved selected players or use an empty array
    let savedSelectedPlayers = await loadFollowedPlayers()
    // Select all player rows in the table
    document.querySelectorAll("tbody tr[id^='id']").forEach(row => {
        // Find the player's name element in the row
        const nameElement = row.querySelector(".player-cell");
        if (nameElement) {
            // Extract the player's name from the text content
            const playerName = nameElement.textContent!.trim();

            // Create a checkbox to associate with the player's name
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = playerName; // Use the player name as the checkbox ID
            checkbox.checked = savedSelectedPlayers.includes(playerName); // Set checkbox state based on saved selection

            // Create a label for the checkbox
            const label = document.createElement('label');
            label.setAttribute('for', playerName);

            // Append the checkbox and label to the name element
            nameElement.appendChild(checkbox);
            nameElement.appendChild(label);

            // Add an event listener to update the selected players when the checkbox state changes
            checkbox.addEventListener('change', () => {
                updateFollowedPlayers(playerName, checkbox.checked)
            });
        }
    });
}

const FOLLOWED_PLAYERS = 'followedPlayers'; // Key to store followed players in chrome.storage

// Load followed players from chrome storage
async function loadFollowedPlayers(): Promise<string[]> {
    return new Promise((resolve) => {
        chrome.storage.local.get([FOLLOWED_PLAYERS], (result) => {
            resolve(result[FOLLOWED_PLAYERS] || []);
        });
    });
}

// Save followed players to chrome storage
async function updateFollowedPlayers(playerName: string, isFollowed: boolean) {
    await loadFollowedPlayers().then(async followedPlayers => {
        if (isFollowed) {
            // Add player to followed list if not already there
            if (!followedPlayers.includes(playerName)) {
                followedPlayers.push(playerName);
            }
        } else {
            // Remove player from followed list if unchecked
            const index = followedPlayers.indexOf(playerName);
            if (index > -1) {
                followedPlayers.splice(index, 1);
            }
        }

        // Save updated followed players list to storage
        await chrome.storage.local.set({[FOLLOWED_PLAYERS]: followedPlayers});
    });
}

// Run the function when the page is loaded
window.addEventListener('load', addPlayerCheckboxes);

