import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "./baseQuery";
import { IBackupFileInfo } from "../../models/backup";
import { getFormData } from "../../utilities/common_funct";

export const backupAuthApi = createApi({
    reducerPath: "backupAuthApi",
    baseQuery: createBaseQueryWithAuth("Backup"),
    tagTypes: ["BackupFiles"],

    endpoints: (builder) => ({
        deleteBackupFile: builder.mutation<void, string>({
            query: (backupName) => ({
                url: `delete?backupName=${backupName}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BackupFiles"]
        }),

        createBackupFile: builder.mutation<void, void>({
            query: () => ({
                url: `backup`,
                method: "POST",
            }),
            invalidatesTags: ["BackupFiles"]
        }),

        addBackupFile: builder.mutation<void, { backupFile: File }>({
            query: (backupRequest) => ({
                url: `add`,
                method: "PUT",
                body: getFormData(backupRequest)
            }),
            invalidatesTags: ["BackupFiles"]
        }),

        restoreDatabase: builder.mutation<void, string>({
            query: (backupName) => ({
                url: `restore?backupName=${backupName}`,
                method: "POST",
            })
        }),


        getBackupInfo: builder.query<IBackupFileInfo[], void>({
            query: () => ({
                url: `info`,
                method: "GET",
            }),
            providesTags: ["BackupFiles"],
        }),

        getBackupFile: builder.query<Blob, string>({
            query: (backupName) => ({
                url: `get?backupName=${backupName}`,
                method: "GET",
                responseHandler: async (response) => response.blob(),
            })
        }),


    }),
});

export const {
    useGetBackupInfoQuery,
    useLazyGetBackupFileQuery,
    useDeleteBackupFileMutation,
    useCreateBackupFileMutation,
    useAddBackupFileMutation,
    useRestoreDatabaseMutation
} = backupAuthApi;