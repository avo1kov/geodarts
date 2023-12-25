import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./Game.module.scss"
import { Bulb } from "@gravity-ui/icons"
import { RegionMap } from "../RegionMap/RegionMap"

import { KeyCodes } from "src/keyCodes"
import type { City } from "../../core/types"
import { isMobile } from "react-device-detect"
import { PlayControl } from "../PlayControl"
import { useGameContext } from "../GameContext"
import { CitySign } from "../CitySign"
import { ArrowDown, ArrowRight } from "../../assets/icons/Arrows"
import { RoadButton } from "../RoadButton"

// [lat, lng]

export const Game: React.FC = () => {
    // const [allHiddenCities, setAllHiddenCities] = useState<City[]>(fiveHiddenCities)
    // const hiddenCity: City = useMemo(() => (allHiddenCities[0] || citiesData[0]) as unknown as City, [allHiddenCities])
    // const [inputValue, setInputValue] = useState("")
    // const [attempts, setAttempts] = useState<City[]>([])
    // const [doneCities, setDoneCities] = useState<City[]>([])

    // const { allCities, hiddenCityId } = useGameContext()
    const {
        allCities,
        hiddenCityId,
        attemptedCitiesIds,
        sumDistance,
        recognizedCitiesIds,
        restHiddenCitiesIds 
    } = useGameContext()

    useEffect(() => {
        console.log({ attemptedCitiesIds })
    }, [attemptedCitiesIds])

    const hiddenCity = useMemo(
        () => hiddenCityId ? allCities[hiddenCityId] : undefined,
        [allCities, hiddenCityId]
    )

    const attemptedCities = useMemo(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        () => attemptedCitiesIds.map((id) => allCities[id]!), 
        [allCities, attemptedCitiesIds]
    )
    
    // const [hoveredHint, setHoveredHint] = useState<number | undefined>(undefined)

    // const makeCity = useCallback(() => {
    //     if (allHiddenCities.length > 1) {
    //         setAllHiddenCities((state) => state.slice(1))
    //     } else {
    //         alert("Всё")
    //     }
    // }, [allHiddenCities])

    // const finishGame = useCallback(() => {
    //     setDoneCities([...doneCities, hiddenCity])
    //     makeCity()
    //     setAttempts([])
    //     setInputValue("")
    //     setAnswerHint("")
    // }, [doneCities, hiddenCity, makeCity])

    // useEffect(() => {
    //     if (compareCityNames(answerHint, hiddenCity.name)) {
    //         finishGame()
    //     }
    // }, [answerHint, finishGame, hiddenCity.name])

    // useEffect(() => {
    //     document.addEventListener("keyup", (e) => {
    //         if (e.key.length === 1 && !isFocused) {
    //             inputRef.current?.focus()
    //             inputRef.current?.dispatchEvent(new KeyboardEvent("keydown", e))
    //         }
    //     })
    // }, [isFocused])

    const remainCitiesNumber = useMemo(
        () => restHiddenCitiesIds.length + (hiddenCity !== undefined ? 1 : 0),
        [hiddenCity, restHiddenCitiesIds.length]
    )

    return (
        <div className={styles.root}>
            <RegionMap
                hiddenCity={hiddenCity}
                attempts={attemptedCities}
                recognizedCities={recognizedCitiesIds.map((id) => allCities[id]!)}
            />
            <div className={styles.info}>
                {/* <div>
                    Сумма промахов: {sumDistance} км
                </div> */}
                <div className={[styles.recognized, isMobile ? styles.mobile : ""].join(" ")}>
                    {recognizedCitiesIds.map((cityId) => {
                        const city = allCities[cityId]!
                        return (
                            <a href={city.wikilink} target="_blank" className={styles.link}>
                                <CitySign
                                    text={city.name.toUpperCase()}
                                    crossOnHover={city.wikilink !== undefined && !isMobile}
                                    shiftOnHover={city.wikilink !== undefined && !isMobile}
                                    crossed={city.wikilink === undefined || isMobile}
                                    view="blue"
                                    clickable
                                />
                            </a>
                        )
                    })}
                    <RoadButton className={styles.restCitiesNumber}>
                        {isMobile ? undefined : <ArrowDown />}
                        {"Осталось " + remainCitiesNumber}
                        {isMobile ? <ArrowRight /> : <ArrowDown /> }
                    </RoadButton>
                    {/* {[...Array(restHiddenCitiesIds.length + (hiddenCity !== undefined ? 1 : 0))].map(() => (
                        <div className={styles.emptyCity}></div>
                    ))} */}
                </div>
            </div>
            <PlayControl />
        </div>
    )
}
