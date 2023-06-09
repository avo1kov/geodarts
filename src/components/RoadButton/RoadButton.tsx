import React, { ReactNode, useMemo } from "react"
import styles from "./RoadButton.module.scss"

interface ReadButtonProps {
    text?: string;
    crossed?: boolean;
    crossOnHover?: boolean;
    shiftOnHover?: boolean;
    view?: "blue" | "white" | "orange" | "green";
    onClick?: () => void;
    title?: string;
    children?: ReactNode;
    className?: string;
    borderRadius?: number;
    borderWidth?: number;
    accentColor?: string;
}

export function RoadButton({
    children,
    text,
    crossed,
    crossOnHover,
    shiftOnHover,
    view = "white",
    onClick,
    title,
    className,
    borderRadius,
    borderWidth,
    accentColor
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
                    onClick !== undefined ? styles.clickable : "",
                    className
                ].join(" ")
            }
            style={{ "borderRadius": borderRadius, "borderWidth": borderWidth }}
            onClick={onClick}
            title={title}
        >
            <div
                className={styles.inner}
                style={{ "borderRadius": (borderRadius! - 1), "borderWidth": borderWidth, "borderColor": accentColor }}
            >
                <div className={styles.content} style={{ "color": accentColor }}>
                    {children ?? text}
                </div>
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
