import React from "react"

import { RoadButton } from "../RoadButton"
import { isMobile } from "react-device-detect"

import styles from "./Result.module.scss"

interface ResultProps {
    sumDistance: number;
    recognizedCities: { name: string }[];
    hints: string[];
    showFinal: boolean;
    setShowFinal: (showFinal: boolean) => void;
}

export const Result: React.FC<ResultProps> = ({
    sumDistance,
    recognizedCities,
    hints,
    showFinal,
    setShowFinal
}) => {
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
                    <div>🎉 Yeah! You have completed ✅</div>
                    <div>the game #205</div>
                </div>
                <div className={styles.results}>
                    You made mistakes for
                    <RoadButton
                        text={`${formatNumberWithCommas(Math.ceil(sumDistance))} km`}
                        fontSize={isMobile ? 16 : 22}
                        doNumberFormat
                    />
                </div>
                <RoadButton
                    view="blue"
                    text={recognizedCities[0]?.name.toUpperCase() ?? ""}
                    fontSize={28}
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
                {/* <div className={styles.dev}>
                        This is <b>development version</b> of the game. If you want to get the notification after release, please, text me to <a href="mailto: to@agvolkov.ru">to@agvolkov.ru</a>
                </div> */}
                <details className={styles.recommendations}>
                    <summary className={styles.summary}>Similar games from other developers</summary>
                    <div className={styles.listOfGames}>
                        <a href="https://travle.earth/" target="_blank">travle</a>
                        <a href="https://worldle.teuteuf.fr/" target="_blank">worldle</a>
                        <a href="https://wheretaken.teuteuf.fr/" target="_blank">Where Taken</a>
                        <a href="https://world-geography-games.com/en/flags_world.html" target="_blank">Country Flags Quiz</a>
                    </div>
                </details>
                <div className={styles.hideButton} onClick={() => setShowFinal(false)}>[<a href="#">Hide</a>]</div>
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
