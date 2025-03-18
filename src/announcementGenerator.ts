import {PlayerResult} from "./tournament";

// The AnnouncementRule class, which has conditions and generates the message
class AnnouncementRule {
    constructor(
        private conditions: ((playerResult: PlayerResult) => boolean)[],  // A list of conditions
        private message: (playerResult: PlayerResult) => string  // Function to generate the message
    ) {
    }

    // Checks if the announcement should be triggered based on the conditions
    matches(playerResult: PlayerResult): boolean {
        return this.conditions.every(condition => condition(playerResult));
    }

    // Generates the message if the conditions match
    generateMessage(playerResult: PlayerResult): string {
        return this.message(playerResult);
    }
}

// The AnnouncementRegistry class, which will hold and manage all registered announcements
export class AnnouncementGenerator {
    private static announcements: AnnouncementRule[] = [];

    // Register a new announcement rule
    static registerAnnouncement(rule: AnnouncementRule): void {
        this.announcements.push(rule);
    }

    // Generate announcements based on player results
    static generateAnnouncements(playerResult: PlayerResult): string[] {
        const messages: string[] = [];
        this.announcements.forEach(rule => {
            if (rule.matches(playerResult)) {
                messages.push(rule.generateMessage(playerResult));
            }
        });
        return messages;
    }
}

// The basic general announcement rule for player finishing a hole
function result(playerResult: PlayerResult): string {
    if (playerResult.result == 1) {
        return "Ace"
    }
    switch (playerResult.diff) {
        case -3:
            return "Albatross"
        case -2:
            return "Eagle"
        case -1:
            return "Birdie"
        case 0:
            return "Par"
        case 1:
            return "Bogey"
        case 2:
            return "Double Bogey"
        case 3:
            return "Triple Bogey"
        case 4:
            return "Quadruple Bogey"
        default:
            return "Mega-Bogey mit Plus " + playerResult.diff
    }
}

// Register the basic announcement rule
AnnouncementGenerator.registerAnnouncement(new AnnouncementRule(
    [
        (playerResult) => playerResult.player.followed  // No conditions, this will always trigger
    ],
    (playerResult) => {
        // Return the message in German
        return `Spieler ${playerResult.player.name} hat gerade das Loch ${playerResult.hole.name} beendet (Par: ${playerResult.hole.par}) mit einem ${result(playerResult)}.`;
    }
));

