// The basic general announcement rule for player finishing a hole
import {PlayerResult} from "./tournament";
import {AnnouncementGenerator, AnnouncementRule} from "./announcementGenerator";

const exclamation = "exclamation"
const PLAYER_NAME = "player_name"
const HOLE = "hole"
const RESULT = "result"
const ROUND_SCORE = "round_score"
const TOURNAMENT_SCORE = "tournament_score"
const PLACE = "place"
const NUMBER_OF_HOLES = "number_of_holes"

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

// Register the rules.

export function registerAnnouncements() {
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) => ((data.diff <= -1) && (Math.random() < 0.5))
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Yeah!", "Wow!", "Irre!", "Ih wer narrisch!", "Da Hund Olta!"];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        ["exclamation"],
        10,  // Interest level (can be adjusted)
        1,    // Order: 1 means this rule's announcement will come first.
        (data: PlayerResult) => {
            // Side effect: mark player as followed so that later rules know the player is being followed.
            data.player.followed = true;
        }));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) => ((data.diff == 0) && (Math.random() < 0.2))
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Besser als ein Stein am Schädel.", "Stabil.", "Passt schon."];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        ["exclamation"],
        10,  // Interest level (can be adjusted)
        1,    // Order: 1 means this rule's announcement will come first.
        (data: PlayerResult) => {
            // Side effect: mark player as followed so that later rules know the player is being followed.
            data.player.followed = true;
        }));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) => ((data.diff == 1) && (Math.random() < 0.5))
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Auweh.", "Uff.", "Na geh.", "Schade.", "Oh Maria."];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        ["exclamation"],
        10,  // Interest level (can be adjusted)
        1,    // Order: 1 means this rule's announcement will come first.
        (data: PlayerResult) => {
            // Side effect: mark player as followed so that later rules know the player is being followed.
            data.player.followed = true;
        }));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) => ((data.diff == 2) && (Math.random() < 0.7))
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Jetzt frisst er.", "Gschissn", "Uh, versemmelt.", "Das tut weh.", "Scheiße.", "Er gibt sicher sein Bestes."];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        ["exclamation"],
        10,  // Interest level (can be adjusted)
        1,    // Order: 1 means this rule's announcement will come first.
        (data: PlayerResult) => {
            // Side effect: mark player as followed so that later rules know the player is being followed.
            data.player.followed = true;
        }));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) => data.diff >= 3
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Jetzt frisst er richtig.", "Disc Golf gibt und Disc Golf nimmt. Jetzt nimmt es.", "So ein Dreck!", "Das tut jetzt sicher richtig weh.", "Himmel, Arsch und Zwirn!"];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        ["exclamation"],
        10,  // Interest level (can be adjusted)
        1,    // Order: 1 means this rule's announcement will come first.
        (data: PlayerResult) => {
            // Side effect: mark player as followed so that later rules know the player is being followed.
            data.player.followed = true;
        }));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed
        ],
        (data: PlayerResult) => {
            return ` ${data.player.name}`;
        },
        [PLAYER_NAME],
        1,
        100
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed
        ],
        (data: PlayerResult) => {
            return ` ${data.hole.name} PAR ${data.hole.par}`;
        },
        [HOLE],
        1,
        101
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed
        ],
        (data: PlayerResult) => {
            return result(data);
        },
        [RESULT],
        1,
        102
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed
        ],
        (data: PlayerResult) => {
            let diff: number | string = data.playerRound.diff;
            if (diff >= 0) {
                diff = " plus " + diff
            }
            return `Rundenscore: ${data.playerRound.sum} ${diff}`
        },
        [ROUND_SCORE],
        1,
        103
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => false // TODO berechnung für ansage bauen
        ],
        (data: PlayerResult) => {
            let diff: number | string = data.playerRound.diff;
            if (diff >= 0) {
                diff = " plus " + diff
            }
            return `Turnierscore: ${data.playerRound.sum} ${diff}`
        },
        [TOURNAMENT_SCORE],
        1,
        104
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed
        ],
        (data: PlayerResult) => {
            return `Aktueller Platz: ${data.player.place}`
        },
        [PLACE],
        1,
        105
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed
        ],
        (data: PlayerResult) => {
            return `${18 - data.playerRound.results.length} Löcher verbleibend`
        },
        [NUMBER_OF_HOLES],
        1,
        105
    ));
}
