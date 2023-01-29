import { useState, useContext, useRef } from 'react';
import TrailContext from './store/trail-context';
import NavBar from './components/UI/Nav/NavBar';
import SearchOptions from './components/Search/SearchOptions';
import CountryPage from './components/Trail/TrailSelection/CountryPage/CountryPage';
import StatePage from './components/Trail/TrailSelection/StatePage/StatePage';
import TrailPage from './components/Trail/TrailPage/TrailPage';
import NewTrail from './components/NewTrail/NewTrail';

export default function App() {
	const trailCxt = useContext(TrailContext);
	const [addNewTrail, setAddNewTrail] = useState(false);
	const [viewTrail, setViewTrail] = useState(false);
	const [viewCountriesList, setViewCountriesList] = useState(false);
	const [viewStatesList, setViewStatesList] = useState(false);

	const selectedCountry = useRef();
	const selectedTrail = useRef();

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
	}

	function viewTrailHandler(trailID) {
		const trail = trailCxt.trails[trailID];

		selectedTrail.current = trail;
		setAddNewTrail(false);
		setViewTrail(true);
	}

	let appPages = (
		<SearchOptions onResult={displayResultHandler}></SearchOptions>
	);

	if (viewCountriesList) {
		appPages = <CountryPage onResult={displayResultHandler} />;
	}

	if (viewStatesList) {
		appPages = (
			<StatePage
				selectedCountry={selectedCountry.current}
				onResult={displayResultHandler}
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

