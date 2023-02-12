import { useContext } from 'react';
import TrailContext from '../../../../store/trail-context';
import classes from './CountryListPage.module.css';

export default function CountryPage({ onResult }) {
	const trailCtx = useContext(TrailContext);

	const { country_container_outer, country_container_inner, country_btn } =
		classes;

	function loadStatesHandler(event) {
		event.preventDefault();

		console.log(event.target.id);

		onResult('states', event.target.id);
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
		const countriesArray = [];

		for (const country in trailCtx.trailLocations) {
			const capitalisedCountry = capitalise(country);

			console.log(country);

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
