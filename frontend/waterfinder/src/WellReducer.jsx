import { createSlice } from '@reduxjs/toolkit';
import { wells } from './Data';

const wellSlice = createSlice({
	name: 'wells',
	initialState: wells,
	reducers: {},
});

export default wellSlice.reducer;
