import React, { useEffect, useState } from "react";
import Input from "../../../components/input/input";
import BannerImage from "../../../assets/images/banner/main-image.png";
import Button from "../../../components/button/button";
import "../common/auth.scss";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import MyLink from "../../../components/link/link";
import { PATH } from "../../../paths/path";
import Loading from "../../../components/loader/loader";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPasswordUser } from "../../../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import showToast from "../../../components/toasters/toast";

const ConfirmPassword = (props: any) => {

    const params = new URLSearchParams(document.location.search);


    let [showPassword, setShowPassword]: any = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loadingSetPassword } = useAppSelector(state => state.auth);


    const validationSchema = Yup.object().shape({
        password: Yup.string().trim()
            .required('Password is required')
            .max(20, 'Password must not exceed 20 characters')
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Password must contain at least 8 characters,one uppercase,one number and one special case character"
            ),
        confirm_password: Yup.string().trim()
            .required('This field is required')
            .oneOf([Yup.ref('password')], 'Passwords must match.'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        localStorage.clear();
    }, [])

    const onSubmit = async (data: any) => {
        let formData = {
            hash: params.get("hash_id"),
            password: data.password
        }
        let response = await dispatch(setPasswordUser(formData));
        let setUserData = response?.payload?.data ? response.payload.data : {};
        if (setUserData.success) {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                setUserData.message ?
                    setUserData.message :
                    "Something went wrong"
            )
            navigate(PATH.PUBLIC.SIGN_IN);
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                setUserData.message ?
                    setUserData.message :
                    "Something went wrong"
            )
        }
    }

    return (
        <React.Fragment>
            {loadingSetPassword ? <Loading loading={true} /> : ""}
            <div className="authContainer">
                <div className="col-lg-7 col-xl-7 d-none d-lg-block d-xl-block">
                    <img src={BannerImage} alt="main image" />
                </div>
                <div className="col-lg-5 col-xl-5 col-sm-12 col-xs-12">

                    <div className="col-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row mainContainer">

                                <div className="col-12 text-center">
                                    <h2>Confirm Password</h2>
                                </div>

                                <div className="col-lg-12">
                                    <Input
                                        required={true}
                                        label="Password"
                                        isPassword={true}
                                        showPassword={showPassword}
                                        setShowPassword={setShowPassword}
                                        type={showPassword ? "text" : "password"}
                                        register={register('password')}
                                        error={errors.password ? true : false}
                                        errormessage={errors.password?.message}
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <div className="col-lg-12">
                                    <Input
                                        required={true}
                                        label="Confirm Password"
                                        isPassword={true}
                                        showPassword={showConfirmPassword}
                                        setShowPassword={setShowConfirmPassword}
                                        type={showConfirmPassword ? "text" : "password"}
                                        register={register('confirm_password')}
                                        error={errors.confirm_password ? true : false}
                                        errormessage={errors.confirm_password?.message}
                                        placeholder="Confirm password"
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
                                    <MyLink label="Forgot Password?" navigatePath={PATH.PUBLIC.FORGOT_PASSWORD} />
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>



        </React.Fragment>
    );
}
export default ConfirmPassword;