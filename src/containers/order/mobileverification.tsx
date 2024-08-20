import React, { useEffect, useState } from "react";
import Input from "../../components/input/input";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import Button from "../../components/button/button";
import OtpModal from "./mobileverificationotp";
import { useLocation } from "react-router-dom";
import showToast from "../../components/toasters/toast";
import { sendOtpOrder } from "../../store/slices/order";
import { useAppDispatch } from "../../store/hooks";
import { API_MESSAGE_TYPE } from "../../constants/constants";
import Select from "../../components/select/select";
import { COUNTRY_CODE } from "../../constants/dropdown";


const MobileVerification = (props: any) => {

    const dispatch = useAppDispatch();

    const location = useLocation();
    const [open, setOpen]: any = useState(false);

    const validationSchema = Yup.object().shape({
        mobile: Yup.string().trim()
            .required('Mobile No. is required')
            .min(10, 'Mobile No. must be of 10 digits')
            .max(10, 'Mobile No. must not exceed 10 digits')
            .matches(/[6-9]{1}[0-9]{9}/, "Please enter a valid mobile number")

    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        getValues,
        setValue
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const handleChangeMobile = (e: any) => {
        let str = e.target.value.replace(/\D/g, '');
        if (str.length <= 10) {
            setValue('mobile', str);
        }
    }

    const onSubmit = async (data: any) => {

        let formData = {
            order_id: location.state.order_id,
            mobile_number: data.mobile,
             country_code: '+91'
        }

        let response = await dispatch(sendOtpOrder(formData));
        let sendOtpData = response?.payload?.data ? response.payload.data : {};

        if (sendOtpData.success) {
            showToast(API_MESSAGE_TYPE.SUCCESS,
                sendOtpData.message ?
                    sendOtpData.message :
                    "Something went wrong")
            setOpen(true)
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                sendOtpData.message ?
                    sendOtpData.message :
                    "Something went wrong"
            )
        }
    }

    return <React.Fragment>
        <div className="row mobile-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex align-items-center">
                    <div className="col-2">
                       <div className="country-code-info">+91</div>
                    </div>

                    <div className="col-10">

                        <Controller
                            control={control}
                            name={`mobile`}
                            render={({ field: any }) => (
                                <Input
                                    required={true}
                                    label="Mobile Number"
                                    type="text"
                                    error={errors.mobile ? true : false}
                                    errormessage={errors.mobile?.message}
                                    placeholder="Enter your mobile number"
                                    onChange={handleChangeMobile}
                                    value={getValues("mobile")}
                                    style={{ marginLeft: "5px" }}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="col-12 mt-3">
                    <Button isFilled={true} type="submit" isFullwidth={true} label="get otp" />
                </div>

            </form>

            {open ? <OtpModal
                open={open}
                setOpen={setOpen}
                activeStep={props.activeStep}
                setActiveStep={props.setActiveStep}
                mobile={getValues("mobile")}
                order_id={location.state.order_id}
            /> : ""}

        </div>
    </React.Fragment >
}

export default MobileVerification;
