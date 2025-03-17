const toggleButton = document.getElementById("toggle") as HTMLButtonElement;

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

toggleButton.addEventListener("click", () => {
    const isCurrentlyBroadcasting = toggleButton.textContent === "Stop Broadcast";
    const newState = !isCurrentlyBroadcasting;

    // Update the button text
    toggleButton.textContent = newState ? "Stop Broadcast" : "Start Broadcast";

    // Send the toggle state to the background script
    chrome.runtime.sendMessage({ type: "TOGGLE_BROADCAST", enabled: newState });

    // Save the new state
    setToggleState(newState);
});

// When the popup is opened, load the stored state
getToggleState();
