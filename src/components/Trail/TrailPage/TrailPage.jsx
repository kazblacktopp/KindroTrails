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

	return (
		<main>
			<div className={classes['section-container']}>
				<div className={classes['title_container']}>
					<h1>{capitalisedTitle}</h1>
					<p>
						{capitalisedState}, {capitalisedCountry}
					</p>
				</div>
				<div className={classes['top-section_container']}>
					<TrailSummary summaryData={summaryData} />
					<PhotoGallery photos={trailImages} />
				</div>
				<div className={classes['bottom-section_container']}>
					<RecommendedGearList previewGearList={recommendedGear} />
				</div>
			</div>
		</main>
	);
}

export default TrailPage;

