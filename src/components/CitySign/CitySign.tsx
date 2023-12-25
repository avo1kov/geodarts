import React, { ReactNode, useMemo } from "react"
import styles from "./CitySign.module.scss"
import { RoadButton } from "../RoadButton"
import { ReadButtonProps } from "../RoadButton"

type CitySign = ReadButtonProps

export function CitySign({ ...restProps }: CitySign) {
    return (
        <RoadButton {...restProps} />
    )
}
