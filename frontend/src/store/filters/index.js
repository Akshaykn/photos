import { createSlice } from '@reduxjs/toolkit';
import { photosFilters } from './../../constants';

const initialState = {
  filters: [...photosFilters],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {

  }
})

export default filtersSlice.reducer;