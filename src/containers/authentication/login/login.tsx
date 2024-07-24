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
import { loginUser } from "../../../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import showToast from "../../../components/toasters/toast";
import { addToCart } from "../../../store/slices/cart";

const Login = (props: any) => {

    let [showPassword, setShowPassword]: any = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loadingSignin } = useAppSelector(state => state.auth);


    const validationSchema = Yup.object().shape({
        email: Yup.string().trim()
            .required('Email is required')
            .email('Email format is invalid')
        , password: Yup.string().trim()
            .required('Password is required')
            .max(20, 'Password must not exceed 20 characters.')
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Password must contain at least 8 characters,one uppercase,one number and one special case character"
            )
    });


    // useEffect(() => 
    // {
    //     localStorage.clear();
    // }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });


    const onSubmit = async (data: any) => {
        //////////create async thunk returns a promise so use async await instead///////
        let formData = {
            email: data.email,
            password: data.password
        }
        let response = await dispatch(loginUser(formData));
        let loginUserData = response?.payload?.data ? response.payload.data : {};

        if (loginUserData.success) {
            // showToast(
            //     API_MESSAGE_TYPE.SUCCESS,
            //     loginUserData.message ?
            //         loginUserData.message :
            //         "Something went wrong"
            // )
            if (loginUserData.user.role === 0) {
                ///////////navigation happens only for USER///////
                if (localStorage.getItem("product_to_buy")) {
                    let formData =
                    {
                        product_id: localStorage.getItem("product_to_buy"),
                        quantity: 1
                    }

                    let response: any = await dispatch(addToCart(formData));
                    let responseData = response?.payload?.data ? response.payload.data : {};

                    if (responseData.success) {
                        localStorage.removeItem("product_to_buy");
                        showToast(API_MESSAGE_TYPE.SUCCESS, responseData.message || 'Some Error Occurred...');
                        navigate(PATH.PRIVATE.CART)
                    }
                    
                    else {
                        showToast(API_MESSAGE_TYPE.ERROR, responseData.message || 'Some Error Occurred...');
                        if (responseData.status === 403) {
                            navigate(PATH.PRIVATE.CART)
                        }
                    }

                } else {
                    navigate(PATH.PUBLIC.HOME_PAGE)
                }
            } else if (loginUserData.user.role === 2) {
                ///////////DELIVERY///////
                navigate(PATH.PRIVATE.VIEW_ORDER_ITEM_DETAILS)
            } else {
                ///////////////////ADMIN ROUTE////////////
                navigate(`${PATH.PRIVATE.ADMIN.MAIN_ROUTE}/${PATH.PRIVATE.ADMIN.CHILD_ROUTES.DASHBOARD}`)
            }
        }

        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                loginUserData.message ?
                    loginUserData.message :
                    "Something went wrong"
            )
        }
    }



    return (
        <React.Fragment>
            {(loadingSignin) ? <Loading loading={true} /> : ""}
            <div className="authContainer">
                <div className="col-lg-7 col-xl-7 d-none d-lg-block d-xl-block">
                    <img src={BannerImage} alt="main image" />
                </div>
                <div className="col-lg-5 col-xl-5 col-sm-12 col-xs-12">

                    <div className="col-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row mainContainer">
                                <div className="col-12 text-center">
                                    <h2>Login</h2>
                                </div>
                                <div className="col-12">
                                    <Input
                                        required={true}
                                        label="Email"
                                        type="text"
                                        register={register('email')}
                                        error={errors.email ? true : false}
                                        errormessage={errors.email?.message}
                                        placeholder="Enter your email"
                                    />
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

                                <div className="col-12">
                                    <Button
                                        isFilled={true}
                                        label="Login"
                                        type="submit"
                                    />
                                </div>

                                <div className="col-12 linkContainer">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <span >Are you a new user? </span>
                                        <MyLink label="signup" navigatePath={PATH.PUBLIC.SIGN_UP} />
                                    </div>

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
export default Login;