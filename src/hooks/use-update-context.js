import { useContext } from 'react';
import TrailContext from '../store/trail-context';

export function useUpdateContext() {
	const trailCxt = useContext(TrailContext);

	function addNewTrailToContext(trailData) {
		const {
			country,
			state,
			id,
			facts: { difficulty },
		} = trailData;

		if (Object.keys(trailCxt.trailLocations).length) {
			addLocationToContext(country, state, id);
		}

		if (Object.keys(trailCxt.trailIDs).length) {
			addTrailIDToContext(id);
		}

		if (Object.keys(trailCxt.trailGrades).length) {
			addTrailGradeToContext(difficulty, id);
		}

		if (trailCxt.pendingTrails[id]) {
			updatePendingTrailInContext(id);
		}

		trailCxt.updateTrails(trailData);
	}

	function addLocationToContext(country, state, id) {
		const modifiedCountry = country.split(' ').join('_');
		const modifiedState = state.split(' ').join('_');

		const { trailLocations } = trailCxt;

		const statesObj = trailLocations[modifiedCountry]
			? trailLocations[modifiedCountry]
			: {};

		const trailsObj = statesObj[modifiedState]
			? statesObj[modifiedState]
			: {};

		trailCxt.updateTrailLocations({
			...trailLocations,
			[modifiedCountry]: {
				...statesObj,
				[modifiedState]: {
					...trailsObj,
					[id]: true,
				},
			},
		});
	}

	function addTrailIDToContext(id) {
		trailCxt.updateTrailIDs({
			...trailCxt.trailIDs,
			[id]: true,
		});
	}

	function addTrailGradeToContext(grade, id) {
		const { trailGrades } = trailCxt;

		trailCxt.updateTrailGrades({
			...trailGrades,
			[grade]: {
				...trailGrades[grade],
				[id]: true,
			},
		});
	}

	function updatePendingTrailInContext(id, pendingTrailData = null) {
		trailCxt.updatePendingTrails({
			...trailCxt.pendingTrails,
			[id]: pendingTrailData,
		});
	}

	return { addNewTrailToContext, updatePendingTrailInContext };
}
