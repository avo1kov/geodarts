import {
    GameContextType,
    GameDispatchAttemptedActionType,
    GameDispatchSetAllCitiesActionType,
    GameDispatchInitGameActionType,
    GameMode
} from "./GameContext"

const DEFAULT_RADIUS = 10
const TODAY = new Date().toISOString().split("T")[0]

export function initGame(game: GameContextType, action: GameDispatchInitGameActionType): GameContextType {
    return {
        ...game,
        hiddenCity: action, // TODO: omit dayNumber here
        dayNumber: action.dayNumber,
    }
}

export function setAllCities(game: GameContextType, action: GameDispatchSetAllCitiesActionType): GameContextType {
    return {
        ...game,
        allCities: action.cities
    }
}

export function attempt(game: GameContextType, action: GameDispatchAttemptedActionType): GameContextType {
    if (action.distanceKm <= (game.hiddenCity?.radius ?? DEFAULT_RADIUS)) {
        return finishGame(game)
    } else {
        return {
            ...game,
            distanceMistakesKm: game.distanceMistakesKm + Math.ceil(action.distanceKm),
            attempts: [
                ...game.attempts,
                {
                    ll: action.ll,
                    distanceKm: action.distanceKm,
                    name: action.name,
                    direction: action.direction,
                    cityId: action.id
                }
            ]
        }
    }
}

function finishGame(game: GameContextType): GameContextType {
    // todo: is that okay to send it here. Anyway, it's neccessary to wait request
    if (game.isGameFinished && !game.isStatsSent && game.mode === GameMode.Game) {
        fetch("https://volkov.media/test/geodarts-server/api/finish_game.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                distanceMistakesKm: game.distanceMistakesKm,
                attempts: game.attempts.length,
                hints: game.hints.length,
                localDate: TODAY,
                cityId: game.hiddenCity?.id
            })
        })
    }

    return {
        ...game,
        recognizedCities: game.hiddenCity
            ? [...game.recognizedCities, game.hiddenCity]
            : game.recognizedCities,
        hiddenCity: undefined,
        isGameFinished: true,
        isStatsSent: true
    }
}

export function takeHint(game: GameContextType): GameContextType {
    return {
        ...game,
        hints: [...game.hints, game.round]
    }
}

export function setTrainingMode(game: GameContextType): GameContextType {
    return {
        ...game,
        mode: GameMode.Training,
        hiddenCity: game.allCities[Math.floor(Math.random() * game.allCities.length)],
        isGameFinished: false,
        attempts: []
    }
}
