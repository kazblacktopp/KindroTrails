import TrailSummary from '../TrailSummary/TrailSummary';
import PhotoGallery from '../../PhotoGallery/PhotoGallery';
import classes from './TrailPage.module.css';

function TrailPage(props) {
  const { title, country, state, trailImages, ...remainingData } =
    props.trailData;

  return (
    <main>
      <div className={classes['section-container']}>
        <div className={classes['title_container']}>
          <h1>{title}</h1>
          <p>
            {state}, {country}
          </p>
        </div>
        <div className={classes['top-section_container']}>
          <TrailSummary summaryData={remainingData} />
          <PhotoGallery photos={trailImages} />
        </div>
      </div>
    </main>
  );
}

export default TrailPage;
