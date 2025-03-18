import {DiscGolfMetrixAPI} from "./discGolfMetrixAPI";
import {Tournament} from "./tournament";
import {TournamentStorage} from "./tournamentStorage";
import {AnnouncementGenerator} from "./announcementGenerator";

let isBroadcasting = false;
let intervalId: number | null = null;

/**
 * Load the broadcasting state from storage on startup.
 */
async function initializeBroadcasting() {
    const data = await chrome.storage.local.get("isBroadcasting");
    isBroadcasting = data.isBroadcasting || false;
    console.log(`🔄 Loaded broadcasting state: ${isBroadcasting}`);

    if (isBroadcasting) {
        checkMetrixTab(); // Ensure it starts only if a Metrix tab is open
    }
}

/**
 * Fetch tournament data, compare it to previous data, and send new results to the content script.
 */
async function fetchAndProcessTournamentData() {
    const data = await chrome.storage.local.get("tournamentId");
    console.log("fetching data for " + data.tournamentId);
    const competition = await DiscGolfMetrixAPI.fetchTournamentData(data.tournamentId);
    if (!competition) {
        console.log("❌ Error fetching tournament data");
        return;
    }

    const newTournament = Tournament.fromCompetition(competition);
    const oldTournament = await TournamentStorage.load();
    await TournamentStorage.store(competition); // Store latest API response

    if (oldTournament) {
        const newResults = Tournament.detectNewPlayerResults(newTournament, oldTournament);
        if (newResults.length > 0) {
            console.log("📢 New results detected:", newResults);
            newResults.forEach((result) => {

                const announcement = AnnouncementGenerator.generateAnnouncements(result)

                chrome.tabs.query({url: "*://*.discgolfmetrix.com/*"}, (tabs) => {
                    if (tabs.length > 0) {
                        announcement.forEach((announcement) => {
                            chrome.tabs.sendMessage(tabs[0].id!, {
                                type: "NEW_ANNOUNCEMENT",
                                text: announcement
                            });
                        })
                    }
                });
            })
            // Send new results to the content script

        } else {
            console.log("no new results")
        }
    } else {
        console.log("no old tournament found")
    }
}

/**
 * Starts polling for new tournament data every 10 seconds.
 */
function startFetchingTournamentData(): void {
    if (intervalId !== null) return; // Avoid duplicate intervals

    intervalId = setInterval(async () => {
        console.log("🔄 Checking for new tournament data...");
        await fetchAndProcessTournamentData();
    }, 10000);
}

/**
 * Stops polling for tournament data.
 */
function stopFetchingTournamentData(): void {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        console.log("🛑 Stopped fetching tournament data.");
    }
}

/**
 * Checks if a Disc Golf Metrix tab is open and controls fetching accordingly.
 */
function checkMetrixTab(): void {
    chrome.tabs.query({url: "*://*.discgolfmetrix.com/*"}, (tabs) => {
        if (tabs.length > 0) {
            if (isBroadcasting && !intervalId) {
                console.log("📡 Starting tournament data fetch...");
                startFetchingTournamentData();
            }
        } else {
            console.log("🚫 No Metrix tab open. Stopping fetch.");
            stopFetchingTournamentData();
        }
    });
}

/**
 * Listen for messages from the popup to toggle broadcasting.
 */
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === "TOGGLE_BROADCAST") {
        isBroadcasting = message.enabled;
        const tournamentId = message.tournamentId
        await chrome.storage.local.set({isBroadcasting});
        await chrome.storage.local.set({tournamentId});
        console.log(`🔘 Broadcast ${isBroadcasting ? "ON" : "OFF"}`);
        checkMetrixTab();
        if (!isBroadcasting) {
            stopFetchingTournamentData()
        }
    }
});

/**
 * Detects when a Metrix tab is opened/closed and adjusts fetching accordingly.
 */
chrome.tabs.onUpdated.addListener(checkMetrixTab);
chrome.tabs.onRemoved.addListener(checkMetrixTab);

// Initialize broadcasting state when the worker starts
initializeBroadcasting().then(r => {
    console.log("🔄 Background script loaded");
});
