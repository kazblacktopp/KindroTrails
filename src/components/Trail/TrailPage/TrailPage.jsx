import TrailSummary from "../TrailSummary/TrailSummary";
import PhotoGallery from "../../PhotoGallery/PhotoGallery";
import classes from "./TrailPage.module.css";

function TrailPage(props) {
  return (
    <main className={classes["main_container"]}>
      <h1 className={classes["page_title"]}>Overland Track</h1>
      <div className={classes["top-section_container"]}>
        <TrailSummary />
        <PhotoGallery />
      </div>
    </main>
  );
}

export default TrailPage;
