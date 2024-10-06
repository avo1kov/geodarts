import React from "react"
import { isMobile } from "react-device-detect"

import Logo from "../../assets/logo@0.5x.png"

import styles from "./Footer.module.scss"

export const Footer: React.FC = () => {
    return (
        <div className={[styles.author, isMobile ? styles.mobile : ""].join(" ")}>
            <img src={Logo} className={styles.logo} />
                by <a href="https://volkov.media" target="_blank">Alexander Volkov</a>
        </div>
    )
}
