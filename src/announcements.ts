// The basic general announcement rule for player finishing a hole
import {PlayerResult} from "./tournament";
import {AnnouncementGenerator, AnnouncementRule} from "./announcementGenerator";

const EXCLAMATION = "exclamation"
const PLAYER_NAME = "player_name"
const HOLE = "hole"
const RESULT = "result"
const ROUND_SCORE = "round_score"
const TOURNAMENT_SCORE = "tournament_score"
const PLACE = "place"
const NUMBER_OF_HOLES = "number_of_holes"

function diff(diff: number | string) {
    if (diff >= 0) {
        diff = " plus " + diff
    }
    return diff;
}

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
            (data: PlayerResult) =>
                data.player.followed &&
                data.playerRound.round.number == 1 && // erste runde
                data.playerRound.results.length == 1 && // erstes loch
                data.diff <= -1 // birdie
        ],
        (data: PlayerResult) => {
            const outputs = [
                `Super Start ins Turnier für ${data.playerRound.player.name}! ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `${data.playerRound.player.name} holt sich direkt mit der ersten Bahn Loch ${data.hole.name} Par ${data.hole.par} einen ${result(data)}! So startet man gern in die erste Runde.`,
                `Perfekter Auftakt für ${data.playerRound.player.name}! ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Was für ein Start ins Turnier! ${data.playerRound.player.name} mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Ein Traumstart für ${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}. Weiter so!`,
                `Stark gespielt! ${data.playerRound.player.name} startet mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `So kann es weitergehen! ${data.playerRound.player.name} beginnt die Runde mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Fantastischer Start für ${data.playerRound.player.name}! Direkt ein ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Guter Start für ${data.playerRound.player.name} mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}. Das gibt Selbstvertrauen fürs Turnier!`,
            ];
            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [EXCLAMATION, PLAYER_NAME, RESULT, HOLE],
        200,  // Interest level (can be adjusted)
        1
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) =>
                data.player.followed &&
                data.playerRound.round.number == 1 && // erste runde
                data.playerRound.results.length == 1 && // erstes loch
                data.diff == 0 // birdie
        ],
        (data: PlayerResult) => {
            const outputs = [
                `${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par} für ${data.playerRound.player.name}. Immer gut, wenn das von Tisch ist.`,
                `${data.playerRound.player.name} startet solide ins Turnier mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Ein stabiler Auftakt für ${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Kein schlechter Start: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par} für ${data.playerRound.player.name}.`,
                `${data.playerRound.player.name} bringt die erste Bahn ohne Probleme hinter sich: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Nicht spektakulär, aber solide: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par} für ${data.playerRound.player.name}.`,
                `Das Turnier beginnt mit einem soliden ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par} für ${data.playerRound.player.name}.`,
                `Ein solider Start ins Turnier für ${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Das Turnier beginnt ohne große Überraschungen für ${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`
            ];
            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [EXCLAMATION, PLAYER_NAME, RESULT, HOLE],
        200,  // Interest level (can be adjusted)
        1
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) =>
                data.player.followed &&
                data.playerRound.round.number == 1 && // erste runde
                data.playerRound.results.length == 1 && // erstes loch
                data.diff == 1 // birdie
        ],
        (data: PlayerResult) => {
            const outputs = [
                `${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par} für ${data.playerRound.player.name}. Nicht der Start den man sich wünscht.`, `${data.playerRound.player.name} startet mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}. Da ist noch Luft nach oben!`,
                `Nicht ideal: ${data.playerRound.player.name} kassiert einen ${result(data)} auf der ersten Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Ein holpriger Start für ${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `${data.playerRound.player.name} hadert mit dem Turnierstart auf Bahn ${data.hole.name} Par ${data.hole.par} und nimmt einen ${result(data)} mit.`,
                `Kein perfekter Start: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par} für ${data.playerRound.player.name}.`,
                `${data.playerRound.player.name} startet das Turnier mit einem kleinen Rückschlag: ${result(data)} auf Bahn ${data.hole.name}.`,
                `Nicht optimal, aber kein Drama: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par} für ${data.playerRound.player.name}.`,
                `Ein erster Dämpfer für ${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name}.`,
                `Das Turnier beginnt mit einem kleinen Rückschlag: ${data.playerRound.player.name} spielt einen ${result(data)} auf Bahn ${data.hole.name}.`,
                `${data.playerRound.player.name} erwischt keinen Traumstart: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Das erste Loch ist durch, aber leider mit einem ${result(data)} für ${data.playerRound.player.name}. Noch genug Zeit für ein Comeback!`,
                `Noch nicht ganz im Rhythmus: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par} für ${data.playerRound.player.name}.`

            ];
            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [EXCLAMATION, PLAYER_NAME, RESULT, HOLE],
        200,  // Interest level (can be adjusted)
        1
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) =>
                data.player.followed &&
                data.playerRound.round.number == 1 && // erste runde
                data.playerRound.results.length == 1 && // erstes loch
                data.diff >= 2 // birdie
        ],
        (data: PlayerResult) => {
            const outputs = [
                `Das tut richtig weh: ${data.playerRound.player.name} frisst direkt einen ${result(data)} auf der ersten Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Katastrophenstart für ${data.playerRound.player.name}! Ein ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `${data.playerRound.player.name} beginnt das Turnier mit einem echten Schocker: ${result(data)} auf Bahn ${data.hole.name}. Nicht die Art von Statement, die man setzen will!`,
                `Autsch! ${data.playerRound.player.name} mit einem ${result(data)} auf der ersten Bahn. Die Scorekarte weint, aber das Turnier ist noch lang!`,
                `Wenn das ein Drehbuch wäre, müsste man es umschreiben! ${data.playerRound.player.name} startet mit einem ${result(data)} auf Bahn ${data.hole.name}.`,
                `Wirklich kein Traumbeginn: ${data.playerRound.player.name} stolpert mit einem ${result(data)} auf Bahn ${data.hole.name} ins Turnier.`,
                `Ein Albtraum direkt am Morgen für ${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name}. Hoffentlich bleibt das die größte Baustelle heute!`,
                `Ein echter Kaltstart für ${data.playerRound.player.name}: ${result(data)} auf der ersten Bahn. Der Kaffee war wohl noch nicht stark genug!`,
                `Erstes Loch, erster Tiefschlag! ${data.playerRound.player.name} mit einem ${result(data)} auf Bahn ${data.hole.name}.`,
                `Drama direkt zum Auftakt: ${data.playerRound.player.name} spiel einen ${result(data)} auf der ersten Bahn. Die Scorekarte weint leise vor sich hin.`,
                `Oh je! ${data.playerRound.player.name} eröffnet mit einem ${result(data)}. Wenn das eine Einweihungsparty fürs Turnier war, dann ist der Kuchen gerade vom Tisch gefallen.`,
                `Es gibt sanfte Einstiege ins Turnier… und dann gibt es ${data.playerRound.player.name} mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Das Turnier hat kaum begonnen, aber die Spannung ist schon auf dem Höhepunkt: ${data.playerRound.player.name} mit einem ${result(data)} auf der ersten Bahn!`,
                `Erste Bahn, erste Bruchlandung! ${data.playerRound.player.name} muss ein ${result(data)} auf Bahn ${data.hole.name} hinnehmen.`,
                `Manche starten mit einem Birdie, andere mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.. ${data.playerRound.player.name} wählt heute die härtere Route.`
            ];
            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [EXCLAMATION, PLAYER_NAME, RESULT, HOLE],
        200,  // Interest level (can be adjusted)
        1
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === Math.floor(data.tournament?.holes.length / 2) &&
                    data.playerRound.round.number === 1 &&
                    data.player.place == 1;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `Nach den ersten ${holesPlayed} des Turniers liegt er mit ${diff(data.playerRound.diff)} am ersten Platz!`,
                `Das ist aktuell mit ${diff(data.playerRound.diff)} der erste Platz der ${data.player.division.name} Division!`,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1001,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === Math.floor(data.tournament?.holes.length / 2) &&
                    data.playerRound.round.number === 1 &&
                    data.player.place == data.player.division.players.length;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `Nach den ersten ${holesPlayed} des Turniers liegt er mit ${diff(data.playerRound.diff)} am letzten Platz! `,
                `Mit ${diff(data.playerRound.diff)} ist er aktuell Letzter! `,
                `Keiner ist aktuell schlechter als er mit seinen ${diff(data.playerRound.diff)}! `,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1001,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === Math.floor(data.tournament?.holes.length / 2) &&
                    data.playerRound.round.number === 1 &&
                    data.player.isTopThird;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `${data.player.name} befindet sich mit ${diff(data.playerRound.diff)} über Par auf dem ${data.playerRound.player.place}. Platz – Top-Leistung!`,
                `Nach den ersten ${holesPlayed} Löchern liegt der Spieler mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place} und im Top-Drittel der Division!`,
                `Aktueller Rundenscore: ${diff(data.playerRound.diff)}, Platz: ${data.playerRound.player.place} – Ein solider Start ins Turnier!`,
                `Halbzeit! Der Spieler hat ${holesPlayed} Löcher gespielt und ist mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Das gibt Selbstvertrauen für die zweite Hälfte.`,
                `Mit ${holesPlayed} gespielten Löchern und einem Score von ${diff(data.playerRound.diff)} über Par steht der Spieler auf Platz ${data.playerRound.player.place}. Platz – eine starke Leistung!`,
                `Der Spieler liegt mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz und zeigt, dass er nach der ersten Hälfte des Turniers im Top-Drittel ist!`,
                `Aktueller Platz: ${data.playerRound.player.place} – mit ${holesPlayed} gespielten Löchern liegt der Spieler mit ${diff(data.playerRound.diff)} im oberen Drittel.`,
                `Halbzeit! Der Spieler spielt ein bisher ein top Turnier und liegt mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place}.`
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length == Math.floor(data.tournament?.holes.length / 2) &&
                    data.playerRound.round.number == 1 &&
                    data.player.isMiddleThird
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `Halbzeit! Nach den ersten ${holesPlayed} Löchern liegt er bei ${diff(data.playerRound.diff)} über die Runde und steht auf Platz ${data.playerRound.player.place}.`,
                `Nach ${holesPlayed} gespielten Löchern liegt der Spieler mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz.`,
                `Halbzeit-Update: ${holesPlayed} Löcher gespielt, der Spieler liegt bei ${diff(data.playerRound.diff)} und steht aktuell auf Platz ${data.playerRound.player.place}.`,
                `Aktueller Roundscore ${diff(data.playerRound.diff)}, Platz ${data.playerRound.player.place}.`,
                `Mit ${holesPlayed} gespielten Löchern steht der Spieler bei ${diff(data.playerRound.diff)} und aktuell auf Platz ${data.playerRound.player.place}.`,
                `Mit ${holesPlayed} Löchern gespielt steht der Spieler bei ${diff(data.playerRound.diff)} und aktuell auf Platz ${data.playerRound.player.place}.`,
                `Nach den ersten ${holesPlayed} liegt der Score bei ${diff(data.playerRound.diff)} – das ist aktuell Platz ${data.playerRound.player.place}.`,
                `Der Spieler steht nach den ersten ${holesPlayed} Löchern des Turniers bei ${diff(data.playerRound.diff)} und aktuell auf Platz ${data.playerRound.player.place}.`,
                `Der Spieler hat ${holesPlayed} Löcher gespielt und liegt mit ${diff(data.playerRound.diff)} über Par auf dem ${data.playerRound.player.place}. Platz.`,
                `${holesPlayed} gespielte Löcher, ${diff(data.playerRound.diff)} über Par und derzeit Platz ${data.playerRound.player.place}.`,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === Math.floor(data.tournament?.holes.length / 2) &&
                    data.playerRound.round.number === 1 &&
                    data.player.isBottomThird;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `Nach ${holesPlayed} Löchern liegt er mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Es wird schwer, hier noch etwas zu reißen.`,
                `Nach den ersten ${holesPlayed} liegt er mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Eine starke Leistung in der zweiten Hälfte wird notwendig sein, um noch aufzuholen.`,
                `Halbzeit! Der Spieler steht nach ${holesPlayed} Löchern bei ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Die Aufholjagd wird schwierig.`,
                `Mit ${holesPlayed} gespielten Löchern liegt er mit ${diff(data.playerRound.diff)} über Par auf dem eher verhaltenen ${data.playerRound.player.place}. Platz.`,
                `Aktuell liegt er mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz.`,
                `Er steht mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Es ist noch alles offen, aber der Rückstand ist nicht zu unterschätzen.`,
                `Halbzeit-Update: Nach ${holesPlayed} Löchern und ${diff(data.playerRound.diff)} liegt er auf dem ${data.playerRound.player.place}. Platz. Die Aufholjagd wird nicht einfach.`,
                `Nach den ersten ${holesPlayed} Löchern und ${diff(data.playerRound.diff)} über Par steht er auf dem ${data.playerRound.player.place}. Platz. Es könnte schwer werden, noch nach vorne zu kommen.`,
                `Halbzeit! Der Spieler hat ${holesPlayed} Löcher gespielt und liegt mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Das wird mental eine harte zweite Hälfte.`,
                `Der Spieler liegt nach ${holesPlayed} gespielten Löchern mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Eher mau.`
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    //  ROUND 1 LAST 3
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === (data.tournament?.holes.length - 3) &&
                    data.playerRound.round.number === 1 &&
                    data.player.place == 1;
            }
        ],
        (data: PlayerResult) => {
            const outputs = [
                `${data.player.name} geht als Leader der ${data.player.division.name} Division mit einem Rundenscore von ${diff(data.playerRound.diff)} in die letzten 3!`,
                `Mit 3 verbleibenden Bahnen in Runde 1 liegt er damit mit einem Score von ${diff(data.playerRound.diff)} am ersten Platz. Wir werden sehen, ob er das so heim bringen kann.`,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1001,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === (data.tournament?.holes.length - 3) &&
                    data.playerRound.round.number === 1 &&
                    data.player.place == data.player.division.players.length;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `Mit drei Löchern vor sich war es eine harte erste Runde für ${data.player.name}: ${diff(data.playerRound.diff)} über die Runde und aktuell letzter Platz.`,
                `${data.player.name} hat nur noch drei Löcher zu spielen, aber es sieht nicht gut aus. Aktuell hält er den letzten Platz mit ${diff(data.playerRound.diff)} über die Runde.`,
                `Drei Löcher noch, aber die Runde läuft nicht nach Plan: ${data.player.name} ist auf dem letzten Platz und kämpft um Schadensbegrenzung. Aktuell ${diff(data.playerRound.diff)}`
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1001,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === (data.tournament?.holes.length - 3) &&
                    data.playerRound.round.number === 1 &&
                    data.player.isTopThird;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `${data.player.name} befindet sich mit ${diff(data.playerRound.diff)} über Par auf dem ${data.playerRound.player.place}. Platz und spielt vorne mit!`,
                `Nach den ersten ${holesPlayed} Löchern liegt der Spieler mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place} und im Top-Drittel der Division!`,
                `Aktueller Rundenscore: ${diff(data.playerRound.diff)}, Platz: ${data.playerRound.player.place} – Die erste Runde ist fast vorbei und sieht bis jetzt ganz gut aus!`,
                `Noch 3 Bahnen in der Runde und er ist mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz.`,
                `Mit ${holesPlayed} gespielten Löchern und einem Score von ${diff(data.playerRound.diff)} über Par steht der Spieler auf Platz ${data.playerRound.player.place}. Platz.`,
                `Der Spieler liegt mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz und damit aktuell im oberen Drittel der ${data.player.division.name} Division!`,
                `Aktueller Platz: ${data.playerRound.player.place} – mit noch 3 Bahnen liegt der Spieler mit ${diff(data.playerRound.diff)} im oberen Drittel.`,
                `Der Spieler spielt bisher ein top erste Runde und liegt mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place}.`
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length == (data.tournament?.holes.length - 3) &&
                    data.playerRound.round.number == 1 &&
                    data.player.isMiddleThird
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `Final Stretch! Mit 3 verbleibenden Löchern liegt er bei ${diff(data.playerRound.diff)} über die Runde und steht auf Platz ${data.playerRound.player.place}.`,
                `Nach ${holesPlayed} gespielten Löchern liegt der Spieler mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz.`,
                `${holesPlayed} Löcher gespielt, der Spieler liegt bei ${diff(data.playerRound.diff)} und steht aktuell auf Platz ${data.playerRound.player.place}.`,
                `Aktueller Roundscore ${diff(data.playerRound.diff)}, Platz ${data.playerRound.player.place}, noch 3 Bahnen.`,
                `Mit ${holesPlayed} gespielten Löchern steht der Spieler bei ${diff(data.playerRound.diff)} und aktuell auf Platz ${data.playerRound.player.place}.`,
                `Mit 3 verbleibenden Löchern steht der Spieler bei ${diff(data.playerRound.diff)} und aktuell auf Platz ${data.playerRound.player.place}.`,
                `Aktueller Score: ${diff(data.playerRound.diff)} – das ist Platz ${data.playerRound.player.place} in der ${data.player.division.name}.`,
                `Der Spieler steht bei ${diff(data.playerRound.diff)} und aktuell auf Platz ${data.playerRound.player.place}.`,
                `Der Spieler hat ${holesPlayed} Löcher gespielt und geht mit ${diff(data.playerRound.diff)} und dem ${data.playerRound.player.place}. Platz in die finalen 3 Löcher der ersten Runde`,
                `${holesPlayed} gespielte Löcher, ${diff(data.playerRound.diff)} über Par und derzeit Platz ${data.playerRound.player.place}.`,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === (data.tournament?.holes.length - 3) &&
                    data.playerRound.round.number === 1 &&
                    data.player.isBottomThird;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `Nach ${holesPlayed} Löchern liegt er mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Es wird schwer, hier noch etwas zu reißen.`,
                `Nach den ersten ${holesPlayed} liegt er mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Diese Runde wird wahrscheinlich nix mehr.`,
                `Der Spieler steht vor den letzten 3 bei ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz.`,
                `Mit ${holesPlayed} gespielten Löchern liegt er mit ${diff(data.playerRound.diff)} über Par auf dem eher verhaltenen ${data.playerRound.player.place}. Platz.`,
                `Aktuell liegt er mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz.`,
                `Er steht mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Stockerl wirds wahrscheinlich nicht mehr.`,
                `Nach ${holesPlayed} Löchern und ${diff(data.playerRound.diff)} liegt er auf dem ${data.playerRound.player.place}. Platz. Unteres Drittel.`,
                `3 verbleibende Löcher: mit ${diff(data.playerRound.diff)} über Par steht er auf dem ${data.playerRound.player.place}. Platz. Hoch gewinnt er es nicht mehr.`,
                `Der Spieler hat ${holesPlayed} Löcher gespielt und liegt mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. Hoffentlich wird die nächste Runde besser.`,
                `Der Spieler liegt nach ${holesPlayed} gespielten Löchern mit ${diff(data.playerRound.diff)} auf dem ${data.playerRound.player.place}. Platz. So wird das nix mit Jomez.`
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    //  ROUND 1 FINISHED
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === data.tournament?.holes.length &&
                    data.playerRound.round.number === 1 &&
                    data.player.place == 1;
            }
        ],
        (data: PlayerResult) => {
            const outputs = [
                `Die erste Runde ist vorbei und ${data.player.name} liegt mit  ${diff(data.playerRound.diff)} auf dem ersten Platz der ${data.player.division.name}!`,
                `Er beendet die Runde mit einem Score von ${diff(data.playerRound.diff)} auf dem ersten Platz. So soll das sein!`,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1001,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === data.tournament?.holes.length &&
                    data.playerRound.round.number === 1 &&
                    data.player.place == data.player.division.players.length;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `${data.player.name} beendet die Runde auf dem allerletzten Platz mit  ${diff(data.playerRound.diff)}. Er ist sicher froh, dass es endlich vorbei ist.`,
                `Die zweite Runde kann für ${data.player.name} nur noch besser werden. Die erste beendet er mit ${diff(data.playerRound.diff)} auf dem letzten Platz.`,
                `Die Runde ist vorbei. Der Score ist ${diff(data.playerRound.diff)} und der Platz Nummer ${data.player.place} von ${data.player.place}. Eher schlecht.`
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1001,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === data.tournament?.holes.length &&
                    data.playerRound.round.number === 1 &&
                    data.player.isTopThird;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `${data.player.name} beendet die erste Runde mit ${diff(data.playerRound.diff)} und sichert sich vorerst Platz ${data.playerRound.player.place}. Starke Leistung!`,
                `Runde 1 ist abgeschlossen! Mit einem Score von ${diff(data.playerRound.diff)} liegt ${data.player.name} aktuell auf dem ${data.playerRound.player.place}. Platz – ein vielversprechender Start.`,
                `Die erste Runde ist durch, und ${data.player.name} ist vorne dabei! Aktuell steht er mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place}.`,
                `Das war’s für die erste Runde! Mit ${diff(data.playerRound.diff)} belegt ${data.player.name} momentan den ${data.playerRound.player.place}. Platz – eine gute Ausgangsposition für die zweite Runde.`,
                `Runde 1 beendet! ${data.player.name} platziert sich mit ${diff(data.playerRound.diff)} stabil im oberen Drittel auf Platz ${data.playerRound.player.place}.`,
                `Starker Auftakt! Nach der ersten Runde steht ${data.player.name} mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place} – darauf kann man aufbauen.`,
                `${data.player.name} liegt mit ${diff(data.playerRound.diff)} auf Rang ${data.playerRound.player.place} im oberen Drittel.`,
                `Mit einem Score von ${diff(data.playerRound.diff)} sichert sich ${data.player.name} nach Runde 1 den ${data.playerRound.player.place}. Platz – eine solide Basis für den weiteren Verlauf.`,
                `Ein guter Start ins Turnier! ${data.player.name} beendet die erste Runde mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place} und ist damit im oberen Drittel.`,
                `Runde 1 ist durch, und ${data.player.name} spielt vorne mit! Aktuell mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place}.`
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length == data.tournament?.holes.length &&
                    data.playerRound.round.number == 1 &&
                    data.player.isMiddleThird
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `${data.player.name} beendet die erste Runde mit ${diff(data.playerRound.diff)} und liegt damit aktuell auf Platz ${data.playerRound.player.place}.`,
                `Runde 1 ist abgeschlossen. Mit einem Score von ${diff(data.playerRound.diff)} steht ${data.player.name} derzeit im Mittelfeld auf Platz ${data.playerRound.player.place}.`,
                `Nach der ersten Runde findet sich ${data.player.name} mit ${diff(data.playerRound.diff)} im soliden Mittelfeld auf Platz ${data.playerRound.player.place} wieder.`,
                `Mit einem Score von ${diff(data.playerRound.diff)} beendet ${data.player.name} die erste Runde auf dem mittelmäßigen Platz ${data.playerRound.player.place}.`,
                `Erste Runde gespielt. ${data.player.name} steht mit ${diff(data.playerRound.diff)} derzeit auf Platz ${data.playerRound.player.place}.`,
                `Das war’s für die erste Runde. Mit ${diff(data.playerRound.diff)} liegt ${data.player.name} auf Rang ${data.playerRound.player.place}.`,
                `Runde 1 ist vorbei. ${data.player.name} liegt mit ${diff(data.playerRound.diff)} aktuell im Mittelfeld auf Platz ${data.playerRound.player.place}.`
            ];
            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => {
                return data.player.followed &&
                    data.playerRound.results.length === data.tournament?.holes.length &&
                    data.playerRound.round.number === 1 &&
                    data.player.isBottomThird;
            }
        ],
        (data: PlayerResult) => {
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `Die erste Runde ist vorbei, aber ${data.player.name} würde sie am liebsten nochmal spielen. Mit ${diff(data.playerRound.diff)} auf dem Konto geht es auf Platz ${data.playerRound.player.place} weiter.`,
                `Runde 1 ist durch – und es war... nun ja, eine Runde. ${data.player.name} steht mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place}.`,
                `Es hätte schlimmer laufen können. Aber nicht viel. Mit ${diff(data.playerRound.diff)} reicht es für Platz ${data.playerRound.player.place}.`,
                `Die erste Runde ist vorbei – immerhin hat ${data.player.name} alle Bahnen gefunden. Mit ${diff(data.playerRound.diff)} auf der Scorekarte geht’s von Platz ${data.playerRound.player.place} in die nächste Runde.`,
                `Nennen wir es einen herausfordernden Start. ${data.player.name} beendet Runde 1 mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place}. Es gibt noch Luft nach oben.`,
                `Die gute Nachricht: Die erste Runde ist vorbei. Die schlechte: ${data.player.name} liegt mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place}.`,
                `Nicht jede Runde kann ein Meisterwerk sein. ${data.player.name} beendet die erste Runde mit ${diff(data.playerRound.diff)} und nimmt Platz ${data.playerRound.player.place} in Beschlag.`,
                `Runde 1 ist abgeschlossen. ${data.player.name} steht mit ${diff(data.playerRound.diff)} auf Platz ${data.playerRound.player.place}.`,
                `Die erste Runde ist vorbei, ${data.player.name} beendet sie mit ${diff(data.playerRound.diff)} auf Rang ${data.playerRound.player.place}.`,
                `${data.player.name} schließt Runde 1 mit einem Score von ${diff(data.playerRound.diff)} ab und belegt derzeit Platz ${data.playerRound.player.place}.`,
                `Mit ${diff(data.playerRound.diff)} auf der Scorekarte beendet ${data.player.name} die erste Runde auf Platz ${data.playerRound.player.place}.`,
                `Mit ${diff(data.playerRound.diff)} belegt ${data.player.name} nach der ersten Runde Platz ${data.playerRound.player.place}.`,
                `Nach der ersten Runde geht es für ${data.player.name} mit einem Score von ${diff(data.playerRound.diff)} von Platz ${data.playerRound.player.place} weiter.`,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES, ROUND_SCORE, PLACE],
        1000,
        6
    ));

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) =>
                data.player.followed && ((data.diff <= -1) && (Math.random() < 0.5))
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Yeah!", "Wow!", "Irre!", "Ih wer narrisch!", "Da Hund Olta!"];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        [EXCLAMATION],
        10,  // Interest level (can be adjusted)
        1));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) =>
                data.player.followed && ((data.diff == 0) && (Math.random() < 0.2))
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Besser als ein Stein am Schädel.", "Stabil.", "Passt schon."];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        [EXCLAMATION],
        10,  // Interest level (can be adjusted)
        1));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) =>
                data.player.followed && ((data.diff == 1) && (Math.random() < 0.5))
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Auweh.", "Uff.", "Na geh.", "Schade.", "Oh Maria."];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        [EXCLAMATION],
        10,  // Interest level (can be adjusted)
        1));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) =>
                data.player.followed && ((data.diff == 2) && (Math.random() < 0.7))
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = ["Jetzt frisst er.", "Gschissn", "Uh, versemmelt.", "Das tut weh.", "Scheiße.", "Er gibt sicher sein Bestes."];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        [EXCLAMATION],
        10,  // Interest level (can be adjusted)
        1
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) =>
                data.player.followed && data.diff >= 3 && (Math.random() < 0.7)
            // You can expand this condition to include "or better" if you add more types.
        ],
        (data: PlayerResult) => {
            const exclamations = [
                "Jetzt frisst er richtig.",
                "Disc Golf gibt und Disc Golf nimmt. Jetzt nimmt es.",
                "So ein Dreck!",
                "Das tut jetzt sicher richtig weh.",
                "Himmel, Arsch und Zwirn!"];
            return exclamations[Math.floor(Math.random() * exclamations.length)];
        },
        [EXCLAMATION],
        10,  // Interest level (can be adjusted)
        1));

    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data: PlayerResult) => data.player.followed
        ],
        (data: PlayerResult) => {
            const outputs = [
                `${data.playerRound.player.name} spielt ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `${data.playerRound.player.name} beendet Bahn ${data.hole.name} Par ${data.hole.par} mit einem ${result(data)}.`,
                `${data.playerRound.player.name} mit einem ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `${data.playerRound.player.name}: ${result(data)} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `${data.playerRound.player.name} kommt mit einem ${result(data)} von Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `Ein ${result(data)} für ${data.playerRound.player.name} auf Bahn ${data.hole.name} Par ${data.hole.par}.`,
                `${data.playerRound.player.name} beendet die Bahn ${data.hole.name} Par ${data.hole.par} mit einem ${result(data)}.`,
                `${data.playerRound.player.name} beendet Bahn ${data.hole.name} Par ${data.hole.par} mit einem ${result(data)}.`
            ];
            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [PLAYER_NAME, RESULT, HOLE],
        100,  // Interest level (can be adjusted)
        5
    ));

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
            (data) => data.player.followed && data.playerRound.results.length > 3 && Math.random() < 0.5
        ],
        (data: PlayerResult) => {
            let roundDiff: number | string = diff(data.playerRound.diff);
            const outputs = [
                `Aktueller Rundenscore: ${roundDiff}.`,
                `Über diese Runde liegt der Score bei ${roundDiff}.`,
                `Momentane Rundendifferenz ${roundDiff}.`,
                `Der Rundenscore steht bei ${roundDiff}.`,
                `Nach dieser Bahn beträgt der Rundenscore ${roundDiff}.`,
                `Die Rundendifferenz nach dieser Bahn ${roundDiff}.`,
                `Aktueller Stand über diese Runde ${roundDiff}.`,
                `Neuer Rundenscore ${roundDiff}.`,
                `Zwischenstand über diese Runde ${roundDiff}.`,
                `Der Score für diese Runde ${roundDiff}.`,
                `Derzeitiger Stand der Runde ${roundDiff}.`,
                `Update für die Runde: Aktuell ${roundDiff}.`,
                `Nach der letzten Bahn ist der Rundenscore ${roundDiff}.`
            ];
            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [ROUND_SCORE],
        1,
        103
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed &&
                data.playerRound.results.length > 3 &&
                data.playerRound.round.number > 1 &&
                Math.random() < 0.33
        ],
        (data: PlayerResult) => {
            return `Turnierscore: ${diff(data.player.diff)}`
        },
        [TOURNAMENT_SCORE],
        1,
        104
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed &&
                data.playerRound.results.length > 3 &&
                Math.random() < 0.33
        ],
        (data: PlayerResult) => {
            const outputs = [
                `Aktuell ${data.player.place}. Platz.`,
                `Platz ${data.player.place} nach dieser Bahn.`,
                `Zwischenstand: ${data.player.place}. Platz.`,
                `Momentan ${data.player.place}. Platz.`,
                `Rangliste aktualisiert: ${data.player.place}. Platz.`,
                `Nach diesem Loch: ${data.player.place}. Platz.`,
                `Aktuelle Platzierung: ${data.player.place}. Platz.`,
                `Platzierung: ${data.player.place}. Platz.`,
                `Neuer Zwischenstand: ${data.player.place}. Platz.`,
                `Situation im Moment: ${data.player.place}. Platz.`
            ];
            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [PLACE],
        1,
        105
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed &&
                data.playerRound.results.length > 3 &&
                Math.random() < 0.2
        ],
        (data: PlayerResult) => {
            // @ts-ignore
            const holesLeft = `${data.tournament?.holes.length - data.playerRound.results.length}`;
            const outputs = [
                `${holesLeft} Löcher verbleibend.`,
                `Noch ${holesLeft} Löcher zu spielen!`,
                `${holesLeft} Löcher bleiben noch.`,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES],
        1,
        106
    ));
    AnnouncementGenerator.register(new AnnouncementRule(
        [
            (data) => data.player.followed &&
                data.playerRound.results.length > 3 &&
                Math.random() < 0.2
        ],
        (data: PlayerResult) => {
            // @ts-ignore
            const holesPlayed = `${data.playerRound.results.length}`;
            const outputs = [
                `${holesPlayed} Löcher gespielt.`,
                `Bisher wurden ${holesPlayed} Löcher gespielt.`,
                `${holesPlayed} Löcher sind bereits gespielt.`,
            ];

            return outputs[Math.floor(Math.random() * outputs.length)];
        },
        [NUMBER_OF_HOLES],
        1,
        106
    ));
}
