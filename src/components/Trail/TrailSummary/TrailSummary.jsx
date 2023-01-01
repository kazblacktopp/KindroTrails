import { Fragment } from 'react';
import Card from '../../UI/Card/Card';
import classes from './TrailSummary.module.css';

export default function TrailSummary({ summaryData }) {
  const {
    description,
    infoUrl,
    distance,
    direction,
    difficulty,
    ownGear,
    environment,
    elevLowest,
    elevHighest,
    summerMin,
    summerMax,
    autumnMin,
    autumnMax,
    winterMin,
    winterMax,
    springMin,
    springMax,
  } = summaryData;

  const descriptionLines = description.split(/\n/);
  const descriptionWithBreaks = descriptionLines.flatMap((line, index) =>
    index > 0
      ? [<br key={`br-${index}`} />, <Fragment key={index}>{line}</Fragment>]
      : [line]
  );

  return (
    <section className={classes['section_summary']}>
      <div className={classes['summary_container']}>
        <p>{descriptionWithBreaks}</p>
        <a href={infoUrl} target="_blank" rel="noreferrer">
          Learn more
        </a>
      </div>
      <div className={classes['callout_container']}>
        <Card styles={classes.callout}>
          <h3>Fun Facts</h3>
          <ul>
            <li>
              <strong>Distance</strong>: {distance} km
            </li>
            <li>
              <strong>Direction</strong>: {direction}
            </li>
            <li>
              <strong>Difficulty</strong>: Level {difficulty}
            </li>
            <li>
              <strong>Carry Own Gear?</strong>: {ownGear}
            </li>
            <li>
              <strong>Environment</strong>: {environment}
            </li>
            <li>
              <strong>Elevation</strong>: {elevLowest} m to {elevHighest} m
            </li>
          </ul>
        </Card>
        <Card styles={classes.callout}>
          <h3>Average Temperatures</h3>
          <ul>
            <li>
              <strong>Summer</strong>: {summerMin}&#176;C min. {summerMax}
              &#176;C max.
            </li>
            <li>
              <strong>Autumn</strong>: {autumnMin}&#176;C min. {autumnMax}
              &#176;C max.
            </li>
            <li>
              <strong>Winter</strong>: {winterMin}&#176;C min. {winterMax}
              &#176;C max.
            </li>
            <li>
              <strong>Spring</strong>: {springMin}&#176;C min. {springMax}
              &#176;C max.
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
