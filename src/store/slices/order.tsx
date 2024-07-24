import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useApiService } from '../api/api';
import useLocalStorage from '../../utils/localStorage';


type InitialState = {
    loadingCreateOrder: boolean,
    loadingSendOtpOrder: boolean,
    loadingVerifyOtp: boolean,
    loadingUpdateOrder: boolean,
    loadingPinCodeDetails: boolean,
    loadingGetOrderDetails: boolean,
    orderData: any,
    loadingUpdateOrderPostPayment: boolean,
    loadingGetMyOrders: boolean,
    totalCountMyOrders: any,
    loadingUpdateOrderStatus: boolean,
    loadingGetOrderItemDetails: boolean,
    orderItemData: any
}
const initialState: InitialState = {
    loadingCreateOrder: false,
    loadingSendOtpOrder: false,
    loadingVerifyOtp: false,
    loadingUpdateOrder: false,
    loadingPinCodeDetails: false,
    loadingGetOrderDetails: false,
    orderData: {},
    loadingUpdateOrderPostPayment: false,
    loadingGetMyOrders: false,
    totalCountMyOrders: 0,
    loadingUpdateOrderStatus: false,
    loadingGetOrderItemDetails: false,
    orderItemData: {}
}

const namespace = "order"
// Generates pending, fulfilled and rejected action types

const CREATE_ORDER = "/api/order/createOrder";
const SEND_OTP = "/api/order/sendOtp";
const VERIFY_OTP_ORDER = "/api/order/verifyOtp";
const UPDATE_ORDER = "/api/order/updateOrder";
const GET_PINCODE_DETAILS = "/pincodeDetails";
const GET_ORDER_DETAILS = "/api/order/getOrderDetails";
const UPDATE_ORDER_POST_PAYMENT = "/api/order/updateOrderPostPayment";
const GET_MY_ORDERS = "/api/order/getMyOrders";
const UPDATE_ORDER_STATUS = "/api/order/updateOrderStatus";
const GET_ORDER_ITEM_DETAILS = "/api/order/orderItem"


export const updateOrderStatus = createAsyncThunk(`${namespace}/updateOrderStatus`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${UPDATE_ORDER_STATUS}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const getOrderItemDetails = createAsyncThunk(`${namespace}/getOrderItemDetails`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "GET", data: payload, url: `${GET_ORDER_ITEM_DETAILS}?order_item_id=${payload.order_item_id}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})



export const getMyOrders = createAsyncThunk(`${namespace}/getMyOrders`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "GET", data: payload, url: `${GET_MY_ORDERS}?page_number=${payload.page_number}&page_size=${payload.page_size}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const updateOrderPostPayment = createAsyncThunk(`${namespace}/updateOrderPostPayment`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${UPDATE_ORDER_POST_PAYMENT}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const getOrderDetails = createAsyncThunk(`${namespace}/getOrderDetails`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "GET", data: payload, url: `${GET_ORDER_DETAILS}?order_id=${payload.order_id}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})



export const getPincodeDetails = createAsyncThunk(`${namespace}/getPincodeDetails`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "GET", data: payload, url: `${GET_PINCODE_DETAILS}?pincode=${payload.pincode}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const updateOrder = createAsyncThunk(`${namespace}/updateOrder`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${UPDATE_ORDER}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})



export const createOrder = createAsyncThunk(`${namespace}/createOrder`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${CREATE_ORDER}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const sendOtpOrder = createAsyncThunk(`${namespace}/sendOtpOrder`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${SEND_OTP}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const verifyOtpOrder = createAsyncThunk(`${namespace}/verifyOtpOrder`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${VERIFY_OTP_ORDER}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})



const authSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: builder => {
        //////////////////////////////////////////////////////
        builder.addCase(createOrder.pending, state => {
            state.loadingCreateOrder = true
        })

        builder.addCase(
            createOrder.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingCreateOrder = false;
            }
        )
        builder.addCase(createOrder.rejected, (state, action) => {
            state.loadingCreateOrder = false
        })
        //////////////////////////////////////////
        builder.addCase(sendOtpOrder.pending, state => {
            state.loadingSendOtpOrder = true
        })

        builder.addCase(
            sendOtpOrder.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingSendOtpOrder = false;
            }
        )
        builder.addCase(sendOtpOrder.rejected, (state, action) => {
            state.loadingSendOtpOrder = false
        })
        //////////////////////////////////////////////////
        builder.addCase(verifyOtpOrder.pending, state => {
            state.loadingVerifyOtp = true
        })

        builder.addCase(
            verifyOtpOrder.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingVerifyOtp = false;
            }
        )
        builder.addCase(verifyOtpOrder.rejected, (state, action) => {
            state.loadingVerifyOtp = false
        })
        ///////////////////////////////////////////////////
        builder.addCase(updateOrder.pending, state => {
            state.loadingUpdateOrder = true
        })

        builder.addCase(
            updateOrder.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingUpdateOrder = false;
            }
        )
        builder.addCase(updateOrder.rejected, (state, action) => {
            state.loadingUpdateOrder = false
        })
        ////////////////////////////////////////
        builder.addCase(getPincodeDetails.pending, state => {
            state.loadingPinCodeDetails = true
        })

        builder.addCase(
            getPincodeDetails.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingPinCodeDetails = false;
            }
        )
        builder.addCase(getPincodeDetails.rejected, (state, action) => {
            state.loadingPinCodeDetails = false
        })

        //////////////////////////////////////////////////////////
        builder.addCase(getOrderDetails.pending, state => {
            state.loadingGetOrderDetails = true
        })

        builder.addCase(
            getOrderDetails.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetOrderDetails = false;
                state.orderData = action.payload.data.data;
            }
        )
        builder.addCase(getOrderDetails.rejected, (state, action) => {
            state.loadingGetOrderDetails = false
        })
        ////////////////////////////////////////////////////////
        builder.addCase(updateOrderPostPayment.pending, state => {
            state.loadingUpdateOrderPostPayment = true
        })

        builder.addCase(
            updateOrderPostPayment.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingUpdateOrderPostPayment = false;
            }
        )
        builder.addCase(updateOrderPostPayment.rejected, (state, action) => {
            state.loadingUpdateOrderPostPayment = false
        })
        //////////////////////////////////////////////////////
        builder.addCase(getMyOrders.pending, state => {
            state.loadingGetMyOrders = true
        })

        builder.addCase(
            getMyOrders.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetMyOrders = false;
                state.totalCountMyOrders = action.payload.data.total_count;
            }
        )
        builder.addCase(getMyOrders.rejected, (state, action) => {
            state.loadingGetMyOrders = false
        })
        //////////////////////////////////////////////////////
        builder.addCase(updateOrderStatus.pending, (state) => {
            state.loadingUpdateOrderStatus = true
        })

        builder.addCase(
            updateOrderStatus.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingUpdateOrderStatus = false;
            }
        )
        builder.addCase(updateOrderStatus.rejected, (state, action) => {
            state.loadingUpdateOrderStatus = false
        })
        ////////////////////////////////////////////////////////
        builder.addCase(getOrderItemDetails.pending, state => {
            state.loadingGetOrderItemDetails = true
        })

        builder.addCase(
            getOrderItemDetails.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetOrderItemDetails = false;
                state.orderItemData = action.payload.data.data
            }
        )
        builder.addCase(getOrderItemDetails.rejected, (state, action) => {
            state.loadingGetOrderItemDetails = false
        })
    }
})

export default authSlice.reducer;