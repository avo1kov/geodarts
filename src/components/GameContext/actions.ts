import {
    GameContextType,
    GameDispatchAttemptedActionType,
    GameDispatchSetAllCitiesActionType,
    GameDispatchInitGameActionType,
    GameMode
} from "./GameContext"

const DEFAULT_RADIUS = 10

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
    return {
        ...game,
        recognizedCities: game.hiddenCity
            ? [...game.recognizedCities, game.hiddenCity]
            : game.recognizedCities,
        hiddenCity: undefined,
        isGameFinished: true
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
