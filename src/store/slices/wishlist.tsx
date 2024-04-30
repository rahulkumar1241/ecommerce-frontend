import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useApiService } from '../api/api';
import useLocalStorage from '../../utils/localStorage';


type InitialState = {
    loadingGetWishlistData: boolean,
    loadingRemoveItemFromWishlist:boolean,
    loadingAddToWishlist:boolean
}
const initialState: InitialState = {
    loadingGetWishlistData: false,
    loadingRemoveItemFromWishlist:false,
    loadingAddToWishlist:false
}

const namespace = "wishlist"
// Generates pending, fulfilled and rejected action types

const GET_WISHLIST_DATA = "/api/products/getWishListItems";
const REMOVE_ITEM_FROM_WISHLIST="/api/products/removeFromWishlist";
const ADD_TO_WISHLIST="/api/products/addToWishlist";

export const addToWishlist = createAsyncThunk(`${namespace}/addToWishlist`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${ADD_TO_WISHLIST}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const getWishlistData = createAsyncThunk(`${namespace}/getWishlistData`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "GET", data: payload, url: `${GET_WISHLIST_DATA}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const removeItemFromWishlist = createAsyncThunk(`${namespace}/removeItemFromWishlist`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "DELETE", data: payload, url: `${REMOVE_ITEM_FROM_WISHLIST}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

const authSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: builder => {
        //////////////////////////////////////////////////////
        builder.addCase(getWishlistData.pending, state => {
            state.loadingGetWishlistData = true
        })

        builder.addCase(
            getWishlistData.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingGetWishlistData = false;
            }
        )
        builder.addCase(getWishlistData.rejected, (state, action) => {
            state.loadingGetWishlistData = false
        })
        //////////////////////////////////////////
        builder.addCase(removeItemFromWishlist.pending, state => {
            state.loadingRemoveItemFromWishlist = true
        })

        builder.addCase(
            removeItemFromWishlist.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingRemoveItemFromWishlist = false;
            }
        )
        builder.addCase(removeItemFromWishlist.rejected, (state, action) => {
            state.loadingRemoveItemFromWishlist = false
        })
        /////////////////////////////////////////////
        builder.addCase(addToWishlist.pending, state => {
            state.loadingAddToWishlist = true
        })

        builder.addCase(
            addToWishlist.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingAddToWishlist = false;
            }
        )
        builder.addCase(addToWishlist.rejected, (state, action) => {
            state.loadingAddToWishlist = false
        })
    }
})

export default authSlice.reducer;