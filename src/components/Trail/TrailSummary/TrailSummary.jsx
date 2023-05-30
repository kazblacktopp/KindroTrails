import { Fragment } from 'react';
import Card from '../../UI/Card/Card';
import classes from './TrailSummary.module.css';

export default function TrailSummary({ summaryData }) {
	const { description, infoUrl, facts, temperatures } = summaryData;
	const {
		distance,
		time,
		direction,
		difficulty,
		ownGear,
		environment,
		elevation,
	} = facts;
	const { lowest, highest } = elevation;
	const { summer, autumn, winter, spring } = temperatures;

	const descriptionLines = description.split(/\n/);
	const descriptionWithBreaks = descriptionLines.flatMap((line, index) =>
		index > 0
			? [
					<br key={`br-${index}`} />,
					<Fragment key={index}>{line}</Fragment>,
			  ]
			: [line],
	);

	return (
		<section className={classes['section_summary']}>
			<div className={classes['summary_container']}>
				<p>{descriptionWithBreaks}</p>
				<a href={infoUrl} target="_blank" rel="noreferrer">
					{`>> Learn more`}
				</a>
			</div>
			<div className={classes['callout_container']}>
				<Card styles={classes.callout}>
					<h3>Fun Facts</h3>
					<ul>
						<li>
							<strong>Distance</strong>: {distance} km (
							{time.timeAmount} {time.timeType})
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
							<strong>Elevation</strong>: {lowest} m to {highest}{' '}
							m
						</li>
					</ul>
				</Card>
				<Card styles={classes.callout}>
					<h3>Average Temperatures</h3>
					<ul>
						<li>
							<strong>Summer</strong>: (L) {summer.sumMin}&#176;C
							(H) {summer.sumMax}
							&#176;C
						</li>
						<li>
							<strong>Autumn</strong>: (L) {autumn.autMin}&#176;C
							(H) {autumn.autMax}
							&#176;C
						</li>
						<li>
							<strong>Winter</strong>: (L) {winter.winMin}&#176;C
							(H) {winter.winMax}
							&#176;C
						</li>
						<li>
							<strong>Spring</strong>: (L) {spring.sprMin}&#176;C
							(H) {spring.sprMax}
							&#176;C
						</li>
					</ul>
				</Card>
			</div>
		</section>
	);
}

