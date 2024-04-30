import React from "react";
import "./button.scss";

const Button = (props: any) => {

    const { label, onClick, type, isFilled, style, loading, isFullWidth, disabled } = props;

    return <React.Fragment>
        <div className={`BtnContainer`}>
            <button
                className={`Btn ${isFullWidth === undefined || isFullWidth === true ? 'fullWidthBtn' : ''} ${isFilled ? 'contained' : 'outlined'} ${disabled ? 'wrapper' : ''}`}
                onClick={onClick}
                style={{ ...style }}
                type={type || "button"}
                disabled={disabled || false}
            >
                {props.children}
                {label || ""}

            </button>
        </div>
    </React.Fragment>
}

export default Button;