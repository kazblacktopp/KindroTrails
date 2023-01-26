import { Fragment, useContext } from 'react';
import { useDatabase } from '../../hooks/use-database';
import TrailContext from '../../store/trail-context';
import classes from './SearchOptions.module.css';

export default function SearchOptions(props) {
	const { queryDatabase, isLoading, error } = useDatabase();
	const trailCtx = useContext(TrailContext);

	const { search_container_outer, search_container_inner, search_btn, soon } =
		classes;

	const countryBtnClasses = `btn btn_green ${search_btn}`;
	const nameBtnClasses = `btn_blue ${search_btn} ${soon}`;
	const gradeBtnClasses = `btn_red ${search_btn} ${soon}`;

	function searchByCountryHandler() {
		queryDatabase({
			queryType: 'trailLocations',
			dataProcessFn: updateTrailLocations,
		});
	}

	function updateTrailLocations(locationsObj) {
		console.log(locationsObj);

		trailCtx.updateTrailLocations(locationsObj);
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
		searchPageContent = <p>Loading....</p>;
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
