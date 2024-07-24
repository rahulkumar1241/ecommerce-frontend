import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useApiService } from '../api/api';
import useLocalStorage from '../../utils/localStorage';

type InitialState =
    {
        loadingUploadProductSheet: boolean,
        loadingGetAllOrderItemsInfo: boolean,
        allOrderItemsData: any,
        totalOrderItemsCount: any,
        loadingGetDashboardData: any,
        dashboardData: any,
        loadingAddMember:boolean
    }

const initialState: InitialState = {
    loadingUploadProductSheet: false,
    loadingGetAllOrderItemsInfo: false,
    allOrderItemsData: [],
    totalOrderItemsCount: 0,
    loadingGetDashboardData: false,
    dashboardData: {},
    loadingAddMember:false
}

const namespace = "admin"
// Generates pending, fulfilled and rejected action types

const UPLOAD_PRODUCT_SHEET = "/api/admin/uploadProductSheet";
const GET_ALL_ORDER_ITEMS_INFO = "/api/admin/getAllOrders";
const DASHBOARD_DATA = "/api/admin/dashboard";
const ADD_MEMBER="/api/admin/add-account";


export const getDashboardData = createAsyncThunk(`${namespace}/getDashboardData`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = {
        method: "GET", data: payload, url: `${DASHBOARD_DATA}`
    }

    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const uploadProductSheet = createAsyncThunk(`${namespace}/uploadProductSheet`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = {
        method: "POST", data: payload, url: UPLOAD_PRODUCT_SHEET, headerInfo: {
            "Content-Type": "multipart/form-data"
        }
    }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const getAllOrdersInfo = createAsyncThunk(`${namespace}/getAllOrdersInfo`, async (payload: any, { rejectWithValue }) => {
    let apiPayload =
    {
        method: "POST", data: payload, url: `${GET_ALL_ORDER_ITEMS_INFO}?page_number=${payload.page_number}&page_size=${payload.page_size}`
    }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const addMember = createAsyncThunk(`${namespace}/addMember`, async (payload: any, { rejectWithValue }) => {
    let apiPayload ={method: "POST", data: payload, url: `${ADD_MEMBER}`}

    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(uploadProductSheet.pending, state => {
            state.loadingUploadProductSheet = true
        })
        builder.addCase(
            uploadProductSheet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingUploadProductSheet = false;
            }
        )
        builder.addCase(uploadProductSheet.rejected, (state, action) => {
            state.loadingUploadProductSheet = false
        })

        //////////////////////////////////////////////
        builder.addCase(getAllOrdersInfo.pending, state => {
            state.loadingGetAllOrderItemsInfo = true
        })
        builder.addCase(
            getAllOrdersInfo.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetAllOrderItemsInfo = false;
                state.allOrderItemsData = action.payload.data.data;
                state.totalOrderItemsCount = action.payload.data.total_count;
            }
        )
        builder.addCase(getAllOrdersInfo.rejected, (state, action) => {
            state.loadingGetAllOrderItemsInfo = false
        })
        /////////////////////////////////////////////////
        builder.addCase(getDashboardData.pending, state => {
            state.loadingGetDashboardData = true
        })
        builder.addCase(
            getDashboardData.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetDashboardData = false;
                state.dashboardData = action.payload.data.data;
            }
        )
        builder.addCase(getDashboardData.rejected, (state, action) => {
            state.loadingGetDashboardData = false
        })
        ///////////////////////////////////
        builder.addCase(addMember.pending, state => {
            state.loadingAddMember = true
        })

        builder.addCase(
            addMember.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingAddMember = false;
            }
        )
        builder.addCase(addMember.rejected, (state, action) => {
            state.loadingAddMember = false
        })
    }
})

export default adminSlice.reducer;