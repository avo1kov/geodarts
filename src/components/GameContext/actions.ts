import { Draft } from "immer"
import { GameContextType, GameDispatchAttemptedActionType } from "./GameContext"

export function attemptCity(game: GameContextType, action: GameDispatchAttemptedActionType): GameContextType {
    console.log(action.attemptCityId === game.hiddenCityId, action.attemptCityId, game.hiddenCityId)

    if (action.attemptCityId === game.hiddenCityId) {
        return setNextCity(game)
    } else {
        return {
            ...game, 
            attemptedCitiesIds: [...game.attemptedCitiesIds, action.attemptCityId]
        }
    }
}

function setNextCity(game: GameContextType): GameContextType {
    if (game.restHiddenCitiesIds.length) {
        return {
            ...game,
            attemptedCitiesIds: [],
            recognizedCitiesIds: game.hiddenCityId
                ? [...game.recognizedCitiesIds, game.hiddenCityId]
                : game.recognizedCitiesIds,
            restHiddenCitiesIds: game.restHiddenCitiesIds.slice(1),
            hiddenCityId: game.restHiddenCitiesIds[0]
        }
    } else {
        return finishGame(game)
    }
}

function finishGame(game: GameContextType): GameContextType {
    return {
        ...game,
        attemptedCitiesIds: [],
        recognizedCitiesIds: game.hiddenCityId
            ? [...game.recognizedCitiesIds, game.hiddenCityId]
            : game.recognizedCitiesIds,
        restHiddenCitiesIds: [],
        hiddenCityId: undefined
    }
}
