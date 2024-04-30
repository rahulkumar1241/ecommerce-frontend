import React, { useRef, useState } from "react";
import "./uploadsheet.scss";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Loading from "../../../components/loader/loader";
import Button from "../../../components/button/button";
import showToast from "../../../components/toasters/toast";
import { API_MESSAGE_TYPE } from "../../../constants/constants";
import { uploadProductSheet } from "../../../store/slices/admin";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../paths/path";

const UploadSheet = () => {
    const hiddenFileInput: any = useRef(null);
    const dispatch = useAppDispatch();
    const [loading, setLoading]: any = useState(false);
    const navigate = useNavigate();
    const [file, setFile]: any = useState(null);
    const [error, setError]: any = useState("");

    const { loadingUploadProductSheet } = useAppSelector(state => state.admin);

    const handleChange = (e: any) => {

        setLoading(true);

        const fileUploaded = e.target.files[0];
        let tempArr = fileUploaded.name.split(".")
        let extension = tempArr[tempArr.length - 1];
        if (extension === "xlsx" || extension === "xls" || extension === "csv") {
            setFile(fileUploaded);
        } else {
            showToast(API_MESSAGE_TYPE.ERROR, "File must be xlsx,xls or csv type")
        }

        setTimeout(() => {
            setLoading(false)
        }, 1000)

    }


    const onSubmit = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("product_sheet", file);

            let response = await dispatch(uploadProductSheet(formData));
            let sheetData = response?.payload?.data ? response.payload.data : {};

            if (sheetData.success) {
                showToast(
                    API_MESSAGE_TYPE.SUCCESS,
                    sheetData.message ?
                        sheetData.message :
                        "Something went wrong"
                )
                navigate(PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_ALL_PRODUCTS)
            } else {
                //////////////////console.log(show error)////////////////
                showToast(API_MESSAGE_TYPE.ERROR, sheetData.message ?
                    sheetData.message :
                    "Something went wrong")
            }
        }
        else {
            //////////////////console.log(show error)////////////////
            showToast(API_MESSAGE_TYPE.ERROR, "Please select a file")
        }
    }

    return <React.Fragment>
        {(loading || loadingUploadProductSheet) ? <Loading loading={true} /> : ""}
        <div className="sheet-container">

            <div className="row">
                <div className="col-12">
                    <div className="dropzone" onClick={(e: any) => hiddenFileInput.current.click()}>
                        <p>Drag & Drop file here...</p>

                        <p className="text-success">{file?.name}</p>

                    </div>

                    <input
                        accept=".xlsx, .xls, .csv"
                        type="file"
                        onChange={handleChange}
                        ref={hiddenFileInput}
                        style={{ display: 'none' }} // Make the file input element invisible
                    />
                </div>

                <div className="col-12">
                    <Button
                        isFilled={true}
                        label="upload"
                        type="button"
                        onClick={onSubmit}
                    />
                </div>
            </div>



        </div>
    </React.Fragment>
}
export default UploadSheet;