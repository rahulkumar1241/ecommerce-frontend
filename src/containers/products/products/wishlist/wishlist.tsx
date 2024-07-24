import React, { useEffect, useState } from "react";
import "./wishlist.scss";
import { getWishlistData, removeItemFromWishlist } from "../../../../store/slices/wishlist";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import Loading from "../../../../components/loader/loader";
import showToast from "../../../../components/toasters/toast";
import { API_MESSAGE_TYPE, numberToIndianCurrency } from "../../../../constants/constants";
import RatingComponent from "../../../../components/rating/rating";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../paths/path";
import MyLink from "../../../../components/link/link";
import NoProductsFound from "../../../../assets/images/banner/error_404.jpeg";

const NAME_LENGTH = 80

const WishList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [wishlistData, setWishListData]: any = useState([]);

    const { loadingGetWishlistData, loadingRemoveItemFromWishlist } = useAppSelector(state => state.wishlist);

    const getWishListDataFunc = async () => {
        let response = await dispatch(getWishlistData({}));
        let wishlistData = response?.payload?.data ? response.payload.data : {};
        if (!wishlistData.success) {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                wishlistData.message ?
                    wishlistData.message :
                    "Something went wrong"
            )
        } else {
            setWishListData(wishlistData.data);
        }
    }


    const removeItemFromWishListFunc = async (product_id: any) => {
        let formData = {
            product_id: product_id
        }
        let response = await dispatch(removeItemFromWishlist(formData));
        let removeData = response?.payload?.data ? response.payload.data : {};

        if (!removeData.success) {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                removeData.message ?
                    removeData.message :
                    "Something went wrong"
            )
        } else {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                removeData.message ?
                    removeData.message :
                    "Something went wrong"
            )
            let newWishListProducts: any = wishlistData.filter((value: any, index: any) => {
                return !(value.product_id === product_id)
            })
            setWishListData(newWishListProducts);
        }
    }
    const viewProduct = (product_id: any) => {
        navigate(`${PATH.PUBLIC.PRODUCTS.MAIN_ROUTE}/${PATH.PUBLIC.PRODUCTS.CHILD_ROUTES.VIEW_PRODUCT}?product_id=${product_id}`)
    }

    useEffect(() => {
        getWishListDataFunc();
    }, [])


    return <React.Fragment>
        {(loadingGetWishlistData || loadingRemoveItemFromWishlist) ? <Loading loading={true} /> : ""}

        <div className="wishlist-container">

            {wishlistData.length === 0 ? <><div className="d-flex justify-content-center align-items-center">
                <img src={NoProductsFound} alt="" />
            </div>
                <div className="d-flex justify-content-center align-items-center">
                    <MyLink navigatePath={PATH.PUBLIC.HOME_PAGE} label="continue shopping" style={{
                        fontWeight: 600,
                        fontSize: "120%"
                    }} />
                </div>
            </> : ""}



            {wishlistData.length ?
                <div className="col-12">
                    <h5>{`${wishlistData.length} ${wishlistData.length > 1 ? 'Items' : 'Item'} in the wishlist!`}</h5>
                </div> : ""}

            {wishlistData.map((value: any, index: any) =>
                <div className="row wishlist-card">
                    <div className="col-3 d-flex justify-content-center">
                        <img src={value.photo_url} alt="" onClick={(e: any) => {
                            viewProduct(value.product_id)
                        }} />
                    </div>
                    <div className="col-8">
                        <p className="product-name" onClick={(e: any) => {
                            viewProduct(value.product_id)
                        }}>{value.product_name.length > NAME_LENGTH ? value.product_name.slice(0, NAME_LENGTH) + "..." : value.product_name}</p>
                        <p className="rating-component"> <RatingComponent size='small' rating={value.rating} /></p>

                        <div className="price-section">
                            {value.discount_per ? <span className="price">{numberToIndianCurrency(value.price ? value.price : 0)}</span> : ""}
                            <span className="price_after_discount">{numberToIndianCurrency(value.price_after_discount ? value.price_after_discount : 0)}</span>
                            {value.discount_per ? <span className="discount_per">{value.discount_per + "% OFF"}</span> : ""}
                        </div>
                    </div>
                    <div className="col-1">
                        <span className="delete-section" onClick={(e: any) => {
                            removeItemFromWishListFunc(value.product_id)
                        }}>
                            <MdDelete size="20" />
                        </span>
                    </div>
                </div>)}
        </div>
    </React.Fragment>
}

export default WishList;