import React, { useEffect, useState } from "react";
import Input from "../../components/input/input";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import Button from "../../components/button/button";
import { useLocation, useNavigate } from "react-router-dom";
import showToast from "../../components/toasters/toast";
import { getPincodeDetails, updateOrder, updateOrderPostPayment } from "../../store/slices/order";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { API_MESSAGE_TYPE } from "../../constants/constants";
import "./order.scss";
import Loading from "../../components/loader/loader";
import RadioButton from "../../components/radio/radio";
import { PATH } from "../../paths/path";

const OrderDetails = (props) => {

    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { loadingPinCodeDetails, loadingUpdateOrder, loadingUpdateOrderPostPayment } = useAppSelector(state => state.order);

    useEffect(() => {
        setValue("addressType", "1");
    }, [])


    const validationSchema = Yup.object().shape({
        pincode: Yup.string().trim()
            .required('Pincode is required')
            .min(6, 'Pincode must be of 6 digits')
            .max(6, 'Pincode must not exceed 6 digits')
            .matches(/^[1-9][0-9]{5}$/, "Please enter a valid pincode"),
        district: Yup.string().trim()
            .required('District is required'),
        state: Yup.string().trim()
            .required('State is required'),
        address: Yup.string().trim()
            .required('Address is required'),
        addressType: Yup.string().trim()
            .required('Address Type is required')
    });


    const getPincodeData = async () => {
        let formData =
        {
            pincode: getValues("pincode")
        }
        let response = await dispatch(getPincodeDetails(formData));
        let pincodeData = response?.payload?.data ? response.payload.data : {};
        if (pincodeData.success) {
            setValue("district", pincodeData.data.district);
            setValue("state", pincodeData.data.state)
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                pincodeData.message ?
                    pincodeData.message :
                    "Something went wrong"
            )
        }
    }

    const updateOrderPostPaymentFunc = async (razorpay_payment_id, razorpay_signature) => {
        let formData =
        {
            order_id: location.state.order_id,
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature
        }
        let response = await dispatch(updateOrderPostPayment(formData));
        let orderData = response?.payload?.data ? response.payload.data : {};

        if (orderData.success) {
            ///////////navigation happens only for USER///////
            showToast(API_MESSAGE_TYPE.SUCCESS, "We've got your order. Thanks!");
            navigate(PATH.PRIVATE.GET_MY_ORDERS)
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                orderData.message ?
                    orderData.message :
                    "Something went wrong"
            )
        }
    }

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

    const handleChangePincode = (e) => {
        let str = e.target.value.replace(/\D/g, '');
        if (str.length <= 6) {
            setValue('pincode', str);
            if (str.length === 6) {
                ///////////call pin code api///////////  
                getPincodeData();
            }
            else {
                setValue('pincode', str);
                setValue("district", "");
                setValue("state", "");
            }
        }
    }

    const onSubmit = async (data) => {

        let formData = {
            order_id: location.state.order_id,
            pincode: data.pincode,
            state: data.state,
            district: data.district,
            addressType: parseInt(data.addressType),
            address: data.address
        }

        let response = await dispatch(updateOrder(formData));
        let orderData = response?.payload?.data ? response.payload.data : {};

        if (orderData.success) {
            let options = {
                key: orderData.data.key_id, // Enter the Key ID generated from the Dashboard
                amount: orderData.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                name: 'Shopee - An Online Shopping Platform', //your business name
                description: "Payment Transaction",
                order_id: orderData.data.razorpay_order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                prefill: { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                    name: orderData.data.name, //your customer's name
                    email: orderData.data.email,
                    contact: orderData.data.contact //Provide the customer's phone number for better conversion rates 
                },
                handler: function (response) {
                    updateOrderPostPaymentFunc(response.razorpay_payment_id, response.razorpay_signature)
                },
                "theme": {
                    "color": "#e9611e"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                showToast(API_MESSAGE_TYPE.ERROR, "Payment declined.Please try again.")
            })
            rzp1.open();
            //////////////RAZORPAY INTEGRATE KARNA H/////////
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                orderData.message ?
                    orderData.message :
                    "Something went wrong"
            )
        }
    }

    return <React.Fragment>
        {(loadingPinCodeDetails || loadingUpdateOrder || loadingUpdateOrderPostPayment) ? <Loading loading={true} /> : ""}
        <div className="mobile-container">
            <div className="row">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-12">

                        <Controller
                            control={control}
                            name={`pincode`}
                            render={({ field: any }) => (
                                <Input
                                    required={true}
                                    label="Pincode"
                                    type="text"
                                    error={errors.pincode ? true : false}
                                    errormessage={errors.pincode?.message}
                                    placeholder="Enter pincode"
                                    onChange={handleChangePincode}
                                    value={getValues("pincode")}
                                />
                            )}
                        />
                    </div>

                    <div className="d-flex">

                        <div className="col-6">
                            <Controller
                                control={control}
                                name={`district`}
                                render={({ field: any }) => (
                                    <Input
                                        required={true}
                                        label="District"
                                        type="text"
                                        error={errors.district ? true : false}
                                        errormessage={errors.district?.message}
                                        placeholder="Enter district"
                                        value={getValues("district")}
                                        disabled={true}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-6" style={{ paddingRight: "10px" }}>
                            <Controller
                                control={control}
                                name={`state`}
                                render={({ field: any }) => (
                                    <Input
                                        required={true}
                                        label="State"
                                        type="text"
                                        error={errors.state ? true : false}
                                        errormessage={errors.state?.message}
                                        placeholder="Enter state"
                                        value={getValues("state")}
                                        disabled={true}
                                        style={{ marginLeft: "10px" }}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-12">

                        <Controller
                            control={control}
                            name={`address`}
                            render={({ field: any }) => (
                                <Input
                                    required={true}
                                    label="Address"
                                    type="text"
                                    onChange={(e) => {
                                        setValue("address", e.target.value)
                                    }}
                                    error={errors.address ? true : false}
                                    errormessage={errors.address?.message}
                                    placeholder="Enter address"
                                    value={getValues("address")}
                                    isTextArea={true}
                                />
                            )}
                        />
                    </div>


                    <div className="col-12">
                        <div className='label'>Address Type<span className="text-danger">*</span></div>
                    </div>

                    <div className="col-12 d-flex">

                        <Controller
                            control={control}
                            name={`addressType`}
                            render={({ field: any }) => (
                                <RadioButton
                                    selectedValue={getValues("addressType")}
                                    label="Home"
                                    value="1"
                                    onChange={(e) => {
                                        setValue("addressType", "1")
                                    }}
                                    style={{ marginLeft: "10px" }}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name={`addressType`}
                            render={({ field: any }) => (
                                <RadioButton
                                    selectedValue={getValues("addressType")}
                                    label="Work"
                                    value="2"
                                    onChange={(e) => {
                                        setValue("addressType", "2")
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="col-12 mt-3">
                        <Button isFilled={true} type="submit" isFullwidth={true} label="continue" />
                    </div>
                </form>

            </div>
        </div>
    </React.Fragment >
}

export default OrderDetails;