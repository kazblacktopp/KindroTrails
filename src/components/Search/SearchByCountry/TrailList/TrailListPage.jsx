import { useSelector, useDispatch } from 'react-redux';
import {
	updateTrails,
	updateTrailIDs,
} from '../../../../store/trailData-slice';
import { useDatabase } from '../../../../hooks/use-database';
import Spinner from '../../../UI/Spinner/Spinner';

import classes from './TrailListPage.module.css';

export default function TrailListPage({
	selectedCountry,
	selectedState,
	onResult,
}) {
	const { trails, trailIDs, trailLocations } = useSelector(
		state => state.trailData,
	);

	const dispatch = useDispatch();

	const { queryDatabase, isLoading, error } = useDatabase();

	const capitalisedState = capitalise(selectedState);

	const { trail_container_outer, trail_container_inner, trail_btn } = classes;

	async function loadTrailsHandler(event) {
		event.preventDefault();

		const trailID = event.target.id;

		if (!trailID) return;

		let trail;

		try {
			if (!trails[trailID]) {
				const trailResult = await queryDatabase({
					queryType: 'trails',
					queryID: trailID,
				});

				if (!trailResult) {
					throw new Error(
						'The database did not return a query result.',
					);
				}

				dispatch(updateTrails(trailResult));

				dispatch(
					updateTrailIDs({
						...trailIDs,
						[trailID]: true,
					}),
				);

				trail = trailResult;
			} else {
				trail = trails[trailID];
			}

			onResult(trail);
		} catch (err) {
			console.error('loadTrailsHandler: ', err);
		}
	}

	function capitalise(string) {
		const stringArray = string.split('_');

		const capitalisedString = stringArray
			.map(stringEl => {
				return stringEl[0].toUpperCase() + stringEl.substring(1);
			})
			.join(' ');

		return capitalisedString;
	}

	function generateJSX() {
		const countryObj = trailLocations[selectedCountry];

		const trailElArray = [];

		for (const trailID in countryObj[selectedState]) {
			const capitalisedTrail = capitalise(trailID);

			trailElArray.push(
				<li key={`trail_${trailElArray.length + 1}`}>
					<button
						id={trailID}
						className={`btn btn_red ${trail_btn}`}
						onClick={loadTrailsHandler}
					>
						{capitalisedTrail}
					</button>
				</li>,
			);
		}

		return trailElArray;
	}

	let searchPageContent = generateJSX();

	if (isLoading) {
		searchPageContent = (
			<div className="container_centered">
				<Spinner />
			</div>
		);
	}

	if (error) {
		alert(error);
	}

	return (
		<div className={trail_container_outer}>
			<h1>{capitalisedState}</h1>
			<h2>Choose a trail:</h2>
			<ul className={trail_container_inner}>{searchPageContent}</ul>
		</div>
	);
}
