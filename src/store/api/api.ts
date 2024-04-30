import axios from "axios";
import { PATH } from "../../paths/path";
import showToast from "../../components/toasters/toast";
import { API_MESSAGE_TYPE } from "../../constants/constants";


export const useApiService = async ({ url, method, data, headerInfo }: any) => {

    axios.interceptors.response.use((response: any) => {
        return response
    }, (error) => {
        if (error?.response && error?.response?.data) {
            if (error?.response?.data?.isTokenError) {
                showToast(API_MESSAGE_TYPE.ERROR,"Test");
                window.location.href = PATH.PUBLIC.SIGN_IN;
            }
            return Promise.reject({ data: { ...error.response.data } });

        }
        return Promise.reject(error);
    });

    let headers: any = {};

    if (headerInfo) {
        headers = { ...headerInfo }
    } else {
        headers = {
            "Content-Type": "application/json"
        }
    }

    if (localStorage.getItem("accessToken")) {
        headers.Authorization = localStorage.getItem("accessToken");
    }

    try {
        let response: any = await axios.request({
            baseURL: process.env.REACT_APP_APIBASE,
            headers,
            url,
            method,
            data,
        });
        return response;
    }

    catch (error: any) {
        debugger

        return {
            isCrash: true,
            error: error || 'Something went wrong'
        }
    }
}

