import { createBaseQueryWithAuth } from "./baseQuery"
import { IAdminMesssage, IAdminMesssageCreationModel, IAdminMesssagePageRequest } from "../../models/adminMesssage"
import { createApi } from "@reduxjs/toolkit/query/react"
import { PageResponse } from "../../models/user"

export const adminMessageAuthApi = createApi({
    reducerPath: 'adminMessageAuthApi',
    baseQuery: createBaseQueryWithAuth('AdminMessage'),
    tagTypes: ['Messeges', 'AdminMessages', 'UnreadedMessages'],
    endpoints: (builder) => ({

        createMessageForUser: builder.mutation<void, IAdminMesssageCreationModel>({
            query: (messageCreationModel) => {
                return {
                    url: 'send/user',
                    method: 'PUT',
                    body: messageCreationModel
                    // timeout: 10000,
                }
            },
            invalidatesTags: ['AdminMessages']
        }),

        createMessageForAdmin: builder.mutation<void, IAdminMesssageCreationModel>({
            query: (messageCreationModel) => {
                return {
                    url: 'send/admin',
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

        getAdminUnreadedMessages: builder.query<IAdminMesssage[], void>({
            query: () => {
                return {
                    url: 'get/admin/unreaded',
                    method: 'GET',
                    // timeout: 10000,
                }
            },
            providesTags: ["UnreadedMessages"]
        }),

        getUserMessagesPage: builder.query<PageResponse<IAdminMesssage>, IAdminMesssagePageRequest>({
            query: (pageRequest) => {
                return {
                    url: 'get/page',
                    method: 'POST',
                    body: pageRequest
                }
            },
            providesTags: ["Messeges"]
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

        softDeleteUserMessages: builder.mutation<void, number[]>({
            query: (ids) => {
                return {
                    url: `delete/soft`,
                    method: 'DELETE',
                    body: ids
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
                }
            },
            invalidatesTags: ['Messeges', 'UnreadedMessages']
           
        }),

        setUserMessageReadedRange: builder.mutation<void, number[]>({
            query: (ids) => {
                return {
                    url: `readed/set`,
                    method: 'POST',
                    body: ids
                }
            },
            invalidatesTags: ['Messeges', 'UnreadedMessages']
        }),

    }),
})
export const {
    useGetAdminUnreadedMessagesQuery,
    useCreateMessageForUserMutation,
    useCreateMessageForAdminMutation,
    useGetAdminMessagesQuery,
    useGetUserMessagesQuery,
    useGetUserUnreadedMessagesQuery,
    useSoftDeleteUserMessageMutation,
    useSoftDeleteUserMessagesMutation,
    useSetUserMessageReadedMutation,
    useSetUserMessageReadedRangeMutation,
    useGetUserMessagesPageQuery } = adminMessageAuthApi