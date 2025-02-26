import { createBaseQueryWithAuth } from "./baseQuery"
import { IAdminMesssage, IAdminMesssageCreationModel } from "../../models/adminMesssage"
import { createApi } from "@reduxjs/toolkit/query/react"

export const adminMessageAuthApi = createApi({
    reducerPath: 'adminMessageAuthApi',
    baseQuery: createBaseQueryWithAuth('AdminMessage'),
    tagTypes: ['Messeges', 'AdminMessages', 'UnreadedMessages'],
    endpoints: (builder) => ({

        createAdminMessage: builder.mutation<IAdminMesssage, IAdminMesssageCreationModel>({
            query: (messageCreationModel) => {
                return {
                    url: 'create/admin',
                    method: 'PUT',
                    body: messageCreationModel
                    // timeout: 10000,
                }
            },
            invalidatesTags: ['AdminMessages']
        }),

        createUserMessage: builder.mutation<IAdminMesssage, IAdminMesssageCreationModel>({
            query: (messageCreationModel) => {
                return {
                    url: 'create/user',
                    method: 'PUT',
                    body: messageCreationModel
                    // timeout: 10000,
                }
            },
            invalidatesTags: ['Messeges']
        }),

        getAdminMessages: builder.query<IAdminMesssage[], void>({
            query: () => {
                return {
                    url: 'get/admin',
                    method: 'GET',
                    // timeout: 10000,
                }
            },
            providesTags: ["AdminMessages"],
        }),

        getUserMessages: builder.query<IAdminMesssage[], void>({
            query: () => {
                return {
                    url: 'get/user',
                    method: 'GET',
                    // timeout: 10000,
                }
            },
            providesTags: ["Messeges"]
        }),

        getUserUnreadedMessages: builder.query<IAdminMesssage[], void>({
            query: () => {
                return {
                    url: 'get/user/unreaded',
                    method: 'GET',
                    // timeout: 10000,
                }
            },
            providesTags: ["UnreadedMessages"]
        }),

        softDeleteUserMessage: builder.mutation<void, number>({
            query: (id) => {
                return {
                    url: `delete/soft/${id}`,
                    method: 'DELETE',

                    // timeout: 10000,
                }
            },
            invalidatesTags: ['Messeges', 'UnreadedMessages']
        }),

        setUserMessageReaded: builder.mutation<void, number>({
            query: (id) => {
                return {
                    url: `readed/set/${id}`,
                    method: 'POST',

                    // timeout: 10000,
                }
            },
            invalidatesTags: ['Messeges', 'UnreadedMessages']
        }),


    }),
})
export const {
    useCreateAdminMessageMutation,
    useCreateUserMessageMutation,
    useGetAdminMessagesQuery,
    useGetUserMessagesQuery,
    useGetUserUnreadedMessagesQuery,
    useSoftDeleteUserMessageMutation,
    useSetUserMessageReadedMutation } = adminMessageAuthApi