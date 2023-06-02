import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useGameContext, useGameDispanchContext } from "../GameContext/GameContext"
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined"

import styles from "./PlayControl.module.scss"
import { isMobile } from "react-device-detect"
import { MainInput } from "../MainInput"

export const PlayControl: React.FC = () => {
    const { allCities, hiddenCityId } = useGameContext()

    const hiddenCity = useMemo(() => hiddenCityId ? allCities[hiddenCityId] : undefined, [allCities, hiddenCityId])
    const dispatch = useGameDispanchContext()

    const inputRef = useRef<HTMLInputElement>(null)

    const [answerHint, setAnswerHint] = useState("")

    useEffect(() => {
        setAnswerHint("")
    }, [hiddenCity])

    // const completeInputHint = useCallback(() => {
    //     if (inputHint) {
    //         setInputValue(inputHint)
    //     }
    // }, [inputHint])

    const showNextLetter = useCallback(() => {
        const answer = hiddenCity?.name
        
        if (answer) {
            setAnswerHint(answer.slice(0, answerHint.length + 1))
            // setInputValue("")
            
            dispatch({ type: "took_hint" })

            inputRef.current?.blur()
            inputRef.current?.focus()
        }
    }, [answerHint.length, dispatch, hiddenCity?.name])

    return <div className={`${styles.root} ${isMobile && styles.mobile}`}>
        <button className={`${styles.button} ${styles.hintButton}`} onClick={() => showNextLetter()}
        >
            <EmojiObjectsOutlinedIcon />
        </button>
        <MainInput inputRef={inputRef} answerHint={answerHint} />
    </div>
}
