import React, { ReactNode, createContext, useContext, useReducer } from "react"
import { City } from "src/core/types"
import { attempt, takeHint, initGame, setAllCities } from "./actions"
import { LngLat } from "mapbox-gl"

export type Round = "cities" | "peaks" | "seas"

export interface Attempt {
    ll: LngLat,
    distanceKm: number,
    name: string,
    direction: number,
    cityId?: number | undefined,
}

export interface GameContextType {
    allCities: City[],
    distanceMistakesKm: number,
    hiddenCity: City | undefined,
    attempts: Attempt[],
    recognizedCities: City[],
    round: Round,
    hints: Round[],
    dayNumber: number,
}

export interface GameDispatchAttemptedActionType {
    type: "attempted",
    id?: number,
    distanceKm: number,
    ll: LngLat,
    name: string,
    direction: number,
}

export interface GameDispatchInitGameActionType {
    type: "init_game",
    id: number,
    name: string,
    ll: LngLat,
    radiusKm: number,
    dayNumber: number,
}

export interface GameDispatchSetAllCitiesActionType {
    type: "set_all_cities",
    cities: City[],
}

export interface GameDispatchTookHintActionType {
    type: "took_hint",
}

export type GameDispatchActionType = GameDispatchAttemptedActionType
    | GameDispatchTookHintActionType
    | GameDispatchInitGameActionType
    | GameDispatchSetAllCitiesActionType

function gameReducer(game: GameContextType, action: GameDispatchActionType) {
    switch (action.type) {
    case "attempted": {
        return attempt(game, action)
    }
    case "took_hint": {
        return takeHint(game)
    }
    case "init_game": {
        return initGame(game, action)
    }
    case "set_all_cities": {
        return setAllCities(game, action)
    }
    }
}

const initGameState: GameContextType = {
    allCities: [],
    distanceMistakesKm: 0,
    hiddenCity: undefined, // undefined, // hiddenCities[0]!,
    dayNumber: 0,
    // restHiddenCities: hiddenCities.slice(1), // TODO: must be gotten from server
    attempts: [],
    recognizedCities: [], //[citiesData[Math.floor(Math.random() * citiesData.length)]!], // [citiesData[Math.floor(Math.random() * citiesData.length)]!] // [0, 1, 6, 8, 10].map((i) => citiesData[i]!)
    hints: [],
    round: "cities"
}

// const initGameState: GameContextType = {
//     allCities: [],
//     distanceMistakesKm: 0,
//     hiddenCity: undefined, // undefined, // hiddenCities[0]!,
//     dayNumber: 0,
//     // restHiddenCities: hiddenCities.slice(1), // TODO: must be gotten from server
//     attempts: [],
//     recognizedCities: [{
//         id: 1,
//         name: "Moscow",
//         ll: new LngLat(37.6176, 55.7558),
//         radius: 10
//     }], //[citiesData[Math.floor(Math.random() * citiesData.length)]!], // [citiesData[Math.floor(Math.random() * citiesData.length)]!] // [0, 1, 6, 8, 10].map((i) => citiesData[i]!)
//     hints: [],
//     round: "cities"
// }

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
