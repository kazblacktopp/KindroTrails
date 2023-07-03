import { json, useNavigate, useLoaderData } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { queryDatabase } from '../../../../services/apiFirebase';
import capitaliseString from '../../../../helpers/capitaliseString';

import classes from './CountryListPage.module.css';
import { updateTrailLocations } from '../../../../store/trailData-slice';

export default function CountryPage() {
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const trailLocations = useLoaderData();

	dispatch(updateTrailLocations(trailLocations));

	function loadStatesHandler(event) {
		event.preventDefault();

		const countryId = event.target.id;

		navigate(`/search/${countryId}`);
	}

	const { country_container_outer, country_container_inner, country_btn } =
		classes;

	function generateJSX() {
		const countriesArray = [];

		for (const country in trailLocations) {
			const capitalisedCountry = capitaliseString(country);

			countriesArray.push(
				<li key={`country_${countriesArray.length + 1}`}>
					<button
						id={country}
						className={`btn btn_green ${country_btn}`}
						onClick={loadStatesHandler}
					>
						{capitalisedCountry}
					</button>
				</li>,
			);
		}

		return countriesArray;
	}

	const searchPageContent = generateJSX();

	return (
		<div className={country_container_outer}>
			<h1>Search by Country</h1>
			<h2>Choose a country:</h2>
			<ul className={country_container_inner}>{searchPageContent}</ul>
		</div>
	);
}

export async function loader() {
	const queryResult = await queryDatabase({
		queryType: 'trailLocations',
	});
	if (!queryResult) {
		throw json(
			{
				message: 'Could not fetch country locations',
			},
			{
				status: 500,
			},
		);
	} else {
		return queryResult;
	}
}
