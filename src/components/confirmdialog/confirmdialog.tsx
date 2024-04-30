import React, { useImperativeHandle, forwardRef, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { Grid } from "@mui/material";
import Button from "../button/button";
import "./confirmdialog.scss";

const ConfirmDialog: React.FC<any> = forwardRef((props: any, ref: any) => {

    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () =>
    ({
        handleClickOpen: () => {
            setOpen(true);
        },
        handleClose: () => {
            setOpen(false);
        }
    }));

    const closeModal = () => {
        setOpen(false);
    }


    return (
        <div className="confirm-dialog">
            <Dialog
                className='dialogAlertStyle'
                open={open}
                onClose={closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">

                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b>{props.description ? props.description : null}</b>
                    </DialogContentText>
                </DialogContent>

                <DialogActions
                    className="dialogactions"
                >
                    <Grid container spacing={1}>
                        <Grid item xs={6} sm={6} md={6} lg={6}>
                            <Button label={props.confirm} onClick={props.onConfirm} />
                        </Grid>

                        <Grid item xs={6} sm={6} md={6} lg={6}>
                            <Button label={props.discard} isFilled={true} onClick={props.onDiscard} />
                        </Grid>

                    </Grid>
                </DialogActions>
            </Dialog>

        </div>
    );
});

export default ConfirmDialog;
