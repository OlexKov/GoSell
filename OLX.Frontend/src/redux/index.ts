import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice'
import appReducer from './slices/appSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountApi } from "./api/accountApi";
import errorMiddleware from "./middlewares/errorMiddleware";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { userAuthApi } from "./api/userAuthApi";
import { accountApiAuth } from "./api/accountAuthApi";
import { adminMessageAuthApi } from "./api/adminMessageApi";
import { filterApi } from "./api/filterApi";
import { filterAuthApi } from "./api/filterAuthApi";
import { categoryApi } from "./api/categoryApi";
import { categoryAuthApi } from "./api/categoryAuthApi";
import { advertApi } from "./api/advertApi";
import { advertAuthApi } from "./api/advertAuthApi";
import { newPostApi } from "./api/newPostApi";
import { chatAuthApi } from "./api/chatAuthApi";


export const store = configureStore({
    reducer: {
        user: userReducer,
        app: appReducer,
        [userAuthApi.reducerPath]: userAuthApi.reducer,
        [filterApi.reducerPath]: filterApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [categoryAuthApi.reducerPath]: categoryAuthApi.reducer,
        [filterAuthApi.reducerPath]: filterAuthApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [adminMessageAuthApi.reducerPath]: adminMessageAuthApi.reducer,
        [accountApiAuth.reducerPath]: accountApiAuth.reducer,
        [advertApi.reducerPath]: advertApi.reducer,
        [advertAuthApi.reducerPath]: advertAuthApi.reducer,
        [newPostApi.reducerPath]: newPostApi.reducer,
        [chatAuthApi.reducerPath]: chatAuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            accountApi.middleware,
            userAuthApi.middleware,
            adminMessageAuthApi.middleware,
            accountApiAuth.middleware,
            categoryApi.middleware,
            categoryAuthApi.middleware,
            filterApi.middleware,
            filterAuthApi.middleware,
            advertApi.middleware,
            advertAuthApi.middleware,
            newPostApi.middleware,
            chatAuthApi.middleware,
            errorMiddleware)
})
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector