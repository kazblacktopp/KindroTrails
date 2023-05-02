import { configureStore } from '@reduxjs/toolkit';
import trailDataReducer from './trailData-slice';

const store = configureStore({
	reducer: {
		trailData: trailDataReducer,
	},
});

export default store;
