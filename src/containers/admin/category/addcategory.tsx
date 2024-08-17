import React, { useEffect, useState } from "react";
import useLocalStorage from "../../../utils/localStorage";
import Button from "../../../components/button/button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import showToast from "../../../components/toasters/toast";
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from "../../../components/input/input";
import Loading from "../../../components/loader/loader";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import { addCategory } from "../../../store/slices/admin";

const AddCategory = () => {

    const dispatch = useAppDispatch();

    const { loadingAddCategory } = useAppSelector(state => state.admin);

    const validationSchema = Yup.object().shape({
        cat_name: Yup.string().trim()
            .required('Category is required')
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
        setValue("cat_name", "");
    }, []);


    const onSubmit = async (data: any) => {
        let formData =
        {
            cat_name: data.cat_name
        }

        let response = await dispatch(addCategory(formData));
        let categoryData = response?.payload?.data ? response.payload.data : {};

        if (categoryData.success) {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                categoryData.message ?
                    categoryData.message :
                    "Something went wrong"
            )
            setValue("cat_name", "");
        } else {

            showToast(
                API_MESSAGE_TYPE.ERROR,
                categoryData.message ?
                    categoryData.message :
                    "Something went wrong")
        }
    }

    return <React.Fragment>

        {loadingAddCategory ? <Loading loading={true} /> : ""}

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row d-flex align-items-center">
                <div className="col-6">
                    <Controller
                        control={control}
                        name={`cat_name`}
                        render={({ field: any }) => (
                            <Input
                                required={true}
                                label="Category"
                                type="text"
                                error={errors.cat_name ? true : false}
                                errormessage={errors.cat_name?.message}
                                placeholder="Enter category..."
                                value={getValues("cat_name")}
                                onChange={(e: any) => {
                                    setValue("cat_name", e.target.value)
                                }}
                                autoFocus={true}
                            />
                        )}
                    />
                </div>

                <div className="col-6">
                    <Button label="submit" type="submit" isFilled={true} isFullWidth={false} style={{ marginTop: "45px", padding: "10px 25px" }} />
                </div>
            </div>
        </form>



    </React.Fragment>
}

export default AddCategory;
