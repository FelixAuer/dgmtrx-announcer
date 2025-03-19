// The basic general announcement rule for player finishing a hole
import {PlayerResult} from "./tournament";
import {AnnouncementGenerator, AnnouncementRule} from "./announcementGenerator";

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

const exclamationRule = new AnnouncementRule(
    [
        (data: PlayerResult) => data.diff <= -1
        // You can expand this condition to include "or better" if you add more types.
    ],
    (data: PlayerResult) => {
        const exclamations = ["Yeah!", "Wow!", "Irre!", "I wear narrisch!"];
        return exclamations[Math.floor(Math.random() * exclamations.length)];
    },
    ["exclamation"],
    10,  // Interest level (can be adjusted)
    1,    // Order: 1 means this rule's announcement will come first.
    (data: PlayerResult) => {
        // Side effect: mark player as followed so that later rules know the player is being followed.
        data.player.followed = true;
    }
);

// Basic score announcement: Always announce the basic score result.
// This rule gets a higher order number (e.g., 2) so it plays after the exclamation rule.
const basicAnnouncementRule = new AnnouncementRule(
    [
        // No conditions (always true)
        (data) => data.player.followed
    ],
    (data: PlayerResult) => {
        return ` ${data.player.name} hat gerade mit einem ${result(data)} das Loch ${data.hole.name} Par ${data.hole.par} beendet.`;
    },
    ["basic_score"],
    1,   // Interest level (lower than exclamation)
    2    // Order: 2 means this announcement comes after those with order 1.
);

// Register the rules.
AnnouncementGenerator.register(exclamationRule);
AnnouncementGenerator.register(basicAnnouncementRule);
