import { useSelector } from 'react-redux';
import capitaliseString from '../../../../helpers/capitaliseString';

import classes from './StateListPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function StatePage() {
	const { trailLocations } = useSelector(state => state.trailData);

	const navigate = useNavigate();

	const { countryId } = useParams();

	const capitalisedCountry = capitaliseString(countryId);

	const { state_container_outer, state_container_inner, state_btn } = classes;

	function loadStatesHandler(event) {
		event.preventDefault();

		const stateId = event.target.id;

		navigate(`/search/${countryId}/${stateId}`);
	}

	function generateJSX() {
		const statesArray = [];

		for (const state in trailLocations[countryId]) {
			const capitalisedState = capitaliseString(state);

			statesArray.push(
				<li key={`state_${statesArray.length + 1}`}>
					<button
						id={state}
						className={`btn btn_blue ${state_btn}`}
						onClick={loadStatesHandler}
					>
						{capitalisedState}
					</button>
				</li>,
			);
		}

		return statesArray;
	}

	const searchPageContent = generateJSX();

	return (
		<div className={state_container_outer}>
			<h1>{capitalisedCountry}</h1>
			<h2>Choose a state/region:</h2>
			<ul className={state_container_inner}>{searchPageContent}</ul>
		</div>
	);
}
