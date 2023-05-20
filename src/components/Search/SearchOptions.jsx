import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTrailLocations } from '../../store/trailData-slice';
import { useDatabase } from '../../hooks/use-database';
import Spinner from '../UI/Spinner/Spinner';
import classes from './SearchOptions.module.css';

export default function SearchOptions({ onResult }) {
	const { trailLocations } = useSelector(state => state.trailData);

	const dispatch = useDispatch();

	const { queryDatabase, isLoading, error } = useDatabase();

	const {
		search_container_outer,
		search_container_inner,
		search_btn,
		coming_soon,
	} = classes;

	const countryBtnClasses = `btn btn_green ${search_btn}`;
	const nameBtnClasses = `btn_blue ${search_btn} ${coming_soon}`;
	const gradeBtnClasses = `btn_red ${search_btn} ${coming_soon}`;

	async function searchByCountryHandler() {
		try {
			if (!Object.keys(trailLocations).length) {
				const queryResult = await queryDatabase({
					queryType: 'trailLocations',
				});

				if (!queryResult) {
					throw new Error(
						'The database did not return a query result.',
					);
				}

				dispatch(updateTrailLocations(queryResult));
			}

			onResult('countries');
		} catch (err) {
			console.error('searchByCountryHandler: ', err);
		}
	}

	let searchPageContent = (
		<Fragment>
			<button
				className={countryBtnClasses}
				onClick={searchByCountryHandler}
			>
				Search By Country
			</button>
			<button className={nameBtnClasses}>Search By Trail Name</button>
			<button className={gradeBtnClasses}>Search By Grade</button>
		</Fragment>
	);

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
		<div className={search_container_outer}>
			<h2>Search for a trail:</h2>
			<div className={search_container_inner}>{searchPageContent}</div>
		</div>
	);
}
