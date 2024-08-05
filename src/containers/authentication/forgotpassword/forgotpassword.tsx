import React, { useState,useEffect } from "react";
import Input from "../../../components/input/input";
import BannerImage from "../../../assets/images/banner/main-image.png";
import Button from "../../../components/button/button";
import "../common/auth.scss";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import MyLink from "../../../components/link/link";
import { PATH } from "../../../paths/path";
import OtpModal from "./otpmodalcomponent";
import "../../authentication/common/auth.scss";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { sendOtpUser } from "../../../store/slices/auth";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import Loading from "../../../components/loader/loader";
import showToast from "../../../components/toasters/toast";

const Forgotpassword = (props: any) => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();

    const { loadingSendOtp, } = useAppSelector(state => state.auth);


    const validationSchema = Yup.object().shape({
        email: Yup.string().trim()
            .required('Email is required')
            .email('Email format is invalid')
    });


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);


    const onSubmit = async (data: any) => {
        let formData = {
            email: data.email
        }
        let response = await dispatch(sendOtpUser(formData));
        let forgotUserData = response?.payload?.data ? response.payload.data : {};

        if (forgotUserData.success) {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                forgotUserData.message ?
                    forgotUserData.message :
                    "Something went wrong"
            )
            setOpen(true)
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                forgotUserData.message ?
                    forgotUserData.message :
                    "Something went wrong"
            )
        }
    }

    return (
        <React.Fragment>
            {loadingSendOtp ? <Loading loading={true} /> : ""}
            <div className="authContainer">
                <div className="col-lg-7 col-xl-7 col-sm-0 col-xs-0 d-none d-lg-block d-xl-block">
                    <img src={BannerImage} alt="main image" />
                </div>
                <div className="col-lg-5 col-xl-5 col-sm-12 col-xs-12">
                    <div className="col-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row mainContainer">
                                <div className="col-12 text-center">
                                    <h2>Forgot password</h2>
                                </div>
                                <div className="col-12">
                                    <Input
                                        required={true}
                                        label="Email"
                                        type="text"
                                        register={register('email')}
                                        error={errors.email ? true : false}
                                        errormessage={errors.email?.message}
                                        placeholder={"Enter your email"}
                                    />
                                </div>


                                <div className="col-12">
                                    <Button
                                        isFilled={true}
                                        label="submit"
                                        type="submit"
                                    />
                                </div>

                                <div className="col-12 linkContainer">
                                    <MyLink label="login?" navigatePath={PATH.PUBLIC.SIGN_IN} />
                                    <MyLink label="signup?" navigatePath={PATH.PUBLIC.SIGN_UP} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {
                    open ?
                        <OtpModal
                            open={open}
                            setOpen={setOpen}
                        /> : ""
                }

            </div>
        </React.Fragment>
    );
}
export default Forgotpassword;
