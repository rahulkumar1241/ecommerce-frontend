import React, { useEffect, useState } from "react";
import StepperComponent from "../../components/stepper/stepper";
import MobileVerification from "./mobileverification";
import OrderDetails from "./orderdetails";
import useLocalStorage from "../../utils/localStorage";
import "./order.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Loading from "../../components/loader/loader";
import { useLocation } from "react-router-dom";
import { getOrderDetails } from "../../store/slices/order";
import showToast from "../../components/toasters/toast";
import { API_MESSAGE_TYPE, numberToIndianCurrency } from "../../constants/constants";

const NAME_LENGTH = 40;

const OrderMain = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const [activeStep, setActiveStep]: any = useState(0);

    const { loadingSendOtpOrder, loadingGetOrderDetails, orderData } = useAppSelector(state => state.order);

    const steps =
        [
            'Mobile Verification',
            'Order Details'
        ];


    const getOrderDetailsFunc = async () => {
        let formData = {
            order_id: location.state.order_id
        }

        let response = await dispatch(getOrderDetails(formData));
        let orderData = response?.payload?.data ? response.payload.data : {};

        if (!orderData.success) {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                orderData.message ?
                    orderData.message :
                    "Something went wrong"
            )
        }
    }

    useEffect(() => {
        if (!useLocalStorage.getItem("activeStep")) {
            useLocalStorage.setItem("activeStep", 0)
        }
        else {
            let activeStep = useLocalStorage.getItem("activeStep");
            setActiveStep(parseInt(activeStep));
        }

        getOrderDetailsFunc();

        return () => {
            useLocalStorage.removeItem("activeStep");
        }

    }, [])

    const getComponent = () => {
        switch (activeStep) {
            case 0: return <MobileVerification
                activeStep={activeStep}
                setActiveStep={setActiveStep} />;
            case 1: return <OrderDetails
                activeStep={activeStep}
                setActiveStep={setActiveStep} />
        }
    }

    return <React.Fragment>

        {(loadingSendOtpOrder || loadingGetOrderDetails) ? <Loading loading={true} /> : ""}

        <div className="container">
            <div className="row">

                <div className="col-12 mt-3 stepper-container">
                    <StepperComponent
                        activeStep={activeStep}
                        steps={steps} />
                </div>

                <div className="col-sm-12 col-xs-12 col-md-8 col-lg-8 col-xl-8 order-container">
                    {getComponent()}
                </div>

               

                <div className="col-xs-0 col-sm-0 col-md-4 col-lg-4 col-xl-4 pricing-container">
                    {/* //////////////////SHOW ORDER DETAILS IN BIG SCREENS///////////////// */}

                    <div className="col-12 order-pricing-container">
                        <span className="total-amount-label">
                            Total Amount
                        </span>
                        <span className="total-amount">
                            {orderData?.order?.total_amount ? numberToIndianCurrency(orderData.order.total_amount) : 0}
                        </span>
                    </div>

                    {
                        orderData?.order_items?.length ?
                            orderData?.order_items.map((value: any, index: any) => {

                                return <div className="col-12 product-info-card">
                                    <div className="col-4 product-image">
                                        <img src={value.photo_url} alt="" />
                                    </div>
                                    <div className="col-8">
                                        <div className="product-name">{value.product_name.length > NAME_LENGTH ? value.product_name.slice(0, NAME_LENGTH) + "..." : value.product_name}</div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <b>Qty:{value.quantity}</b>
                                            <b>Amount:<span className="product-checkout-price">{numberToIndianCurrency(value.quantity*value.buyout_price)}</span></b>
                                        </div>
                                    </div>
                                </div>
                            })
                            : ""
                    }
                </div>
            </div>
        </div>

    </React.Fragment>
}

export default OrderMain;