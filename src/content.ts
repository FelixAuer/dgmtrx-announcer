chrome.runtime.onMessage.addListener((message) => {
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

