// A condition is a function that, given a PlayerResult, returns a boolean.
import {PlayerResult} from "./tournament";

export type Condition = (data: PlayerResult) => boolean;

// The AnnouncementRule class holds the conditions, the message generator,
// an interest level, and a list of tags that describe the content of the announcement.
export class AnnouncementRule {
    constructor(
        private conditions: Condition[],
        private message: (data: PlayerResult) => string,
        private tags: string[],
        private interestLevel: number,
        private order: number,
        private sideEffect?: (data: PlayerResult) => void
    ) {
    }

    // Checks if all conditions are met.
    matches(data: PlayerResult): boolean {
        return this.conditions.every(condition => condition(data));
    }

    // Applies the side effect if defined.
    apply(data: PlayerResult): void {
        if (this.sideEffect) {
            this.sideEffect(data);
        }
    }

    // Generates the announcement text.
    generateMessage(data: PlayerResult): string {
        return this.message(data);
    }

    // Returns the tags associated with this announcement.
    getTags(data: PlayerResult): string[] {
        // In a more advanced version, tags might be dynamic.
        // Here we assume the tags are as provided.
        return this.tags;
    }

    // Returns the interest level.
    getInterestLevel(): number {
        return this.interestLevel;
    }

    getOrder(): number {
        return this.order;
    }
}

// The AnnouncementRegistry holds all the rules.
export class AnnouncementGenerator {
    private static announcements: AnnouncementRule[] = [];

    // Call this to register a new announcement rule.
    static register(rule: AnnouncementRule): void {
        this.announcements.push(rule);
    }

    // Given player result data, generate a list of announcement messages.
    static generateAnnouncements(data: PlayerResult): string[] {
        const rules = this.announcements.slice();
        rules.sort((a, b) => {
            if (a.getOrder() !== b.getOrder()) {
                return a.getOrder() - b.getOrder();
            }
            if (a.getInterestLevel() !== b.getInterestLevel()) {
                return b.getInterestLevel() - a.getInterestLevel();
            }
            // For equal order and interest, randomize order
            return Math.random() - 0.5;
        });

        const usedTags = new Set<string>();
        const messages: string[] = [];

        // Process each rule in the sorted order.
        for (const rule of rules) {
            const ruleTags = rule.getTags(data);
            if (ruleTags.some(tag => usedTags.has(tag))) {
                continue;
            }
            if (rule.matches(data)) {
                // Check if any of the rule's tags have already been used.
                // Apply the rule's side effect before evaluating subsequent rules.
                rule.apply(data);

                // Generate the message and mark the rule's tags as used.
                messages.push(rule.generateMessage(data));
                ruleTags.forEach(tag => usedTags.add(tag));
            }
        }
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

const exclamationRule = new AnnouncementRule(
    [
        (data: PlayerResult) => data.diff <= -1
        // You can expand this condition to include "or better" if you add more types.
    ],
    (data: PlayerResult) => {
        const exclamations = ["Yeah!", "Wow!", "Irre!", "I wear narrisch!"];
        const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];
        return randomExclamation;
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

