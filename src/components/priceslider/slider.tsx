import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import "./priceslider.scss";
import { numberToIndianCurrency } from '../../constants/constants';


const MAX = 100;
const MIN = 0;
const marks = [
    {
        value: MIN,
        label: '',
    },
    {
        value: MAX,
        label: '',
    },
];

const PriceSlider = (props: any) => {
    const { value, handleChange, MIN, MAX, register } = props;


    return (
        <Box sx={{ width: "100%" }}>
            <Slider
                {...register}
                marks={marks}
                value={value}
                valueLabelDisplay="auto"
                min={MIN}
                max={MAX}
                onChange={handleChange}
                sx={{
                    '& .MuiSlider-thumb': {
                        color: "#e9611e"
                    },
                    '& .MuiSlider-track': {
                        color: "#e9611e"
                    },
                    '& .MuiSlider-rail': {
                        color: "gray"
                    },
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="body2"
                    sx={{ cursor: 'pointer' }}
                >
                    {numberToIndianCurrency(MIN)} <b>MIN</b>
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ cursor: 'pointer' }}
                >
                    {numberToIndianCurrency(MAX)} <b>MAX</b>
                </Typography>
            </Box>
        </Box>
    );
}

export default PriceSlider;

