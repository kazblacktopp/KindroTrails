import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import capitaliseString from '../../../../helpers/capitaliseString';

import classes from './CountryListPage.module.css';

export default function CountryPage() {
	const { trailLocations } = useSelector(state => state.trailData);

	const navigate = useNavigate();

	const { country_container_outer, country_container_inner, country_btn } =
		classes;

	function loadStatesHandler(event) {
		event.preventDefault();

		const countryId = event.target.id;

		localStorage.setItem('selectedCountry', countryId);

		navigate('/search/country/state');
	}

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
