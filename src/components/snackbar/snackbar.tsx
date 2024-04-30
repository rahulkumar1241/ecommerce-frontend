import React, { forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const CustomizedSnackbars: React.FC<any> = forwardRef((props: any, ref: any) => {

    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState("");
    const [message, setMessage] = React.useState("");

    const DURATION_IN_SECONDS = 5000;

    useImperativeHandle(ref, () =>
    ({
        handleClickOpen: (type: any, message: any) => {
            setType(type.toUpperCase());
            setMessage(message);
            setOpen(true);
        }
    }));

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            autoHideDuration={DURATION_IN_SECONDS}
            onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={type === "SUCCESS" ? "success" : "error"}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
})

export default CustomizedSnackbars;