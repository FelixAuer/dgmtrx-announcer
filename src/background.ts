let isBroadcasting = false;
let intervalId: number | null = null;

// List of test words to announce
const testWords = ["Eagle", "Bogey", "Ace", "Birdie", "Albatross", "Double Bogey"];

/**
 * Checks if a Disc Golf Metrix tab is open and visible in Chrome
 */
function checkMetrixTab(): void {
    chrome.tabs.query({url: "*://*.discgolfmetrix.com/*"}, (tabs) => {
        if (tabs.length > 0) {
            if (isBroadcasting && !intervalId) {
                console.log("📢 Starting announcements...");
                startAnnouncements();
            }
        } else {
            console.log("🚫 No Metrix tab open. Stopping announcements.");
            stopAnnouncements();
        }
    });
}

/**
 * Starts sending announcements every 10 seconds with 3 random words.
 */
function startAnnouncements(): void {
    if (intervalId !== null) return; // Avoid duplicate intervals

    intervalId = setInterval(() => {
        const wordsToAnnounce = getRandomWords(3);

        // Send each word to the content script
        chrome.tabs.query({url: "*://*.discgolfmetrix.com/*"}, (tabs) => {
            if (tabs.length > 0) {
                wordsToAnnounce.forEach((word, index) => {
                    chrome.tabs.sendMessage(tabs[0].id!, {type: "NEW_ANNOUNCEMENT", text: word}, (response) => {
                        if (chrome.runtime.lastError) {
                            console.warn("⚠️ Content script not active yet:", chrome.runtime.lastError.message);
                        } else {
                            console.log(`📨 Sent announcement: ${word}`);
                        }
                    });
                });
            }
        });
    }, 10000); // Send a new set of 3 words every 10 seconds
}

/**
 * Stops the announcements.
 */
function stopAnnouncements(): void {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

/**
 * Randomly selects a specified number of words from the list of available words.
 */
function getRandomWords(count: number): string[] {
    const shuffled = testWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Listen for messages from the popup to toggle the broadcast.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "TOGGLE_BROADCAST") {
        isBroadcasting = message.enabled;
        console.log(`🔘 Broadcast ${isBroadcasting ? "ON" : "OFF"}`);
        checkMetrixTab();
        if (!isBroadcasting) {
            stopAnnouncements()
        }
    }
});

/**
 * Listen for tab updates to detect if a Metrix tab is open.
 */
chrome.tabs.onUpdated.addListener(checkMetrixTab);
chrome.tabs.onRemoved.addListener(checkMetrixTab);

console.log("🔄 Background script loaded");
