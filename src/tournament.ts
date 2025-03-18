export type Hole = {
    holeNumber: number;
    name: string;
    par: number;
    results: PlayerResult[];  // Results for this hole across all players and rounds
};

export type Player = {
    userId: string;
    name: string;
    place: number;
    division: Division;
    playerRounds: PlayerRound[];  // Player's rounds
};

export type PlayerRound = {
    player: Player;
    results: PlayerResult[];
    sum: number;
    diff: number;
    round: Round;
};

export type PlayerResult = {
    hole: Hole;  // Referencing hole directly by number
    player: Player;
    playerRound: PlayerRound;
    result: string;
    diff: number;
};

export type Division = {
    name: string;
    players: Player[];
};

export type Round = {
    number: number;
    playerRounds: PlayerRound[];  // Each round contains results for all players
};

export class Tournament {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    courseName: string;
    competitionType: string;  // e.g., "Stroke Play"
    divisions: Division[];  // Multiple divisions
    holes: Hole[];  // Holes tracked across all rounds/divisions
    rounds: Round[];

    constructor(
        id: number,
        name: string,
        startDate: string,
        endDate: string,
        courseName: string,
        competitionType: string,
        divisions: Division[],
        holes: Hole[],
        rounds: Round[]
    ) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.courseName = courseName;
        this.competitionType = competitionType;
        this.divisions = divisions;
        this.holes = holes;
        this.rounds = rounds;
    }

    // Helper method to find a specific player result in the old tournament data
    findOldResult(playerId: string, holeNumber: number, roundNumber: number): PlayerResult | undefined {
        for (const division of this.divisions) {
            for (const player of division.players) {
                for (const playerRound of player.playerRounds) {
                    if (player.userId === playerId) {
                        const result = playerRound.results.find(r => r.hole.holeNumber === holeNumber && r.playerRound.round.number === roundNumber);
                        if (result) return result;
                    }
                }
            }
        }
        return undefined;
    }

    // Method to detect new or changed player results compared to an old tournament
    getNewPlayerResults(oldTournament: Tournament): PlayerResult[] {
        const newResults: PlayerResult[] = [];

        for (const division of this.divisions) {
            for (const player of division.players) {
                for (const playerRound of player.playerRounds) {
                    for (const result of playerRound.results) {
                        const oldResult = oldTournament.findOldResult(player.userId, result.hole.holeNumber, playerRound.round.number);
                        // If the result is new or has changed, add it to the list
                        if (!oldResult) {
                            newResults.push(result);
                        }
                    }
                }
            }
        }

        return newResults;
    }
}

