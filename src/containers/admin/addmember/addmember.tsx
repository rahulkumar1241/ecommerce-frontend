import React, { useState, useEffect } from "react";
import "./addmember.scss";
import showToast from "../../../components/toasters/toast";
import Loading from "../../../components/loader/loader";
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from "../../../components/input/input";
import Button from "../../../components/button/button";
import RadioButton from "../../../components/radio/radio";
import useLocalStorage from "../../../utils/localStorage";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addMember } from "../../../store/slices/admin";
import { API_MESSAGE_TYPE } from "../../../constants/constants";


const AddMember = () => {

    const dispatch = useAppDispatch();

    let [showPassword, setShowPassword]: any = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { loadingAddMember } = useAppSelector(state => state.admin);

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
            .required('Lastname is required.'),
        password: Yup.string().trim()
            .required('Password is required')
            .max(20, 'Password must not exceed 20 characters')
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Password must contain at least 8 characters,one uppercase,one number and one special case character"
            ), confirm_password: Yup.string().trim()
                .required('This field is required')
                .oneOf([Yup.ref('password')], 'Passwords must match.'),
        role: Yup
            .number()
            .required('Role is required')
    });

    useEffect(() => {
        setValue("role", 1);
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        getValues,
        setValue,
        reset
    } = useForm({
        resolver: yupResolver(validationSchema)
    });


    const onSubmit = async (data: any) => {
        let userDetails = useLocalStorage.getItem("userData");

        let formData =
        {
            admin_id: userDetails.user_id,
            email: data.email,
            firstname: data.firstName,
            lastname: data.lastName,
            password: data.password,
            role: data.role
        }

        let response = await dispatch(addMember(formData));
        let userData = response?.payload?.data ? response.payload.data : {};

        if (userData.success) {

            reset({
                email: "",
                firstName: "",
                lastName: "",
                password: "",
                role: 1,
                confirm_password:""
            })
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                userData.message ?
                    userData.message :
                    "Something went wrong"
            )
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                userData.message ?
                    userData.message :
                    "Something went wrong"
            )
        }


    }

    return <>

        {loadingAddMember ? <Loading loading={true} /> : ""}

        <div className="admin-add-member">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row add-member-container">

                    <div className="col-12 text-center">
                        <h2>Add Member</h2>
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

                    <div className="col-12 d-flex mt-3">
                        <h6 style={{
                            color: "#e9611e",
                            marginTop: "6px",
                            marginRight: "10px"
                        }}>Role*</h6>

                        <Controller
                            control={control}
                            name={`role`}
                            render={({ field: any }) => (
                                <RadioButton
                                    selectedValue={getValues("role")}
                                    label="Admin"
                                    value={1}
                                    onChange={(e: any) => {
                                        setValue("role", 1)
                                    }}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name={`role`}
                            render={({ field: any }) => (
                                <RadioButton
                                    selectedValue={getValues("role")}
                                    label="Delivery Person"
                                    value={2}
                                    onChange={(e: any) => {
                                        setValue("role", 2)
                                    }}
                                />
                            )}
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
                            label="Submit"
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </div>
    </>
}

export default AddMember;
