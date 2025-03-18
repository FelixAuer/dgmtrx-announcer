import {CompetitionDgm, PlayerDgm, PlayerResultDgm, TrackDgm} from "./discGolfMetrixAPI";

export type Hole = {
    average: number;
    difficulty: number;
    holeNumber: number;
    name: string;
    par: number;
    results: PlayerResult[];  // Results for this hole across all players and rounds
};

export type Player = {
    userId: string;
    followed: boolean;
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
    result: number;
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


    public static fromCompetition(apiData: CompetitionDgm): Tournament {
        let {Name, CourseName, TourDateStart, TourDateEnd, Tracks, Type, SubCompetitions} = apiData;

        const holes: Hole[] = Tracks.map((trackDgm: TrackDgm, trackIndex: number) => {
            return {
                average: 0,
                difficulty: 0,
                holeNumber: trackIndex + 1,
                name: trackDgm.NumberAlt.length ? trackDgm.NumberAlt : (trackIndex + 1).toString(),
                par: parseInt(trackDgm.Par),
                results: [] as PlayerResult[]
            }
        })

        // Creating the tournament object with the basic fields
        const tournament: Tournament = new Tournament(
            apiData.ID,
            Name,
            TourDateStart,
            TourDateEnd,
            CourseName,
            Type,
            [], // Empty divisions for now
            [], // Empty holes for now
            [] // Empty rounds for now
        );
        if (!apiData.HasSubcompetitions) {
            SubCompetitions = [apiData]
        }
        const players: Player[] = []
        const divisions: Division[] = []
        // Process rounds (SubCompetitions)
        const rounds: Round[] = SubCompetitions.map((subCompetition: CompetitionDgm, roundIndex: number) => {
            const playerRounds = subCompetition.Results.map((playerDgm: PlayerDgm): PlayerRound => {
                const player = Tournament.findOrCreatePlayer(players, playerDgm)
                const division = Tournament.findOrCreateDivision(divisions, playerDgm)
                Tournament.addPlayerToDivision(division, player)
                const playerResults = playerDgm.PlayerResults.map((playerResultDgm: PlayerResultDgm, holeIndex: number): PlayerResult => {
                    const hole = holes[holeIndex]
                    const playerResult: PlayerResult = {
                        diff: playerResultDgm.Diff,
                        result: parseInt(playerResultDgm.Result),
                        player: player,
                        hole: hole,
                        playerRound: {
                            player: {
                                followed: false,
                                place: 1,
                                userId: "",
                                name: "",
                                division: {
                                    name: "",
                                    players: []
                                },
                                playerRounds: [],
                            },
                            results: [],
                            sum: 0,
                            diff: 0,
                            round: {
                                number: 0,
                                playerRounds: []
                            }
                        }
                    }
                    hole.results.push(playerResult)
                    return playerResult
                }).filter((playerResult: PlayerResult) => playerResult.diff != undefined)
                const playerRound = {
                    player: player,
                    diff: playerDgm.Diff,
                    results: playerResults,
                    round: {
                        number: 0,
                        playerRounds: []
                    },
                    sum: 0
                }
                playerResults.forEach((result) => {
                    result.playerRound = playerRound
                })
                player.playerRounds.push(playerRound)
                return playerRound
            });

            const round: Round = {
                number: roundIndex + 1,
                playerRounds: playerRounds
            };
            playerRounds.forEach((playerRound) => {
                playerRound.round = round
            })

            return round
        });

        players.forEach(async (player: Player) => player.followed = await isPlayerFollowed(player.name))

        // Update the tournament with the rounds we've processed
        tournament.rounds = rounds;
        tournament.divisions = divisions;
        tournament.holes = holes;

        return tournament;
    }


    private static findOrCreatePlayer(players: Player[], playerDgm: PlayerDgm): Player {
        // Try to find the player by name
        let player = players.find(p => p.userId === playerDgm.UserID);

        // If player doesn't exist, create a new player and add to the array
        if (!player) {
            player = {
                place: 0,
                userId: playerDgm.UserID,  // Assuming you have a method to generate a unique ID
                name: playerDgm.Name,
                followed: false,
                division: {name: "Default", players: []},  // Placeholder division, will be filled later
                playerRounds: [],
            };

            // Add the new player to the players array
            players.push(player);
        }
        player.place = playerDgm.Place

        // Return the player (either existing or newly created)
        return player;
    }

    private static findOrCreateDivision(divisions: Division[], playerDgm: PlayerDgm): Division {
        // Try to find the player by name
        const name = playerDgm.ClassName ?? "Alle Spieler"
        let division = divisions.find(p => p.name === name);
        // If player doesn't exist, create a new player and add to the array
        if (!division) {
            division = {
                name: name,
                players: []
            };
            divisions.push(division);
        }

        // Return the player (either existing or newly created)
        return division;
    }

    private static addPlayerToDivision(division: Division, player: Player): void {
        player.division = division;
        // Check if the player is already in the division
        const existingPlayer = division.players.find(p => p.userId === player.userId);

        // If the player is not in the division, add them
        if (!existingPlayer) {
            division.players.push(player);
        }
    }

    public static detectNewPlayerResults(newTournament: Tournament, oldTournament: Tournament): PlayerResult[] {
        const newResults: PlayerResult[] = [];

        for (const division of newTournament.divisions) {
            for (const player of division.players) {
                for (const playerRound of player.playerRounds) {
                    for (const result of playerRound.results) {
                        const oldResult = oldTournament.findOldResult(player.userId, result.hole.holeNumber, playerRound.round.number);

                        // If no previous result exists, it's new
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

async function isPlayerFollowed(playerName: string) {
    const storedData = await chrome.storage.local.get("followedPlayers");
    const followedPlayers = storedData["followedPlayers"] || [];
    return followedPlayers.includes(playerName);
}
