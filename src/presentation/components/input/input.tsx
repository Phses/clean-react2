import React, { useContext } from "react";
import Styles from "./input-styles.scss"
import Context from "@/presentation/context/form-context";

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
    const { state, setState } = useContext(Context)
    const value = state[`${props.type}Error`]

    const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [props.type]: event.target.value
        })
    }
    const getStatusContent = (): string => {
        return value ? "&#10060" : '&#9989'
    }
    return (
        <div className={Styles.inputWrapper}>
            <label htmlFor={props.type}>{props.type}</label>
            <input {...props} onChange={handleChange}/>
            <span data-testid={`${props.type}-status`} title={value} className={Styles.inputStatus}>{getStatusContent()}</span>
        </div>
    )
}

export default Input