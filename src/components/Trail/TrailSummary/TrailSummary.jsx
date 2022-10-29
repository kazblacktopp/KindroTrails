import classes from "./TrailSummary.module.css";

function TrailSummary(props) {
  return (
    <div className={classes.summary}>
      <h2>Overland Track</h2>
      <p>
        The Overland Track is Australia's premier <strong>alpine</strong> walk.
      </p>
      <p>
        The track begins at the iconic Cradle Mountain and ends at Australia’s
        deepest lake, Lake St Clair.
      </p>
      <p>
        The Cradle Mountain-Lake St Clair National Park is part of the
        magnificent Tasmanian Wilderness World Heritage Area.
      </p>
      <div>
        <ul className={classes.callout}>
          <h3>Fun Facts</h3>
          <li>
            <strong>Distance</strong>: 65km (6 days)
          </li>
          <li>
            <strong>Direction</strong>: One way
          </li>
          <li>
            <strong>Difficulty</strong>: Grade 4
          </li>
          <li>
            <strong>Carry Own Gear?</strong>: Yes
          </li>
          <li>
            <strong>Environment</strong>: Remote Alpine
          </li>
          <li>
            <strong>Elevation</strong>: 720m to 1,250m
          </li>
        </ul>
      </div>
      <div>
        <ul className={classes.callout}>
          <h3>Average Temperatures</h3>
          <li>
            <strong>Summer</strong>: 5.8&#176;C min. 18.7&#176;C max.
          </li>
          <li>
            <strong>Autumn</strong>: 3.0&#176;C min. 13.4&#176;C max.
          </li>
          <li>
            <strong>Winter</strong>: 0.1&#176;C min. 7.7&#176;C max.
          </li>
          <li>
            <strong>Spring</strong>: 2.2&#176;C min. 12.9&#176;C max.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TrailSummary;
