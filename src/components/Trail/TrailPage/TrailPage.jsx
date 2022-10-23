import { Fragment } from "react";
import PhotoGallery from "../TrailGallery/PhotoGallery/PhotoGallery";
import GearList from "../../Gear/GearList/GearList";
import TrailSummary from "../TrailSummary/TrailSummary";
import classes from "./TrailPage.module.css";

function TrailPage(props) {
  return (
    <Fragment>
      <TrailSummary />
      <PhotoGallery />
      <GearList />
    </Fragment>
  );
}

export default TrailPage;
