import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./App.module.scss"
import { Bulb } from "@gravity-ui/icons"
import { RegionMap } from "../RegionMap/RegionMap"

import { KeyCodes } from "src/keyCodes"
import type { City } from "../../core/types"

// [lat, lng]

const citiesData: City[] = [
    { name: "Краснодар", ll: [45.020502, 38.998274] },
    { name: "Сочи", ll: [43.585472, 39.723098] },
    { name: "Адлер", ll: [43.438172, 39.911178] },
    { name: "Новороссийск", ll: [44.723771, 37.768813] },
    { name: "Анапа", ll: [44.894818, 37.316367] },
    { name: "Джубга", ll: [44.314735, 38.701623] },
    { name: "Архипо-Осиповка", ll: [44.370106, 38.533396] },
    { name: "Тамань", ll: [45.215612, 36.718413] },
    { name: "Туапсе", ll: [44.095245, 39.073382] },
    { name: "Усть-Лабинск", ll: [45.213657, 39.691225] },
    { name: "Славянск-на-Кубани", ll: [45.260332, 38.128220] },
    { name: "Армавир", ll: [44.997655, 41.129644] },
    { name: "Майкоп", ll: [44.606683, 40.105852] },
    { name: "Горячий Ключ", ll: [44.634246, 39.136426] },
    { name: "Темрюк", ll: [45.282052, 37.365353] },
    { name: "Геленджик", ll: [44.561018, 38.077104] },
    { name: "Лазаревское", ll: [43.908447, 39.333382] },
    { name: "Красная Поляна", ll: [43.679971, 40.205534] },
    { name: "Приморско-Ахтарск", ll: [46.043528, 38.177561] },
    { name: "Тимашевск", ll: [45.614183, 38.933903] },
    { name: "Кропоткин", ll: [45.434628, 40.575894] },
    { name: "Лабинск", ll: [44.635798, 40.723527] },
    { name: "Тихорецк", ll: [45.852691, 40.123037] },
    { name: "Крымск", ll: [44.935471, 37.987805] },
    { name: "Хадыженск", ll: [44.422773, 39.537182] },
    { name: "Белореченск", ll: [44.765976, 39.868327] },
    { name: "Апшеронск", ll: [44.465569, 39.727045] },
    { name: "Каменномостский", ll: [44.296042, 40.183335] },
    { name: "Псебай", ll: [44.115509, 40.794468] },
    { name: "Ильский", ll: [44.836008, 38.561858] },
    { name: "Кореновск", ll: [45.462752, 39.447915] },
    { name: "Тбилисская", ll: [45.364454, 40.201704] },
    { name: "Калининская", ll: [45.485700, 38.661768] },
    { name: "Кущёвская", ll: [46.565709, 39.627994] },
    { name: "Ленинградская", ll: [46.320538, 39.392810] },
    { name: "Должанская", ll: [46.638358, 37.800860] },
    { name: "Ейск", ll: [46.711972, 38.272600] },
    { name: "Староминская", ll: [46.538826, 39.062610] },
    { name: "Курганинск", ll: [44.884602, 40.588812] },
    { name: "Варениковская", ll: [45.125005, 37.641382] }
]

const fiveHiddenCities = [...Array(5)].map(() => getRandomCity(citiesData))

const MAX_HINTS_NUMBER = 3

