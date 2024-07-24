import { Suspense, useEffect, useRef, useState } from 'react';
import React from "react";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getAllProducts, getDropdownValues } from '../../../store/slices/product';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import showToast from '../../../components/toasters/toast';
import Pagination from '../../../components/pagination/pagination';
import { IoFilter } from "react-icons/io5";
import Button from '../../../components/button/button';
import Loading from '../../../components/loader/loader';
import DrawerComponent from '../../../components/drawer/drawer';
import Input from '../../../components/input/input';
import { Controller, useForm } from 'react-hook-form';
import RadioButton from '../../../components/radio/radio';
import Checkbox from '../../../components/checkbox/checkbox';
import "../../products/products/viewallproductsbycategory/viewproductsbycategory.scss";
import Datatable from '../../../components/table/table';
import { numberToIndianCurrency } from '../../../constants/constants';
import { FaRegEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../paths/path';

const OFFSET = 10;

const NAME_OFFSET = 50;

const ViewAllProducts = () => {

    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const DrawerRef: any = useRef();

    const { totalProductsCount, loadingGetAllProducts, loadingGetDropdownValues, dropdownValues } = useAppSelector(state => state.product);

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

    const handleProduct = (mode: any, data?: any) => {
        navigate(PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.CREATE_VIEW_OR_EDIT_PRODUCT,
            {
                state:
                {
                    mode: mode,
                    data: data
                }
            })
    }

    const columns: any = [
        {
            name: "Product Id",
            selector: "product_id",
            wrap: true,
        },
        {
            name: "Product Name",
            selector: "product_name",
            wrap: true,
            cell: (row: any) => {
                return <div>

                    {row['product_name'].length > NAME_OFFSET ? row['product_name'].slice(0, NAME_OFFSET) + "..." : row['product_name']}
                </div>
            }
        },
        {
            name: "Product Image",
            selector: "product_description",
            wrap: true,
            cell: (row: any) => {
                return <div className='p-3 d-flex justify-content-center'>
                    <img src={row['photo_url']} alt="product" style={{ objectFit: "contain", height: "100px", width: "100px" }} />
                </div>
            }
        },
        {
            name: "Product Category",
            selector: "category_name",
            wrap: true,
        },
        {
            name: "Price After Discount",
            selector: "price_after_discount",
            wrap: true,
            cell: (row: any) => {
                return <div>
                    {numberToIndianCurrency(row['price_after_discount'])}
                </div>
            }
        },
        {
            name: "Stock",
            selector: "stock",
            wrap: true,
        },
        {
            name: "Active/Inactive",
            selector: "is_active",
            wrap: true,
            cell: (row: any) => {
                return <b className={`d-flex justify-content-center`}>
                    <span className={`${row['is_active'] ? 'text-success' : 'text-danger'}`} style={{fontFamily:"Arial"}}>{row['is_active'] ? 'Active' : 'Inactive'}</span>
                </b>
            }
        },
        {
            name: "Actions",
            cell: (row: any) => {
                return <div>
                    <FaEye onClick={(e: any) => {
                        handleProduct("view", row)
                    }} style={{ height: "20px", width: "20px", marginRight: "10px", cursor: "pointer" }} />
                    <FaRegEdit onClick={(e: any) => {
                        handleProduct("edit", row)
                    }} style={{ height: "20px", width: "20px", cursor: "pointer" }} />
                </div>
            }

        },
    ];


    const getProductsData = async (page: any) => {
        let formData: any = {
            page_number: page,
            page_size: OFFSET,
            filter_section: {}
        }
        /////////////////////////////////////////////////////

        if (getValues("search_by_id")) {
            formData.filter_section.search_by_product_id = getValues("search_by_id");
        }

        else {

            if (getValues("search")) {
                formData.filter_section.name = getValues("search");
            }

            if (getValues("newest_first")) {
                formData.filter_section.newest_first = getValues("newest_first");
            }


            if (getValues("sort_by_price")) {
                formData.filter_section.order_by_price = getValues("sort_by_price");
            }

            if (getValues("out_of_stock")) {
                formData.filter_section.out_of_stock = getValues("out_of_stock");
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
        }
        let response = await dispatch(getAllProducts(formData));
        let productsData = response?.payload?.data ? response.payload.data : {};

        if (productsData.success) {
            let data = { ...productsData.data };
            setProducts(data.products ? data.products : []);
            setPage(page);
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
        getProductsData(1);
    }, [])


    const handlePageChange = (page: any) => {
        getProductsData(page)
    }

    const resetValues = () => {
        setValue("newest_first", false);
        setValue("out_of_stock", false);
        setValue("search", "");
        setValue("sort_by_price", "");
        setValue("search_by_id", "")
    }

    const openDrawer = () => {
        DrawerRef.current.handleClickOpen();
    }

    const handleChangeSearch = (e: any) => {
        setValue("search", e.target.value);
    }

    const applyFilters = async () => {
        ////////////search from the first page//////
        getProductsData(1);
    }

    return (<React.Fragment>
        {(loadingGetAllProducts || loadingGetDropdownValues) ? <Loading loading={true} /> : ""}
        <div className='viewProductsByCategoryContainer'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 d-flex justify-content-between align-items-center'>
                        <span>
                            <Button label="Filter" isFilled={true} isFullWidth={false} onClick={openDrawer}>
                                <IoFilter />
                            </Button>
                        </span>

                        <span className='d-flex'>
                            <Button
                                style={{ marginRight: "10px" }}
                                onClick={(e: any) => {
                                    navigate(PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.UPLOAD_PRODUCT_SHEET)
                                }} label="Upload Sheet" isFilled={true} isFullWidth={false} />

                            <Button onClick={(e: any) => {
                                handleProduct("create")
                            }} label="Create product" isFilled={true} isFullWidth={false} />
                        </span>

                    </div>

                    <div className='col-12 d-flex justify-content-end'>
                        {totalProductsCount ? <b>{`${totalProductsCount} ${totalProductsCount > 1 ? 'results' : 'result'} found`}</b> : ""}
                    </div>

                    <div className='col-12 text-center'>

                        {products.length ?
                            <Datatable
                                columns={columns}
                                data={products}
                            />
                            : <p>No data found.</p>}
                    </div>



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
                                    resetValues();
                                    for (let i = 0; i < dropdownValues.categories.length; ++i) {
                                        setValue(`categories.${i}.cat_name`, false);
                                    }
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

                            <div className='col-12'>
                                <Controller
                                    control={control}
                                    name={`search_by_id`}
                                    render={({ field: any }) => (
                                        <Input
                                            label="Search By Product Id"
                                            type="text"
                                            onChange={(e: any) => {
                                                if (isNaN(e.target.value) === false) {
                                                    setValue("search_by_id", e.target.value);
                                                }
                                            }}
                                            value={getValues("search_by_id")}
                                            placeholder="Search by product Id"
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
                                <div className='label'>Sort by Out of Stock</div>

                                <Controller
                                    control={control}
                                    name={`out_of_stock`}
                                    render={({ field: any }) => (
                                        <Checkbox
                                            checked={getValues(`out_of_stock`)}
                                            label={'Out of Stock'}
                                            onChange={(e: any) => {
                                                let value = getValues(`out_of_stock`);
                                                setValue(`out_of_stock`, value ? false : true)
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
                        </div>
                    </div>
                </DrawerComponent>
            </Suspense>
        </div>
    </React.Fragment>
    );
}

export default ViewAllProducts;