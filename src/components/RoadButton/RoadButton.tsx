import React, { ReactNode, useMemo } from "react"
import styles from "./RoadButton.module.scss"

export interface ReadButtonProps {
    text?: string;
    crossed?: boolean;
    crossOnHover?: boolean;
    shiftOnHover?: boolean;
    view?: "blue" | "white" | "orange" | "green";
    onClick?: () => void;
    clickable?: boolean;
    title?: string;
    children?: ReactNode;
    className?: string;
    borderRadius?: number;
    borderWidth?: number;
    accentColor?: string;
    fontSize?: number;
}

export function RoadButton({
    children,
    text,
    crossed,
    crossOnHover,
    shiftOnHover,
    view = "white",
    onClick,
    clickable,
    title = text,
    className,
    borderRadius = 0,
    borderWidth,
    accentColor,
    fontSize = 22
}: ReadButtonProps) {
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
            style={{
                borderRadius: borderRadius,
                borderWidth: borderWidth
            }}
            onClick={onClick}
            title={title}
        >
            <div
                className={styles.inner}
                style={{
                    borderRadius: (borderRadius! - 1),
                    borderWidth: borderWidth,
                    borderColor: accentColor,
                    padding: `0 ${fontSize / 2}px`
                }}
            >
                <div
                    className={styles.content}
                    style={{
                        color: accentColor, 
                        fontSize: `${fontSize}px`,
                        lineHeight: `${fontSize}px`,
                        paddingBottom: "1px",
                        wordSpacing: `${-fontSize / 4}px`
                        // padding: `${fontSize / 1000}px 0`
                    }}
                >
                    {children ?? text}
                </div>
                <div
                    className={
                        [
                            styles.redLine,
                            crossed ? styles.visible : "",
                            crossOnHover ? styles.crossOnHover : ""
                        ].join(" ")
                    }
                    style={{
                        height: fontSize / 4.5 + "px"
                    }}
                ></div>
            </div>
        </div>
    )
}
