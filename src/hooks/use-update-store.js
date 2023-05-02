import { useSelector, useDispatch } from 'react-redux';
import {
	updateTrails,
	updateTrailLocations,
	updateTrailIDs,
	updateTrailGrades,
	updatePendingTrails,
} from '../store/trailData-slice';

export function useUpdateStore() {
	const { trailLocations, trailIDs, trailGrades, pendingTrails } =
		useSelector(state => state.trailData);

	const dispatch = useDispatch();

	function addNewTrailToStore(trailData) {
		const {
			country,
			state,
			id,
			facts: { difficulty },
		} = trailData;

		if (Object.keys(trailLocations).length) {
			addLocationToStore(country, state, id);
		}

		if (Object.keys(trailIDs).length) {
			addTrailIDToStore(id);
		}

		if (Object.keys(trailGrades).length) {
			addTrailGradeToStore(difficulty, id);
		}

		if (pendingTrails[id]) {
			updatePendingTrailInStore(id);
		}

		dispatch(updateTrails(trailData));
	}

	function addLocationToStore(country, state, id) {
		const modifiedCountry = country.split(' ').join('_');
		const modifiedState = state.split(' ').join('_');

		const statesObj = trailLocations[modifiedCountry]
			? trailLocations[modifiedCountry]
			: {};

		const trailsObj = statesObj[modifiedState]
			? statesObj[modifiedState]
			: {};

		dispatch(
			updateTrailLocations({
				...trailLocations,
				[modifiedCountry]: {
					...statesObj,
					[modifiedState]: {
						...trailsObj,
						[id]: true,
					},
				},
			}),
		);
	}

	function addTrailIDToStore(id) {
		dispatch(
			updateTrailIDs({
				...trailIDs,
				[id]: true,
			}),
		);
	}

	function addTrailGradeToStore(grade, id) {
		dispatch(
			updateTrailGrades({
				...trailGrades,
				[grade]: {
					...trailGrades[grade],
					[id]: true,
				},
			}),
		);
	}

	function updatePendingTrailInStore(id, pendingTrailData = null) {
		dispatch(
			updatePendingTrails({
				...pendingTrails,
				[id]: pendingTrailData,
			}),
		);
	}

	return { addNewTrailToStore };
}
