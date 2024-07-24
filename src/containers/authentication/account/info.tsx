import React, { useEffect, useRef, useState } from "react";
import useLocalStorage from "../../../utils/localStorage";
import NoImage from "../../../assets/images/banner/no-image.png";
import Button from "../../../components/button/button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { uploadImage } from "../../../store/slices/common";
import showToast from "../../../components/toasters/toast";
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from "../../../components/input/input";
import Loading from "../../../components/loader/loader";
import { FaRegEdit } from "react-icons/fa";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import { updateUserInfo } from "../../../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../paths/path";


const Info = () => {
    const navigate = useNavigate();
    const hiddenFileInput: any = useRef(null);
    const [imageUrl, setImageUrl]: any = useState("");
    const dispatch = useAppDispatch();

    const { loadingUploadImage } = useAppSelector(state => state.common);
    const { loadingUpdateUserInfo } = useAppSelector(state => state.auth);

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().trim()
            .required('Firstname is required'),
        lastname: Yup.string().trim()
            .required('Lastname is required'),
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

    const handleChange = async (e: any) => {
        const fileUploaded = e.target.files[0];
        const formData = new FormData();
        formData.append("image", fileUploaded);
        /////////////check for jpg and png images///////////
        let response = await dispatch(uploadImage(formData));
        let imageData = response?.payload?.data ? response.payload.data : {};

        if (imageData.success) {
            setImageUrl(imageData.data.url)
        } else {
            showToast('ERROR', imageData.message || 'Some Error Occurred...');
        }
    }

    useEffect(() => {
        const userData = useLocalStorage.getItem("userData");
        setValue("firstname", userData.firstname);
        setValue("lastname", userData.lastname);
        setImageUrl(userData.photo_url ? userData.photo_url : "")
    }, [])


    const onSubmit = async (data: any) => {
        let formData = {
            firstname: data.firstname,
            lastname: data.lastname,
            photo_url: imageUrl ? imageUrl : null
        }

        let response = await dispatch(updateUserInfo(formData));
        let userData = response?.payload?.data ? response.payload.data : {};

        if (userData.success) {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                userData.message ?
                    userData.message :
                    "Something went wrong"
            )
            let newData = useLocalStorage.getItem("userData");

            newData['photo_url'] = formData.photo_url;
            newData['lastname'] = formData.firstname;
            newData['lastname'] = formData.lastname;
            useLocalStorage.setItem("userData", newData);

            navigate(PATH.PUBLIC.HOME_PAGE)
        } else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                userData.message ?
                    userData.message :
                    "Something went wrong"
            )
        }
    }

    return <React.Fragment>
        {(loadingUploadImage || loadingUpdateUserInfo) ? <Loading loading={true} /> : ""}
        <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row info-section">
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                        {imageUrl ? <img src={imageUrl} alt="" /> : <img src={NoImage} alt="" />}
                        <Button
                            isFilled={true}
                            isFullWidth={false}
                            label="browse"
                            type="button"
                            onClick={(e: any) => hiddenFileInput.current.click()}
                        />

                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleChange}
                            ref={hiddenFileInput}
                            style={{ display: 'none' }} // Make the file input element invisible
                        />
                    </div>

                    <div className="col-6">
                        <Controller
                            control={control}
                            name={`firstname`}
                            render={({ field: any }) => (
                                <Input
                                    required={true}
                                    label="Firstname"
                                    type="text"
                                    error={errors.firstname ? true : false}
                                    errormessage={errors.firstname?.message}
                                    placeholder="Firstname"
                                    value={getValues("firstname")}
                                    onChange={(e: any) => setValue("firstname", e.target.value)}
                                />
                            )}
                        />
                    </div>
                    <div className="col-6">
                        <Controller
                            control={control}
                            name={`lastname`}
                            render={({ field: any }) => (
                                <Input
                                    required={true}
                                    label="Lastname"
                                    type="text"
                                    error={errors.lastname ? true : false}
                                    errormessage={errors.lastname?.message}
                                    placeholder="Lastname"
                                    value={getValues("lastname")}
                                    onChange={(e: any) => setValue("lastname", e.target.value)}
                                />
                            )}
                        />
                    </div>

                    <div className="col-12 d-flex justify-content-center">
                        <Button
                            isFilled={true}
                            isFullWidth={false}
                            label="edit"
                            type="submit"
                            style={{ paddingLeft: "50px", paddingRight: "50px" }}
                        />
                    </div>
                </div>

               
        </form>
    </React.Fragment>
}

export default Info;