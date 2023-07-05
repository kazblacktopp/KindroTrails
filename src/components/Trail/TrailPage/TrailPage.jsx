import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TrailSummary from '../TrailSummary/TrailSummary';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import RecommendedGearList from '../RecommendedGear/RecommendedGearList';
import capitaliseString from '../../../helpers/capitaliseString';

import classes from './TrailPage.module.css';

function TrailPage({ trailData = null, images = null }) {
	const { trailId } = useParams();

	const { trails } = useSelector(state => state.trailData);

	let trail = trails[trailId];

	if (trailData) {
		trail = trailData;
	}

	let { trailImages } = trail;

	if (images) {
		trailImages = images;
	}

	const { title, country, state, recommendedGear, ...summaryData } = trail;

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
		<section className={section}>
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
		</section>
	);
}

export default TrailPage;

