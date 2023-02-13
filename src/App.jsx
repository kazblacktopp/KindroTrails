import { useState, useRef } from 'react';
import NavBar from './components/UI/Nav/NavBar';
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

	const selectedCountry = useRef(null);
	const selectedState = useRef(null);
	const selectedTrail = useRef(null);

	// Set showAddBtn to true if user is logged in and has admin permissions
	const [showAddBtn, setShowAddBtn] = useState(true);

	function clickHomeHandler() {
		setAddNewTrail(false);
		setViewTrail(false);
		setViewCountriesList(false);
		setViewStatesList(false);

		// TODO: If user is logged in and has admin permissions:
		setShowAddBtn(true);
	}

	function addNewTrailHandler() {
		setAddNewTrail(true);
		setShowAddBtn(false);
	}

	function closeNewTrailFormHandler() {
		setAddNewTrail(false);
		setShowAddBtn(true);
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
		appPages = (
			<TrailPage
				trailData={selectedTrail.current}
				trailImages={selectedTrail.current.trailImages}
			/>
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
		<div className="app_container">
			<header className="top_header">
				<NavBar onClickHome={clickHomeHandler}></NavBar>
				{!addNewTrail && showAddBtn && (
					<button
						className="new_trail_btn btn btn_blue"
						onClick={addNewTrailHandler}
					>
						Add New Trail
					</button>
				)}
			</header>
			{appPages}
		</div>
	);
}

