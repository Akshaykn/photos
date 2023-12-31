import { configureStore } from "@reduxjs/toolkit";
import filterReducer from './filters';
import photosReducer from './photos';

export const store = configureStore({
  reducer: {
    filtersSlice : filterReducer,
    photosSlice: photosReducer
  },  
});