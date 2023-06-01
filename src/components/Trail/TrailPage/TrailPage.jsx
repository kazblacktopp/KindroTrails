import TrailSummary from '../TrailSummary/TrailSummary';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import RecommendedGearList from '../RecommendedGear/RecommendedGearList';
import capitaliseString from '../../../helpers/capitaliseString';

import classes from './TrailPage.module.css';

function TrailPage({ trailData, trailImages }) {
	const { title, country, state, recommendedGear, ...summaryData } =
		trailData;

	const capitalisedTitle = capitaliseString(title);
	const capitalisedCountry = capitaliseString(country);
	const capitalisedState = capitaliseString(state);

	const {
		section,
		section_container,
		title_container,
		top_section_container,
	} = classes;

	return (
		<main className={section}>
			<div className={section_container}>
				<div className={title_container}>
					<h1>{capitalisedTitle}</h1>
					<p>
						{capitalisedState}, {capitalisedCountry}
					</p>
				</div>
				<div className={top_section_container}>
					<TrailSummary summaryData={summaryData} />
					<PhotoGallery photos={trailImages} />
				</div>
			</div>
			<div className={section_container}>
				<RecommendedGearList trailGearList={recommendedGear} />
			</div>
		</main>
	);
}

export default TrailPage;

