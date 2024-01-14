import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./Game.module.scss"
import { RegionMap } from "../RegionMap/RegionMap"

import type { City } from "../../core/types"
import { isMobile } from "react-device-detect"
import { useGameContext, useGameDispanchContext } from "../GameContext"
import { CitySign } from "../CitySign"
import { ArrowDown, ArrowRight } from "../../assets/icons/Arrows"
import { RoadButton } from "../RoadButton"
import { LngLat } from "mapbox-gl"

import logo from "../../assets/logo@0.5x.png"

const DEFAULT_RADIUS = 5

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
        hiddenCity,
        attempted,
        sumDistance,
        recognizedCities,
        restHiddenCities,
        hints
    } = useGameContext()

    const [showFinal, setShowFinal] = useState(true)

    const dispatch = useGameDispanchContext()
    
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
        () => restHiddenCities.length + (hiddenCity !== undefined ? 1 : 0),
        [hiddenCity, restHiddenCities.length]
    )

    const onSupposeByMarker = useCallback((cityId: string) => {
        if (!hiddenCity) {
            return
        }

        const city = allCities.find(city => city.id === cityId)

        if (!city) { return }

        const attemptedPoint = new LngLat(city.ll[1], city.ll[0])

        const hiddenPoint = new LngLat(hiddenCity.ll[1], hiddenCity.ll[0])
        const distanceKm = attemptedPoint.distanceTo(hiddenPoint) / 1000

        const degree = bearing(attemptedPoint.lat, attemptedPoint.lng, hiddenPoint.lat, hiddenPoint.lng)

        console.log(attemptedPoint, hiddenPoint, degree)

        dispatch({
            type: "attempted",
            distanceKm,
            ll: attemptedPoint,
            name: hiddenCity.name,
            direction: degree,
            cityId
        })

    }, [allCities, dispatch, hiddenCity])

    const onSuppose = useCallback((attemptedPoint: LngLat) => {
        if (!hiddenCity) {
            return
        }

        const hiddenPoint = new LngLat(hiddenCity.ll[1], hiddenCity.ll[0])
        const distanceKm = attemptedPoint.distanceTo(hiddenPoint) / 1000

        const degree = bearing(attemptedPoint.lat, attemptedPoint.lng, hiddenPoint.lat, hiddenPoint.lng)

        console.log(attemptedPoint, hiddenPoint, degree)

        dispatch({
            type: "attempted",
            distanceKm,
            ll: attemptedPoint,
            name: hiddenCity.name,
            direction: degree
        })

    }, [dispatch, hiddenCity])

    return (
        <div className={styles.root}>
            <RegionMap
                allCities={allCities}
                hiddenCity={hiddenCity}
                attempted={attempted}
                recognizedCities={recognizedCities}
                onSupposeByMarker={onSupposeByMarker}
                onSuppose={onSuppose}
                hints={hints}
            />
            {/* <div className={styles.info}>
                <div className={[styles.recognized, isMobile ? styles.mobile : ""].join(" ")}>
                    {recognizedCities.map((city) => {
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
                    {
                        remainCitiesNumber > 0
                            ?
                            <RoadButton className={styles.restCitiesNumber}>
                                {isMobile ? undefined : <ArrowDown />}
                                {"Осталось " + remainCitiesNumber}
                                {isMobile ? <ArrowRight /> : <ArrowDown /> }
                            </RoadButton>
                            : 
                            null
                    }
                </div>
            </div> */}
            <div className={styles.hintWrapper}>
                <button onClick={() => dispatch({ type: "took_hint" })}>Take hint</button>
            </div>
            <div className={[styles.finishWrap, recognizedCities[0] === undefined || !showFinal ? styles.hidden : ""].join(" ")}>
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
                            You made mistakes for <RoadButton text={`${Math.ceil(sumDistance)} km`} fontSize={isMobile ? 16 : 22} />
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
                                    Used <b>{hints.length} hints</b>
                                </div>
                            ) : null
                    }
                    <div className={styles.dev}>
                        This is <b>development version</b> of game. If you want to get notification after release, please, text me to <a href="mailto: to@agvolkov.ru">to@agvolkov.ru</a>
                    </div>
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
            {
                recognizedCities[0] === undefined
                    ?
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
                                    : null
                            }
                        </div>
                    </div>
                    : null
            }
            <div className={[styles.author, isMobile ? styles.mobile : ""].join(" ")}>
                <img src={logo} className={styles.logo} />
                by <a href="https://volkov.media" target="_blank">Alexander Volkov</a>
            </div>
        </div>
    )
}

// Converts from degrees to radians.
function toRadians(degrees: number) {
    return degrees * Math.PI / 180
}
   
// Converts from radians to degrees.
function toDegrees(radians: number) {
    return radians * 180 / Math.PI
}
  
function bearing(startLat: number, startLng: number, destLat: number, destLng: number){
    startLat = toRadians(startLat)
    startLng = toRadians(startLng)
    destLat = toRadians(destLat)
    destLng = toRadians(destLng)
  
    const y = Math.sin(destLng - startLng) * Math.cos(destLat)
    const x = Math.cos(startLat) * Math.sin(destLat) -
          Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)
    let brng = Math.atan2(y, x)
    brng = toDegrees(brng)

    return (brng + 360) % 360
}
