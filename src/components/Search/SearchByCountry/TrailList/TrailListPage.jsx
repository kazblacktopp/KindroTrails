import { useSelector, useDispatch } from 'react-redux';
import {
	updateTrails,
	updateTrailIDs,
	updateGearList,
} from '../../../../store/trailData-slice';
import { useDatabase } from '../../../../hooks/use-database';
import Spinner from '../../../UI/Spinner/Spinner';
import capitaliseString from '../../../../helpers/capitaliseString';

import classes from './TrailListPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function TrailListPage() {
	const { trails, trailIDs, trailLocations, gearList } = useSelector(
		state => state.trailData,
	);

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const { queryDatabase, isLoading, error } = useDatabase();

	const { countryId, stateId } = useParams();

	const capitalisedState = capitaliseString(stateId);

	const { trail_container_outer, trail_container_inner, trail_btn } = classes;

	async function loadTrailsHandler(event) {
		event.preventDefault();

		const trailId = event.target.id;

		if (!trailId) return;

		try {
			if (!trails[trailId]) {
				const trailResult = await queryDatabase({
					queryType: 'trails',
					queryID: trailId,
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
						[trailId]: true,
					}),
				);
			}

			if (Object.keys(gearList).length === 0) {
				const list = await queryDatabase({
					queryType: 'gearList',
				});

				dispatch(updateGearList(list));
			}

			navigate(`/trail/${trailId}`);
		} catch (err) {
			console.error('loadTrailsHandler: ', err);
		}
	}

	function generateJSX() {
		const countryObj = trailLocations[countryId];

		const trailElArray = [];

		for (const trailID in countryObj[stateId]) {
			const capitalisedTrail = capitaliseString(trailID);

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
