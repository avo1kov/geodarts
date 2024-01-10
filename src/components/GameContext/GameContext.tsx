import React, { ReactNode, createContext, useContext, useReducer } from "react"
import { City } from "src/core/types"
import { attempt, takeHint } from "./actions"
import { citiesData } from "./allCities"
import { LngLat } from "mapbox-gl"

export interface Attempt {
    ll: LngLat,
    distance: number,
    name: string,
    direction: number
}

export interface GameContextType {
    allCities: City[],
    sumDistance: number,
    hiddenCity: City | undefined,
    restHiddenCities: City[],
    attempted: Attempt[],
    recognizedCities: City[]
}

// export interface GameDispatchAttemptedActionType {
//     type: "attempted";
//     attemptCityId: number;
// }

export interface GameDispatchAttemptedActionType {
    type: "attempted";
    distance: number;
    ll: LngLat;
    name: string;
    direction: number;
}

export interface GameDispatchTookHintActionType {
    type: "took_hint";
}

export type GameDispatchActionType = GameDispatchAttemptedActionType | GameDispatchTookHintActionType

function gameReducer(game: GameContextType, action: GameDispatchActionType) {
    switch (action.type) {
    case "attempted": {
        return attempt(game, action)
    }
    case "took_hint": {
        return takeHint(game)
    }
    }
}

const hiddenCities = [
    ...[...Array(1)].map(() => Math.floor(Math.random() * citiesData.length))
]
    .map(i => citiesData[i]!)

const initGameState: GameContextType = {
    allCities: citiesData,
    sumDistance: 0,
    hiddenCity: hiddenCities[0]!, // undefined, // hiddenCities[0]!,
    restHiddenCities: hiddenCities.slice(1), // TODO: must be got from server
    attempted: [],
    recognizedCities: [], //[citiesData[Math.floor(Math.random() * citiesData.length)]!], // [citiesData[Math.floor(Math.random() * citiesData.length)]!] // [0, 1, 6, 8, 10].map((i) => citiesData[i]!)
}

console.log({ initGameState })
// console.log(citiesData[initGameState.hiddenCityId!])

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
