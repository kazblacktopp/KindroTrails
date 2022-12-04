import Card from '../../UI/Card/Card';
import classes from './TrailSummary.module.css';

export default function TrailSummary({ summaryData }) {
  const { description, infoURL, facts, temperatures } = summaryData;

  return (
    <section className={classes['section_summary']}>
      <div className={classes['summary_container']}>
        <p>{description}</p>
        <a href={infoURL} target="_blank" rel="noreferrer">
          Learn more
        </a>
      </div>
      <div className={classes['callout_container']}>
        <Card styles={classes.callout}>
          <h3>Fun Facts</h3>
          <ul>
            <li>
              <strong>Distance</strong>: {facts.distance}
            </li>
            <li>
              <strong>Direction</strong>: {facts.direction}
            </li>
            <li>
              <strong>Difficulty</strong>: {facts.difficulty}
            </li>
            <li>
              <strong>Carry Own Gear?</strong>: {facts.gear ? 'Yes' : 'No'}
            </li>
            <li>
              <strong>Environment</strong>: {facts.environment}
            </li>
            <li>
              <strong>Elevation</strong>: {facts.elevation.lowest} m to{' '}
              {facts.elevation.highest} m
            </li>
          </ul>
        </Card>
        <Card styles={classes.callout}>
          <h3>Average Temperatures</h3>
          <ul>
            <li>
              <strong>Summer</strong>: {temperatures.summer.min}&#176;C min.{' '}
              {temperatures.summer.max}&#176;C max.
            </li>
            <li>
              <strong>Autumn</strong>: {temperatures.autumn.min}&#176;C min.{' '}
              {temperatures.autumn.max}&#176;C max.
            </li>
            <li>
              <strong>Winter</strong>: {temperatures.winter.min}&#176;C min.{' '}
              {temperatures.winter.max}&#176;C max.
            </li>
            <li>
              <strong>Spring</strong>: {temperatures.spring.min}&#176;C min.{' '}
              {temperatures.spring.max}&#176;C max.
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
