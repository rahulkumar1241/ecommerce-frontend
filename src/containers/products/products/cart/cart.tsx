import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_MESSAGE_TYPE, PRODUCT_ACTIONS, numberToIndianCurrency, priceAfterDiscount } from "../../../../constants/constants";
import showToast from "../../../../components/toasters/toast";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import Loading from "../../../../components/loader/loader";
import { PATH } from "../../../../paths/path";
import "./cart.scss";
import RatingComponent from "../../../../components/rating/rating";
import Button from "../../../../components/button/button";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";
import { getCartItems, handleUpdateQuantity } from "../../../../store/slices/cart";
import { MdDelete } from "react-icons/md";
import NoProductsFound from "../../../../assets/images/banner/error_404.jpeg";
import MyLink from "../../../../components/link/link";
import useLocalStorage from "../../../../utils/localStorage";
import { createOrder } from "../../../../store/slices/order";

const MyCart = () => {
    const NAME_LENGTH = 60;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [products, setProducts]: any = useState([]);
    const [checkoutInfo, setCheckoutInfo]: any = useState({
        total_checkout_price: 0,
        total_checkout_price_after_discount: 0,
        isDisabled: false
    });

    const { loadingGetCartItems, loadingUpdateQuantity } = useAppSelector(state => state.cart);
    const { loadingCreateOrder } = useAppSelector(state => state.order);

    const getCartInfo = async () => {
        let response = await dispatch(getCartItems({}));
        let cartData = response?.payload?.data ? response.payload.data : {};
        if (cartData.success) {
            let cartProductData = cartData.data.map((value: any, index: any) => {
                return {
                    ...value,
                    actual_price: value.price,
                    actual_price_after_discount: value.price_after_discount,
                    price: value.quantity * value.price,
                    price_after_discount: value.quantity * value.price_after_discount
                }
            })
            setProducts(cartProductData);
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                cartData.message ?
                    cartData.message :
                    "Something went wrong"
            )
        }
        window.scrollTo(0, 0)
    }


    useEffect(() => {
        getCartInfo();
    }, [])

    useEffect(() => {
        let checkoutInfo = {
            total_checkout_price: 0,
            total_checkout_price_after_discount: 0,
            isDisabled: false
        }
        products.forEach((value: any, index: any) => {

            if (value.stock <= 0) {
                checkoutInfo.isDisabled = true
            }
            checkoutInfo.total_checkout_price += value.price;
            checkoutInfo.total_checkout_price_after_discount += value.price_after_discount;
        })
        setCheckoutInfo(checkoutInfo)
    }, [products])

    const updateProductInfo = async (index: any, quantity: any) => {
        let formData = {
            product_id: products[index].product_id,
            quantity: quantity
        }
        let response = await dispatch(handleUpdateQuantity(formData));
        let cartProductData = response?.payload?.data ? response.payload.data : {};
        //increase or decrease in quantity means success and product info will update accordingly
        //in case of remove from cart show popup
        let updatedProducts = JSON.parse(JSON.stringify(products));
        if (cartProductData.success) {
            if (quantity === 0) {
                updatedProducts.splice(index, 1);
                useLocalStorage.setItem("cartItems", updatedProducts);
            } else {
                updatedProducts[index].price = quantity * updatedProducts[index].actual_price;
                updatedProducts[index].price_after_discount = quantity * updatedProducts[index].actual_price_after_discount;
                updatedProducts[index].quantity = quantity;
            }
            setProducts(updatedProducts)
            showToast(API_MESSAGE_TYPE.SUCCESS,
                cartProductData.message ?
                    cartProductData.message :
                    "Something went wrong")
        } else {
            showToast(API_MESSAGE_TYPE.ERROR,
                cartProductData.message ?
                    cartProductData.message :
                    "Something went wrong")
        }
    }

    const viewProduct = (product_id: any) => {
        navigate(`${PATH.PUBLIC.PRODUCTS.MAIN_ROUTE}/${PATH.PUBLIC.PRODUCTS.CHILD_ROUTES.VIEW_PRODUCT}?product_id=${product_id}`)
    }

    const createOrderFunc = async () => {
        let formData = {
            total_amount: checkoutInfo.total_checkout_price_after_discount,
            products: products.map((value: any, index: any) => {
                return {
                    product_id: value.product_id,
                    quantity: value.quantity,
                    buyout_price: value.actual_price_after_discount
                }
            })
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
        {(loadingGetCartItems || loadingUpdateQuantity || loadingCreateOrder) ? <Loading loading={true} /> : ""}

        <div className="cart-container">
            <div className="container">
                {products.length === 0 ? <><div className="no-products-section d-flex justify-content-center align-items-center">
                    <img src={NoProductsFound} alt="" />
                </div>
                    <div className="no-products-section d-flex justify-content-center align-items-center">
                        <MyLink navigatePath={PATH.PUBLIC.HOME_PAGE} label="continue shopping" style={{
                            fontWeight: 600,
                            fontSize: "120%"
                        }} />
                    </div>
                </> : ""}

                {products.length ? <div className="row mt-3 mb-3">
                    <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12 col-xs-12 products-section">
                        <div className="col-12">
                            <h5>{`${products.length} ${products.length > 1 ? 'Items' : 'Item'} in the cart!`}</h5>
                        </div>
                        {products.map((value: any, index: any) => {
                            return <div className="my-cart-card row">
                                <div className="col-4">
                                    <img src={value.photo_url} alt="" onClick={(e: any) => {
                                        viewProduct(value.product_id)
                                    }} />
                                </div>
                                <div className="col-8">
                                    <p className="product-name"
                                        onClick={(e: any) => {
                                            viewProduct(value.product_id)
                                        }}>{value.product_name.length > NAME_LENGTH ? value.product_name.slice(0, NAME_LENGTH) + "..." : value.product_name}</p>
                                    <p className="out-of-stock">{value.stock <= 0 ? PRODUCT_ACTIONS.OUT_OF_STOCK : ''}</p>
                                    <div className="quantity-section">
                                        <Button
                                            isFilled={true}
                                            isFullWidth={false}
                                            onClick={(e: any) => {
                                                updateProductInfo(index, value.quantity - 1)
                                            }}
                                            style={{
                                                padding: "5px",
                                                height: "auto"
                                            }}
                                        >
                                            <IoIosRemove />
                                        </Button>
                                        <span className="quantity"> {value.quantity} </span>


                                        <Button
                                            isFilled={true}
                                            isFullWidth={false}
                                            onClick={(e: any) => {
                                                updateProductInfo(index, value.quantity + 1)
                                            }}
                                            style={{
                                                padding: "5px",
                                                height: "auto"
                                            }}
                                        >
                                            <IoIosAdd />
                                        </Button>
                                    </div>

                                    <div className="rating-section">
                                        <RatingComponent size='small' rating={value.rating} />
                                    </div>

                                    <div className="pricing-discount-section d-flex justify-content-between" onClick={(e: any) => {
                                        viewProduct(value.product_id)
                                    }}>
                                        <span className="actual-price">
                                            {numberToIndianCurrency(value.price)}
                                        </span>
                                        <span className="price-after-discount">
                                            {numberToIndianCurrency(value.price_after_discount)}
                                        </span>
                                        <span className="discount-per">
                                            <label>{value.discount_per + "%" + " OFF"}</label>
                                        </span>
                                        <span className="save-amount">
                                            {`You save ${numberToIndianCurrency(value.price - value.price_after_discount)}!`}
                                        </span>
                                    </div>
                                   
                                    <span className="text-center remove-section" onClick={(e: any) => {
                                        updateProductInfo(index, 0)
                                    }}>
                                        <MdDelete size={20} style={{ marginTop: "-5px" }} />
                                        Remove
                                    </span>
                                </div>
                            </div>
                        })}
                    </div>
                    <div className="col-lg-4 col-xl-4 col-md-4 col-sm-12 col-xs-12 checkout-section">

                        <div className="price-section">
                            <p className="actual-price">{numberToIndianCurrency(checkoutInfo.total_checkout_price)}</p>
                            <p className="price-after-discount">{numberToIndianCurrency(checkoutInfo.total_checkout_price_after_discount)}</p>
                            <p className="save-amount">{'You save ' + numberToIndianCurrency(checkoutInfo.total_checkout_price - checkoutInfo.total_checkout_price_after_discount) + '!'}</p>
                        </div>

                        <div className="col-12 d-flex justify-content-between">
                            <div className="col-6">
                                <Button label="continue shopping" onClick={(e: any) => {
                                    navigate(PATH.PUBLIC.HOME_PAGE)
                                }} />

                            </div>
                            <div className="col-6">
                                <Button label="checkout"
                                    disabled={checkoutInfo.isDisabled}
                                    style={{ marginLeft: "5px" }}
                                    onClick={createOrderFunc}
                                    isFilled={true} />
                            </div>
                        </div>
                    </div>
                </div> : ""}
            </div>
        </div>


    </React.Fragment>
}

export default MyCart;