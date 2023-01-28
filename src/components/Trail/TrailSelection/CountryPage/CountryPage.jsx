import { useContext } from 'react';
import TrailContext from '../../../../store/trail-context';
import classes from './CountryPage.module.css';

export default function CountryPage({ onResult }) {
	const trailCtx = useContext(TrailContext);

	const { country_container_outer, country_container_inner, country_btn } =
		classes;

	function generateCountriesJSX() {
		const countriesArray = [];

		for (const country in trailCtx.trailLocations) {
			const stringArray = country.split('_');

			const capitalisedCountry = stringArray
				.map(stringEl => {
					return stringEl[0].toUpperCase() + stringEl.substring(1);
				})
				.join(' ');

			countriesArray.push(
				<li key={`country_${countriesArray.length + 1}`}>
					<button
						id={country}
						className={`btn btn_green ${country_btn}`}
						onClick={loadStatesHandler}
					>
						<span>{capitalisedCountry}</span>
					</button>
				</li>,
			);
		}

		return countriesArray;
	}

	function loadStatesHandler(event) {
		event.preventDefault();

		onResult('states', event.target.id);
	}

	const searchPageContent = generateCountriesJSX();

	return (
		<div className={country_container_outer}>
			<h2>Choose a country:</h2>
			<ul className={country_container_inner}>{searchPageContent}</ul>
		</div>
	);
}
