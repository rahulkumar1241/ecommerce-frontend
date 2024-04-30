import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useApiService } from '../api/api';
import useLocalStorage from '../../utils/localStorage';

type InitialState =
    {
        loadingSignin: boolean,
        loadingSignup: boolean,
        loadingSetPassword: boolean,
        loadingSendOtp: boolean,
        sendOtpEmail: any,
        loadingVerifyOtp: boolean,
        loadingUpdateUserInfo: boolean,
        loadingVerifyOtpUpdateEmail:boolean,
        loadingSendOtpUpdateEmail:boolean
    }
const initialState: InitialState = {
    loadingSignin: false,
    loadingSignup: false,
    loadingSetPassword: false,
    loadingSendOtp: false,
    sendOtpEmail: "",
    loadingVerifyOtp: false,
    loadingUpdateUserInfo: false,
    loadingVerifyOtpUpdateEmail:false,
    loadingSendOtpUpdateEmail:false
}

const namespace = "auth"
// Generates pending, fulfilled and rejected action types

const SIGN_IN = "/api/auth/login";
const SIGN_UP = "/api/auth/signup";
const SET_PASSWORD = "/api/auth/set-password";
const SEND_OTP = "/api/auth/send-otp";
const VERIFY_OTP = "/api/auth/verify-otp";
const UPDATE_USER_INFO = "/api/cart/updateUserInfo";
const SEND_OTP_UPDATE_EMAIL = "/api/auth/send-otp-update-email";
const VERIFY_OTP_UPDATE_EMAIL = "/api/auth/verify-otp-update-email";


export const verifyOtpUpdateEmail = createAsyncThunk(`${namespace}/verifyOtpUpdateEmail`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: VERIFY_OTP_UPDATE_EMAIL }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const sendOtpUpdateEmail = createAsyncThunk(`${namespace}/sendOtpUpdateEmail`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: SEND_OTP_UPDATE_EMAIL }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const updateUserInfo = createAsyncThunk(`${namespace}/updateUserInfo`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: UPDATE_USER_INFO }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const loginUser = createAsyncThunk(`${namespace}/loginUser`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: SIGN_IN }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})

export const signupUser = createAsyncThunk(`${namespace}/signupUser`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: SIGN_UP }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const setPasswordUser = createAsyncThunk(`${namespace}/setPasswordUser`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: SET_PASSWORD }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const sendOtpUser = createAsyncThunk(`${namespace}/sendOtpUser`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: SEND_OTP }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


export const verifyOtpUser = createAsyncThunk(`${namespace}/verifyOtpUser`, async (payload: any, { rejectWithValue }) => {
    let apiPayload = { method: "POST", data: payload, url: VERIFY_OTP }
    let response: any = await useApiService(apiPayload);
    //////////////If API CRASHES//////////
    if (response.isCrash) {
        return rejectWithValue(response.error);
    }
    return response;
})


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        //////////////////////////////////////////////////////
        builder.addCase(loginUser.pending, state => {
            state.loadingSignin = true
        })
        builder.addCase(
            loginUser.fulfilled,
            (state, action: PayloadAction<any>) => {
                debugger
                state.loadingSignin = false;
                localStorage.setItem("accessToken", action.payload.data.accessToken);
                useLocalStorage.setItem("userData", action.payload.data.user);
            }
        )
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loadingSignin = false
        })
        /////////////////////////////////////////////////
        builder.addCase(signupUser.pending, state => {
            state.loadingSignup = true
        })
        builder.addCase(
            signupUser.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingSignup = false;
            }
        )
        builder.addCase(signupUser.rejected, (state, action) => {
            state.loadingSignup = false
        })
        /////////////////////////////////////////////////////
        builder.addCase(setPasswordUser.pending, state => {
            state.loadingSetPassword = true
        })
        builder.addCase(
            setPasswordUser.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingSetPassword = false;
            }
        )
        builder.addCase(setPasswordUser.rejected, (state, action) => {
            state.loadingSetPassword = false
        })
        ////////////////////////////////////////////////////
        builder.addCase(sendOtpUser.pending, state => {
            state.loadingSendOtp = true
        })
        builder.addCase(
            sendOtpUser.fulfilled,
            (state, action: PayloadAction<any>) => {
                debugger
                state.loadingSendOtp = false;
                state.sendOtpEmail = action.payload.data.email;
            }
        )
        builder.addCase(sendOtpUser.rejected, (state, action) => {
            state.loadingSendOtp = false
        })
        ///////////////////////////////////////////////////////
        builder.addCase(verifyOtpUser.pending, state => {
            state.loadingVerifyOtp = true
        })
        builder.addCase(
            verifyOtpUser.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingVerifyOtp = false;
            }
        )
        builder.addCase(verifyOtpUser.rejected, (state, action) => {
            state.loadingVerifyOtp = false
        })

        builder.addCase(updateUserInfo.pending, state => {
            state.loadingUpdateUserInfo = true
        })
        builder.addCase(
            updateUserInfo.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingUpdateUserInfo = false;
            }
        )
        builder.addCase(updateUserInfo.rejected, (state, action) => {
            state.loadingUpdateUserInfo = false
        })
        /////////////////////////////////////////////////

        builder.addCase(sendOtpUpdateEmail.pending, state => {
            state.loadingSendOtpUpdateEmail = true
        })
        builder.addCase(
            sendOtpUpdateEmail.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingSendOtpUpdateEmail = false;
                state.sendOtpEmail = action.payload.data.email;
            }
        )
        builder.addCase(sendOtpUpdateEmail.rejected, (state, action) => {
            state.loadingSendOtpUpdateEmail = false;
            
        })
        //////////////////////////////////////////
        builder.addCase(verifyOtpUpdateEmail.pending, state => {
            state.loadingVerifyOtpUpdateEmail = true
        })
        builder.addCase(
            verifyOtpUpdateEmail.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.loadingVerifyOtpUpdateEmail = false;
            }
        )
        builder.addCase(verifyOtpUpdateEmail.rejected, (state, action) => {
            state.loadingVerifyOtpUpdateEmail = false;
        })
    }
})

export default authSlice.reducer;