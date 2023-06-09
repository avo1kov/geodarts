import React, { ReactNode, useMemo } from "react"
import styles from "./CitySign.module.scss"

interface CitySign {
    text?: string;
    crossed?: boolean;
    crossOnHover?: boolean;
    shiftOnHover?: boolean;
    view?: "blue" | "white" | "orange" | "green";
    onClick?: () => void;
    title?: string;
    children?: ReactNode;
    className?: string;
    clickable?: boolean;
}

export function CitySign({ children, text, crossed, crossOnHover, shiftOnHover, view = "white", onClick, title, className, clickable }: CitySign) {
    const viewStyle = useMemo(() => {
        switch (view) {
        case "blue": {
            return styles.blue
        }
        case "white": {
            return styles.white
        }
        case "orange": {
            return styles.orange
        }
        case "green": {
            return styles.green
        }
        }
    }, [view])

    return (
        <div
            className={
                [
                    styles.root,
                    viewStyle,
                    shiftOnHover ? styles.shiftOnHover : "",
                    (clickable || onClick !== undefined) && clickable !== false ? styles.clickable : "",
                    className
                ].join(" ")
            }
            onClick={onClick}
            title={title}
        >
            <div className={styles.inner}>
                <div className={styles.text}>
                    {children ?? text}
                </div>
                {/* <div className={styles.rightIcon}>
                    {rightIcon}
                </div> */}
                <div className={
                    [
                        styles.redLine,
                        crossed ? styles.visible : "",
                        crossOnHover ? styles.crossOnHover : ""
                    ].join(" ")
                }></div>
            </div>
        </div>
    )
}
