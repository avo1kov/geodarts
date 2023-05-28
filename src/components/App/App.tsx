import React from "react"
import { GameProvider } from "../GameContext"
import { Game } from "../Game"

export const App: React.FC = () => {
    return (
        <GameProvider>
            <Game />
        </GameProvider>
    )
}
