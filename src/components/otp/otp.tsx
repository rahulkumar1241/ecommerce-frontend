import { Typography } from '@mui/material';
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';


const MyOtpInput = (props: any) => {
    let { value, onChange, error, errormessage } = props;

    return (
        <div >
            <OtpInput
                value={value}
                onChange={onChange}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input   {...props} />}
                inputStyle={{
                    border: error ?
                        "1px solid red" : "",
                    height: "45px", width: "45px",
                    margin:"0px 10px"
                }}
            />
            <Typography variant="subtitle1" color="error" >
                {errormessage ? errormessage : ""}
            </Typography>
        </div>

    );
}
export default MyOtpInput;