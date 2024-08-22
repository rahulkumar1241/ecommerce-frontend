import React, { useState,useEffect } from "react";
import "./vieworderitem.scss";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/input/input";
import Button from "../../../components/button/button";
import Loading from "../../../components/loader/loader";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getOrderItemDetails, updateOrderStatus } from "../../../store/slices/order";
import showToast from "../../../components/toasters/toast";
import { API_MESSAGE_TYPE, getOS, numberToIndianCurrency } from "../../../constants/constants";
import moment from "moment";
import { getDropdownValues } from "../../../store/slices/common";
import Select from "../../../components/select/select";

const ViewOrderItemStatus = () => {

    const dispatch = useAppDispatch();
    
    const { loadingGetOrderItemDetails, loadingUpdateOrderStatus } = useAppSelector(state => state.order);
    const { loadingDropdownValues, dropdownData } = useAppSelector(state => state.common);
    let [orderItemData,setOrderItemData]:any = useState({});

    const validationSchema = Yup.object().shape({
        order_item_id: Yup.string().trim()
            .required('Order Item No is required')
    });

    const validationSchema2 = Yup.object().shape({
        order_status: Yup.string().required('Order Status is required')
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });


    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
        getValues: getValues2,
        setValue: setValue2,
        control: control2,
        setError: setError2,
        clearErrors: clearErrors2
    } = useForm({
        resolver: yupResolver(validationSchema2)
    });



    const getDropDownValuesForOrderStatus = async () => {

        let formData = {
            order_status_dropdown: true
        }
        let response = await dispatch(getDropdownValues(formData));
        let dropdownData = response?.payload?.data ? response.payload.data : {};

        if (dropdownData.success) {
        } else {
            showToast(API_MESSAGE_TYPE.ERROR,
                dropdownData.message ?
                    dropdownData.message :
                    "Something went wrong")
        }
    }

    useEffect(() => {
        window.scrollTo(0,0);
        getDropDownValuesForOrderStatus()
    }, [])

    const getOrderItemInfo = async (order_item_id: any) => {
        let formData = {
            order_item_id: order_item_id
        }

        let response = await dispatch(getOrderItemDetails(formData));
        let orderItemData = response?.payload?.data ? response.payload.data : {};

        if (orderItemData.success) {
            setOrderItemData(orderItemData.data);
            setValue2("order_status",orderItemData.data.item_status ? orderItemData.data.item_status:"" );
        } else {
            showToast(API_MESSAGE_TYPE.ERROR, orderItemData.message)
        }
    }

    const onSubmit = async (data: any) => {
        getOrderItemInfo(data.order_item_id)
    }


    const onSubmit2 = async (data: any) => {
        let formData =
        {
            item_id: orderItemData.order_item_id,
            status: parseInt(data.order_status),
            mobile_number: orderItemData.mobile_number,
            fullname: (orderItemData.firstname.slice(0, 1).toUpperCase() + orderItemData.firstname.slice(1).toLowerCase()) + " " + (orderItemData.lastname.slice(0, 1).toUpperCase() + orderItemData.lastname.slice(1).toLowerCase())
        }

        let response = await dispatch(updateOrderStatus(formData));
        let orderData = response?.payload?.data ? response.payload.data : {};

        if (orderData.success) {
            setValue("order_item_id","");
            setValue2("order_status","");
            setOrderItemData({});
            window.scrollTo(0,0);
            showToast(API_MESSAGE_TYPE.SUCCESS,
                orderData.message ?
                    orderData.message :
                    "Something went wrong")
            
        }
        else {
            showToast(API_MESSAGE_TYPE.ERROR,
                orderData.message ?
                    orderData.message :
                    "Something went wrong")
        }
    }


    return <React.Fragment>
        {(loadingGetOrderItemDetails || loadingDropdownValues || loadingUpdateOrderStatus) ? <Loading loading={true} /> : ""}
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row d-flex">
                    <div className="col-sm-8 col-xs-8 col-md-4 col-lg-4 col-xl-4">
                        <Controller
                            control={control}
                            name={`order_item_id`}
                            render={({ field: any }) => (
                                <Input
                                    required={true}
                                    label="Order Item No."
                                    type="text"
                                    error={errors.order_item_id ? true : false}
                                    value={getValues('order_item_id')}
                                    errormessage={errors.order_item_id?.message}
                                    placeholder="Enter Order Item No."
                                    onChange={(e: any) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        setValue("order_item_id", value);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="col-sm-4 col-xs-4 col-md-2 col-lg-2 col-xl-2">
                        <Button
                            isFilled={true}
                            label="Search"
                            style={{ marginTop: (getOS() === "android" || getOS() === "ios") ? "15px" : "35px" }}
                            type="submit"
                        />
                    </div>
                </div>
            </form>





            {Object.keys(orderItemData).length ? <div className="order-item-card">
                <form onSubmit={handleSubmit2(onSubmit2)}>
                    <div className="row">
                        <div className="col-4 ">
                            <img src={orderItemData.photo_url} alt="" />
                        </div>

                        <div className="col-8">
                            <b>Order Item No. {orderItemData.order_item_id}</b>
                            <p className="title">{orderItemData.product_name}</p>
                            <div className="order-price-info">
                                <label>Oty:</label><span>{orderItemData.quantity}</span>
                                <label>Total Amount:</label><span className="total-amount">{numberToIndianCurrency(orderItemData.quantity * orderItemData.buyout_price)}</span>
                            </div>
                        </div>
                    </div>


                    <div className="col-12 shipping-heading">
                        Shipping Details:
                    </div>

                    <div className="row d-flex justify-content-between  shipping-info">
                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">
                            <span className="sub-heading">Shipping Address : </span>
                            <span className="heading">{orderItemData.address + "," + orderItemData.district + "," + orderItemData.state + "," + orderItemData.pincode}</span>
                        </div>
                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">
                            <span className="sub-heading">Shipping Address Type : </span>
                            <span className="heading">{orderItemData.description}</span>
                        </div>

                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">
                            <span className="sub-heading">Mobile No : </span>
                            <span className="heading">{orderItemData.country_code} {orderItemData.mobile_number}</span>
                        </div>

                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">
                            <span className="sub-heading">Purchase Time : </span>
                            <span className="heading">{moment(orderItemData.datetime).format('DD/MM/YYYY hh:mm A')}</span>
                        </div>

                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">
                            <span className="sub-heading">Buyer's name : </span>
                            <span className="heading">{(orderItemData.firstname.slice(0, 1).toUpperCase() + orderItemData.firstname.slice(1).toLowerCase()) + " " + (orderItemData.lastname.slice(0, 1).toUpperCase() + orderItemData.lastname.slice(1).toLowerCase())}</span>
                        </div>

                        {orderItemData.size_info ? <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">
                            <span className="sub-heading">Size : </span>
                            <span className="heading">{orderItemData.size_info}</span>
                        </div> : null}

                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">
                            <span className="sub-heading">Order Status : </span>
                            <span className="heading">{orderItemData.order_status_desc}</span>
                        </div>

                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">

                            <Controller
                                control={control2}
                                name={`order_status`}
                                render={({ field: any }) => (
                                    <Select
                                        style={{ marginTop: "-15px" }}
                                        menuItems={dropdownData?.order_status_dropdown?.length ?
                                            dropdownData.order_status_dropdown.map((data: any, index: any) => {
                                                return { value: data.status_id, label: data.order_status_desc }
                                            })
                                            : []}
                                        value={getValues2("order_status")}
                                        onChange={(e: any) => {
                                            if (e.target.value) {
                                                clearErrors2("order_status")
                                            }
                                            setValue2("order_status", e.target.value)
                                        }}
                                        required={true}
                                        label="Order Status"
                                        error={errors2.order_status ? true : false}
                                        errormessage={errors2.order_status?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="col-12 d-flex justify-content-center">
                            <Button isFilled={true} style={{ padding: "8px 35px" }} isFullWidth={false} label="Submit" type="submit" />
                        </div>

                    </div>
                </form>
            </div>

                : ""}

        </div>
    </React.Fragment >
}

export default ViewOrderItemStatus;
