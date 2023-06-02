import React, { ReactNode, createContext, useContext, useReducer } from "react"
import { City } from "src/core/types"
import { attemptCity, takeHint } from "./actions"
import { citiesData } from "./allCities"

export interface GameContextType {
    allCities: City[],
    sumDistance: number,
    hiddenCityId: number | undefined,
    restHiddenCitiesIds: number[],
    attemptedCitiesIds: number[],
    recognizedCitiesIds: number[],
}

export interface GameDispatchAttemptedActionType {
    type: "attempted";
    attemptCityId: number;
}

export interface GameDispatchTookHintActionType {
    type: "took_hint";
}

export type GameDispatchActionType = GameDispatchAttemptedActionType | GameDispatchTookHintActionType

function gameReducer(game: GameContextType, action: GameDispatchActionType) {
    switch (action.type) {
    case "attempted": {
        return attemptCity(game, action)
    }
    case "took_hint": {
        return takeHint(game)
    }
    }
}

const hiddenCities = [...Array(2)].map(() => Math.floor(Math.random() * citiesData.length))

const initGameState: GameContextType = {
    allCities: citiesData,
    sumDistance: 0,
    hiddenCityId: hiddenCities[0]!,
    restHiddenCitiesIds: hiddenCities.slice(1), // TODO: must be got from server
    attemptedCitiesIds: [],
    recognizedCitiesIds: []
}

console.log({ initGameState })
console.log(citiesData[initGameState.hiddenCityId!])

export const GameContext = createContext<any>(initGameState)
export const GameDispatchContext = createContext<any>(null)

export function GameProvider({ children }: {children: ReactNode}) {
    const [game, dispatch] = useReducer(gameReducer, initGameState)

    return (
        <GameContext.Provider value={game}>
            <GameDispatchContext.Provider value={dispatch}>
                {children}
            </GameDispatchContext.Provider>
        </GameContext.Provider>
    )
}

export function useGameContext(): GameContextType {
    return useContext(GameContext)
}

export function useGameDispanchContext(): React.Dispatch<GameDispatchActionType> {
    return useContext(GameDispatchContext)
}
