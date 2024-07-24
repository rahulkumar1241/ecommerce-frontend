import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useApiService } from '../api/api';
import useLocalStorage from '../../utils/localStorage';


type InitialState =
    {
        loadingGetProductData: boolean,
        loadingGetProductsByCategory: boolean,
        MAX_PRICE: number,
        MIN_PRICE: number,
        totalProductsCount: number,
        loadingGetAllProducts: boolean,
        allProductsData: Array<any>,
        search_keyword: any,
        current_page: number,
        loadingGetDropdownValues: boolean,
        dropdownValues: any,
        loadingCreateOrUpdateProduct: boolean
    }
const initialState: InitialState = {
    loadingGetProductData: false,
    loadingGetProductsByCategory: false,
    MAX_PRICE: 0,
    MIN_PRICE: 0,
    totalProductsCount: 0,
    loadingGetAllProducts: false,
    allProductsData: [],
    search_keyword: "",
    current_page: 1,
    loadingGetDropdownValues: false,
    dropdownValues: {},
    loadingCreateOrUpdateProduct: false
}


const namespace = "product"
// Generates pending, fulfilled and rejected action types

const GET_PRODUCT_DATA = "/api/products/getProduct";
const GET_PRODUCTS_BY_CATEGORY = "/api/products/getAllProductsByCategory";
const GET_ALL_PRODUCTS = "/api/products/getAllProducts";
const GET_DROPDOWN_VALUES = "/getDropdownValues";
const CREATE_OR_UPDATE_PRODUCT = "/api/admin/createOrUpdateProduct";


export const createOrUpdateProduct = createAsyncThunk(`${namespace}/createOrUpdateProduct`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${CREATE_OR_UPDATE_PRODUCT}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const getProductData = createAsyncThunk(`${namespace}/getProductData`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "GET", data: payload, url: `${GET_PRODUCT_DATA}?product_id=${payload.product_id}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const getProductsByCategory = createAsyncThunk(`${namespace}/getProductsByCategory`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${GET_PRODUCTS_BY_CATEGORY}?page_number=${payload.page_number}&page_size=${payload.page_size}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const getAllProducts = createAsyncThunk(`${namespace}/getAllProducts`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${GET_ALL_PRODUCTS}?page_number=${payload.page_number}&page_size=${payload.page_size}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const getDropdownValues = createAsyncThunk(`${namespace}/getDropdownValues`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${GET_DROPDOWN_VALUES}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetProductSlice: (state) => {
            Object.assign(state, { ...state, search_keyword: "" });
        },
        changePageNumber: (state, data: any) => {
            state.current_page = data.payload.page_number;
        }
    },
    extraReducers: builder => {
        //////////////////////////////////////////////////////
        builder.addCase(getProductData.pending, state => {
            state.loadingGetProductData = true
        })
        builder.addCase(
            getProductData.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetProductData = false;
            }
        )
        builder.addCase(getProductData.rejected, (state, action) => {
            state.loadingGetProductData = false
        })
        /////////////////////////////////////////////////
        builder.addCase(getProductsByCategory.pending, state => {
            state.loadingGetProductsByCategory = true
        })

        builder.addCase(
            getProductsByCategory.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetProductsByCategory = false;
                state.MAX_PRICE = action.payload.data.data.MAX_PRICE;
                state.MIN_PRICE = action.payload.data.data.MIN_PRICE;
                state.totalProductsCount = action.payload.data.data.total_count;
            }
        )
        builder.addCase(getProductsByCategory.rejected, (state, action) => {
            state.loadingGetProductsByCategory = false
        })

        //////////////////////////////////////////////////////////
        builder.addCase(getAllProducts.pending, state => {
            state.loadingGetAllProducts = true;
        })

        builder.addCase(
            getAllProducts.fulfilled,
            (state, action: PayloadAction<any>) => {
                let search_keyword: any = localStorage.getItem("search_keyword");
                if (!(search_keyword === null || search_keyword === undefined)) {
                    state.search_keyword = localStorage.getItem("search_keyword");
                    state.current_page = 1;
                    localStorage.removeItem("search_keyword")
                }
                state.loadingGetAllProducts = false;
                state.MAX_PRICE = action.payload.data.data.MAX_PRICE;
                state.MIN_PRICE = action.payload.data.data.MIN_PRICE;
                state.totalProductsCount = action.payload.data.data.total_count;
                state.allProductsData = action.payload.data.data.products;
            }
        )
        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.loadingGetAllProducts = false
        })
        //////////////////////////////////////////////////////
        builder.addCase(getDropdownValues.pending, state => {
            state.loadingGetDropdownValues = true
        })

        builder.addCase(
            getDropdownValues.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetDropdownValues = false;
                state.dropdownValues = action.payload.data.data;
            }
        )
        builder.addCase(getDropdownValues.rejected, (state, action) => {
            state.loadingGetDropdownValues = false
        })
        /////////////////////////////////////////
        builder.addCase(createOrUpdateProduct.pending, state => {
            state.loadingCreateOrUpdateProduct = true
        })

        builder.addCase(
            createOrUpdateProduct.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingCreateOrUpdateProduct = false;
            }
        )
        builder.addCase(createOrUpdateProduct.rejected, (state, action) => {
            state.loadingCreateOrUpdateProduct = false
        })
    }
})


export const { actions } = productSlice;
export const { resetProductSlice, changePageNumber } = actions;

export default productSlice.reducer;