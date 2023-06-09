import { useState, useRef } from 'react';
import NavBar from './components/UI/Nav/NavBar.tsx';
import SearchOptions from './components/Search/SearchOptions';
import CountryListPage from './components/Search/SearchByCountry/CountryList/CountryListPage';
import StateListPage from './components/Search/SearchByCountry/StateList/StateListPage';
import TrailListPage from './components/Search/SearchByCountry/TrailList/TrailListPage';
import TrailPage from './components/Trail/TrailPage/TrailPage';
import NewTrail from './components/NewTrail/NewTrail';

export default function App() {
	const [addNewTrail, setAddNewTrail] = useState(false);
	const [viewTrail, setViewTrail] = useState(false);
	const [viewCountriesList, setViewCountriesList] = useState(false);
	const [viewStatesList, setViewStatesList] = useState(false);
	const [viewTrailsList, setViewTrailsList] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const selectedCountry = useRef(null);
	const selectedState = useRef(null);
	const selectedTrail = useRef(null);

	function clickHomeHandler() {
		setAddNewTrail(false);
		setViewTrail(false);
		setViewCountriesList(false);
		setViewStatesList(false);
	}

	function addNewTrailHandler() {
		setAddNewTrail(true);
	}

	function closeNewTrailFormHandler() {
		setAddNewTrail(false);
	}

	function displayResultHandler(resultType, resultID = null) {
		if (resultType === 'countries') {
			setViewCountriesList(true);
		}

		if (resultType === 'states') {
			setViewCountriesList(false);
			setViewStatesList(true);
			selectedCountry.current = resultID;
		}

		if (resultType === 'trails') {
			setViewStatesList(false);
			setViewTrailsList(true);
			selectedState.current = resultID;
		}
	}

	function viewTrailHandler(trail) {
		setViewTrailsList(false);
		setAddNewTrail(false);
		setViewTrail(true);

		selectedTrail.current = trail;
	}

	let appPages = (
		<SearchOptions onResult={displayResultHandler}></SearchOptions>
	);

	if (viewCountriesList) {
		appPages = <CountryListPage onResult={displayResultHandler} />;
	}

	if (viewStatesList) {
		appPages = (
			<StateListPage
				selectedCountry={selectedCountry.current}
				onResult={displayResultHandler}
			/>
		);
	}

	if (viewTrailsList) {
		appPages = (
			<TrailListPage
				selectedCountry={selectedCountry.current}
				selectedState={selectedState.current}
				onResult={viewTrailHandler}
			/>
		);
	}

	if (viewTrail) {
		const { trailImages, ...trailData } = selectedTrail.current;

		appPages = (
			<TrailPage trailData={trailData} trailImages={trailImages} />
		);
	}

	if (addNewTrail) {
		appPages = (
			<NewTrail
				onClose={closeNewTrailFormHandler}
				onViewTrail={viewTrailHandler}
			/>
		);
	}

	return (
		<>
			<header>
				<NavBar
					onClickHome={clickHomeHandler}
					onClickAddTrail={addNewTrailHandler}
					isAuth={isAuthenticated}
				/>
			</header>
			<main>{appPages}</main>
			<footer></footer>
		</>
	);
}

