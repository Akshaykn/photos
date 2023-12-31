import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    photos: [],
};

const photosSlice = createSlice({
    name: 'photos',
    initialState,
    reducers: {}
});



export default photosSlice.reducer;