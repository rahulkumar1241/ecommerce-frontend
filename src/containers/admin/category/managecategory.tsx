import React, { useEffect, useRef, useState } from "react";
import { getDropdownValues } from "../../../store/slices/product";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import showToast from "../../../components/toasters/toast";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import Loading from "../../../components/loader/loader";
import Select from "../../../components/select/select";
import { getCategoryInfo, updateCategoryInfo } from "../../../store/slices/admin";
import NoImage from "../../../assets/images/banner/no-image.png";
import Switch from "../../../components/switch/switch";
import Button from "../../../components/button/button";
import { uploadImage } from "../../../store/slices/common";
import Input from "../../../components/input/input";

function isValidUrl(url: any) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '(([\\w\\d\\-\\.]+)\\.[a-z]{2,}|' + // domain name
        'localhost|\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // localhost or IPv4
        '\\[([0-9a-fA-F:\\.]+)\\])' + // IPv6
        '(\\:\\d+)?(\\/[-\\w\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-\\w]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}

const ManageCategory = () => {

    let [catData, setCatData]: any = useState({});
    const hiddenFileInput: any = useRef(null);

    const dispatch = useAppDispatch();
    const { loadingGetDropdownValues, dropdownValues }: any = useAppSelector(state => state.product);
    const { loadingGetCategoryInfo, loadingUpdateCategoryInfo }: any = useAppSelector(state => state.admin);
    const { loadingUploadImage } = useAppSelector(state => state.common);

    useEffect(() => {
        getDropDownValuesForOrderStatus();
    }, [])


    const getDropDownValuesForOrderStatus = async () => {

        let formData = {
            product_categories: true
        }
        let response = await dispatch(getDropdownValues(formData));
        let dropdownData = response?.payload?.data ? response.payload.data : {};

        if (dropdownData.success) { 
            window.scrollTo(0, 0);            
        } else {
            showToast(API_MESSAGE_TYPE.ERROR,
                dropdownData.message ?
                    dropdownData.message :
                    "Something went wrong")
        }
    }

    const getCategoryInfoFunc = async (cat_id: any) => {

        setCatData({cat_id:"",banner_url:"",banner_is_active:0,redirect_url:""});

        let formData = {
            cat_id: cat_id
        }
        let response = await dispatch(getCategoryInfo(formData));
        let categoryData: any = response?.payload?.data ? response.payload.data : {};

        if (categoryData.success) {

            setCatData({...categoryData.data[0]},)
        } else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                categoryData.message ?
                    categoryData.message :
                    "Something went wrong")
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
            setCatData({ ...catData, banner_url: imageData.data.url })
        } else {
            showToast('ERROR', imageData.message || 'Some Error Occurred...');
        }
    }

    const updateCategoryInfoFunc = async () => {
        if (catData.redirect_url) {
            if (!isValidUrl(catData.redirect_url)) {
                showToast("ERROR", "Please enter a valid Redirect URL");
                return;
            }
        }
        let formData = {
            cat_id: catData.cat_id,
            banner_url: catData.banner_url ? catData.banner_url :"",
            banner_is_active: catData.banner_is_active ? 1 : 0,
            redirect_url: catData.redirect_url ? catData.redirect_url : ""
        }
        /////////////check for jpg and png images///////////
        let response = await dispatch(updateCategoryInfo(formData));
        let categoryData = response?.payload?.data ? response.payload.data : {};

        if (categoryData.success) {
            showToast('SUCCESS', categoryData.message || 'Some Error Occurred...');
            setCatData({cat_id:"",banner_url:"",banner_is_active:0,redirect_url:""});
            window.scrollTo(0, 0);
        } else {
            showToast('ERROR', categoryData.message || 'Some Error Occurred...');
        }
    }

    return <React.Fragment>
        {loadingGetDropdownValues || loadingGetCategoryInfo || loadingUploadImage || loadingUpdateCategoryInfo ? <Loading loading={true} /> : ""}
        <div className="row">
            <div className="col-6">
                <Select
                    menuItems={dropdownValues?.categories?.length ?
                        dropdownValues.categories.map((data: any, index: any) => {
                            return { value: data.cat_id, label: data.category_name }
                        })
                        : []}
                    value={catData.cat_id}
                    onChange={(e: any) => {
                        if (e.target.value) {
                            getCategoryInfoFunc(e.target.value);
                        } else {
                            setCatData({cat_id:"",banner_url:"",banner_is_active:0,redirect_url:""})
                        }
                    }}
                    required={true}
                    label="Select Category"
                />
            </div>
        </div>

        <div className="row banner-info">
            <div className="col-12 mt-3">
                <img src={catData.banner_url ? catData.banner_url : NoImage} alt="banner" />
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center">
                <Button
                    isFilled={false}
                    label="browse"
                    type="button"
                    isFullWidth={false}
                    onClick={(e: any) => hiddenFileInput.current.click()}
                />

                <div className="toggle ml-3">
                    <Switch
                        checked={catData.banner_is_active}
                        handleChange={(e: any) => {
                            setCatData({ ...catData, banner_is_active: e.target.checked })
                        }}
                    />
                </div>

                <input
                    accept="image/*"
                    type="file"
                    onChange={handleChange}
                    ref={hiddenFileInput}
                    style={{ display: 'none' }} // Make the file input element invisible
                />
            </div>

            <div className="col-12">

                <Input
                    required={true}
                    label="Redirect URL"
                    type="text"
                    placeholder="Enter URL..."
                    value={catData.redirect_url}
                    onChange={(e: any) => {
                        setCatData({ ...catData, redirect_url: e.target.value })
                    }}
                    autoFocus={true}
                />

            </div>

            {catData.cat_id ? <div className="col-12 d-flex justify-content-center">
                <Button
                    isFilled={true}
                    label="Update"
                    type="button"
                    isFullWidth={false}
                    style={{ paddingLeft: "30px", paddingRight: "30px" }}
                    onClick={updateCategoryInfoFunc}
                />
            </div> : null}
        </div>
    </React.Fragment>
}

export default ManageCategory;
