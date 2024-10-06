import React from "react"
import { isMobile } from "react-device-detect"

import { City } from "src/core/types"
import { RoadButton } from "../RoadButton"

import styles from "./Task.module.scss"

interface TaskProps {
    hiddenCity: City | undefined
}

export const Task: React.FC<TaskProps> = ({ hiddenCity }) => {
    return (
        <div className={[styles.currentCityWrapper, isMobile ? styles.mobile : ""].join(" ")}>
            <div className={[styles.currentCity, isMobile ? styles.mobile : ""].join(" ")}>
                {
                    hiddenCity
                        ?
                        isMobile
                            ?
                            <>
                                Tap the city on map
                                <RoadButton
                                    view="blue"
                                    fontSize={32}
                                >
                                    { hiddenCity?.name.toUpperCase() }
                                </RoadButton>
                            </>
                            :
                            <>
                                Click the
                                <RoadButton
                                    view="blue"
                                    fontSize={32}
                                >
                                    { hiddenCity?.name.toUpperCase() }
                                </RoadButton>
                                on map
                            </>
                        : (
                            <div>the city is loading...</div>
                        )
                }
            </div>
        </div>
    )
}
