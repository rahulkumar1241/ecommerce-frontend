import React, { useEffect  } from "react";
import Input from "../../../components/input/input";
import BannerImage from "../../../assets/images/banner/main-image.png";
import Button from "../../../components/button/button";
import "../common/auth.scss";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import MyLink from "../../../components/link/link";
import { PATH } from "../../../paths/path";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useNavigate } from "react-router-dom";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import { signupUser } from "../../../store/slices/auth";
import Loading from "../../../components/loader/loader";
import showToast from "../../../components/toasters/toast";


const Signup = (props:any) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loadingSignup } = useAppSelector(state => state.auth);

    const validationSchema = Yup.object().shape({
        email: Yup.string().trim()
            .required('Email is required')
            .email('Email format is invalid'),
        firstName: Yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Please enter valid first name')
            .max(15, "Firstname must not exceed 15 characters.")
            .required('Firstname is required.'),
        lastName: Yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Please enter valid last name')
            .max(15, "Lastname must not exceed 15 characters")
            .required('Lastname is required.')
    });

  useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });


    const onSubmit = async (data: any) => {
        let formData = {
            email: data.email,
            firstname: data.firstName,
            lastname: data.lastName
        }

        let response = await dispatch(signupUser(formData));
        let signupUserData = response?.payload?.data ? response.payload.data : {};

        if (signupUserData.success) {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                signupUserData.message ?
                    signupUserData.message :
                    "Something went wrong"
            )
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                signupUserData.message ?
                    signupUserData.message :
                    "Something went wrong"
            )
        }

    }

    const handleContinueShopping = ()=>{
        navigate(PATH.PUBLIC.HOME_PAGE)
    }



    return (
        <React.Fragment>

            {loadingSignup ? <Loading loading={true} /> : ""}

            <div className="authContainer">
                <div className="col-lg-7 col-xl-7 d-none d-lg-block d-xl-block">
                    <img src={BannerImage} alt="main image" />
                </div>
                <div className="col-lg-5 col-xl-5 col-sm-12 col-xs-12">

                    <div className="col-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row mainContainer">
                                
                                <div className="col-12 text-center">
                                    <h2>Signup</h2>
                                </div>

                                <div className="col-6">
                                    <Input
                                        required={true}
                                        label="First Name"
                                        type="text"
                                        register={register('firstName')}
                                        error={errors.firstName ? true : false}
                                        errormessage={errors.firstName?.message}
                                        placeholder="Enter your firstname"
                                    />

                                </div>
                                <div className="col-6">
                                    <Input
                                        required={true}
                                        label="Last Name"
                                        type="text"
                                        register={register('lastName')}
                                        error={errors.lastName ? true : false}
                                        errormessage={errors.lastName?.message}
                                        placeholder="Enter your lastname"
                                    />

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
                                <div className="col-12">
                                    <Button
                                        isFilled={true}
                                        label="Signup"
                                        type="submit"
                                    />
                                </div>

                                <div className="col-12 linkContainer">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <span >Already a user? </span>
                                        <MyLink label="login" navigatePath={PATH.PUBLIC.SIGN_IN} />
                                    </div>

                                    <MyLink label="Forgot Password?" navigatePath={PATH.PUBLIC.FORGOT_PASSWORD} />
                                </div>
                                 <div className="col-12 d-flex justify-content-center">
                                    <Button
                                        isFilled={false}
                                        label="Continue Shopping"
                                        type="button"
                                        isFullWidth={false}
                                        onClick={handleContinueShopping}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
export default Signup;
