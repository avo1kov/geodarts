import React, { useCallback, useMemo, useRef, useState } from "react"
import SendRoundedIcon from "@mui/icons-material/SendRounded"

import styles from "./MainInput.module.scss"
import { useGameContext, useGameDispanchContext } from "../GameContext"
import { KeyCodes } from "src/keyCodes"
import { isMobile } from "react-device-detect"

const MAX_HINTS_NUMBER = 3

interface MainInputProps {
    inputRef: React.RefObject<HTMLInputElement>;
    answerHint: string;
}

export function MainInput({ inputRef, answerHint }: MainInputProps) {
    const { allCities, hiddenCityId } = useGameContext()

    const hiddenCity = useMemo(() => hiddenCityId ? allCities[hiddenCityId] : undefined, [allCities, hiddenCityId])
    const dispatch = useGameDispanchContext()
    
    const [inputValue, setInputValue] = useState("")

    const citiesNames = useMemo(() => allCities.map((city) => city.name), [allCities])
    
    const attemptText: string = useMemo(() => answerHint + inputValue, [answerHint, inputValue])

    const [isFocused, setIsFocused] = useState(true)

    const [inputHint, selectHints] = useMemo(() => {
        const loweredSearch = attemptText.toLowerCase()
        const hints = citiesNames.filter((cityName) => cityName.toLowerCase().includes(loweredSearch))
        const sortedHints = hints.sort((a, b) => a.toLowerCase().indexOf(loweredSearch) - b.toLowerCase().indexOf(loweredSearch))

        if (inputValue.length === 0 && answerHint.length > 0) {
            return ["", []]
        }

        if (inputValue.length === 0 || sortedHints[0] && sortedHints[0].indexOf(loweredSearch) > 0) {
            return ["", sortedHints.slice(0, MAX_HINTS_NUMBER)]
        }
        
        return [sortedHints[0], sortedHints.slice(1, MAX_HINTS_NUMBER + 1)]
    }, [answerHint.length, attemptText, citiesNames, inputValue.length])

    const checkGuess = useCallback(() => {
        if (!inputHint) {
            return
        }
        
        const attemptCityId = allCities.findIndex((city) => city.name.toLowerCase() === inputHint.toLowerCase())

        if (attemptCityId > -1) {
            setInputValue("")
            dispatch({
                type: "attempted",
                attemptCityId
            })
        }
    }, [allCities, dispatch, inputHint])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        // setHoveredHint(undefined)
    }, [])

    const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        
        switch (e.keyCode) {
        case KeyCodes.enter: {
            // setHoveredHint(undefined)
            // checkGuess(hoveredHint !== undefined && selectHints[hoveredHint] || inputHint || attemptText)
            checkGuess()
            return
        }
        // case KeyCodes.tab:
        // case KeyCodes.rightArrow: {
        //     e.preventDefault() // TODO: this prevents arrow even when you need to move cursor right
        //     completeInputHint()
        //     return
        // }
        case KeyCodes.downArrow: {
            e.preventDefault()
            // setHoveredHint((state) => {
            //     if (state === undefined) {
            //         return 0
            //     }

            //     return state < MAX_HINTS_NUMBER - 1 ? state + 1 : undefined
            // })
            return
        }
        case KeyCodes.upArrow:{
            e.preventDefault()
            // setHoveredHint((state) => state && state > 0 ? state - 1 : undefined)
        }
        }
    }, [checkGuess])

    return (
        <div className={styles.form}>
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
                        autoFocus={!isMobile}
                        autoComplete="off"
                        autoCapitalize={answerHint.length > 0 ? "off" : "on"}
                    />
                </div>
            </div>
            <button
                className={
                    [
                        styles.sendButton,
                        !inputHint && styles.disabled
                    ].join(" ")
                }
                onClick={() => inputHint && checkGuess()}>
                <SendRoundedIcon />
            </button>
            {/* <div className={`${styles.selectHint} ${!isFocused ? styles.hidden : null}`} onMouseLeave={() => setHoveredHint(undefined)}>
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
            </div> */}
        </div>
    )
}

const getHighlightedText = (text: string, searchQuery: string) => {
    const parts = text.split(new RegExp(`^(${searchQuery})`, "ig"))
    return parts.map(
        (part, i) => {
            const isHighlighted = part.toLowerCase() === searchQuery.toLowerCase() 
            return (
                <span key={i} className={isHighlighted ? styles.hightlighted : ""}>
                    { part }
                </span>
            )
        }
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
