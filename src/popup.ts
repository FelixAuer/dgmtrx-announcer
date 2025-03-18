const toggleButton = document.getElementById("toggle") as HTMLButtonElement;
const urlInfo = document.getElementById("url-info") as HTMLDivElement;
const errorMessage = document.getElementById("error-message") as HTMLDivElement;

// Set the toggle state to localStorage
function setToggleState(state: boolean) {
    localStorage.setItem("isBroadcasting", String(state));
}

// Get the toggle state from localStorage
function getToggleState() {
    const state = localStorage.getItem("isBroadcasting") === "true";
    toggleButton.textContent = state ? "Stop Broadcast" : "Start Broadcast";
    toggleButton.disabled = false; // Enable the button after loading state
}

// Extract the tournament ID from the current URL
function getTournamentIdFromUrl(url: string): string | null {
    const match = url.match(/\/(\d+)$/); // Match the number at the end of the URL
    return match ? match[1] : null; // Return the tournament ID or null if not found
}

// Display the current URL and check for valid Disc Golf Metrix tournament page
function displayCurrentUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0]?.url || "N/A"; // If no tab, display N/A
        urlInfo.textContent = `Current URL: ${currentUrl}`;

        // Extract the tournament ID
        const tournamentId = getTournamentIdFromUrl(currentUrl);

        // Check if the URL matches the DiscGolfMetrix tournament page format
        const validUrlPattern = /^(https?:\/\/)?(www\.)?discgolfmetrix\.com\/\d+$/;
        if (validUrlPattern.test(currentUrl) && tournamentId) {
            // Show the button if valid
            toggleButton.style.display = "block";
            errorMessage.style.display = "none";
        } else {
            // Hide the button and show the error message if not valid
            toggleButton.style.display = "none";
            errorMessage.style.display = "block";
        }

        // Store the tournament ID for later use
        toggleButton.setAttribute("data-tournament-id", tournamentId || "");
    });
}

toggleButton.addEventListener("click", () => {
    const isCurrentlyBroadcasting = toggleButton.textContent === "Stop Broadcast";
    const newState = !isCurrentlyBroadcasting;

    // Get the tournament ID
    const tournamentId = toggleButton.getAttribute("data-tournament-id");

    // Update the button text
    toggleButton.textContent = newState ? "Stop Broadcast" : "Start Broadcast";

    // Send the toggle state and tournament ID to the background script
    chrome.runtime.sendMessage({
        type: "TOGGLE_BROADCAST",
        enabled: newState,
        tournamentId: tournamentId // Include the tournament ID
    });

    // Save the new state
    setToggleState(newState);
});

// When the popup is opened, load the stored state and display current URL
getToggleState();
displayCurrentUrl();
