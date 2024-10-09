import React, { useEffect } from "react"

import { RoadButton } from "../RoadButton"
import { isMobile } from "react-device-detect"

import styles from "./Result.module.scss"
import { GameMode, useGameDispanchContext } from "../GameContext"

interface ResultProps {
    sumDistanceKm: number,
    recognizedCities: { name: string }[],
    hints: string[],
    showFinal: boolean,
    dayNumber: number,
    rank: number,
    rankWithHints: number,
    mode: GameMode,
    setShowFinal: (showFinal: boolean) => void
}

export const Result: React.FC<ResultProps> = ({
    sumDistanceKm,
    recognizedCities,
    hints,
    showFinal,
    dayNumber,
    rank,
    rankWithHints,
    mode,
    setShowFinal
}) => {
    const dispatch = useGameDispanchContext()
    
    return (
        <div className={styles.finishWrap}>
            <div
                className={[
                    styles.finish,
                    isMobile ? styles.mobile : "",
                    recognizedCities[0] === undefined || !showFinal ? styles.hidden : ""
                ].join(" ")}
            >
                <div className={styles.title}>
                    { mode === GameMode.Game ? (
                        <div>
                        🎉 You're <span className={styles.rank}>
                                {rank}{getOrdinalSuffix(rank)}
                            </span> in today's top! ✅
                        </div>
                    ) : (
                        <div>
                        🎉 You've done it! ✅
                        </div>
                    )}
                </div>
                <div className={styles.results}>
                    Accumulated mistakes over
                    <RoadButton
                        text={`${formatNumberWithCommas(Math.ceil(sumDistanceKm))} km`}
                        fontSize={isMobile ? 16 : 22}
                        doNumberFormat
                    />
                    {sumDistanceKm === 0 ? "🤯" : ""}
                </div>
                <RoadButton
                    view="blue"
                    text={recognizedCities[recognizedCities.length - 1]?.name.toUpperCase() ?? ""}
                    fontSize={40}
                    borderRadius={7}
                    crossed
                />
                {
                    hints.length > 0
                        ? (
                            <div className={styles.hints}>
                                    Used a hint ;)
                            </div>
                        ) : null
                }
                <details className={styles.recommendations}>
                    <summary className={styles.summary}>Similar games from other developers</summary>
                    <div className={styles.listOfGames}>
                        <a href="https://travle.earth/" target="_blank">travle</a>
                        <a href="https://worldle.teuteuf.fr/" target="_blank">worldle</a>
                        <a href="https://wheretaken.teuteuf.fr/" target="_blank">Where Taken</a>
                        <a href="https://world-geography-games.com/en/flags_world.html" target="_blank">Country Flags Quiz</a>
                    </div>
                </details>
                <div className={styles.buttons}>
                    <div className={styles.button} onClick={() => dispatch({ type: "set_training_mode" })}>
                        [{
                            mode === GameMode.Game
                                ? <a href="#">Training Mode</a>
                                : <a href="#">Once Again!</a>
                        }]
                    </div>
                    <div className={styles.button} onClick={() => setShowFinal(false)}>
                    [<a href="#">Hide</a>]
                    </div>
                </div>
            </div>
        </div>
    )
}

function formatNumberWithCommas(num: number) {
    if (num < 10000) {
        return num.toString()
    }
    
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function getOrdinalSuffix(rank: number) {
    const j = rank % 10,
        k = rank % 100
    if (j === 1 && k !== 11) {
        return "st"
    }
    if (j === 2 && k !== 12) {
        return "nd"
    }
    if (j === 3 && k !== 13) {
        return "rd"
    }
    return "th"
}
