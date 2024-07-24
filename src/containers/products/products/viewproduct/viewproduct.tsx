import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_MESSAGE_TYPE, numberToIndianCurrency, priceAfterDiscount } from "../../../../constants/constants";
import showToast from "../../../../components/toasters/toast";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import product, { getProductData } from "../../../../store/slices/product";
import Loading from "../../../../components/loader/loader";
import { PATH } from "../../../../paths/path";
import "./viewproduct.scss";
import RatingComponent from "../../../../components/rating/rating";
import Button from "../../../../components/button/button";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { addToCart } from "../../../../store/slices/cart";
import { addToWishlist } from "../../../../store/slices/wishlist";
import { createOrder } from "../../../../store/slices/order";
import useLocalStorage from "../../../../utils/localStorage";


const ViewProduct = () => {
    const params = new URLSearchParams(document.location.search);
    const [productData, setproductData]: any = useState({});
    const [quantity, setQuantity]: any = useState(1);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loadingGetProductData } = useAppSelector(state => state.product);
    const { loadingAddToCart } = useAppSelector(state => state.cart);
    const { loadingAddToWishlist } = useAppSelector(state => state.wishlist);
    const { loadingCreateOrder } = useAppSelector(state => state.order);


    const getProductInfo = async () => {
        let formData = {
            product_id: params.get('product_id')
        }
        let response = await dispatch(getProductData(formData));
        let productData = response?.payload?.data ? response.payload.data : {};

        if (productData.success) {
            let data = productData.data;
            data['actual_price'] = data.price;
            data['actual_price_after_discount'] = data.price_after_discount;
            setproductData(productData.data);
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                productData.message ?
                    productData.message :
                    "Something went wrong"
            )
        }
        window.scrollTo(0, 0)
    }
    useEffect(() => {
        getProductInfo();
    }, [])

    const updateProductInfo = (quantity: any) => {
        let data = { ...productData };
        data['price'] = quantity * data.actual_price;
        data['price_after_discount'] = quantity * data.actual_price_after_discount;
        setproductData({ ...data })
        setQuantity(quantity);
    }

    const productAction = async () => {
        if (!localStorage.getItem("accessToken")) {
            let product_id: any = params.get('product_id');
            localStorage.setItem("product_to_buy", product_id);
            showToast(API_MESSAGE_TYPE.ERROR, "Please sign in to continue.");
            navigate(PATH.PUBLIC.SIGN_IN);
        }
        else {
            let formData = {
                product_id: productData.product_id,
                quantity: quantity
            }

            let response: any = await dispatch(addToCart(formData));
            let responseData = response?.payload?.data ? response.payload.data : {};

            if (responseData.success) {
                let cartItems = useLocalStorage.getItem("cartItems");
                cartItems.push(responseData.data);
                useLocalStorage.setItem("cartItems", cartItems);
                showToast(API_MESSAGE_TYPE.SUCCESS, responseData.message || 'Some Error Occurred...');
            }
            else {
                showToast(API_MESSAGE_TYPE.ERROR, responseData.message || 'Some Error Occurred...');
                if (responseData.status === 403) {
                    navigate(PATH.PRIVATE.CART)
                }
            }
        }
    }

    const addToWishlistFunc = async () => {
        let formData = {
            product_id: productData.product_id
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


    const createOrderFunc = async () => {
        let formData = {
            total_amount: productData.price_after_discount,
            products: [
                {
                    product_id: productData.product_id,
                    quantity: quantity,
                    buyout_price: productData.actual_price_after_discount
                }
            ]
        }
        let response = await dispatch(createOrder(formData));
        let orderData = response?.payload?.data ? response.payload.data : {};

        if (orderData.success) {
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



    return <React.Fragment>
        {(loadingGetProductData || loadingAddToCart || loadingAddToWishlist || loadingCreateOrder) ? <Loading loading={true} /> : ""}

        <div className="view-product-container">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 col-xs-12 col-md-4 col-lg-5 col-xl-5 product-image-container">
                        <img src={productData.photo_url} alt="product" />
                    </div>

                    <div className="col-sm-12 col-xs-12 col-md-8 col-lg-7 col-xl-7">
                        <p className="product-name">
                            {productData.product_name}
                        </p>

                        {productData.stock <= 0 ? <p className="out-of-stock">This product is out of stock</p> : ""}

                        <div>
                            <RatingComponent rating={productData.rating} />
                        </div>

                        <div className="row">
                            {productData.discount_per ? <div className="col-lg-3 col-xl-3 col-md-3 col-6 actual-price mt-1">
                                {numberToIndianCurrency(productData.price ? productData.price : 0)}
                            </div> : ""}
                            <div className="col-lg-3 col-xl-3 col-md-3 col-6 price-after-discount mt-1">
                                {numberToIndianCurrency(productData.price_after_discount ? productData.price_after_discount : 0)}
                            </div>
                            {productData.discount_per ? <div className="col-lg-3 col-xl-3 col-md-3 col-6 mt-1 discount-per">
                                <span>{productData.discount_per + "%" + " OFF"}</span>
                            </div> : ""}
                            {productData.discount_per ? <div className="col-lg-3 col-xl-3 col-md-3 col-6 mt-1 save-amount">
                                {`You save ${numberToIndianCurrency(productData.price - productData.price_after_discount)}!`}
                            </div> : ""}

                            {localStorage.getItem("accessToken") ? <div className="col-12 d-flex  align-items-centers">

                                <Button
                                    isFilled={true}
                                    isFullWidth={false}
                                    onClick={(e: any) => {
                                        if (quantity > 1) {
                                            updateProductInfo(quantity - 1)
                                        }
                                    }}
                                >
                                    <IoIosRemove />
                                </Button>

                                <span className="quantity"> {quantity} </span>


                                <Button
                                    isFilled={true}
                                    isFullWidth={false}
                                    onClick={(e: any) => {
                                        updateProductInfo(quantity + 1)
                                    }}
                                >

                                    <IoIosAdd />
                                </Button>



                            </div> : null}
                        </div>

                        {productData.product_description ? <div className="row">
                            <div className="col-12 tabs-product-view">
                                <Tabs
                                    defaultActiveKey="description"
                                    id="uncontrolled-tab-example"
                                    className="mb-3"
                                >
                                    <Tab eventKey="description" title="Description">
                                        <p className="description">{productData.product_description}</p>
                                    </Tab>

                                </Tabs>
                            </div>
                        </div> : ""}

                        {localStorage.getItem("accessToken") ? <div className={`row ActionBtnContainer`}>
                            <div className="col-4">
                                <Button label="Add to cart" disabled={productData.stock <= 0} onClick={productAction} />
                            </div>
                            <div className="col-4">
                                <Button label="Buy Now" isFilled={true} disabled={productData.stock <= 0} onClick={createOrderFunc} />
                            </div>
                            <div className="col-4">
                                <Button label="Add to wishlist" onClick={addToWishlistFunc} />
                            </div>
                        </div> : null}


                        {!localStorage.getItem("accessToken") ? <div className={`row`}>
                            <div className="col-12">
                                <Button label="Buy now" isFilled={true} disabled={productData.stock <= 0} onClick={productAction} />
                            </div>
                        </div> : null}

                    </div>
                </div>

            </div>
        </div>


    </React.Fragment>
}

export default ViewProduct