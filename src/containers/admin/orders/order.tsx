import React, { Suspense, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Loading from "../../../components/loader/loader";
import { getAllOrdersInfo } from "../../../store/slices/admin";
import showToast from "../../../components/toasters/toast";
import { API_MESSAGE_TYPE, numberToIndianCurrency } from "../../../constants/constants";
import Datatable from "../../../components/table/table";
import Pagination from "../../../components/pagination/pagination";
import "../../products/products/viewallproductsbycategory/viewproductsbycategory.scss";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../paths/path";
import useLocalStorage from "../../../utils/localStorage";
import DrawerComponent from "../../../components/drawer/drawer";
import Button from "../../../components/button/button";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/input/input";
import Checkbox from "../../../components/checkbox/checkbox";
import { getDropdownValues } from "../../../store/slices/common";
import { IoFilter } from "react-icons/io5";
import DateRangePicker from "../../../components/rangedatepicker/rangedatepicker"
import { addDays } from 'date-fns';
const OFFSET = 10;
const NAME_OFFSET = 50;

const Orders = () => {
    const [page, setPage]: any = useState(1);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const DrawerRef: any = useRef();

    const [dateRange, setDateRange]: any = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    ])


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

    const [dropdownData, setDropdownData]: any = useState({});

    const { allOrderItemsData, totalOrderItemsCount, loadingGetAllOrderItemsInfo } = useAppSelector(state => state.admin);
    const { loadingDropdownValues } = useAppSelector(state => state.common);

    const handleEditOrder = (data: any) => {
        useLocalStorage.setItem("orderItemInfo", data);
        navigate(PATH.PRIVATE.ADMIN.MAIN_ROUTE
            +
            "/"
            + PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_EDIT_ORDER_ITEM_INFO);
    }

    const columns: any = [
        {
            name: "Order Item No.",
            selector: "order_item_id",
            wrap: true,
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
        }, {
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
            name: "Quantity",
            selector: "quantity",
            wrap: true,
            cell: (row: any) => {
                return <div>
                    {row['quantity']}
                </div>
            }
        },
        {
            name: "Buyout Price/Piece",
            selector: "buyout_price",
            wrap: true,
            cell: (row: any) => {
                return <div>
                    {numberToIndianCurrency(row['buyout_price'])}
                </div>
            }
        },{
            name: "Size",
            selector: "size_info",
            wrap: true,
            cell: (row: any) => {
                return <div className="d-flex justify-content-center">
                    {row['size_info'] ? row['size_info']:"N/A"}
                </div>
            }
        },
        {
            name: "Order Status",
            selector: "order_status_desc",
            wrap: true,
            cell: (row: any) => {
                return <div>
                    {row['order_status_desc']}
                </div>
            }
        },
        {
            name: "Purchase Time",
            selector: "datetime",
            wrap: true,
            cell: (row: any) => {
                return <div>
                    {moment(row['datetime']).format('DD/MM/YYYY hh:mm A')}
                </div>
            }
        },
        {
            name: "Actions",
            cell: (row: any) => {
                return <div>
                    <FaRegEdit onClick={(e: any) => {
                        handleEditOrder(row)
                    }} style={{ height: "20px", width: "20px", cursor: "pointer" }} />
                </div>
            }

        },

    ]





    const getAllOrderItemsData = async (page: any) => {

        let formData: any =
        {
            page_number: page,
            page_size: OFFSET,
            filter_section: {}
        }

        if (getValues("search_by_order_item_id")) {
            formData.filter_section.search_by_order_item_id = getValues("search_by_order_item_id")
        } else {

            if (dateRange[0].startDate && dateRange[0].endDate) {
                formData.filter_section.start_date = moment(dateRange[0].startDate).format('YYYY-MM-DD');
                formData.filter_section.end_date = moment(dateRange[0].endDate).format('YYYY-MM-DD');
            }

            let order_item_status_array: any = [];

            for (let i = 0; i < dropdownData?.order_status_dropdown?.length; ++i) {
                if (getValues(`order_status.${i}.name`)) {
                    order_item_status_array.push(dropdownData.order_status_dropdown[i].status_id)
                }
            }

            if (order_item_status_array.length) {
                formData.filter_section.order_item_status = order_item_status_array
            }

        }

        DrawerRef.current.handleClose();
        
        let response = await dispatch(getAllOrdersInfo(formData));
        let orderData = response?.payload?.data ? response.payload.data : {};

        if (orderData.success) {
            setPage(page);
            window.scrollTo(0, 0);
        } else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                orderData.message ?
                    orderData.message :
                    "Something went wrong"
            )
        }
    }

    const handlePageChange = (page: any) => {
        getAllOrderItemsData(page)
    }

    useEffect(() => {
        /////////////////initial page data//////////
        getAllOrderItemsData(1);
    }, [])


    const resetValues = () => {
        setValue("search_by_order_item_id", "");
        setDateRange([
            {
                startDate: null,
                endDate: null,
                key: 'selection'
            }
        ])
    }


    const applyFilters = () => {
        getAllOrderItemsData(1);
    }


    const getDropDownValuesForOrderStatus = async () => {

        let formData = {
            order_status_dropdown: true
        }
        let response = await dispatch(getDropdownValues(formData));
        let dropdownData = response?.payload?.data ? response.payload.data : {};

        if (dropdownData.success) {
            ///////////filteration of order status dropdown/////////
            let tempArr = [1, 10, 2, 11];

            let data: any = JSON.parse(JSON.stringify(dropdownData.data));

            data.order_status_dropdown = dropdownData.data.order_status_dropdown.filter((value: any, index: any) => {
                return !(tempArr.includes(value.status_id));
            });

            for (let i = 0; i < data.order_status_dropdown.length; ++i) {
                setValue(`order_status.${i}.name`, false)
            }

            setDropdownData(data);

        } else {
            showToast(API_MESSAGE_TYPE.ERROR,
                dropdownData.message ?
                    dropdownData.message :
                    "Something went wrong")
        }
    }


    useEffect(() => {
        getDropDownValuesForOrderStatus()
    }, [])


    const openDrawer = () => {
        DrawerRef.current.handleClickOpen();
    }


    return <React.Fragment>
        {(loadingDropdownValues || loadingGetAllOrderItemsInfo) ? <Loading loading={true} /> : ""}

        <div className='viewProductsByCategoryContainer'>
            <div className='container'>
                <div className="row">

                    <div className="col-12">
                        <Button label="Filter" isFilled={true} isFullWidth={false} onClick={openDrawer}>
                            <IoFilter />
                        </Button>
                    </div>

                    <div className='col-12 d-flex justify-content-end'>
                        {totalOrderItemsCount ? <b>{`${totalOrderItemsCount} ${totalOrderItemsCount > 1 ? 'results' : 'result'} found`}</b> : ""}
                    </div>

                    <div className='col-12 text-center'>

                        {allOrderItemsData.length ?
                            <Datatable
                                columns={columns}
                                data={allOrderItemsData}
                            />
                            : <p>No data found.</p>}
                    </div>

                    <div className='col-12 d-flex flex-row-reverse'>
                        {allOrderItemsData?.length ? <Pagination
                            page={page}
                            onChange={(event: any, value: any) => { handlePageChange(value) }}
                            pageCount={Math.ceil(totalOrderItemsCount / OFFSET)}
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

                                    for (let i = 0; i < dropdownData.order_status_dropdown; ++i) {
                                        setValue(`order_status.${i}.name`, false)
                                    }
                                }} />
                            </div>
                            <div className='col-6'>
                                <Button label="Apply filters" isFilled={true} onClick={applyFilters} />
                            </div>


                            <div className='col-12'>
                                <Controller
                                    control={control}
                                    name={`search_by_order_item_id`}
                                    render={({ field: any }) => (
                                        <Input
                                            label="Search by Order Item No."
                                            type="text"
                                            onChange={(e: any) => {
                                                if (isNaN(e.target.value) === false) {
                                                    setValue("search_by_order_item_id", e.target.value);
                                                } else {
                                                    setValue("search_by_order_item_id", e.target.value.slice(0, e.target.value.length - 1))
                                                }
                                            }}
                                            value={getValues("search_by_order_item_id")}
                                            placeholder="Search by Order Item No."
                                        />
                                    )}
                                />
                            </div>


                            <div className="col-12 mt-3">
                                <div className='label'>Sort by Date Range</div>
                                <DateRangePicker
                                    value={dateRange}
                                    onChange={(item: any) => {
                                        setDateRange([item.selection])
                                    }}
                                />
                            </div>


                            <div className='col-12 mt-3'>
                                <div className='label'>Sort by Order Status</div>

                                {dropdownData?.order_status_dropdown?.map((value: any, index: any) =>
                                    <Controller
                                        control={control}
                                        name={`order_status.${index}.name`}
                                        render={({ field: any }) => (
                                            <Checkbox
                                                checked={getValues(`order_status.${index}.name`)}
                                                label={value.order_status_desc}
                                                onChange={(e: any) => {
                                                    let value = getValues(`order_status.${index}.name`);
                                                    setValue(`order_status.${index}.name`, value ? false : true)
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
}

export default Orders;
