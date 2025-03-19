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

