import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAdvert } from '../../models/advert';

interface ModalState {
    isOpen: boolean;
    advert?: IAdvert;
}

const initialState: ModalState = {
    isOpen: false,
};

const lockAdverModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<{advert: IAdvert }>) => {
            state.isOpen = true;
            state.advert = action.payload.advert
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.advert = undefined
        }
    },
});

export const { openModal, closeModal } = lockAdverModalSlice.actions;
export default lockAdverModalSlice.reducer;