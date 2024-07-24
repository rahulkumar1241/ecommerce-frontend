import React, { useEffect, useState } from "react";
import { PATH } from "../../../paths/path";
import Loading from "../../../components/loader/loader";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getAllHomepageData } from "../../../store/slices/homepage";
import { useNavigate } from "react-router-dom";
import { API_MESSAGE_TYPE, numberToIndianCurrency, priceAfterDiscount } from "../../../constants/constants";
import SlickSlider from "../../../components/slickslider/slickslider";
import "./homepage.scss";
import showToast from "../../../components/toasters/toast";
import Slider from "../../../components/carousel/carousel";
import { getCartItems } from "../../../store/slices/cart";


const Homepage = (props: any) => {
    const { snackbarRef }: any = props;
    const [homepageData, setHomepageData]: any = useState({});

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loadingHomepageData, totalProductsCount } = useAppSelector(state => state.homepage);
    const { loadingAddToCart, loadingGetCartItems } = useAppSelector(state => state.cart);
    const { loadingAddToWishlist } = useAppSelector(state => state.wishlist)
    const { loadingCreateOrder } = useAppSelector(state => state.order);


    const getCartInfo = async () => {

        let response = await dispatch(getCartItems({}));
        let cartData = response?.payload?.data ? response.payload.data : {};
        if (cartData.success) { }
        else {
            if (cartData.status === 404) {
            } else {
                showToast(
                    API_MESSAGE_TYPE.ERROR,
                    cartData.message ?
                        cartData.message :
                        "Something went wrong"
                )
            }
        }
    }

    const fetchHomepageData = async () => {
        let response = await dispatch(getAllHomepageData({}));

        let homePageDataAPI =
            response?.payload?.data ?
                response.payload.data :
                {};

        if (!homePageDataAPI.success) {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                homePageDataAPI.message ?
                    homePageDataAPI.message :
                    "Something went wrong"
            )
        } else {
            let data = { ...homePageDataAPI.data };
            setHomepageData(data);
            window.scrollTo(0, 0)
        }
    }

    useEffect(() => {

        fetchHomepageData();

        if (localStorage.getItem("accessToken")) {
            getCartInfo();
        }

    }, []);

    const ViewAllProducts = () => {
        navigate(PATH.PUBLIC.PRODUCTS.MAIN_ROUTE)
    }

    const ViewSimilarProducts = (cat_id: any) => {
        navigate(PATH.PUBLIC.PRODUCTS.MAIN_ROUTE + "/" + PATH.PUBLIC.PRODUCTS.CHILD_ROUTES.VIEW_PRODUCTS_BY_CATEGORY + `?category_id=${cat_id}`);
    }

    return (
        <React.Fragment>
            {(loadingHomepageData || loadingAddToCart || loadingAddToWishlist || loadingCreateOrder || loadingGetCartItems) ? <Loading loading={true} /> : ""}
            <div className="container-fluid">

                <div className="row">
                    <Slider />
                </div>

                {/* <div className="categoryContainer">
                    <div className="d-flex justify-content-end align-items-center">
                        <span className="view-similar-products" onClick={ViewAllProducts}>View all products
                            <b>{totalProductsCount}</b>
                        </span>
                    </div>
                </div> */}

                {(Object.keys(homepageData).length && homepageData.recently_watched_items) ?
                    <div className="categoryContainer">

                        <p className="catName">Recently Watched Items</p>
                        <SlickSlider products={homepageData.recently_watched_items} />
                    </div> : ""}

                {Object.keys(homepageData).length ?
                    homepageData.product_with_categories.map((data: any, index: any) => {
                        return <div className="categoryContainer">

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="catName">{data.category_name}</span>
                                <span className="view-similar-products" onClick={() => {
                                    ViewSimilarProducts(data.cat_id)
                                }}>View similar products
                                    <b>{data.total}</b>
                                </span>
                            </div>
                            <SlickSlider products={data.products} />
                        </div>
                    })
                    : ""}
            </div>
        </React.Fragment>
    );
}
export default Homepage;