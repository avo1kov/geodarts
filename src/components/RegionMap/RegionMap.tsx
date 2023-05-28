import React from "react"
import Map, { Layer, NavigationControl, Marker } from "react-map-gl"
import maplibregl from "maplibre-gl"
import styles from "./RegionMap.module.scss"
import { fromJS } from "immutable"
import type { City } from "../../core/types"

import MAP_STYLE from "../../assets/map-style/months.json"

import { isMobile } from "react-device-detect"

const defaultStyle = fromJS(MAP_STYLE)

interface RegionMapProps {
    doneCities: City[],
    attempts: City[],
    hiddenCity: City
}

export const RegionMap: React.FC<RegionMapProps> = ({ hiddenCity, attempts, doneCities }) => {
    return <div className={styles.rootOfMap}>
        <Map
            mapLib={maplibregl} 
            initialViewState={{
                bounds: [[36.282863, 43.013095], [41.813208, 47.489126]],
            }}
            mapStyle={defaultStyle} // https://api.maptiler.com/maps/streets/style.json?key=h82LwnMs7FsmNItmCTPZ
        >
            { !isMobile && <NavigationControl position="top-right" /> }
            <Layer
                id="city"
                type="symbol"
                source="maptiler_planet"
                source-layer="place"
                layout={{
                    "icon-image": "circle",
                    "icon-size": {
                        "stops": [[6, 0.4], [12, 0.5]]
                    },
                    "text-font": [
                        "Roboto Medium",
                        "Noto Sans Regular"
                    ],
                    "text-size": [
                        "interpolate",
                        [
                            "linear",
                            1
                        ],
                        [
                            "zoom"
                        ],
                        4,
                        [
                            "case",
                            [
                                "<=",
                                [
                                    "get",
                                    "rank"
                                ],
                                2
                            ],
                            14,
                            12
                        ],
                        8,
                        [
                            "case",
                            [
                                "<=",
                                [
                                    "get",
                                    "rank"
                                ],
                                4
                            ],
                            18,
                            14
                        ],
                        12,
                        [
                            "case",
                            [
                                "<=",
                                [
                                    "get",
                                    "rank"
                                ],
                                4
                            ],
                            24,
                            18
                        ],
                        16,
                        [
                            "case",
                            [
                                "<=",
                                [
                                    "get",
                                    "rank"
                                ],
                                4
                            ],
                            32,
                            26
                        ]
                    ],
                    "text-field": ["get", "name:ru"],
                    "visibility": "none",
                    "text-anchor": "center",
                    "text-offset": [0, 0],
                    "icon-optional": false,
                    "text-max-width": 9,
                    "text-line-height": 0.8,
                    "icon-allow-overlap": true
                }}
                paint={{
                    "text-color": "hsl(0,0%,20%)",
                    "icon-opacity": ["step", ["zoom"], 1, 13, 0],
                    "text-halo-color": "hsla(0,0%,100%,0.8)",
                    "text-halo-width": 1.2
                }}
                filter={
                    ["all",
                        ["all", ["==", "class", "city"]],
                    // ["any",
                    //     ["in", "name:ru", hiddenCity.name],
                    //     ...visibleCities
                    // ]
                    ]
                }
            />
            <Layer
                id="town"
                type="symbol"
                source="maptiler_planet"
                source-layer="place"
                minzoom={1}
                maxzoom={24}
                layout={{
                    "icon-size": { "stops": [[6, 0.5], [14, 0.8]] },
                    "text-font": ["Roboto Regular", "Noto Sans Regular"],
                    "text-size": [
                        "interpolate",
                        ["linear", 1], ["zoom"], 6,
                        ["case", ["<=", ["get", "rank"], 12], 11, 10], 9,
                        ["case", ["<=", ["get", "rank"], 15], 13, 12], 16,
                        ["case", ["<=", ["get", "rank"], 15], 22, 20]
                    ],
                    "icon-image": "circle-stroke",
                    "text-field": ["get", "name"],
                    "visibility": "none",
                    "text-anchor": "bottom",
                    "text-offset": [0, 0],
                    "icon-optional": false,
                    "text-max-width": 8,
                    "icon-allow-overlap": true
                }}
                paint={{
                    "text-color": "hsl(0,0%,20%)",
                    "icon-opacity": 1,
                    "text-halo-color": "hsla(0,0%,100%,0.8)",
                    "text-halo-width": 1.2
                }}
                filter={
                    ["all",
                        ["all", ["==", "class", "town"]],
                    // ["any",
                    //     ["in", "name:ru", hiddenCity.name],
                    //     ...visibleCities
                    // ]
                    ]
                }
            />
            <Layer
                id="place"
                type="symbol"
                source="maptiler_planet"
                source-layer="place"
                layout={{
                    "icon-size":{
                        "stops":[
                            [
                                6,
                                0.5
                            ],
                            [
                                8.9,
                                0.8
                            ],
                            [
                                9,
                                0
                            ]
                        ]
                    },
                    "text-font":[
                        "Roboto Regular",
                        "Noto Sans Regular"
                    ],
                    "text-size":[
                        "interpolate",
                        [
                            "linear",
                            1
                        ],
                        [
                            "zoom"
                        ],
                        3,
                        11,
                        8,
                        13,
                        11,
                        [
                            "match",
                            [
                                "get",
                                "class"
                            ],
                            "village",
                            12,
                            [
                                "suburb",
                                "neighbourhood",
                                "quarter",
                                "hamlet",
                                "isolated_dwelling"
                            ],
                            9,
                            "island",
                            8,
                            12
                        ],
                        16,
                        [
                            "match",
                            [
                                "get",
                                "class"
                            ],
                            "village",
                            18,
                            [
                                "suburb",
                                "neighbourhood",
                                "quarter",
                                "hamlet",
                                "isolated_dwelling"
                            ],
                            15,
                            "island",
                            11,
                            16
                        ]
                    ],
                    "text-field":[
                        "case",
                        [
                            "has",
                            "name:ru"
                        ],
                        [
                            "concat",
                            [
                                "get",
                                "name:ru"
                            ],
                            [
                                "case",
                                [
                                    "has",
                                    "name:latin"
                                ],
                                [
                                    "concat",
                                    "\n",
                                    [
                                        "get",
                                        "name:latin"
                                    ]
                                ],
                                ""
                            ]
                        ],
                        [
                            "get",
                            "name"
                        ]
                    ],
                    "visibility":"none",
                    "text-anchor":"bottom",
                    "text-offset":[
                        0,
                        0
                    ],
                    "text-padding":2,
                    "icon-optional":false,
                    "text-max-width":[
                        "match",
                        [
                            "get",
                            "class"
                        ],
                        [
                            "island"
                        ],
                        6,
                        8
                    ],
                    "text-transform":[
                        "match",
                        [
                            "get",
                            "class"
                        ],
                        [
                            "suburb",
                            "neighborhood",
                            "neighbourhood",
                            "quarter",
                            "island"
                        ],
                        "uppercase",
                        "none"
                    ],
                    "icon-allow-overlap":true,
                    "text-letter-spacing":[
                        "match",
                        [
                            "get",
                            "class"
                        ],
                        [
                            "suburb",
                            "neighborhood",
                            "neighbourhood",
                            "quarter",
                            "island"
                        ],
                        0.2,
                        0
                    ]
                }}
                paint={{
                    "text-color":"hsl(0,0%,20%)",
                    "icon-opacity":1,
                    "text-opacity":[
                        "step",
                        [
                            "zoom"
                        ],
                        1,
                        8,
                        [
                            "match",
                            [
                                "get",
                                "class"
                            ],
                            [
                                "island"
                            ],
                            0,
                            1
                        ],
                        9,
                        [
                            "match",
                            [
                                "get",
                                "class"
                            ],
                            [
                                "island"
                            ],
                            1,
                            1
                        ]
                    ],
                    "text-halo-blur":[
                        "match",
                        [
                            "get",
                            "class"
                        ],
                        [
                            "suburb",
                            "neighborhood",
                            "neighbourhood",
                            "quarter"
                        ],
                        0.5,
                        1
                    ],
                    "text-halo-color":"hsl(0,0%,100%)",
                    "text-halo-width":[
                        "match",
                        [
                            "get",
                            "class"
                        ],
                        [
                            "suburb",
                            "neighborhood",
                            "neighbourhood",
                            "quarter"
                        ],
                        1,
                        1.2
                    ]
                }}
            />
            {doneCities.map((city, index) => 
                <Marker
                    latitude={city.ll[0]}
                    longitude={city.ll[1]}
                    color="#32ade6"
                    children={<div className={`${styles.marker} ${styles.green}`}>
                        <div className={styles.text}>{city.name}</div>
                        <div className={styles.circle}></div>
                    </div>}
                    key={index}
                />
            )}
            {attempts.map((attempt, index) => 
                <Marker
                    latitude={attempt.ll[0]}
                    longitude={attempt.ll[1]}
                    color="#32ade6"
                    children={<div className={styles.marker}>
                        <div className={styles.text}>{attempt.name}</div>
                        <div className={styles.circle}></div>
                    </div>}
                    key={index}
                />
            )}
            <Marker
                latitude={hiddenCity.ll[0]}
                longitude={hiddenCity.ll[1]}
                children={<div className={`${styles.marker} ${styles.red}`}>
                    <div className={styles.text}>?</div>
                    <div className={styles.circle}></div>
                </div>}
            />
        </Map>
    </div>
}
