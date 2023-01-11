import { Fragment, useState } from 'react';
import { useRef } from 'react';
import { compressImage } from '../../helpers/compressImage';
import {
  IMAGE_MAX_WIDTH,
  THUMBNAIL_MAX_WIDTH,
  THUMBNAIL,
} from '../../config/appConfig';
import TrailPage from '../Trail/TrailPage/TrailPage';
import { createNewObject } from '../../helpers/createNewObject';

import classes from './NewTrailForm.module.css';

export default function NewTrailForm({ onSubmitNewTrail }) {
  const photoInputRef = useRef();

  const [urlInputValue, setUrlInputValue] = useState('');
  const [urlAtrribution, setUrlAttribution] = useState('');
  const [filenamesElArray, setFilenamesElArray] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

  const initialTrailState = {
    title: '',
    description: '',
    infoUrl: '',
    country: '',
    state: '',
    facts: {
      distance: '',
      time: {
        timeAmount: '',
        timeType: '',
      },
      direction: '',
      difficulty: '',
      ownGear: '',
      environment: '',
      elevation: {
        lowest: '',
        highest: '',
      },
    },
    temperatures: {
      summer: {
        sumMin: '',
        sumMax: '',
      },
      autumn: {
        autMin: '',
        autMax: '',
      },
      winter: {
        winMin: '',
        winMax: '',
      },
      spring: {
        sprMin: '',
        sprMax: '',
      },
    },
    trailImages: [],
  };

  const [newTrail, setNewTrail] = useState(initialTrailState);

  function inputChangeHandler(event) {
    event.preventDefault();

    const targetInput = event.target;
    const { name, value, type } = targetInput;

    if (type === 'textarea') {
      targetInput.parentNode.dataset.replicatedValue = value;
    }

    if (name === 'imageURL') {
      setUrlInputValue(value);
      return;
    }

    if (name === 'imageAttributionHtml') {
      setUrlAttribution(value);
      return;
    }

    setNewTrail(prevTrailState => {
      const newTrailState = createNewObject(prevTrailState, name, value);

      return newTrailState;
    });
  }

  function uploadImageHandler(evnt) {
    evnt.preventDefault();

    const files = evnt.target.files;

    if (!files) return;

    const fileListArray = [...files];

    addToFilenameArray(fileListArray);

    fileListArray.forEach(file => {
      compressImage(
        file,
        createPreviewImages,
        IMAGE_MAX_WIDTH,
        THUMBNAIL,
        THUMBNAIL_MAX_WIDTH
      );
    });
  }

  function createPreviewImages(imageData) {
    setPreviewImages(prevPreviewState => {
      return [...prevPreviewState, imageData];
    });
  }

  function addToFilenameArray(fileList) {
    setFilenamesElArray(prevArrayState => {
      const newFilenameEls = fileList.map((file, i) => {
        return (
          <li key={`imageName_${prevArrayState.length + i + 1}`}>
            {file.name}
          </li>
        );
      });

      return [...prevArrayState, ...newFilenameEls];
    });
  }

  async function submitUrlHandler(e) {
    e.preventDefault();

    const attribution = urlAtrribution;
    const input = urlInputValue;

    setUrlInputValue('');
    setUrlAttribution('');

    const file = await makeFileFromUrl(input);

    addToFilenameArray([file]);

    file.attribution = attribution;

    compressImage(
      file,
      createPreviewImages,
      IMAGE_MAX_WIDTH,
      THUMBNAIL,
      THUMBNAIL_MAX_WIDTH
    );
  }

  async function makeFileFromUrl(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      if (!response.ok) {
        throw new Error(`Something went wrong: ${blob.status}`);
      }

      const fileName = url.split('/').pop();
      const fileMetadata = {
        type: blob.type,
        size: blob.size,
      };

      const file = new File([blob], fileName, fileMetadata);

      return file;
    } catch (error) {
      console.error(error.message);
    }
  }

  function displayTrailPreviewHandler(e) {
    e.preventDefault();

    setIsPreview(true);
  }

  function closePreviewHandler(e) {
    e.preventDefault();

    setIsPreview(false);
  }

  function submitNewTrailHandler() {
    onSubmitNewTrail(newTrail, previewImages);
  }

  const { facts, temperatures } = newTrail;
  const { timeAmount, timeType } = facts.time;
  const { lowest, highest } = facts.elevation;
  const { summer, autumn, winter, spring } = temperatures;

  const {
    form_container,
    title,
    description,
    textarea_grow_wrap,
    info_url,
    location_container,
    country,
    state,
    facts_container,
    image_input_container,
    photo_input_container,
    photoInput,
    url_input_container,
    url_input_wrapper,
    filename_preview,
    preview_btn,
  } = classes;

  return (
    <Fragment>
      {isPreview && (
        <Fragment>
          <TrailPage trailData={newTrail} trailImages={previewImages} />
          <button onClick={closePreviewHandler}>Close</button>
          <button onClick={submitNewTrailHandler}>Submit</button>
        </Fragment>
      )}

      {!isPreview && (
        <form className={form_container}>
          <div className={title}>
            <label htmlFor="title">Trail title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTrail.title}
              placeholder="Please enter a title for the trail."
              required
              onChange={inputChangeHandler}
            />
          </div>
          <div className={description}>
            <label htmlFor="trailDescription">Trail description:</label>
            <div className={textarea_grow_wrap}>
              <textarea
                id="trailDescription"
                name="description"
                value={newTrail.description}
                placeholder="Please enter a description for the trail."
                rows="3"
                required
                onChange={inputChangeHandler}
              />
            </div>
          </div>
          <div className={info_url}>
            <label htmlFor="info-url">URL for more trail info:</label>
            <input
              type="url"
              id="info-url"
              name="infoUrl"
              value={newTrail.infoUrl}
              placeholder="E.g.: https://website.com"
              required
              onChange={inputChangeHandler}
            />
          </div>
          <div className={location_container}>
            <div className={country}>
              <label htmlFor="country">Trail Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                value={newTrail.country}
                placeholder="E.g. Australia"
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div className={state}>
              <label htmlFor="state">Trail State:</label>
              <input
                type="text"
                id="state"
                name="state"
                value={newTrail.state}
                placeholder="E.g.: Queensland"
                required
                onChange={inputChangeHandler}
              />
            </div>
          </div>
          <div className={facts_container}>
            <div>
              <label htmlFor="distance">Trail distance (km):</label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={facts.distance}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label>
                Time to Complete:
                <input
                  type="number"
                  name="timeAmount"
                  value={timeAmount}
                  required
                  onChange={inputChangeHandler}
                />
                <select
                  name="timeType"
                  value={timeType}
                  onChange={inputChangeHandler}
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </label>
            </div>
            <div>
              <label htmlFor="direction">Trail direction:</label>
              <select
                id="direction"
                name="direction"
                value={facts.direction}
                required
                onChange={inputChangeHandler}
              >
                <option value="">--Please Choose an Option--</option>
                <option value="One-way">One Way</option>
                <option value="Loop">Loop</option>
              </select>
            </div>
            <div>
              <label htmlFor="difficulty">Trail difficulty:</label>
              <select
                id="difficulty"
                name="difficulty"
                value={facts.difficulty}
                required
                onChange={inputChangeHandler}
              >
                <option value="">--Please Select Difficulty--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label htmlFor="own-gear">Carry own gear?</label>
              <select
                id="own-gear"
                name="ownGear"
                value={facts.ownGear}
                required
                onChange={inputChangeHandler}
              >
                <option value="">--Please Select an Option--</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="environment">Trail environment:</label>
              <input
                type="text"
                id="environment"
                name="environment"
                value={facts.environment}
                placeholder="E.g.: Remote Alpine"
                required
                onChange={inputChangeHandler}
              />
            </div>
            <h3>Elevation</h3>
            <div>
              <label htmlFor="elevation-low">Lowest:</label>
              <input
                type="number"
                id="elevation-low"
                name="lowest"
                value={lowest}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="elevation-high">Highest:</label>
              <input
                type="number"
                id="elevation-high"
                name="highest"
                value={highest}
                required
                onChange={inputChangeHandler}
              />
            </div>
          </div>
          <h3>Temperatures</h3>
          <div>
            <h4>Summer</h4>
            <div>
              <label htmlFor="summer-min">Min:</label>
              <input
                type="number"
                id="summer-min"
                name="sumMin"
                step="0.1"
                value={summer.sumMin}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="summer-max">Max:</label>
              <input
                type="number"
                id="summer-max"
                name="sumMax"
                step="0.1"
                value={summer.sumMax}
                required
                onChange={inputChangeHandler}
              />
            </div>
          </div>
          <div>
            <div>
              <h4>Autumn</h4>
              <div>
                <label htmlFor="autumn-min">Min:</label>
                <input
                  type="number"
                  id="autumn-min"
                  name="autMin"
                  step="0.1"
                  value={autumn.autMin}
                  required
                  onChange={inputChangeHandler}
                />
              </div>
              <div>
                <label htmlFor="autumn-max">Max:</label>
                <input
                  type="number"
                  id="autumn-max"
                  name="autMax"
                  step="0.1"
                  value={autumn.autMax}
                  required
                  onChange={inputChangeHandler}
                />
              </div>
            </div>
            <h4>Winter</h4>
            <div>
              <label htmlFor="winter-min">Min:</label>
              <input
                type="number"
                id="winter-min"
                name="winMin"
                step="0.1"
                value={winter.winMin}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="winter-max">Max:</label>
              <input
                type="number"
                id="winter-max"
                name="winMax"
                step="0.1"
                value={winter.winMax}
                required
                onChange={inputChangeHandler}
              />
            </div>
          </div>
          <div>
            <h4>Spring</h4>
            <div>
              <label htmlFor="spring-min">Min:</label>
              <input
                type="number"
                id="spring-min"
                name="sprMin"
                step="0.1"
                value={spring.sprMin}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="spring-max">Max:</label>
              <input
                type="number"
                id="spring-max"
                name="sprMax"
                step="0.1"
                value={spring.sprMax}
                required
                onChange={inputChangeHandler}
              />
            </div>
          </div>
          <div className={image_input_container}>
            <div className={photo_input_container}>
              <label htmlFor="trailPhoto">Select a photo:</label>
              <input
                id="trailPhoto"
                type="file"
                name="trailPhoto"
                accept="image/*"
                multiple
                ref={photoInputRef}
                onChange={uploadImageHandler}
                className={photoInput}
              />
              <button
                type="button"
                onClick={() => photoInputRef.current.click()}
              >
                Upload Photos
              </button>
            </div>
            <p>OR</p>
            <div className={url_input_container}>
              <div className={url_input_wrapper}>
                <label htmlFor="trailImageURL">Enter Image URL</label>
                <input
                  id="trailImageURL"
                  type="text"
                  name="imageURL"
                  value={urlInputValue}
                  onChange={inputChangeHandler}
                />
                <label htmlFor="trailImageAttribution">
                  Enter Image Attribution (HTML)
                </label>
                <input
                  type="text"
                  id="trailImageAttribution"
                  name="imageAttributionHtml"
                  value={urlAtrribution}
                  onChange={inputChangeHandler}
                />
              </div>
              <button type="button" onClick={submitUrlHandler}>
                Add
              </button>
            </div>
          </div>
          <div className={filename_preview}>
            <h3>Uploaded Files:</h3>
            <ul>{filenamesElArray.length !== 0 ? filenamesElArray : ''}</ul>
          </div>
          <button
            className={preview_btn}
            type="button"
            onClick={displayTrailPreviewHandler}
          >
            Preview
          </button>
        </form>
      )}
    </Fragment>
  );
}
