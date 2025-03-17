import {DiscGolfMetrixAPI} from "./discGolfMetrixAPI";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "NEW_ANNOUNCEMENT") {
        const word = message.text;
        speakAnnouncement(word);
    }
});

function speakAnnouncement(word: string): void {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
    console.log(`🔊 Speaking: ${word}`);
}

async function fetchAndProcessTournamentData() {
    const competition = await DiscGolfMetrixAPI.fetchTournamentData();

    if (competition) {
        console.log("Tournament Data:", competition);

        // Further analysis can be done here using the structured `competition` object
        // For example, generate announcements or process player performance
    } else {
        console.log("Failed to retrieve tournament data.");
    }
}

// Call the function to test fetching and processing
fetchAndProcessTournamentData();