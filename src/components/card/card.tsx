import "./card.scss";
import ShippingLogo from "../../assets/images/icons/shipping-in-24hrs.png"
import RatingComponent from "../rating/rating";
import Button from "../button/button";
import { API_MESSAGE_TYPE, numberToIndianCurrency, PRODUCT_ACTIONS } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../paths/path";
import { addToCart } from "../../store/slices/cart";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import React, { useRef, useState } from "react";
import Loading from "../loader/loader";
import showToast from "../toasters/toast";
import { addToWishlist } from "../../store/slices/wishlist";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CrossLogo from "../../assets/images/icons/dismiss(2).png";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";
import { createOrder } from "../../store/slices/order";


const Card = (props: any) => {

    const [quantity, setQuantity]: any = useState(1);
    const buyProductDataRef: any = useRef(null);
    const [open, setOpen]: any = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { product } = props;

    const NAME_LENGTH = 40;

    const viewProduct = () => {
        navigate(`${PATH.PRIVATE.PRODUCTS.MAIN_ROUTE}/${PATH.PRIVATE.PRODUCTS.CHILD_ROUTES.VIEW_PRODUCT}?product_id=${product.product_id}`)
    }


    const productAction = async () => {
        let formData = {
            product_id: product.product_id,
            quantity: 1
        }
        let response: any = await dispatch(addToCart(formData));

        let responseData = response?.payload?.data ? response.payload.data : {};

        if (responseData.status === 200) {
            showToast(API_MESSAGE_TYPE.SUCCESS, responseData.message || 'Some Error Occurred...');
        }
        else {
            showToast(API_MESSAGE_TYPE.ERROR, responseData.message || 'Some Error Occurred...');
            if (responseData.status === 403) {
                navigate(PATH.PRIVATE.CART)
            }
        }
    }

    const createOrderFunc = (product_info: any) => {
        buyProductDataRef.current = {
            productInfo: product_info
        }
        setOpen(true);
    }

    const placeOrder = async () => {
        let productData = buyProductDataRef.current.productInfo;
        debugger

        let formData = {
            total_amount: quantity * productData.price_after_discount,
            products: [
                {
                    product_id: productData.product_id,
                    quantity: quantity,
                    buyout_price: productData.price_after_discount
                }
            ]
        }
        debugger
        let response = await dispatch(createOrder(formData));
        let orderData = response?.payload?.data ? response.payload.data : {};

        if (orderData.success) {
            //////////////navigate into the order page for mobile verification//////////
            navigate(PATH.PRIVATE.ORDER_MAIN, {
                state: {
                    order_id: orderData.data.order_id
                }
            });
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

    const addToWishlistFunc = async (product: any) => {
        let formData = {
            product_id: product.product_id
        }

        let response = await dispatch(addToWishlist(formData));
        let wishlistResponseData = response?.payload?.data ? response.payload.data : {};

        if (wishlistResponseData.success) {
            showToast(API_MESSAGE_TYPE.SUCCESS,
                wishlistResponseData.message ?
                    wishlistResponseData.message :
                    "Something went wrong");
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                wishlistResponseData.message ?
                    wishlistResponseData.message :
                    "Something went wrong"
            )
            if (wishlistResponseData.status === 403) {
                navigate(PATH.PRIVATE.WISHLIST)
            }
        }
    }

    return (
        <React.Fragment>

            <div className='product-card'>
                <div className="ship-in-24-hrs-parent">
                    <div className="ship-in-24-hrs">
                        <img src={ShippingLogo} alt="" />
                        <span>
                            Ships within 24hrs
                        </span>
                    </div>
                </div>

                <div className="product-image-container">
                    <img
                        className="product-image "
                        src={product.photo_url}
                        alt="product"
                    />
                </div>

                <p className="product-description" onClick={viewProduct}>
                    {product.product_name.length > NAME_LENGTH ? product.product_name.slice(0, NAME_LENGTH) + "..." : product.product_name}
                </p>

                <p className="seperator mt-3 mb-3" onClick={viewProduct}></p>

                <div className="row" onClick={viewProduct}>
                    <div className="col-6 actual_price">
                        <p>{product.discount_per ? numberToIndianCurrency(product.price) : ""}</p>
                    </div>

                    <div className="col-6 price_after_discount">
                        <p>{product.price_after_discount ? numberToIndianCurrency(product.price_after_discount) : ""}</p>
                    </div>

                    <div className="col-5 discount">
                        <p>{product.discount_per ? `${product.discount_per}% OFF` : ""}</p>
                    </div>

                    <div className="col-7 save_after_discount">
                        <p>{product.discount_per ? `You save ${numberToIndianCurrency(product.price - product.price_after_discount)}!` : ""}</p>
                    </div>

                    <div className="col-12 rating">
                        {product.stock <= 0 ? <p className="out-of-stock">This product is out of stock</p> : ""}
                        <RatingComponent size={'small'} rating={product.rating} />
                    </div>
                </div>

                <p className="solid-seperator mt-3 mb-3" onClick={viewProduct}></p>

                <div className="container">
                    <div className="col-12 actionBtn mb-2">
                        <Button label="Add to wishlist" onClick={(e: any) => {
                            addToWishlistFunc(product);
                        }} />
                    </div>
                    <div className="col-12 actionBtn mb-2">
                        <Button label="Add to cart" isFilled={true} disabled={product.stock <= 0}
                            onClick={productAction}
                        />
                    </div>
                    <div className="col-12 actionBtn mb-2">
                        <Button label="Buy Now" disabled={product.stock <= 0}
                            onClick={(e: any) => {
                                createOrderFunc(product)
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="quantity-modal">
                <Dialog
                    open={open}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >

                    <DialogTitle id="alert-dialog-title" className='text-center' >
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="title" style={{
                                fontWeight: "600",
                                fontSize: "16px",
                                color: "#e9611e",
                                marginRight: "10px"
                            }}>{'Please select the quantity to buy'}</span>
                            <span>
                                <img src={CrossLogo} style={{
                                    height: "20px",
                                    width: "20px",
                                    cursor: "pointer"
                                }}
                                    onClick={(e: any) => {
                                        setOpen(false)
                                    }}
                                />
                            </span>
                        </div>
                    </DialogTitle>


                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <div className="d-flex justify-content-center align-items-center">
                                <span>
                                    <Button isFilled={true} isFullWidth={false}
                                        style={{ height: "30px", width: "30px" }}
                                        onClick={(e: any) => {
                                            if (quantity > 1) {
                                                setQuantity(quantity - 1)
                                            }
                                        }}
                                    >
                                        <IoIosRemove />
                                    </Button>
                                </span>
                                <span style={{ margin: "0px 10px", fontWeight: "600" }}>{quantity}</span>
                                <span>
                                    <Button isFilled={true} isFullWidth={false}
                                        style={{ height: "30px", width: "30px" }}
                                        onClick={(e: any) => {
                                            setQuantity(quantity + 1)
                                        }}
                                    >
                                        <IoIosAdd />
                                    </Button>
                                </span>
                            </div>

                            <div className="d-flex justify-content-center align-items-center">
                                <Button isFilled={false} isFullWidth={true} label="cancel" onClick={(e: any) => {
                                    setOpen(false)
                                }} />

                                <Button
                                    isFilled={true}
                                    isFullWidth={true}
                                    label="continue"
                                    style={{ marginLeft: "10px" }}
                                    onClick={placeOrder}
                                />
                            </div>
                        </DialogContentText>
                    </DialogContent>

                </Dialog>
            </div>
        </React.Fragment>
    );
}

export default Card;