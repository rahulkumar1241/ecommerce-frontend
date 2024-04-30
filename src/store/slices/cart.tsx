import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useApiService } from '../api/api';
import useLocalStorage from '../../utils/localStorage';


type InitialState =
    {
        totalCartItem: number,
        loadingGetCartItems: boolean,
        cartItems: [],
        loadingUpdateQuantity: boolean,
        loadingAddToCart: boolean

    }
const initialState: InitialState = {
    totalCartItem: useLocalStorage.getItem("cartItems").length || 0,
    loadingGetCartItems: false,
    cartItems: [],
    loadingUpdateQuantity: false,
    loadingAddToCart: false
}

const namespace = "cart"
// Generates pending, fulfilled and rejected action types

const GET_CART_ITEMS = "/api/cart/getCartItems";
const UPADTE_QUANTITY = "/api/cart/updateQuantity";
const ADD_TO_CART = "/api/cart/addToCart";

export const getCartItems = createAsyncThunk(`${namespace}/getCartItems`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "GET", data: payload, url: `${GET_CART_ITEMS}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const handleUpdateQuantity = createAsyncThunk(`${namespace}/handleUpdateQuantity`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${UPADTE_QUANTITY}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const addToCart = createAsyncThunk(`${namespace}/addToCart`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${ADD_TO_CART}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


const authSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: builder => {
        //////////////////////////////////////////////////////
        builder.addCase(getCartItems.pending, state => {
            state.loadingGetCartItems = true
        })
        builder.addCase(
            getCartItems.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetCartItems = false;
                state.cartItems = action.payload.data.data;
                state.totalCartItem = action.payload.data.data.length;
                useLocalStorage.setItem("cartItems", action.payload.data.data);
            }
        )
        builder.addCase(getCartItems.rejected, (state, action: PayloadAction<any>) => {
            state.loadingGetCartItems = false
            if (action.payload.data.status === 404) {
                state.totalCartItem = 0;
                useLocalStorage.setItem("cartItems", []);
            }
        })
        //////////////////////////////////////////////////////////////
        builder.addCase(handleUpdateQuantity.pending, state => {
            state.loadingUpdateQuantity = true
        })
        builder.addCase(
            handleUpdateQuantity.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingUpdateQuantity = false;
                if (action.payload.data.data.quantity === 0) {
                    state.totalCartItem -= 1;

                }
            }
        )
        builder.addCase(handleUpdateQuantity.rejected, (state, action) => {
            state.loadingUpdateQuantity = false
        })
        /////////////////////////////////////////////////////////////////////
        builder.addCase(addToCart.pending, state => {
            state.loadingAddToCart = true
        })
        builder.addCase(
            addToCart.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingAddToCart = false;
                state.totalCartItem += 1;
            }
        )
        builder.addCase(addToCart.rejected, (state, action) => {
            state.loadingAddToCart = false
        })
    }
})

export default authSlice.reducer;