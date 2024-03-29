import { createSlice } from '@reduxjs/toolkit';
import initialTrailState from '../config/newTrailPreviewConfig';

const initialTrailDataState = {
	trails: {},
	gearList: {},
	trailIDs: {},
	trailGrades: {},
	pendingTrails: {},
	trailLocations: {},
	newTrailPreview: initialTrailState,
};

const trailDataSlice = createSlice({
	name: 'trailData',
	initialState: initialTrailDataState,
	reducers: {
		updateTrails(state, action) {
			const { id } = action.payload;
			state.trails[id] = action.payload;
		},
		updateGearList(state, action) {
			state.gearList = action.payload;
		},
		updateTrailIDs(state, action) {
			state.trailIDs = action.payload;
		},
		updateTrailGrades(state, action) {
			state.trailGrades = action.payload;
		},
		updatePendingTrails(state, action) {
			state.pendingTrails = action.payload;
		},
		updateTrailLocations(state, action) {
			state.trailLocations = action.payload;
		},
		updateNewTrailPreview(state, action) {
			state.newTrailPreview = action.payload;
		},
	},
});

export const {
	updateTrails,
	updateGearList,
	updateTrailIDs,
	updateTrailGrades,
	updatePendingTrails,
	updateTrailLocations,
	updateNewTrailPreview,
} = trailDataSlice.actions;

export default trailDataSlice.reducer;
