import React, { useContext } from "react";
import Styles from "./form-status-styles.scss"
import Spinner from "../spinner/spinner";
import Context from "../../context/form-context"

const FormStatus: React.FC = () => {
    const { isLoading, errorMessage } = useContext(Context)
    return (
        <div data-testid="form-status" className={Styles.formStatus}>
           {isLoading && <Spinner className={Styles.spinner}/>}
           {errorMessage && <span>{errorMessage}</span>}
        </div>
    )
}

export default FormStatus