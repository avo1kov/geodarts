import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useGameContext, useGameDispanchContext } from "../GameContext/GameContext"
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined"

import styles from "./PlayControl.module.scss"
import { isMobile } from "react-device-detect"
import { MainInput } from "../MainInput"
import { RoadButton } from "../RoadButton"

export const PlayControl: React.FC = () => {
    const { allCities, hiddenCityId, restHiddenCitiesIds } = useGameContext()

    const hiddenCity = useMemo(() => hiddenCityId ? allCities[hiddenCityId] : undefined, [allCities, hiddenCityId])
    const dispatch = useGameDispanchContext()

    const [mainInputValue, setMainInputValue] = useState("При")
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
            const newAnswerHint = answer.slice(0, answerHint.length + 1)
            setAnswerHint(newAnswerHint)
            setMainInputValue("")
            
            dispatch({ type: "took_hint" })

            if (restHiddenCitiesIds.length > 0) {
                inputRef.current?.blur()
                inputRef.current?.focus()   
            }

            if (newAnswerHint === answer && hiddenCityId) {
                dispatch({ type: "attempted", attemptCityId: hiddenCityId })
            }
        }
    }, [answerHint.length, dispatch, hiddenCity?.name, hiddenCityId, restHiddenCitiesIds.length])

    return <div className={`${styles.root} ${isMobile && styles.mobile}`}>
        <RoadButton
            view={"orange"}
            className={styles.button}
            onClick={() => showNextLetter()} title="Подсказка"
            borderRadius={10}
            borderWidth={1.5}
            accentColor={"#4f4d41"}
        >
            <EmojiObjectsOutlinedIcon className={styles.hintIcon} />
        </RoadButton>
        {/* <button className={`${styles.button} ${styles.hintButton}`} onClick={() => showNextLetter()}
        >
            <EmojiObjectsOutlinedIcon />
        </button> */}
        <MainInput inputRef={inputRef} answerHint={answerHint} value={mainInputValue} onChange={setMainInputValue} />
    </div>
}
