import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./Game.module.scss"
import { Bulb } from "@gravity-ui/icons"
import { RegionMap } from "../RegionMap/RegionMap"

import { KeyCodes } from "src/keyCodes"
import type { City } from "../../core/types"
import { isMobile } from "react-device-detect"
import { PlayControl } from "../PlayControl"
import { useGameContext } from "../GameContext"

// [lat, lng]

export const Game: React.FC = () => {
    // const [allHiddenCities, setAllHiddenCities] = useState<City[]>(fiveHiddenCities)
    // const hiddenCity: City = useMemo(() => (allHiddenCities[0] || citiesData[0]) as unknown as City, [allHiddenCities])
    // const [inputValue, setInputValue] = useState("")
    // const [attempts, setAttempts] = useState<City[]>([])
    // const [doneCities, setDoneCities] = useState<City[]>([])

    // const { allCities, hiddenCityId } = useGameContext()
    const { allCities, hiddenCityId, attemptedCitiesIds } = useGameContext()

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

    // const inputRef = useRef<HTMLInputElement>(null)
    // const [isFocused, setIsFocused] = useState(true)

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

    return (
        <div className={styles.root}>
            <RegionMap hiddenCity={hiddenCity} attempts={attemptedCities} doneCities={[]} />
            <PlayControl />
        </div>
    )
}

const compareCityNames = (name1: string, name2: string) => {
    return name1.toLocaleLowerCase() === name2.toLocaleLowerCase()
}

function isCharacterKeyPress(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (typeof evt.which === "undefined") {
        // This is IE, which only fires keypress events for printable keys
        return true
    } else if (typeof evt.which === "number" && evt.which > 0) {
        // In other browsers except old versions of WebKit, evt.which is
        // only greater than zero if the keypress is a printable key.
        // We need to filter out backspace and ctrl/alt/meta key combinations
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which !== 8
    }
    return false
}
