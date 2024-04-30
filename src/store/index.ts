import { configureStore } from '@reduxjs/toolkit';
import authSlice from "./slices/auth";
import homepageSlice from './slices/homepage';
import productSlice from "./slices/product";
import cartSlice from "./slices/cart";
import wishlistSlice from './slices/wishlist';
import orderSlice from "./slices/order";
import commonSlice from "./slices/common";
import adminSlice from "./slices/admin";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    homepage: homepageSlice,
    product: productSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    order: orderSlice,
    common: commonSlice,
    admin: adminSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch