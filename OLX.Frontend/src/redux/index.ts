import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice'
import appReducer from './slices/appSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountApi } from "./api/accountApi";
import errorMiddleware from "./middlewares/errorMiddleware";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { userAuthApi } from "./api/userAuthApi";
import { adminMessageAuthApi } from "./api/adminMessageApi";


export const store = configureStore({
    reducer: {
        user: userReducer,
        app: appReducer,
        [userAuthApi.reducerPath]: userAuthApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [adminMessageAuthApi.reducerPath]: adminMessageAuthApi.reducer,
        // [accountApiAuth.reducerPath]: accountApiAuth.reducer,
        // [categoryApi.reducerPath]: categoryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            accountApi.middleware,
            userAuthApi.middleware,
            adminMessageAuthApi.middleware,
            errorMiddleware)
})
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

