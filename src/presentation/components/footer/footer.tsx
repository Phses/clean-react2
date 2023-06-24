import React, { memo } from "react";
import Styles from "./footer-styles.scss"
import Logo from "../logo/logo";

const Footer: React.FC = () => {
    return (
        <footer className={Styles.footer}></footer>
    )
}

export default memo(Footer)