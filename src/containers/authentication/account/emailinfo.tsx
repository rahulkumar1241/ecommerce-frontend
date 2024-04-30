import React, { useEffect, useRef, useState } from "react";
import useLocalStorage from "../../../utils/localStorage";
import NoImage from "../../../assets/images/banner/no-image.png";
import Button from "../../../components/button/button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import showToast from "../../../components/toasters/toast";
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from "../../../components/input/input";
import Loading from "../../../components/loader/loader";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import { sendOtpUpdateEmail, } from "../../../store/slices/auth";
import OtpModal from "./otpModal";


const EmailInfo = () => {

    const [open, setOpen]: any = useState(false);
    const dispatch = useAppDispatch();

    const { loadingSendOtpUpdateEmail } = useAppSelector(state => state.auth);

    const validationSchema = Yup.object().shape({
        email: Yup.string().trim()
            .required('Email is required')
            .email('Email format is invalid')
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        control
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        const userData = useLocalStorage.getItem("userData");
        setValue("email", userData.email);
    }, []);


    const onSubmit = async (data: any) => {
        let formData =
        {
            email: data.email
        }

        let response = await dispatch(sendOtpUpdateEmail(formData));
        let userData = response?.payload?.data ? response.payload.data : {};

        if (userData.success) {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                userData.message ?
                    userData.message :
                    "Something went wrong"
            )
            setOpen(true)
        } else {

            showToast(
                API_MESSAGE_TYPE.ERROR,
                userData.message ?
                    userData.message :
                    "Something went wrong")
        }
    }

    return <React.Fragment>

        {loadingSendOtpUpdateEmail ? <Loading loading={true} /> : ""}

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row d-flex align-items-center">
                <div className="col-6">
                    <Controller
                        control={control}
                        name={`email`}
                        render={({ field: any }) => (
                            <Input
                                required={true}
                                label="Email"
                                type="text"
                                error={errors.email ? true : false}
                                errormessage={errors.email?.message}
                                placeholder="Enter your email"
                                value={getValues("email")}
                                onChange={(e: any) => {
                                    setValue("email", e.target.value)
                                }}
                            />
                        )}
                    />
                </div>

                <div className="col-6">
                    <Button label="submit" type="submit" isFilled={true} isFullWidth={false} style={{ marginTop: "45px", padding: "10px 25px" }} />
                </div>
            </div>
        </form>

        {
            open ?
                <OtpModal
                    open={open}
                    setOpen={setOpen}
                /> : ""
        }

    </React.Fragment>
}

export default EmailInfo;