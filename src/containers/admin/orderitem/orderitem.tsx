import React, { useEffect, useState } from "react";
import "../../delivery/vieworderitemstatus/vieworderitem.scss";
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
import useLocalStorage from "../../../utils/localStorage";

const AdminOrderItemInfo = () => {

    const dispatch = useAppDispatch();
    const [orderItemData, setOrderItemData]: any = useState({});

    const [dropdownData, setDropdownData]: any = useState({});
    const { loadingUpdateOrderStatus } = useAppSelector(state => state.order);
    const { loadingDropdownValues } = useAppSelector(state => state.common);

    const validationSchema = Yup.object().shape({
        order_status: Yup.string().required('Order Status is required')
    });


    useEffect(() => {
        let data = useLocalStorage.getItem("orderItemInfo");
        setValue("order_status", data.item_status)
        setOrderItemData(data);



        return () => {
            useLocalStorage.removeItem("orderItemInfo");
        }
    }, [])



    const {
        register: register,
        handleSubmit: handleSubmit,
        formState: { errors: errors },
        getValues: getValues,
        setValue: setValue,
        control: control,
        setError: setError,
        clearErrors: clearErrors
    } = useForm({
        resolver: yupResolver(validationSchema)
    });



    const getDropDownValuesForOrderStatus = async () => {

        let formData = {
            order_status_dropdown: true
        }
        let response = await dispatch(getDropdownValues(formData));
        let dropdownData = response?.payload?.data ? response.payload.data : {};

        if (dropdownData.success) {
            ///////////filteration of order status dropdown/////////
            let tempArr = [1, 10, 2, 11];

            let data: any = JSON.parse(JSON.stringify(dropdownData.data));

            data.order_status_dropdown = dropdownData.data.order_status_dropdown.filter((value: any, index: any) => {
                return !(tempArr.includes(value.status_id));
            });

            setDropdownData(data);

        } else {
            showToast(API_MESSAGE_TYPE.ERROR,
                dropdownData.message ?
                    dropdownData.message :
                    "Something went wrong")
        }
    }

    useEffect(() => {
        getDropDownValuesForOrderStatus()
    }, [])



    const onSubmit = async (data: any) => {
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
            showToast(API_MESSAGE_TYPE.SUCCESS,
                orderData.message ?
                    orderData.message :
                    "Something went wrong");

            let OrderItemData = useLocalStorage.getItem("orderItemInfo");
            OrderItemData['item_status'] = parseInt(data.order_status);
            OrderItemData['order_status_desc'] = dropdownData.order_status_dropdown.filter((value: any, index: any) => {
                return value.status_id === parseInt(data.order_status)
            })[0].order_status_desc;

            setOrderItemData(OrderItemData);

            useLocalStorage.setItem("orderItemInfo", OrderItemData);
        }
        else {
            showToast(API_MESSAGE_TYPE.ERROR,
                orderData.message ?
                    orderData.message :
                    "Something went wrong")
        }
    }


    return <React.Fragment>
        {(loadingDropdownValues || loadingUpdateOrderStatus) ? <Loading loading={true} /> : ""}
        <div className="container">
            {Object.keys(orderItemData).length ? <div className="order-item-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-4 ">
                            <img src={orderItemData.photo_url} alt="" />
                        </div>

                        <div className="col-8">
                            <b>Order Item No. {orderItemData.order_item_id}</b>
                            <p className="title">{orderItemData.product_name}</p>
                            <div className="order-price-info">
                                <label>Oty:</label><span>{orderItemData.quantity}</span>
                                <label>Buyout Price:</label><span className="total-amount">{numberToIndianCurrency(orderItemData.buyout_price)}</span>
                                <label>Total Amount:</label><span className="total-amount">{numberToIndianCurrency(orderItemData.quantity * orderItemData.buyout_price)}</span>
                            </div>
                        </div>
                    </div>


                    <div className="col-12 mt-3 shipping-heading">
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
                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">
                            <span className="sub-heading">Order Status : </span>
                            <span className="heading">{orderItemData.order_status_desc}</span>
                        </div>

                        <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 mb-3">

                            <Controller
                                control={control}
                                name={`order_status`}
                                render={({ field: any }) => (
                                    <Select
                                        style={{ marginTop: "-15px" }}
                                        menuItems={dropdownData?.order_status_dropdown?.length ?
                                            dropdownData.order_status_dropdown.map((data: any, index: any) => {
                                                return { value: data.status_id, label: data.order_status_desc }
                                            })
                                            : []}
                                        value={getValues("order_status")}
                                        onChange={(e: any) => {
                                            if (e.target.value) {
                                                clearErrors("order_status")
                                            }
                                            setValue("order_status", e.target.value)
                                        }}
                                        required={true}
                                        label="Order Status"
                                        error={errors.order_status ? true : false}
                                        errormessage={errors.order_status?.message}
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

export default AdminOrderItemInfo;