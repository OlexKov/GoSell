import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAdvert } from '../../models/advert';
import { IAdminMesssage } from '../../models/adminMesssage';

interface ModalState {
    isLockModalOpen: boolean;
    advert?: IAdvert;
    isMessageSendModalOpen: boolean;
    isMessageViewModalOpen: boolean;
    title?: string;
    userId?: number;
    usersIds?: number[];
    toAdmin: boolean,
    adminMessage?: IAdminMesssage
}

const initialState: ModalState = {
    isLockModalOpen: false,
    isMessageSendModalOpen: false,
    isMessageViewModalOpen: false,
    toAdmin: false
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openMessageViewModal: (state, action: PayloadAction<{ title: string, adminMessage?: IAdminMesssage }>) => {
            state.isMessageViewModalOpen = true;
            state.title = action.payload.title
            state.adminMessage = action.payload.adminMessage
        },
        closeMessageViewModal: (state) => {
            state.isMessageViewModalOpen = false;
            state.title = undefined
            state.adminMessage = undefined
        },
        openMessageSendModal: (state, action: PayloadAction<{ title: string, userId?: number, usersIds?: number[], toAdmin?: boolean }>) => {
            state.isMessageSendModalOpen = true;
            state.title = action.payload.title
            state.userId = action.payload.userId
            state.usersIds = action.payload.usersIds
            state.toAdmin = action.payload.toAdmin ? action.payload.toAdmin : false
        },
        openLockModal: (state, action: PayloadAction<{ advert: IAdvert }>) => {
            state.isLockModalOpen = true;
            state.advert = action.payload.advert
        },
        closeLockModal: (state) => {
            state.isLockModalOpen = false;
            state.advert = undefined
        },
        closeMessageSendModal: (state) => {
            state.isMessageSendModalOpen = false;
            state.title = undefined;
            state.userId = undefined,
                state.usersIds = undefined
        }
    },
});

export const {
    openLockModal,
    closeLockModal,
    closeMessageSendModal,
    openMessageSendModal,
    openMessageViewModal,
    closeMessageViewModal } = modalSlice.actions;
export default modalSlice.reducer;