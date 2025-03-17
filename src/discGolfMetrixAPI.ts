// Types for the DiscGolfMetrix response

type Track = {
    Number: string;
    NumberAlt: string;
    Par: string;
};

type PlayerResult = {
    Result: string;
    Diff: number;
    BUE: string;
    GRH: string;
    OCP: string;
    ICP: string;
    IBP: string;
    PEN: string;
};

type Player = {
    UserID: string;
    ScorecardID: string;
    Name: string;
    CountryCode: string;
    PlayerResults: PlayerResult[][];
    Sum: number;
    Diff: number;
    Place: number;
    OrderNumber: number;
};

type Competition = {
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
    Results: Player[];
    Tracks: Track[];
    SubCompetitions: Competition[];
};

export class DiscGolfMetrixAPI {
    private static API_URL = "https://discgolfmetrix.com/api.php?content=result&id=3226256";

    // Function to fetch and parse the tournament data
    public static async fetchTournamentData(): Promise<Competition | null> {
        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) {
                throw new Error("Failed to fetch data from DiscGolfMetrix API");
            }

            const data = await response.json();
            return data.Competition;
        } catch (error) {
            console.error("Error fetching tournament data:", error);
            return null;
        }
    }
}
