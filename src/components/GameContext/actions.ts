import { City } from "src/core/types"
import { GameContextType, GameDispatchAttemptedActionType } from "./GameContext"

const DEFAULT_RADIUS = 10

// export function attemptCity(game: GameContextType, action: GameDispatchAttemptedActionType): GameContextType {
//     console.log(action.attemptCityId === game.hiddenCityId, action.attemptCityId, game.hiddenCityId)

//     if (action.attemptCityId === game.hiddenCityId) {
//         return setNextCity(game)
//     } else {
//         return {
//             ...game, 
//             attemptedCitiesIds: [...game.attemptedCitiesIds, action.attemptCityId]
//         }
//     }
// }

export function attempt(game: GameContextType, action: GameDispatchAttemptedActionType): GameContextType {
    // console.log(action.attemptCityId === game.hiddenCityId, action.attemptCityId, game.hiddenCityId)

    if (action.distanceKm <= (game.hiddenCity?.radius ?? DEFAULT_RADIUS)) {
        return setNextCity(game)
    } else {
        return {
            ...game,
            sumDistance: game.sumDistance + action.distanceKm,
            attempted: [
                ...game.attempted,
                {
                    ll: action.ll,
                    distanceKm: action.distanceKm,
                    name: action.name,
                    direction: action.direction,
                    cityId: action.cityId
                }
            ]
        }
    }
}

function setNextCity(game: GameContextType): GameContextType {
    if (game.restHiddenCities.length) {
        return {
            ...game,
            recognizedCities: game.hiddenCity
                ? [...game.recognizedCities, game.hiddenCity]
                : game.recognizedCities,
            restHiddenCities: game.restHiddenCities.slice(1),
            hiddenCity: game.restHiddenCities[0]
        }
    } else {
        return finishGame(game)
    }
}

function finishGame(game: GameContextType): GameContextType {
    return {
        ...game,
        // attempted: [],
        recognizedCities: game.hiddenCity
            ? [...game.recognizedCities, game.hiddenCity]
            : game.recognizedCities,
        restHiddenCities: [],
        hiddenCity: undefined
    }
}

export function takeHint(game: GameContextType): GameContextType {
    console.log("=")
    return {
        ...game,
        hints: [...game.hints, game.round]
    }
}
