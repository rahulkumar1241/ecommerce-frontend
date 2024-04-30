import { Suspense, useEffect, useRef, useState } from 'react';
import React from "react";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getProductsByCategory } from '../../../../store/slices/product';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import showToast from '../../../../components/toasters/toast';
import Card from '../../../../components/card/card';
import "./viewproductsbycategory.scss";
import Pagination from '../../../../components/pagination/pagination';
import { IoFilter } from "react-icons/io5";
import Button from '../../../../components/button/button';
import Loading from '../../../../components/loader/loader';
import DrawerComponent from '../../../../components/drawer/drawer';
import PriceSlider from '../../../../components/priceslider/slider';
import Input from '../../../../components/input/input';
import { Controller, useForm } from 'react-hook-form';
import RadioButton from '../../../../components/radio/radio';
import Checkbox from '../../../../components/checkbox/checkbox';

const OFFSET = 18;

const ViewAllProductsByCategory = () => {
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);

    const DrawerRef: any = useRef();

    const params = new URLSearchParams(document.location.search);

    const { totalProductsCount, MAX_PRICE, MIN_PRICE, loadingGetProductsByCategory } = useAppSelector(state => state.product);
    const { loadingAddToCart } = useAppSelector(state => state.cart);
    const { loadingAddToWishlist } = useAppSelector(state => state.wishlist)
    const { loadingCreateOrder } = useAppSelector(state => state.order)


    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        control,
        formState: { errors },
        reset
    } = useForm({

    });


    const getProductData = async (page: any) => {
        console.log(getValues());
        debugger
        let formData: any = {
            cat_id: params.get("category_id") ? params.get("category_id") : "",
            page_number: page,
            page_size: OFFSET,
            filter_section: {}
        }
        /////////////////////////////////////////////////////
        if (getValues("search")) {
            formData.filter_section.name = getValues("search");
        }
        if (getValues("price_range")) {
            formData.filter_section.max_price_range = getValues("price_range");
        }

        if (getValues("newest_first")) {
            formData.filter_section.newest_first = getValues("newest_first");
        }

        if (getValues("sort_by_price")) {
            formData.filter_section.order_by_price = getValues("sort_by_price");
        }

        if (getValues("rating")) {
            formData.filter_section.rating_greater_than_equal_to = getValues("rating");
        }
        if (getValues("discount_per")) {
            formData.filter_section.discount_greater_than_equal_to = getValues("discount_per");
        }

        let response = await dispatch(getProductsByCategory(formData));
        let productsData = response?.payload?.data ? response.payload.data : {};

        if (productsData.success) {
            let data = { ...productsData.data };
            setProducts(data.products ? data.products : []);
            setPage(page)
            window.scrollTo(0, 0);
        } else {
            showToast('ERROR', productsData.message || 'Some Error Occurred...');
        }
    }


    useEffect(() => {
        ////////////initial page is one by default///////
        resetValues();
        getProductData(1);
    }, [])


    const handlePageChange = (page: any) => {
        getProductData(page)
    }

    const resetValues = () => {
        setValue("search", "");
        setValue("price_range", undefined);
        setValue("sort_by_price", "");
        setValue("newest_first", false);
        setValue("rating", undefined);
        setValue("discount_per", undefined);
    }

    const openDrawer = () => {
        if (!getValues("price_range")) {
            setValue("price_range", MAX_PRICE)
        }
        DrawerRef.current.handleClickOpen();
    }

    const handleChangePrice = (e: any) => {
        setValue("price_range", e.target.value);
    }

    const handleChangeSearch = (e: any) => {
        setValue("search", e.target.value);
    }

    const changeRating = (e: any, rating: any) => {
        setValue("rating", rating);
    }

    const applyFilters = async () => {
        ////////////search from the first page//////
        getProductData(1);
    }

    const changeDiscount = (e: any, value: any) => {
        setValue("discount_per", value);
    }

    return (<React.Fragment>
        {(loadingGetProductsByCategory || loadingAddToCart || loadingAddToWishlist || loadingCreateOrder) ? <Loading loading={true} /> : ""}
        <div className='viewProductsByCategoryContainer'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12'>
                        <Button label="Filter" isFilled={true} isFullWidth={false} onClick={openDrawer}>
                            <IoFilter />
                        </Button>

                    </div>

                    <div className='col-12 d-flex justify-content-end'>
                        {totalProductsCount ? <b>{`${totalProductsCount} ${totalProductsCount > 1 ? 'results' : 'result'} found`}</b> : ""}
                    </div>

                    {products.length ?
                        products.map((value: any, index: any) => <div className='col-sm-6 col-xs-6 col-md-3 col-lg-2 col-xl-2 mb-3'>
                            <Card product={value} />
                        </div>)
                        :
                        <p>No data found.</p>}


                    <div className='col-12 d-flex flex-row-reverse'>
                        {products?.length ? <Pagination
                            page={page}
                            onChange={(event: any, value: any) => { handlePageChange(value) }}
                            pageCount={Math.ceil(totalProductsCount / OFFSET)}
                        /> : ""}
                    </div>
                </div>
            </div>

            <Suspense fallback={<Loading />}>
                <DrawerComponent
                    ref={DrawerRef}
                    description={""}
                >
                    <div className='filter-container'>
                        <div className='row'>
                            <div className='col-6'>
                                <Button label="clear filters" isFilled={false} onClick={() => {
                                    resetValues()
                                    setValue("price_range", MAX_PRICE)
                                }} />
                            </div>
                            <div className='col-6'>
                                <Button label="Apply filters" isFilled={true} onClick={applyFilters} />
                            </div>
                            <div className='col-12'>
                                <Controller
                                    control={control}
                                    name={`search`}
                                    render={({ field: any }) => (
                                        <Input
                                            label="Search"
                                            type="text"
                                            onChange={handleChangeSearch}
                                            value={getValues("search")}
                                            placeholder="Search by product name or description..."
                                        />
                                    )}
                                />



                            </div>


                            <div className='col-12 mt-3'>
                                <div className='label'>Sort by price</div>
                                <Controller
                                    control={control}
                                    name={`sort_by_price`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("sort_by_price")}
                                            label="Low to High"
                                            value="ASC"
                                            onChange={(e: any) => {
                                                debugger
                                                setValue("sort_by_price", "ASC")
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name={`sort_by_price`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("sort_by_price")}
                                            label="High to Low"
                                            value="DESC"
                                            onChange={(e: any) => {
                                                setValue("sort_by_price", "DESC")
                                            }}
                                        />
                                    )}
                                />
                            </div>


                            <div className='col-12 mt-3'>
                                <div className='label'>Sort by Newest First</div>
                                <Controller
                                    control={control}
                                    name={`newest_first`}
                                    render={({ field: any }) => (
                                        <Checkbox
                                            checked={getValues("newest_first")}
                                            label="Newest First"
                                            onChange={(e: any) => {
                                                let value = getValues("newest_first");
                                                setValue("newest_first", value ? false : true)
                                            }}
                                        />
                                    )}
                                />
                            </div>


                            <div className='col-12 mt-3'>
                                <div className='label'>Search by price range</div>
                                <Controller
                                    control={control}
                                    name={`price_range`}
                                    render={({ field: any }) => (
                                        <PriceSlider
                                            MIN={MIN_PRICE}
                                            MAX={MAX_PRICE}
                                            value={getValues("price_range")}
                                            handleChange={handleChangePrice}
                                        />
                                    )}
                                />

                            </div>
                            <div className='col-12 mt-3'>
                                <div className='label'>Search by rating</div>
                                <Controller
                                    control={control}
                                    name={`rating`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("rating")}
                                            label="1*  or above"
                                            value="1"
                                            onChange={(e: any) => { changeRating(e, "1") }}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name={`rating`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("rating")}
                                            label="2*  or above"
                                            value="2"
                                            onChange={(e: any) => { changeRating(e, "2") }}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name={`rating`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("rating")}
                                            label="3*  or above"
                                            value="3"
                                            onChange={(e: any) => { changeRating(e, "3") }}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`rating`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("rating")}
                                            label="4*  or above"
                                            value="4"
                                            onChange={(e: any) => { changeRating(e, "4") }}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`rating`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("rating")}
                                            label="5*"
                                            value="5"
                                            onChange={(e: any) => { changeRating(e, "5") }}
                                        />
                                    )}
                                />
                            </div>

                            <div className='col-12 mt-3'>
                                <div className='label'>Sort by discount%</div>
                                <Controller
                                    control={control}
                                    name={`discount_per`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("discount_per")}
                                            label="10% or above"
                                            value="10"
                                            onChange={(e: any) => { changeDiscount(e, "10") }}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name={`discount_per`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("discount_per")}
                                            label="20% or above"
                                            value="20"
                                            onChange={(e: any) => { changeDiscount(e, "20") }}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name={`discount_per`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("discount_per")}
                                            label="30%  or above"
                                            value="30"
                                            onChange={(e: any) => { changeDiscount(e, "30") }}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`discount_per`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("discount_per")}
                                            label="40%  or above"
                                            value="40"
                                            onChange={(e: any) => { changeDiscount(e, "40") }}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`discount_per`}
                                    render={({ field: any }) => (
                                        <RadioButton
                                            selectedValue={getValues("discount_per")}
                                            label="50% or above"
                                            value="50"
                                            onChange={(e: any) => { changeDiscount(e, "50") }}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </DrawerComponent>
            </Suspense>
        </div>
    </React.Fragment>
    );
}

export default ViewAllProductsByCategory;