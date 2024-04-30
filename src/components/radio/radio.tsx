import * as React from 'react';
import Radio from '@mui/material/Radio';
import "./radio.scss";

const RadioButton = (props: any) => {
    const { selectedValue, onChange, value, label, register,style } = props;

    return (
        <div className='d-flex align-items-center  radio-container'>
            <Radio
                {...register}
                checked={selectedValue === value}
                onChange={onChange}
                value={value}
                name="radio-buttons"
                inputProps={{ 'aria-label': 'A' }}
                sx={{
                    '&, &.Mui-checked': {
                        color: '#e9611e',
                    },
                }}
            />
           {label}
        </div>
    );
}
export default RadioButton;