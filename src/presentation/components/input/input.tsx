import React, { useContext } from "react";
import Styles from "./input-styles.scss"
import Context from "@/presentation/context/form-context";

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
    const { errorState } = useContext(Context)
    const value = errorState[props.type]

    return (
        <div className={Styles.inputWrapper}>
            <label htmlFor={props.type}>{props.type}</label>
            <input {...props}/>
            <span data-testid={`${props.type}-status`} title={value} className={Styles.inputStatus}>❌</span>
        </div>
    )
}

export default Input