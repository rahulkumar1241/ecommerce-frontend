import React, { useEffect, useRef, useState } from "react";
import "./myorder.scss";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Loading from "../../../components/loader/loader";
import { getMyOrders, updateOrderStatus } from "../../../store/slices/order";
import showToast from "../../../components/toasters/toast";
import { API_MESSAGE_TYPE, PRODUCT_ACTIONS, getOS, numberToIndianCurrency } from "../../../constants/constants";
import MyLink from "../../../components/link/link";
import { PATH } from "../../../paths/path";
import NoProductsFound from "../../../assets/images/banner/error_404.jpeg";
import StepperComponent from "../../../components/stepper/stepper";
import Pagination from "../../../components/pagination/pagination";
import Button from "../../../components/button/button";
import moment from "moment";
import { LuInfo } from "react-icons/lu";

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IoClose } from "react-icons/io5";

const NAME_LENGTH = 60;
const OFFSET = 5;


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const MyOrders = () => {
    const [page, setPage]: any = useState(1);
    const [myOrderData, setMyOrderData]: any = useState([]);
    const [open, setOpen]: any = useState(false);
    const dataRef: any = useRef(null);


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };



    const dispatch = useAppDispatch();
    const { loadingGetMyOrders, totalCountMyOrders, loadingUpdateOrderStatus } = useAppSelector(state => state.order);

    const getMyOrdersfunc = async (page_number: any) => {
        let formData =
        {
            page_number: page_number,
            page_size: OFFSET
        }
        let response = await dispatch(getMyOrders(formData));
        let orderData = response?.payload?.data ? response.payload.data : {};
        if (orderData.success) {

            let data = orderData.data.map((value: any, index: any) => {
                let orgData = { ...value }
                if (value.item_status === 3) {
                    orgData['activeStep'] = 0;
                }
                else if (value.item_status === 5) {
                    orgData['activeStep'] = 1;
                }
                else if (value.item_status === 13) {
                    orgData['activeStep'] = 2;
                }
                else if (value.item_status === 12) {
                    orgData['activeStep'] = 3;
                }
                //////////////////////IN CASE OF CANCEELLED/////////////
                else if (value.item_status === 4 || value.item_status === 14) {
                    orgData['isCancelled'] = true;
                }
                return orgData
            })

            window.scrollTo(0, 0)
            
            setMyOrderData(data)
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                orderData.message ?
                    orderData.message :
                    "Something went wrong"
            )
        }
        setPage(page_number)
    }

    useEffect(() => {

        /////////////initial page is 1////////
        getMyOrdersfunc(1);
    }, [])


    const handlePageChange = (page_number: any) => {
        getMyOrdersfunc(page_number);
    }


    const updateOrderStatusfunc = async (action: any, data: any) => {

        let formData =
        {
            item_id: data.order_item_id,
            status: action === PRODUCT_ACTIONS.CANCEL_ORDER ? 4 : 6,
            mobile_number: data.mobile_number,
            fullname: data.firstname + " " + data.lastname
        }

        let response = await dispatch(updateOrderStatus(formData));

        let orderData = response?.payload?.data ? response.payload.data : {};

        if (orderData.success) {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                orderData.message ?
                    orderData.message :
                    "Something went wrong"
            );
            let data = myOrderData.map((value: any, index: any) => {
                if (value.order_item_id === formData.item_id) {
                    value.item_status = formData.status
                }

                if (value.item_status === 4) {
                    delete value['activeStep'];
                    value.isCancelled = true;
                    value.order_status_desc = "Order Cancellation Requested";
                }
                if (value.item_status === 6) {
                    delete value['activeStep'];
                    value.order_status_desc = "Return Initiated";
                }
                return value
            })
            setMyOrderData(data);
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

    const setProductData = (product_data: any) => {
        dataRef.current = {
            productInfo: product_data
        }
        setOpen(true)
    }

    return <React.Fragment>

        {loadingGetMyOrders || loadingUpdateOrderStatus ? <Loading loading={true} /> : ""}

        <div className="my-orders-container">

            {myOrderData.length === 0 ? <><div className="d-flex justify-content-center align-items-center">
                <img src={NoProductsFound} alt="" />
            </div>
                <div className="d-flex justify-content-center align-items-center">
                    <MyLink navigatePath={PATH.PUBLIC.HOME_PAGE} label="continue shopping" style={{
                        fontWeight: 600,
                        fontSize: "120%"
                    }} />
                </div>
            </> : ""}

            {myOrderData.length ?
                <div className="col-12">
                    <h5>{`${totalCountMyOrders} ${totalCountMyOrders > 1 ? 'Order Items' : 'Order Item'}!`}</h5>
                </div> : ""}



            {myOrderData.map((value: any, index: any) =>
                <div className="row my-order-card">
                    <div className="col-3 d-flex justify-content-center">
                        <img src={value.photo_url} alt="" />
                    </div>

                    <div className="col-8">

                        <p className="product-name">{value.product_name.length > NAME_LENGTH ? value.product_name.slice(0, NAME_LENGTH) + "..." : value.product_name}</p>

                        <div className="info-section">
                            <span className="quantity">Qty:{value.quantity}</span>
                            <span className="buyout_price"><label>{numberToIndianCurrency(value.quantity * value.buyout_price)}</label></span>

                            {(value.item_status === 3 || value.item_status === 5 || value.item_status === 13) ||
                                (value.item_status === 12 && moment(value.order_item_datetime).add(7, 'days').format("DD-MM-YYYY") >= moment(new Date()).format("DD-MM-YYYY"))
                                ? <span className="action-button">
                                    <Button isFilled={true} style={{
                                        backgroundColor: "hsl(0, 100%, 60%)", height: "25px", margin: "0px", fontSize: "11px",
                                        minWidth: (getOS() === "android" || getOS() === "android") ? "100px" : "100px"
                                    }}
                                        isFullwidth={false}
                                        label={(value.item_status === 3 || value.item_status === 5 || value.item_status === 13) ? 'Cancel Order' : 'Return Order'}
                                        onClick={(e: any) => {
                                            updateOrderStatusfunc((value.item_status === 3 || value.item_status === 5 || value.item_status === 13) ? PRODUCT_ACTIONS.CANCEL_ORDER : PRODUCT_ACTIONS.RETURN_ORDER, value)
                                        }}
                                    />
                                </span> : ""}

                            <span className="order-info" onClick={() => {
                                setProductData(value)
                            }}>more info<LuInfo /></span>

                        </div>

                        {!value.hasOwnProperty('activeStep') ? <div className="order-status mt-1">
                            <span>Order Status : <label className={`${value.hasOwnProperty("isCancelled") ? 'error' : 'success'}`}>{value.order_status_desc}</label></span>
                        </div> : ""}

                        <div className="d-flex stepper-container">
                            {value.hasOwnProperty('activeStep') ? <StepperComponent
                                steps={[
                                    'Order Confimred',
                                    'Order Shipped',
                                    'Out for Delivery',
                                    'Delivered'
                                ]}
                                isOrderStepper={true}
                                activeStep={value.activeStep}
                            /> : ""}
                        </div>

                    </div>

                    <div className="col-1">

                    </div>

                </div>)}

            <div className='col-12 d-flex flex-row-reverse'>
                {myOrderData?.length ? <Pagination
                    page={page}
                    onChange={(event: any, value: any) => { handlePageChange(value) }}
                    pageCount={Math.ceil(totalCountMyOrders / OFFSET)}
                /> : ""}
            </div>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Shipping Details
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <IoClose />
                </IconButton>
                <DialogContent dividers>

                    <div className="mb-3">
                        <b style={{ color: "#e9611e" }}>Shipping Address : </b><span>{dataRef.current?.productInfo?.address}</span>
                    </div>

                    <div className="mb-3">
                        <b style={{ color: "#e9611e" }}>Shipping Address Type : </b><span>{dataRef.current?.productInfo?.description}</span>
                    </div>

                    <div className="mb-3">
                        <b style={{ color: "#e9611e" }}>Shipping Contact Number. : </b><span>{dataRef.current?.productInfo?.country_code + ' ' + dataRef.current?.productInfo?.mobile_number}</span>
                    </div>

                    <div className="mb-3">
                        <b style={{ color: "#e9611e" }}>Purchase Time : </b><span>{dataRef.current?.productInfo?.datetime ? moment(dataRef.current?.productInfo?.datetime).format('DD/MM/YYYY hh:mm A') : ""}</span>
                    </div>

                </DialogContent>
            </BootstrapDialog>
        </div>
    </React.Fragment>

}

export default MyOrders;