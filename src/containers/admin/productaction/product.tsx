import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrUpdateProduct, getDropdownValues } from "../../../store/slices/product";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import showToast from "../../../components/toasters/toast";
import Loading from "../../../components/loader/loader";
import Button from "../../../components/button/button";
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { API_MESSAGE_TYPE, priceAfterDiscount } from "../../../constants/constants";
import Input from "../../../components/input/input";
import "./product.scss";
import Select from "../../../components/select/select";
import Switch from "../../../components/switch/switch";
import NoImage from "../../../assets/images/banner/no-image.png";
import { uploadImage } from "../../../store/slices/common";
import { PATH } from "../../../paths/path";

const ProductAction = () => {
    const hiddenFileInput: any = useRef(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [imageUrl, setImageUrl]: any = useState("");
    const [mode, setMode]: any = useState("");

    const { loadingGetDropdownValues, dropdownValues, loadingCreateOrUpdateProduct } = useAppSelector(state => state.product);
    const { loadingUploadImage } = useAppSelector(state => state.common);

    let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;

    const validationSchema = Yup.object().shape({
        photo_url: Yup.string().trim()
            .required('Product Image is required.'),
        product_name: Yup.string().trim()
            .required('Product Name is required.'),
        product_description: Yup.string().trim()
            .required('Product description is required'),
        product_category: Yup.string().trim()
            .required('Product Category is required'),
        stock: Yup
            .number()
            .min(1)
            .typeError('Stock must be a number')
            .required("Stock is required"),
        actual_price: Yup
            .number()
            .min(1)
            .typeError('Actual Price must be a number')
            .required("Actual Price is required"),
        discount_per: Yup
            .number()
            .min(1)
            .typeError('Discount must be a number')
            .required("Discount is required"),
        price_after_discount: Yup.string().trim()
            .required('Price after discount is required'),
        rating: Yup.number()
            .typeError('Rating must be a number')
            .min(1, "Min rating is 1")
            .max(5, "Max rating is 5")
            .required("Rating is required"),
        is_active: Yup.boolean()
    });


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        control
    } = useForm({
        resolver: yupResolver(validationSchema)
    });


    const getProductCategories = async () => {
        let formData: any = {
            product_categories: true
        }
        let response = await dispatch(getDropdownValues(formData));
        let dropdownData = response?.payload?.data ? response.payload.data : {};

        if (dropdownData.success) {

            let info = location.state;

            if (info.mode === "edit" || info.mode === "view") {

                let data = info.data;
                /////////////////set the data in this block///////////
                setValue("photo_url", data.photo_url);
                setValue("product_name", data.product_name.trim());
                setValue("product_description", data.product_description.trim())
                setValue("product_category", data.category);
                setValue("stock", data.stock);
                setValue("actual_price", data.price);
                setValue("discount_per", data.discount_per);
                setValue("price_after_discount", data.price_after_discount);
                setValue("rating", data.rating.toFixed(1));
                setValue("is_active", data.is_active ? true : false)
                setImageUrl(data.photo_url)
            }
            setMode(info.mode);
            window.scrollTo(0, 0);
        } else {
            showToast('ERROR', dropdownData.message || 'Some Error Occurred...');
        }
    }

    useEffect(() => {
        setValue("is_active", false)
        getProductCategories();
    }, []);


    const onSubmit = async (data: any) => {
        //////////create async thunk returns a promise so use async await instead//////
        const formData: any = {
            product_name: data.product_name,
            product_description: data.product_description,
            rating: data.rating,
            stock: data.stock,
            category: data.product_category,
            photo_url: data.photo_url,
            price: data.actual_price,
            discount_per: data.discount_per,
            price_after_discount: data.price_after_discount,
            is_active: data.is_active
        };

        if (mode === "edit") {
            formData['product_id'] = location.state.data.product_id
        }


        let response = await dispatch(createOrUpdateProduct(formData));
        let productData = response?.payload?.data ? response.payload.data : {};

        if (productData.success) {
            showToast(
                API_MESSAGE_TYPE.SUCCESS,
                productData.message ?
                    productData.message :
                    "Something went wrong"
            )

            navigate(PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_ALL_PRODUCTS)

        } else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                productData.message ?
                    productData.message :
                    "Something went wrong"
            )
        }
    }

    const handleChange = async (e: any) => {
        const fileUploaded = e.target.files[0];
        const formData = new FormData();
        formData.append("image", fileUploaded);
        /////////////check for jpg and png images///////////
        let response = await dispatch(uploadImage(formData));
        let imageData = response?.payload?.data ? response.payload.data : {};

        if (imageData.success) {
            setValue("photo_url", imageData.data.url);
            setImageUrl(imageData.data.url)
        } else {
            showToast('ERROR', imageData.message || 'Some Error Occurred...');
        }

    }

    return <React.Fragment>

        {(loadingGetDropdownValues || loadingUploadImage || loadingCreateOrUpdateProduct) ? <Loading loading={true} /> : ""}

        <div style={{ cursor: mode === "view" ? "not-allowed" : "pointer" }}>
            <div className="product-container" style={{ pointerEvents: mode === "view" ? "none" : "visible" }}>
                <form onSubmit={handleSubmit(onSubmit)} >

                    <div className="row">
        
                        <div className="col-4">
                            {imageUrl ? <img src={imageUrl} alt="" /> : <img src={NoImage} alt="" />}

                            <p className="text-danger text-center">{errors.photo_url ? errors.photo_url.message : ""}</p>

                            {mode !== "view" ? <Button
                                isFilled={true}
                                label="browse"
                                type="button"
                                onClick={(e: any) => hiddenFileInput.current.click()}
                            /> : ""}

                            <input
                                accept="image/*"
                                type="file"
                                onChange={handleChange}
                                ref={hiddenFileInput}
                                style={{ display: 'none' }} // Make the file input element invisible
                            />
                        </div>

                        <div className="col-8">
                            <div className="row" >
                                <div className="col-12">
                                    <Controller
                                        control={control}
                                        name={`product_name`}
                                        render={({ field: any }) => (
                                            <Input
                                                required={true}
                                                label="Product Name"
                                                type="text"
                                                isTextArea={true}
                                                error={errors.product_name ? true : false}
                                                errormessage={errors.product_name?.message}
                                                placeholder="Enter product name"
                                                value={getValues("product_name")}
                                                onChange={(e: any) => setValue("product_name", e.target.value)}
                                                style={{ minHeight: "100px" }}
                                            />
                                        )}
                                    />
                                </div>


                            </div>

                            <div className="col-12">
                                <Controller
                                    control={control}
                                    name={`product_description`}
                                    render={({ field: any }) => (
                                        <Input
                                            required={true}
                                            label="Product Description"
                                            type="text"
                                            isTextArea={true}
                                            error={errors.product_description ? true : false}
                                            errormessage={errors.product_description?.message}
                                            placeholder="Enter product description"
                                            value={getValues("product_description")}
                                            onChange={(e: any) => setValue("product_description", e.target.value)}
                                            style={{ minHeight: "150px" }}
                                        />
                                    )}
                                />
                            </div>

                            <div className="col-12 mt-3">
                                <p style={{ color: "#e9611e", marginBottom: "-5px", fontWeight: "600" }}>Active/Inactive product<span className="text-danger">*</span></p>
                                <Controller
                                    control={control}
                                    name={`is_active`}
                                    defaultValue={true}
                                    render={({ field: any }) => (
                                        <Switch
                                            checked={getValues("is_active")}
                                            handleChange={(e: any) => {
                                                setValue("is_active", e.target.checked)
                                            }}
                                        />
                                    )}
                                />

                            </div>



                            <div className="col-12 d-flex">
                                <div className="col-6" style={{ paddingRight: "5px" }}>
                                    <Controller
                                        control={control}
                                        name={`stock`}
                                        render={({ field: any }) => (
                                            <Input
                                                required={true}
                                                label="Stock"
                                                type="text"
                                                error={errors.stock ? true : false}
                                                errormessage={errors.stock?.message}
                                                placeholder="Enter stock"
                                                value={getValues("stock")}
                                                onChange={(e: any) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    setValue("stock", value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="col-6" style={{ paddingLeft: "5px" }}>
                                    <Controller
                                        control={control}
                                        name={`product_category`}
                                        render={({ field: any }) => (
                                            <Select
                                                menuItems={dropdownValues?.categories?.length ?
                                                    dropdownValues.categories.map((data: any, index: any) => {
                                                        return { value: data.cat_id, label: data.category_name }
                                                    })
                                                    : []}
                                                required={true}
                                                label="Product Category"
                                                error={errors.product_category ? true : false}
                                                errormessage={errors.product_category?.message}
                                                value={getValues("product_category")}
                                                onChange={(e: any) => {
                                                    setValue("product_category", e.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-12 d-flex">

                                <div className="col-6" style={{ paddingRight: "5px" }}>
                                    <Controller
                                        control={control}
                                        name={`actual_price`}
                                        render={({ field: any }) => (
                                            <Input
                                                required={true}
                                                label="Actual Price"
                                                type="text"
                                                error={errors.actual_price ? true : false}
                                                errormessage={errors.actual_price?.message}
                                                placeholder="Enter Actual Price"
                                                value={getValues("actual_price")}
                                                onChange={(e: any) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    setValue("actual_price", value);


                                                    if (getValues("actual_price") && getValues("discount_per")) {
                                                        let price_after_discount = priceAfterDiscount(getValues("actual_price"), getValues("discount_per"))
                                                        setValue("price_after_discount", price_after_discount.toString())
                                                    } else {
                                                        setValue("price_after_discount", "")
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-6" style={{ paddingLeft: "5px" }}>
                                    <Controller
                                        control={control}
                                        name={`discount_per`}
                                        render={({ field: any }) => (
                                            <Input
                                                required={true}
                                                label="Discount %"
                                                type="text"
                                                error={errors.discount_per ? true : false}
                                                errormessage={errors.discount_per?.message}
                                                placeholder="Enter discount %"
                                                value={getValues("discount_per")}
                                                onChange={(e: any) => {
                                                    let value = e.target.value.replace(/\D/g, '');
                                                    if (value === "" || value <= 100) {
                                                        setValue("discount_per", value);
                                                    }

                                                    if (getValues("actual_price") && getValues("discount_per")) {
                                                        let price_after_discount = priceAfterDiscount(getValues("actual_price"), getValues("discount_per"))
                                                        setValue("price_after_discount", price_after_discount.toString())
                                                    } else {
                                                        setValue("price_after_discount", "")
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>




                            <div className="col-12 d-flex">
                                <div className="col-6" style={{ paddingRight: "5px" }}>
                                    <Controller
                                        control={control}
                                        name={`price_after_discount`}
                                        render={({ field: any }) => (
                                            <Input
                                                disabled={true}
                                                required={true}
                                                label="Price after discount"
                                                type="text"
                                                error={errors.price_after_discount ? true : false}
                                                errormessage={errors.price_after_discount?.message}
                                                placeholder="Price after discount"
                                                value={getValues("price_after_discount")}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="col-6" style={{ paddingLeft: "5px" }}>
                                    <Controller
                                        control={control}
                                        name={`rating`}
                                        render={({ field: any }) => (
                                            <Input
                                                required={true}
                                                label="Rating(1-5)"
                                                type="text"
                                                error={errors.rating ? true : false}
                                                errormessage={errors.rating?.message}
                                                placeholder="Rating"
                                                value={getValues("rating")}
                                                onChange={(e: any) => {
                                                    const regex = new RegExp(/^[0-9]*(\.[0-9]{0,1})?$/);
                                                    if ((regex.test(e.target.value) || e.target.value === "") && e.target.value <= 5) {
                                                        setValue("rating", e.target.value)
                                                    }
                                                    else {
                                                        setValue("rating", e.target.value.slice(0, e.target.value.length - 1))
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {mode !== "view" ? <div className="col-12">
                                <Button
                                    isFilled={true}
                                    label={mode === "edit" ? "Edit product" : "add product"}
                                    type="submit"
                                />
                            </div> : ""}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </React.Fragment >
}

export default ProductAction;