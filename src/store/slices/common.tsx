import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useApiService } from '../api/api';
import useLocalStorage from '../../utils/localStorage';


type InitialState =
    {
        loadingDropdownValues: boolean,
        dropdownData: any,
        loadingUploadImage: boolean
    }
const initialState: InitialState = {
    loadingDropdownValues: false,
    dropdownData: {},
    loadingUploadImage: false
}

const namespace = "common"
// Generates pending, fulfilled and rejected action types

const GET_DROPDOWN_VALUES = "/getDropdownValues";
const UPLOAD_IMAGE = "/uploadImage"


export const getDropdownValues = createAsyncThunk(`${namespace}/getDropdownValues`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: `${GET_DROPDOWN_VALUES}` }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const uploadImage = createAsyncThunk(`${namespace}/uploadImage`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = {
        method: "POST", data: payload, url: `${UPLOAD_IMAGE}`, headerInfo: {
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



const authSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {},
    extraReducers: builder => {
        //////////////////////////////////////////////////////
        builder.addCase(getDropdownValues.pending, state => {
            state.loadingDropdownValues = true
        })
        builder.addCase(
            getDropdownValues.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingDropdownValues = false;
                state.dropdownData = action.payload.data.data;
            }
        )
        builder.addCase(getDropdownValues.rejected, (state, action) => {
            state.loadingDropdownValues = false;
        })
        /////////////////////////////////////////////////////////
        builder.addCase(uploadImage.pending, state => {
            state.loadingUploadImage = true
        })
        builder.addCase(
            uploadImage.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingUploadImage = false;
            }
        )
        builder.addCase(uploadImage.rejected, (state, action) => {
            state.loadingUploadImage = false;
        })
    }
})

export default authSlice.reducer;