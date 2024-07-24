import { Suspense, useEffect, useRef, useState } from 'react';
import React from "react";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { changePageNumber, getAllProducts, getDropdownValues, resetProductSlice } from '../../../../store/slices/product';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import showToast from '../../../../components/toasters/toast';
import Card from '../../../../components/card/card';
import "../viewallproductsbycategory/viewproductsbycategory.scss";
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

const ViewAllProducts = () => {
    const dispatch = useAppDispatch();
    // const [page, setPage] = useState(1);
    // const [products, setProducts] = useState([]);

    const DrawerRef: any = useRef();

    // const params = new URLSearchParams(document.location.search);

    const { current_page, search_keyword, allProductsData, totalProductsCount, MAX_PRICE, MIN_PRICE, loadingGetAllProducts, loadingGetDropdownValues, dropdownValues } = useAppSelector(state => state.product);
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


    const getProductsData = async (page: any, reset?: boolean) => {
        let formData: any = {
            page_number: page,
            page_size: OFFSET,
            filter_section: {}
        }
        /////////////////////////////////////////////////////
        if (search_keyword) {
            formData.filter_section.name = reset ? "" : search_keyword.trim();
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

        formData.filter_section.categories = [];

        getValues("categories")?.map((value: any, index: any) => {
            if (getValues(`categories.${index}.cat_name`)) {
                formData.filter_section.categories.push(dropdownValues.categories[index].cat_id)
            }
        })

        if (!formData.filter_section.categories.length) {
            delete formData.filter_section.categories
        }

        let response = await dispatch(getAllProducts(formData));
        let productsData = response?.payload?.data ? response.payload.data : {};

        DrawerRef.current.handleClose();

        if (productsData.success) {
            // let data = { ...productsData.data };
            // setProducts(data.products ? data.products : []);

            let pageData: any = {
                page_number: page
            }

            dispatch(changePageNumber(pageData))
            // setPage(page);
            window.scrollTo(0, 0);
        } else {
            showToast('ERROR', productsData.message || 'Some Error Occurred...');
        }
    }


    const getDropdownValuesFunc = async () => {
        let formData: any = {
            product_categories: true
        }
        let response = await dispatch(getDropdownValues(formData));
        let dropdownData = response?.payload?.data ? response.payload.data : {};

        if (dropdownData.success) {
            for (let i = 0; i < dropdownData.data.categories; ++i) {
                setValue(`categories.${i}.cat_name`, false)
            }
        } else {
            showToast('ERROR', dropdownData.message || 'Some Error Occurred...');
        }
    }

    useEffect(() => {
        ////////////initial page is one by default///////
        resetValues();
        getDropdownValuesFunc()
        window.scrollTo(0, 0)
        // getProductsData(1);
        return () => {
            dispatch(resetProductSlice());
        }
    }, [])



    const handlePageChange = (page: any) => {
        getProductsData(page)
    }

    const resetValues = () => {
        // setValue("search", "");
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

    const changeRating = (e: any, rating: any) => {
        setValue("rating", rating);
    }

    const applyFilters = async () => {
        ////////////search from the first page//////
        getProductsData(1);
    }

    const changeDiscount = (e: any, value: any) => {
        setValue("discount_per", value);
    }

    return (<React.Fragment>
        {(loadingGetAllProducts || loadingGetDropdownValues || loadingAddToCart || loadingAddToWishlist || loadingCreateOrder) ? <Loading loading={true} /> : ""}
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


                    {allProductsData.length ?
                        allProductsData.map((value: any, index: any) => <div className='col-xs-6 col-sm-6 col-md-3 col-lg-2 col-xl-2 col-6 mb-3'>
                            <Card product={value} />
                        </div>)
                        :
                        ""}

                       


                    <div className='col-12 d-flex flex-row-reverse'>
                        {allProductsData.length ? <Pagination
                            page={current_page}
                            onChange={(event: any, value: any) => { handlePageChange(value) }}
                            pageCount={Math.ceil(totalProductsCount / OFFSET)}
                        /> : null}
                    </div>

                    <div className='d-flex justify-content-center'>
                        {
                            allProductsData.length ? null :
                                <p className='text-center'>No data found.</p>
                        }
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
                                    for (let i = 0; i < dropdownValues.categories.length; ++i) {
                                        setValue(`categories.${i}.cat_name`, false);
                                    }
                                    dispatch(resetProductSlice());
                                    //////////send the reset option to true/////
                                    getProductsData(1, true);
                                }} />
                            </div>
                            <div className='col-6'>
                                <Button label="Apply filters" isFilled={true} onClick={applyFilters} />
                            </div>
                            {/* <div className='col-12'>
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
                            </div> */}


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
                                <div className='label'>Sort by categories</div>

                                {dropdownValues?.categories?.map((value: any, index: any) =>
                                    <Controller
                                        control={control}
                                        name={`categories.${index}.cat_name`}
                                        render={({ field: any }) => (
                                            <Checkbox
                                                checked={getValues(`categories.${index}.cat_name`)}
                                                label={value.category_name}
                                                onChange={(e: any) => {
                                                    let value = getValues(`categories.${index}.cat_name`);
                                                    setValue(`categories.${index}.cat_name`, value ? false : true)
                                                }}
                                            />
                                        )}
                                    />
                                )
                                }
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

export default ViewAllProducts;