export const App: React.FC = () => {
    const [allHiddenCities, setAllHiddenCities] = useState<City[]>(fiveHiddenCities)
    const hiddenCity: City = useMemo(() => (allHiddenCities[0] || citiesData[0]) as unknown as City, [allHiddenCities])
    const [inputValue, setInputValue] = useState("")
    const [attempts, setAttempts] = useState<City[]>([])
    const [doneCities, setDoneCities] = useState<City[]>([])
    
    const [hoveredHint, setHoveredHint] = useState<number | undefined>(undefined)
    const [answerHint, setAnswerHint] = useState("")
    const attemptText: string = useMemo(() => answerHint + inputValue, [answerHint, inputValue])

    const inputRef = useRef<HTMLInputElement>(null)
    const [isFocused, setIsFocused] = useState(true)

    const citiesNames = useMemo(() => citiesData.map((city) => city.name) ,[])
    const [inputHint, selectHints] = useMemo(() => {

        const loweredSearch = attemptText.toLowerCase()
        const hints = citiesNames.filter((cityName) => cityName.toLowerCase().includes(loweredSearch))
        const sortedHints = hints.sort((a, b) => a.toLowerCase().indexOf(loweredSearch) - b.toLowerCase().indexOf(loweredSearch))

        if (inputValue.length === 0 && answerHint.length > 0) {
            return ["", []]
        }

        if (inputValue.length === 0) {
            return ["", sortedHints.slice(0, MAX_HINTS_NUMBER)]
        }
        
        return [sortedHints[0], sortedHints.slice(1, MAX_HINTS_NUMBER + 1)]
    }, [answerHint.length, attemptText, citiesNames, inputValue.length])

    const makeCity = useCallback(() => {
        if (allHiddenCities.length > 1) {
            setAllHiddenCities((state) => state.slice(1))
        } else {
            alert("Всё")
        }
    }, [allHiddenCities])

    const finishGame = useCallback(() => {
        setDoneCities([...doneCities, hiddenCity])
        makeCity()
        setAttempts([])
        setInputValue("")
        setAnswerHint("")
    }, [doneCities, hiddenCity, makeCity])

    const checkGuess = useCallback((guessText: string) => {
        console.log(guessText)
        if (compareCityNames(guessText, hiddenCity.name)) {
            finishGame()
        } else {
            const attemptCity = citiesData.find((city) => compareCityNames(city.name, guessText))

            if (attemptCity) {
                setAttempts((attempts) => ([...attempts, attemptCity]))
                setInputValue("")
            }
        }
    }, [finishGame, hiddenCity.name])

    useEffect(() => {
        if (compareCityNames(answerHint, hiddenCity.name)) {
            finishGame()
        }
    }, [answerHint, finishGame, hiddenCity.name])

    const completeInputHint = useCallback(() => {
        if (inputHint) {
            setInputValue(inputHint)
        }
    }, [inputHint])

    const showNextLetter = useCallback(() => {
        const answer = hiddenCity.name

        setAnswerHint(answer.slice(0, answerHint.length + 1))
        setInputValue("")
        inputRef.current?.focus()
    }, [answerHint.length, hiddenCity.name])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        setHoveredHint(undefined)
    }, [])

    const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        
        switch (e.keyCode) {
        case KeyCodes.enter:
            setHoveredHint(undefined)
            checkGuess(hoveredHint !== undefined && selectHints[hoveredHint] || inputHint || attemptText)
            return
        case KeyCodes.tab:
        case KeyCodes.rightArrow:
            e.preventDefault()
            completeInputHint()
            return
        case KeyCodes.downArrow:
            e.preventDefault()
            setHoveredHint((state) => {
                if (state === undefined) {
                    return 0
                }

                return state < MAX_HINTS_NUMBER - 1 ? state + 1 : undefined
            })
            return
        case KeyCodes.upArrow:
            e.preventDefault()
            setHoveredHint((state) => state && state > 0 ? state - 1 : undefined)
        }
    }, [attemptText, checkGuess, completeInputHint, hoveredHint, inputHint, selectHints])

    useEffect(() => {
        document.addEventListener("keyup", (e) => {
            if (e.key.length === 1 && !isFocused) {
                inputRef.current?.focus()
                inputRef.current?.dispatchEvent(new KeyboardEvent("keydown", e))
            }
        })
    }, [isFocused])

    return (
        <div className={styles.App}>
            <RegionMap hiddenCity={hiddenCity} attempts={attempts} doneCities={doneCities} />
            <div className={styles.playControls}>
                <button className={`${styles.button} ${styles.hintButton}`} onClick={() => showNextLetter()}>
                    <Bulb />
                </button>
                <div className={styles.bigInput}>
                    <div className={styles.inputWrapper}>
                        <div className={styles.inputHint}>
                            {inputHint ? getHighlightedText(inputHint, attemptText) : null}
                        </div>
                        <div className={styles.inputWithHint}>
                            <span className={`${styles.answerHint} ${answerHint && styles.active}`}>{answerHint}</span>
                            <input
                                type="text"
                                ref={inputRef}
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className={`${styles.selectHint} ${!isFocused ? styles.hidden : null}`} onMouseLeave={() => setHoveredHint(undefined)}>
                        {selectHints && selectHints.map((hint, index) => {
                            return <div
                                className={`${styles.item} ${hoveredHint === index ? styles.hover : null}`}
                                onMouseEnter={() => setHoveredHint(index)}
                                onMouseDown={() => {
                                    checkGuess(hint)
                                }}
                                key={index}
                            >
                                {hint}
                            </div>
                        })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.status}>

            </div>
        </div>
    )
}

function getRandomCity(cities: City[]): City {
    return cities[Math.floor(Math.random() * cities.length)] as City
}

const compareCityNames = (name1: string, name2: string) => {
    return name1.toLocaleLowerCase() === name2.toLocaleLowerCase()
}

const getHighlightedText = (text: string, searchQuery: string) => {
    const parts = text.split(new RegExp(`^(${searchQuery})`, "ig"))
    return parts.map(
        (part, i) => {
            const isHighlighted = part.toLowerCase() === searchQuery.toLowerCase() 
            return <span key={i} className={isHighlighted ? styles.hightlighted : ""}>
                { part }
            </span>
        })
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
