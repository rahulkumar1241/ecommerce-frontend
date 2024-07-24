import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';
import { useForm, Controller, set } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom";
import { PATH } from '../../../paths/path';
import Loading from '../../../components/loader/loader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import OtpInput from '../../../components/otp/otp';
import Button from '../../../components/button/button';

import ImageLogo from "../../../assets/images/icons/images.png";
import "../common/auth.scss";
import { sendOtpUpdateEmail, verifyOtpUpdateEmail } from '../../../store/slices/auth';
import { API_MESSAGE_TYPE } from '../../../constants/constants';
import showToast from '../../../components/toasters/toast';
import useLocalStorage from '../../../utils/localStorage';

const TOTAL_SECONDS = 120;

const OtpModal = (props: any) => {

    let { open, setOpen } = props;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [otpTimerInfo, setOtpTimerInfo]: any = useState({
        resend: false,
        seconds: TOTAL_SECONDS
    })

    const timerRef: any = useRef({
        seconds: TOTAL_SECONDS
    });


    const { loadingSendOtpUpdateEmail, loadingVerifyOtpUpdateEmail, sendOtpEmail } = useAppSelector(state => state.auth);

    const handleClose = () => {
        setOpen(false);
    };


    React.useEffect(() => {
        setValue("otp", "");
    }, [])


    useEffect(() => {
        if (otpTimerInfo.resend === false && otpTimerInfo.seconds === TOTAL_SECONDS) {
            startTimer();
        }
    }, [otpTimerInfo])


    const startTimer = () => {

        let clearId = setInterval(() => {

            let seconds = timerRef.current.seconds - 1;

            timerRef.current.seconds = seconds;

            if (seconds <= 0) {
                setOtpTimerInfo({ resend: true, seconds: seconds })
                clearInterval(clearId);
            } else {
                setOtpTimerInfo({
                    resend: false,
                    seconds: seconds
                })
            }
        }, 1000)
    }

    const validationSchema = Yup.object().shape({
        otp: Yup.string()
            .required("Please enter a valid otp.")
            .matches(/^[0-9]+$/, "OTP must be digits only.")
            .min(6, 'Must be exactly 6 digits')
            .max(6, 'Must be exactly 6 digits')
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control
    }: any = useForm({
        resolver: yupResolver(validationSchema)
    });



    const onSubmit = async (data: any) => {
        let formData = {
            email: sendOtpEmail,
            otp: data.otp
        }

        let response = await dispatch(verifyOtpUpdateEmail(formData));
        let verifyOtpData = response?.payload?.data ? response.payload.data : {};

        if (verifyOtpData.success) {
            /////////////show toast first/////////
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                verifyOtpData.message ?
                    verifyOtpData.message :
                    "Something went wrong"
            )
            let data = useLocalStorage.getItem("userData");
            data['email'] = sendOtpEmail;
            useLocalStorage.setItem("userData", data);
            setOpen(false);
            navigate(PATH.PUBLIC.HOME_PAGE);
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                verifyOtpData.message ?
                    verifyOtpData.message :
                    "Something went wrong"
            )
        }
    }


    const resendOtp = async () => {

        let formData = {
            email: sendOtpEmail
        }

        let response = await dispatch(sendOtpUpdateEmail(formData));
        let sendOtpData = response?.payload?.data ? response.payload.data : {};

        if (sendOtpData.success) {
            setValue("otp", "");
            //////////////////show modal again/////////
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                sendOtpData.message ?
                    sendOtpData.message :
                    "Something went wrong"
            )
            timerRef.current.seconds = TOTAL_SECONDS;
            setOtpTimerInfo({ resend: false, seconds: TOTAL_SECONDS })
        }
        else {
            ////////////////////show toast//////////
            showToast(
                API_MESSAGE_TYPE.ERROR,
                sendOtpData.message ?
                    sendOtpData.message :
                    "Something went wrong"
            )
        }
    }

    return (
        <div>
            {(loadingSendOtpUpdateEmail || loadingVerifyOtpUpdateEmail) ? <Loading loading={true} /> : ""}

            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >

                <span
                    className='crossContainer'>
                    <img src={ImageLogo} alt=""
                        onClick={handleClose} />
                </span>



                <DialogTitle id="alert-dialog-title" className='text-center' >
                    {'Enter Verification Code'}


                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Grid container >
                                <Grid item xs={12} md={12} lg={12} style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Controller
                                        name="otp"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <OtpInput
                                                onChange={onChange}
                                                value={value}
                                                error={errors.otp ? true : false}
                                                errormessage={errors.otp?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                {otpTimerInfo.resend ? <Grid item xs={12} md={12} lg={12} className="mt-3 text-center" >
                                    <p >If you don't receive a code.<span
                                        style={{
                                            color: "#e9611e",
                                            cursor: "pointer",
                                            textDecoration: "underline"
                                        }}
                                        onClick={resendOtp}
                                    >Resend</span></p>
                                </Grid> : ""}

                                {!otpTimerInfo.resend ? <Grid item xs={12} md={12} lg={12} alignItems={'center'}>
                                    <p className='mt-3 mb-3 text-center' style={{
                                        color: "#e9611e",
                                        cursor: "pointer",
                                        textDecoration: "underline"
                                    }}>{`Resend in ${Math.floor(otpTimerInfo.seconds / 60).toString().padStart(2, '0')} : ${Math.floor(otpTimerInfo.seconds % 60).toString().padStart(2, '0')}`}</p>
                                    <Button type="submit" label="Submit" isFilled={true} />
                                </Grid> : ""}
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                </form>


            </Dialog>
        </div>

    );
}

export default OtpModal;