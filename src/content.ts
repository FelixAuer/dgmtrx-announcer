import {CompetitionDgm, DiscGolfMetrixAPI, PlayerDgm, PlayerResultDgm, TrackDgm} from "./discGolfMetrixAPI";
import {Division, Hole, Player, PlayerResult, PlayerRound, Round, Tournament} from "./tournament";

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

async function fetchAndProcessTournamentData() {
    const competition = await DiscGolfMetrixAPI.fetchTournamentData();

    if (competition) {
        console.log("Tournament Data:", competition);
        console.log(mapApiResponseToTournament(competition));

        // Further analysis can be done here using the structured `competition` object
        // For example, generate announcements or process player performance
    } else {
        console.log("Failed to retrieve tournament data.");
    }
}

function mapApiResponseToTournament(apiData: CompetitionDgm): Tournament {
    let {Name, CourseName, TourDateStart, TourDateEnd, Tracks, Type, SubCompetitions} = apiData;

    const holes: Hole[] = Tracks.map((trackDgm: TrackDgm, trackIndex: number) => {
        return {
            holeNumber: trackIndex,
            name: trackDgm.NumberAlt,
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
    if (SubCompetitions.length == 0) {
        SubCompetitions = [apiData]
    }
    const players: Player[] = []
    const divisions: Division[] = []
    // Process rounds (SubCompetitions)
    const rounds: Round[] = SubCompetitions.map((subCompetition: CompetitionDgm, roundIndex: number) => {
        const playerRounds = subCompetition.Results.map((playerDgm: PlayerDgm): PlayerRound => {
            const player = findOrCreatePlayer(players, playerDgm)
            const division = findOrCreateDivision(divisions, playerDgm)
            addPlayerToDivision(division, player)
            const playerResults = playerDgm.PlayerResults.map((playerResultDgm: PlayerResultDgm, holeIndex: number): PlayerResult => {
                const hole = holes[holeIndex]
                const playerResult: PlayerResult = {
                    diff: playerResultDgm.Diff,
                    result: playerResultDgm.Result,
                    player: player,
                    hole: hole,
                    playerRound: {
                        player: {
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
            })
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
    console.log(players)

    // Update the tournament with the rounds we've processed
    tournament.rounds = rounds;
    tournament.divisions = divisions;
    tournament.holes = holes;

    return tournament;
}

function findOrCreatePlayer(players: Player[], playerDgm: PlayerDgm): Player {
    // Try to find the player by name
    let player = players.find(p => p.userId === playerDgm.UserID);

    // If player doesn't exist, create a new player and add to the array
    if (!player) {
        player = {
            place: 0,
            userId: playerDgm.UserID,  // Assuming you have a method to generate a unique ID
            name: playerDgm.Name,
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

function findOrCreateDivision(divisions: Division[], playerDgm: PlayerDgm): Division {
    // Try to find the player by name
    var name = playerDgm.Group ?? "Alle Spieler"
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

function addPlayerToDivision(division: Division, player: Player): void {
    player.division = division;
    // Check if the player is already in the division
    const existingPlayer = division.players.find(p => p.userId === player.userId);

    // If the player is not in the division, add them
    if (!existingPlayer) {
        division.players.push(player);
    }
}


// Call the function to test fetching and processing
fetchAndProcessTournamentData();