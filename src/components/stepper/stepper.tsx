import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const StepperComponent = (props: any) => {
    const { activeStep, steps, isOrderStepper } = props;
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep || 0} alternativeLabel
            >
                {steps.map((label: any) => (
                    <Step key={label}
                        sx={
                            !isOrderStepper ? {
                                '& .MuiStepLabel-root .Mui-completed': {
                                    color: '#e9611e', // circle color (COMPLETED)
                                },
                                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                {
                                    color: 'grey.500', // Just text label (COMPLETED)
                                  
                                },
                                '& .MuiStepLabel-root .Mui-active': {
                                    color: '#e9611e', // circle color (ACTIVE)
                                },
                                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                {
                                    color: '#e9611e', // Just text label (ACTIVE)
                                },
                                '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                    fill: '#FFFFFF', // circle's number (ACTIVE)
                                },
                            } : {
                                '& .MuiStepConnector-root':{
                                    marginTop:"-5px"
                                },
                                '& .MuiStepLabel-root .Mui-completed': {
                                    color: '#009933', // circle color (COMPLETED)
                                    height:"15px"
                                   
                                },
                                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                {
                                    color: 'grey.500', // Just text label (COMPLETED)
                                    fontSize:"70%",
                                    marginTop: "10px"
                                },
                                '& .MuiStepLabel-root .Mui-active': {
                                    color: '#009933', // circle color (ACTIVE)
                                    height:"15px"
                                },
                                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                {
                                    color: 'grey.500', // Just text label (ACTIVE)
                                    fontSize:"70%",
                                    marginTop: "10px"
                                },
                                '& .MuiStepLabel-root.MuiStepLabel-horizontal.Mui-disabled.MuiStepLabel-alternativeLabel':{
                                    color: 'grey.600', // Just text label (ACTIVE)
                                    fontSize:"70%"
                                },
                                '& .MuiStepLabel-label.Mui-disabled.MuiStepLabel-alternativeLabel':
                                {
                                    color: 'grey.500', 
                                    fontSize:"100%",
                                    marginTop: "10px"
                                },
                                '& .MuiStepLabel-root .Mui-disabled svg':
                                {
                                    height:"15px"
                                }
                            }}
                    >
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default StepperComponent;