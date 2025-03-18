import {PlayerResult, Tournament} from "./tournament";

export interface TournamentPreprocessor {
    /**
     * Process the tournament data.
     * This method can modify the tournament in place or extract information for later use.
     */
    process(tournament: Tournament): void;
}

// Registry to hold and run preprocessors.
export class TournamentPreprocessorRegistry {
    private static preprocessors: TournamentPreprocessor[] = [];

    // Register a new preprocessor.
    static register(preprocessor: TournamentPreprocessor): void {
        this.preprocessors.push(preprocessor);
    }

    // Run all registered preprocessors on the given tournament.
    static runPreprocessors(tournament: Tournament): void {
        this.preprocessors.forEach(preprocessor => preprocessor.process(tournament));
    }
}

class AverageScorePreprocessor implements TournamentPreprocessor {
    process(tournament: Tournament): void {
        tournament.holes.forEach(hole => {
            let total = 0;
            let count = 0;
            hole.results.forEach((holeResult: PlayerResult) => {
                // We assume the player result's "result" field is a numeric string.
                // Depending on your implementation, you might need to adjust this conversion.
                const score = holeResult.result
                if (!isNaN(score)) {
                    total += score;
                    count++;
                }
            });
            // Add an averageScore property to the hole.
            hole.average = count > 0 ? Math.round((total / count) * 100) / 100 : 0;
        });
    }
}

class HoleRankingPreprocessor implements TournamentPreprocessor {
    process(tournament: Tournament): void {
        // Map each hole to an object that includes its difficulty measure.
        // We assume that each hole has an `averageScore` property (computed earlier)
        const holesWithDiff = tournament.holes.map(hole => {
            // Calculate the difference between average score and par.
            // If no average is available, assume 0 difference.
            const diff = (hole.average !== undefined && hole.average !== 0)
                ? hole.average - hole.par
                : 0;
            return { hole, diff };
        });

        // Sort the holes in ascending order of diff.
        // The easiest hole (lowest diff) comes first.
        holesWithDiff.sort((a, b) => a.diff - b.diff);

        // Assign a rank based on the sorted order:
        // The easiest gets rank 1, the hardest gets rank equal to the number of holes (e.g., 18).
        holesWithDiff.forEach((item, index) => {
            item.hole.difficulty = index + 1;
        });
    }
}

TournamentPreprocessorRegistry.register(new AverageScorePreprocessor());
TournamentPreprocessorRegistry.register(new HoleRankingPreprocessor());