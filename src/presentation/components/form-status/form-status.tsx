import React, { useContext } from "react";
import Styles from "./form-status-styles.scss"
import Spinner from "../spinner/spinner";
import Context from "../../context/form-context"

const FormStatus: React.FC = () => {
    const { state, errorState } = useContext(Context)
    return (
        <div data-testid="form-status" className={Styles.formStatus}>
           {state.isLoading && <Spinner className={Styles.spinner}/>}
           {errorState.main && <span>{errorState.main}</span>}
        </div>
    )
}

export default FormStatus