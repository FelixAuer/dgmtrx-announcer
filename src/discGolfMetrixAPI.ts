// Types for the DiscGolfMetrix response

export type TrackDgm = {
    Number: string;
    NumberAlt: string;
    Par: string;
};

export type PlayerResultDgm = {
    Result: string;
    Diff: number;
};

export type PlayerDgm = {
    UserID: string;
    ScorecardID: string;
    Name: string;
    CountryCode: string;
    PlayerResults: PlayerResultDgm[];
    Sum: number;
    Diff: number;
    Place: number;
    OrderNumber: number;
    Group: string | null;
    ClassName: string | null;
};

export type CompetitionDgm = {
    ID: number;
    Name: string;
    Type: string;
    TourDateStart: string;
    TourDateEnd: string;
    Date: string;
    Time: string;
    CourseName: string;
    CourseID: string;
    MetrixMode: string;
    Results: PlayerDgm[];
    Tracks: TrackDgm[];
    HasSubcompetitions: boolean;
    SubCompetitions: CompetitionDgm[];
};

export class DiscGolfMetrixAPI {
    private static API_URL = "https://discgolfmetrix.com/api.php?content=result&id=";

    // Function to fetch and parse the tournament data
    public static async fetchTournamentData(tournamentId: string): Promise<CompetitionDgm | null> {
        try {
            const response = await fetch(this.API_URL + tournamentId);
            if (!response.ok) {
                throw new Error("Failed to fetch data from DiscGolfMetrix API");
            }

            const data = await response.json();
            console.log(data)
            return data.Competition;
        } catch (error) {
            console.error("Error fetching tournament data:", error);
            return null;
        }
    }
}
