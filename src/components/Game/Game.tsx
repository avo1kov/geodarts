import React, { useCallback, useEffect, useMemo, useState } from "react"
import { LngLat } from "mapbox-gl"

import { useGameContext, useGameDispanchContext } from "../GameContext"
import { RegionMap } from "../RegionMap/RegionMap"
import { Task } from "../Task"
import { Result } from "../Result"
import { Footer } from "../Footer"

import styles from "./Game.module.scss"

const TODAY = new Date().toISOString().split("T")[0]

export const Game: React.FC = () => {
    const dispatch = useGameDispanchContext()
    
    const {
        allCities,
        hiddenCity,
        attempts,
        distanceMistakesKm,
        recognizedCities,
        hints,
        dayNumber
    } = useGameContext()

    const [showFinal, setShowFinal] = useState(true)
    const [rank, setRank] = useState(0)
    const [rankWithHints, setRankWithHints] = useState(0)
    const [isStatsSent, setIsStatsSent] = useState(false)

    useEffect(() => {
        const fetchAllCities = async () => {
            const res = await fetch("https://volkov.media/test/geodarts-server/api/get_all_cities.php")
            const cities = await res.json()

            dispatch({
                type: "set_all_cities",
                cities: cities.map((city: any) => ({
                    id: city.id,
                    name: city.name,
                    ll: new LngLat(city.longitude, city.latitude),
                    radiusKm: city.radius
                }))
            })
        }

        const fetchDailyCity = async () => {
            const res = await fetch("https://volkov.media/test/geodarts-server/api/get_daily_city.php")
            const dailyCity = await res.json()

            dispatch({
                type: "init_game",
                id: dailyCity.id,
                dayNumber: dailyCity.day_number,
                name: dailyCity.name,
                ll: new LngLat(dailyCity.longitude, dailyCity.latitude),
                radiusKm: dailyCity.radius_km
            })
        }

        fetchDailyCity()
        fetchAllCities()
    }, [dispatch])
    
    const isGameFinished = useMemo(() => {
        console.log({ recognizedCities })
        return recognizedCities[0] !== undefined
    }, [recognizedCities])

    useEffect(() => {
        async function getRank() {
            return fetch(`https://volkov.media/test/geodarts-server/api/get_rank.php?localDate=${TODAY}&distanceMistakesKm=${distanceMistakesKm}`)
                .then(res => res.json())
                .then(data => {
                    setRank(data.rankWithNoHints)
                    setRankWithHints(data.rankWithHints)
                })
        }

        getRank()

        if (isGameFinished && !isStatsSent) {
            fetch("https://volkov.media/test/geodarts-server/api/finish_game.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    distanceMistakesKm,
                    attempts: attempts.length,
                    hints: hints.length,
                    localDate: TODAY,
                    cityId: hiddenCity?.id
                })
            })

            setIsStatsSent(true)
        }
    }, [hints, isGameFinished, isStatsSent, recognizedCities, distanceMistakesKm, attempts.length, hiddenCity?.id])

    const onSupposeByMarker = useCallback((cityId: number) => {
        if (!hiddenCity) {
            return
        }

        const city = allCities.find(city => city.id === cityId)

        if (!city) { return }

        const attemptedPoint = city.ll
        const hiddenPoint = hiddenCity.ll

        const distanceKm = attemptedPoint.distanceTo(hiddenPoint) / 1000

        const degree = bearing(attemptedPoint.lat, attemptedPoint.lng, hiddenPoint.lat, hiddenPoint.lng)

        dispatch({
            type: "attempted",
            distanceKm,
            ll: attemptedPoint,
            name: hiddenCity.name,
            direction: degree,
            id: cityId
        })

    }, [allCities, dispatch, hiddenCity])

    const onSuppose = useCallback((attemptedPoint: LngLat) => {
        if (!hiddenCity) {
            return
        }

        const hiddenPoint = hiddenCity.ll
        const distanceKm = attemptedPoint.distanceTo(hiddenPoint) / 1000

        const degree = bearing(attemptedPoint.lat, attemptedPoint.lng, hiddenPoint.lat, hiddenPoint.lng)

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
                attempted={attempts}
                recognizedCities={recognizedCities}
                onSupposeByMarker={onSupposeByMarker}
                onSuppose={onSuppose}
                hints={hints}
            />
            <div className={styles.hintWrapper}>
                <button onClick={() => dispatch({ type: "took_hint" })}>💡 Take a hint</button>
            </div>
            { isGameFinished && showFinal && (
                <Result
                    sumDistanceKm={distanceMistakesKm}
                    recognizedCities={recognizedCities}
                    showFinal={showFinal}
                    hints={hints}
                    dayNumber={dayNumber}
                    rank={rank}
                    rankWithHints={rankWithHints}
                    setShowFinal={setShowFinal}
                />
            )}
            { !isGameFinished && <Task hiddenCity={hiddenCity} /> }
            <Footer />
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
