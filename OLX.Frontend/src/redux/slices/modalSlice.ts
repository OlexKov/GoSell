import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAdvert } from '../../models/advert';

interface ModalState {
    isLockModalOpen: boolean;
    advert?: IAdvert;
    isMessageSendModalOpen: boolean;
    title?: string;
    userId?: number;
    usersIds?: number[];
    toAdmin: boolean
}

const initialState: ModalState = {
    isLockModalOpen: false,
    isMessageSendModalOpen: false,
    toAdmin: false
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
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

export const { openLockModal, closeLockModal, closeMessageSendModal, openMessageSendModal } = modalSlice.actions;
export default modalSlice.reducer;