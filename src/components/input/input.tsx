import React from "react";
import "./input.scss";
import ShowIcon from "../../assets/images/icons/show.png";
import HideIcon from "../../assets/images/icons/hide.png";


const Input = (props: any) => {
    const { type,
        error,
        errormessage,
        label,
        onChange,
        value,
        required,
        isPassword,
        showPassword,
        setShowPassword,
        register,
        placeholder,
        isTextArea,
        disabled,
        style,
        autoFocus,
        isEndProp,
        Icon
    } = props;

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    return <React.Fragment>

        <div className={error ? "invalid-input" : "valid-input"}>

            <div className="form-input">
                {label ? <label htmlFor={label || ""}>{label}
                    <span>{required ? '*' : ''}</span>
                </label> : ""}

                {!isTextArea ? <input type={type || "text"}
                    placeholder={placeholder || "No Placeholder"}
                    id={label || ""}
                    onChange={onChange}
                    value={value}
                    {...register}
                    disabled={disabled || false}
                    style={{ ...style }}
                    autoFocus={autoFocus}
                /> :
                    <textarea className="form-control"
                        placeholder={placeholder || "No Placeholder"}
                        id={label || ""}
                        onChange={onChange}
                        value={value}
                        {...register}
                        disabled={disabled || false}
                        style={{ ...style }}
                    />
                }

                {isPassword ? <div className="passwordIcons">
                    <img src={showPassword ? ShowIcon : HideIcon} onClick={togglePassword} alt="icon" />
                </div> : ""}


                {isEndProp ? <div className="passwordIcons icon">
                    <Icon/>
                </div> : ""}
            </div>

            <div className="errormessage mt-1">
                {errormessage ? errormessage : ""}
            </div>
        </div>


    </React.Fragment>
}
export default Input;