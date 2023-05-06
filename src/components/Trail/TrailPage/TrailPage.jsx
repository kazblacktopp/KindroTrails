import TrailSummary from '../TrailSummary/TrailSummary';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import RecommendedGearList from '../RecommendedGear/RecommendedGearList';
import classes from './TrailPage.module.css';

function TrailPage({ trailData, trailImages }) {
	const { title, country, state, recommendedGear, ...summaryData } =
		trailData;

	function capitaliseString(string) {
		const stringArray = string.toLowerCase().split(' ');

		const capitalisedString = stringArray
			.map(stringEl => {
				return stringEl[0].toUpperCase() + stringEl.substring(1);
			})
			.join(' ');

		return capitalisedString;
	}

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
					<RecommendedGearList gearList={recommendedGear} />
				</div>
			</div>
		</main>
	);
}

export default TrailPage;

