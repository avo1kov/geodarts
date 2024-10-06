import React, { useCallback, useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { LngLat } from "mapbox-gl"

import { useGameContext, useGameDispanchContext } from "../GameContext"
import { RegionMap } from "../RegionMap/RegionMap"
import { Result } from "../Result"
import { RoadButton } from "../RoadButton"

import styles from "./Game.module.scss"

import logo from "../../assets/logo@0.5x.png"

export const Game: React.FC = () => {
    const dispatch = useGameDispanchContext()
    
    const {
        allCities,
        hiddenCity,
        attempted,
        sumDistance,
        recognizedCities,
        hints
    } = useGameContext()

    const [showFinal, setShowFinal] = useState(true)

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
                type: "set_hidden_city",
                id: dailyCity.id,
                name: dailyCity.name,
                ll: new LngLat(dailyCity.longitude, dailyCity.latitude),
                radiusKm: dailyCity.radius
            })
        }

        fetchDailyCity()
        fetchAllCities()
    }, [dispatch])

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
                attempted={attempted}
                recognizedCities={recognizedCities}
                onSupposeByMarker={onSupposeByMarker}
                onSuppose={onSuppose}
                hints={hints}
            />
            <div className={styles.hintWrapper}>
                <button onClick={() => dispatch({ type: "took_hint" })}>💡 Take a hint</button>
            </div>
            { recognizedCities[0] === undefined || !showFinal
                ? null
                : (
                    <Result
                        sumDistance={sumDistance}
                        recognizedCities={recognizedCities}
                        showFinal={showFinal}
                        hints={hints}
                        setShowFinal={setShowFinal}
                    />
                )
            }
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
                                    : (
                                        <div>the city is loading...</div>
                                    )
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
