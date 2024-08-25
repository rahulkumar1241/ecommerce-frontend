import { Typography } from '@mui/material';
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { getOS } from '../../constants/constants';

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
                    height:getOS() ==="desktop" ? "45px":"30px", width: getOS() ==="desktop" ? "45px":"30px",
                    margin:getOS() ==="desktop" ?"0px 10px":"0px 5px"
                }}
            />
            <Typography variant="subtitle1" color="error" >
                {errormessage ? errormessage : ""}
            </Typography>
        </div>

    );
}
export default MyOtpInput;
