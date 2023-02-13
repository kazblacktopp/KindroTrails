import { useReducer } from 'react';
import TrailContext from './trail-context';

const initialTrailState = {
	trails: {},
	trailIDs: {},
	trailGrades: {},
	pendingTrails: {},
	trailLocations: {},
};

function toLocalStorage(trailStateObj) {
	console.log('For Local Storage: ', trailStateObj);
}

function trailStateReducer(state, action) {
	const updatedTrails = { ...state.trails };
	let updatedTrailIDs = state.trailIDs;
	let updatedTrailGrades = state.trailGrades;
	let updatedPendingTrails = state.pendingTrails;
	let updatedTrailLocations = state.trailLocations;

	if (action.type === 'TRAILS') {
		const { id } = action.item;

		updatedTrails[id] = action.item;
	}

	if (action.type === 'TRAILIDS') {
		updatedTrailIDs = action.item;
	}

	if (action.type === 'GRADES') {
		updatedTrailGrades = action.item;
	}

	if (action.type === 'PENDING') {
		updatedPendingTrails = action.item;
	}

	if (action.type === 'LOCATIONS') {
		updatedTrailLocations = action.item;
	}

	const updatedTrailCtx = {
		trails: updatedTrails,
		trailIDs: updatedTrailIDs,
		trailGrades: updatedTrailGrades,
		pendingTrails: updatedPendingTrails,
		trailLocations: updatedTrailLocations,
	};

	toLocalStorage(updatedTrailCtx);

	return updatedTrailCtx;
}

export default function TrailProvider({ children }) {
	const [trailState, dispatchTrailReducer] = useReducer(
		trailStateReducer,
		initialTrailState,
	);

	const trailContext = {
		trails: trailState.trails,
		trailIDs: trailState.trailIDs,
		trailGrades: trailState.trailGrades,
		pendingTrails: trailState.pendingTrails,
		trailLocations: trailState.trailLocations,
		updateTrails: updateTrailsHandler,
		updateTrailIDs: updateTrailIDsHandler,
		updateTrailGrades: updateTrailGradesHandler,
		updatePendingTrails: updatePendingTrailsHandler,
		updateTrailLocations: updateTrailLocationsHandler,
	};

	function updateTrailsHandler(trailData) {
		dispatchTrailReducer({ type: 'TRAILS', item: trailData });
	}

	function updateTrailIDsHandler(trailIDsObj) {
		dispatchTrailReducer({ type: 'TRAILIDS', item: trailIDsObj });
	}

	function updateTrailGradesHandler(gradesObj) {
		dispatchTrailReducer({ type: 'GRADES', item: gradesObj });
	}

	function updatePendingTrailsHandler(pendingObj) {
		dispatchTrailReducer({ type: 'PENDING', item: pendingObj });
	}

	function updateTrailLocationsHandler(locationsObj) {
		dispatchTrailReducer({ type: 'LOCATIONS', item: locationsObj });
	}

	return (
		<TrailContext.Provider value={trailContext}>
			{children}
		</TrailContext.Provider>
	);
}
