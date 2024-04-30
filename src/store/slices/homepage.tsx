import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useApiService } from '../api/api';
import useLocalStorage from '../../utils/localStorage';

type InitialState =
    {
        loadingHomepageData: boolean,
        homepageData: any,
        totalProductsCount: number
    }
const initialState: InitialState = {
    loadingHomepageData: false,
    homepageData: {},
    totalProductsCount: 0
}

const namespace = "homepage"
// Generates pending, fulfilled and rejected action types

const HOMEPAGE = "/dashboard";


export const getAllHomepageData = createAsyncThunk(`${namespace}/getAllHomepageData`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "GET", url: HOMEPAGE }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})



const authSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {},
    extraReducers: builder => {
        //////////////////////////////////////////////////////
        builder.addCase(getAllHomepageData.pending, state => {
            state.loadingHomepageData = true
        })
        builder.addCase(
            getAllHomepageData.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingHomepageData = false;
                state.homepageData = action.payload.data.data;
                let totalCount = 0;
                action.payload.data.data.product_with_categories.map((value: any, index: any) => {
                    totalCount += value.total
                })
                state.totalProductsCount = totalCount;
            }
        )
        builder.addCase(getAllHomepageData.rejected, (state, action) => {
            state.loadingHomepageData = false
        })
        /////////////////////////////////////////////////
    }
})

export default authSlice.reducer;