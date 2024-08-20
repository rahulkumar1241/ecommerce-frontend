import React from "react";
import "./select.scss";


const MySelect = (props: any) => {

    const { menuItems, value, onChange, error, errormessage, label, required,style,size} = props;

    return <React.Fragment>
        <div className={!error ? "my-select" : "my-select-error"} style={{...style}}>
            <label>{label || "No Label"}<span className="text-danger">{required ? '*' : ''}</span></label>
            <select value={value} onChange={onChange} className={`${size ?'form-select-'+size:'form-select'}`} aria-label="Default select example">
                <option value=''>Select an option</option>
                {menuItems.map((data: any, index: any) => {
                    return <option value={data.value}>{data.label}</option>
                })}
            </select>
            {error ? <p className="errormessage">{errormessage}</p> : ""}
        </div>
    </React.Fragment>
}

export default MySelect;
