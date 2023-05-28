import React, { useCallback, useMemo, useState } from "react"

import { useGameContext, useGameDispanchContext } from "../GameContext/GameContext"
import { KeyCodes } from "src/keyCodes"
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined"
import SendRoundedIcon from "@mui/icons-material/SendRounded"

import styles from "./PlayControl.module.scss"
import { isMobile } from "react-device-detect"

const MAX_HINTS_NUMBER = 3

export const PlayControl: React.FC = () => {
    const { allCities, hiddenCityId } = useGameContext()

    const [inputValue, setInputValue] = useState("")

    const hiddenCity = useMemo(() => hiddenCityId && allCities[hiddenCityId], [allCities, hiddenCityId])
    const dispatch = useGameDispanchContext()
    
    const citiesNames = useMemo(() => allCities.map((city) => city.name), [allCities])

    const [answerHint, setAnswerHint] = useState("")
    const attemptText: string = useMemo(() => answerHint + inputValue, [answerHint, inputValue])

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

    const checkGuess = useCallback((guessText: string) => {
        // if (compareCityNames(guessText, hiddenCity.name)) {
        //     finishGame()
        // } else {
        //     const attemptCity = citiesData.find((city) => compareCityNames(city.name, guessText))

        //     if (attemptCity) {
        //         setAttempts((attempts) => ([...attempts, attemptCity]))
        //         setInputValue("")
        //     }
        // }

        const attemptCityId = allCities.findIndex((city) => city.name === inputValue)

        console.log({ attemptCityId })

        if (attemptCityId > -1) {
            dispatch({
                type: "attempted",
                attemptCityId
            })
        }
    }, [allCities, dispatch, inputValue])

    // const completeInputHint = useCallback(() => {
    //     if (inputHint) {
    //         setInputValue(inputHint)
    //     }
    // }, [inputHint])

    // const showNextLetter = useCallback(() => {
    //     const answer = hiddenCity.name

    //     setAnswerHint(answer.slice(0, answerHint.length + 1))
    //     setInputValue("")
    //     inputRef.current?.focus()
    // }, [answerHint.length, hiddenCity.name])

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
            checkGuess(inputValue)
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
    }, [checkGuess, inputValue])

    return <div className={`${styles.root} ${isMobile && styles.mobile}`}>
        <button className={`${styles.button} ${styles.hintButton}`}
            // onClick={() => showNextLetter()}
        >
            <EmojiObjectsOutlinedIcon />
        </button>
        <div className={styles.form}>
            <div className={styles.inputWrapper}>
                <div className={styles.inputHint}>
                    {inputHint ? getHighlightedText(inputHint, attemptText) : null}
                </div>
                <div className={styles.inputWithHint}>
                    <span className={`${styles.answerHint} ${answerHint && styles.active}`}>{answerHint}</span>
                    <input
                        type="text"
                        // ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        // onFocus={() => setIsFocused(true)}
                        // onBlur={() => setIsFocused(false)}
                        autoFocus={!isMobile}
                    />
                </div>
            </div>
            <button className={`${styles.sendButton}`}>
                <SendRoundedIcon />
            </button>
        </div>
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
