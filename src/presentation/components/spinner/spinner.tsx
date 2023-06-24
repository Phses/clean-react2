import React from "react";
import Styles from "./spinner-styles.scss"

interface SpinnerProps extends React.HTMLAttributes<HTMLElement> {
}
  
  const Spinner: React.FC<SpinnerProps> = (props) => {
    const { className, ...restProps } = props;
  
    return (
      <div {...restProps} className={[Styles.spinnerRing, className].join(' ')}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };
  
  export default Spinner;