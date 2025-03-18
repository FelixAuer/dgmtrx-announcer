import {CompetitionDgm} from "./discGolfMetrixAPI";
import {Tournament} from "./tournament";

export class TournamentStorage {
    /**
     * Store the Metrix API response as JSON in local storage.
     * This avoids circular dependencies by saving only the raw API data.
     * @param apiResponse The original Metrix API response.
     */
    static async store(competition: CompetitionDgm): Promise<void> {
        await chrome.storage.local.set({tournamentData: JSON.stringify(competition)});
    }

    /**
     * Retrieve the previous tournament data from local storage and parse it into a Tournament object.
     * @returns Parsed Tournament object or null if no data is found.
     */
    static async load(): Promise<Tournament | null> {
        const data = await chrome.storage.local.get();
        const json = data.tournamentData; // Extract the stored JSON string
        if (!json) return null;

        const apiData = JSON.parse(json); // Now it's a valid string
        return Tournament.fromCompetition(apiData); // Convert API response back to a Tournament object

    }
}
