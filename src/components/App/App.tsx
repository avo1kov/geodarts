import React, { useState } from "react"
import Map, { NavigationControl } from "react-map-gl"
import { Navbar } from "../navbar.js"
import maplibregl from "maplibre-gl"
import styles from "./App.module.scss"

export const App: React.FC = () => {
    const [attemptCityText, setAttemptCityText] = useState("Горячий Ключ")

    return (
        <div className={styles.App}>
            <div className={styles.rootOfMap}>
                <Map
                    mapLib={maplibregl} 
                    initialViewState={{
                        longitude: 39.132523,
                        latitude: 45.172113,
                        zoom: 6.5
                    }}
                    mapStyle="https://api.maptiler.com/maps/streets/style.json?key=h82LwnMs7FsmNItmCTPZ"
                >
                    <NavigationControl position="top-right" />
                </Map>
            </div>
            <div className={styles.input}>
                <input
                    type="text"
                    value={attemptCityText}
                    onChange={(e) => setAttemptCityText(e.target.value)}
                    onKeyUp={(e) => e.keyCode === 13 ? alert(attemptCityText) : null}
                    autoFocus
                />
            </div>
            <div className={styles.status}>

            </div>
        </div>
    )
}

export default App
