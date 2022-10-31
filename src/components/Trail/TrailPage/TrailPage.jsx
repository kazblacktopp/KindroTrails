import TrailSummary from "../TrailSummary/TrailSummary";

import classes from "./TrailPage.module.css";

function TrailPage(props) {
  return (
    <main className={classes["container-outer"]}>
      <section className={classes["container-inner"]}>
        <h2>Overland Track</h2>
        <TrailSummary />
      </section>
    </main>
  );
}

export default TrailPage;
