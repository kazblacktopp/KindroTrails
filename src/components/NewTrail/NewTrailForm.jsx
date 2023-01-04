import { Fragment, useState } from 'react';
import { useRef } from 'react';
import compressFile from '../../helpers/compressFile';
import {
  IMAGE_MAX_WIDTH,
  THUMBNAIL_MAX_WIDTH,
  THUMBNAIL,
} from '../../config/appConfig';
import TrailPage from '../Trail/TrailPage/TrailPage';
import classes from './NewTrailForm.module.css';
import { uploadToStorage } from '../../helpers/uploadToStorage';

export default function NewTrailForm({ onSubmitNewTrail }) {
  const photoInputRef = useRef();

  const [previewImages, setPreviewImages] = useState([]);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [urlAtrribution, setUrlAttribution] = useState('');
  const [filenamesElArray, setFilenamesElArray] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

  const initialTrailState = {
    title: '',
    description: '',
    infoUrl: '',
    country: '',
    state: '',
    distance: '',
    direction: '',
    difficulty: '',
    ownGear: '',
    environment: '',
    elevLowest: '',
    elevHighest: '',
    summerMin: '',
    summerMax: '',
    autumnMin: '',
    autumnMax: '',
    winterMin: '',
    winterMax: '',
    springMin: '',
    springMax: '',
    trailImages: [],
  };

  const [newTrail, setNewTrail] = useState(initialTrailState);

  function inputChangeHandler(event) {
    event.preventDefault();

    const trailKey = event.target.name;
    const newValue = event.target.value;
    const nodeType = event.target.type;

    if (nodeType === 'textarea') {
      event.target.parentNode.dataset.replicatedValue = newValue;
    }

    if (trailKey === 'imageURL') {
      setUrlInputValue(newValue);
      return;
    }

    if (trailKey === 'imageAttributionHtml') {
      setUrlAttribution(newValue);
      return;
    }

    setNewTrail(prevTrailState => {
      return {
        ...prevTrailState,
        [trailKey]: newValue,
      };
    });
  }

  function uploadImageHandler(evnt) {
    evnt.preventDefault();

    const files = evnt.target.files;

    if (!files) return;

    const fileListArray = [...files];

    addToFilenameArray(fileListArray);

    fileListArray.forEach(file => {
      compressFile(
        file,
        createPreviewImages,
        IMAGE_MAX_WIDTH,
        THUMBNAIL,
        THUMBNAIL_MAX_WIDTH
      );
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

  function createPreviewImages(imageData) {
    setPreviewImages(prevPreviewState => {
      return [...prevPreviewState, imageData];
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

    compressFile(
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
    previewImages.forEach(async imageObj => {
      const { imageFullscreen, imageThumbnail, imageAttribution } = imageObj;

      const uploadedFullscreenData = await uploadToStorage(imageFullscreen);
      const uploadedThumbnailData = await uploadToStorage(imageThumbnail);

      const { imageURL: fullscreenURL, imageSnapshot: fullscreenSnapshot } =
        uploadedFullscreenData;

      const { imageURL: thumbnailURL, imageSnapshot: thumbnailSnapshot } =
        uploadedThumbnailData;

      const uploadedImageObj = {
        imageFullscreen: {
          image: fullscreenURL,
          name: imageFullscreen.name,
          width: imageFullscreen.width,
          size: fullscreenSnapshot.metadata.size,
          height: imageFullscreen.height,
          storageRef: fullscreenSnapshot.ref.fullPath,
        },
        imageThumbnail: {
          image: thumbnailURL,
          name: imageThumbnail.name,
          size: thumbnailSnapshot.metadata.size,
          width: imageThumbnail.width,
          height: imageThumbnail.height,
          storageRef: thumbnailSnapshot.ref.fullPath,
        },
        imageAttribution,
      };

      newTrail.trailImages.push(uploadedImageObj);
    });

    onSubmitNewTrail(newTrail);
  }

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
                value={newTrail.distance}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="direction">Trail direction:</label>
              <select
                id="direction"
                name="direction"
                value={newTrail.direction}
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
                value={newTrail.difficulty}
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
                name="ownGear"
                id="own-gear"
                value={newTrail.ownGear}
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
                value={newTrail.environment}
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
                name="elevLowest"
                value={newTrail.elevLowest}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="elevation-high">Highest:</label>
              <input
                type="number"
                id="elevation-high"
                name="elevHighest"
                value={newTrail.elevHighest}
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
                name="summerMin"
                value={newTrail.summerMin}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="summer-max">Max:</label>
              <input
                type="number"
                id="summer-max"
                name="summerMax"
                value={newTrail.summerMax}
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
                  name="autumnMin"
                  value={newTrail.autumnMin}
                  required
                  onChange={inputChangeHandler}
                />
              </div>
              <div>
                <label htmlFor="autumn-max">Max:</label>
                <input
                  type="number"
                  id="autumn-max"
                  name="autumnMax"
                  value={newTrail.autumnMax}
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
                name="winterMin"
                value={newTrail.winterMin}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="winter-max">Max:</label>
              <input
                type="number"
                id="winter-max"
                name="winterMax"
                value={newTrail.winterMax}
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
                name="springMin"
                value={newTrail.springMin}
                required
                onChange={inputChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="spring-max">Max:</label>
              <input
                type="number"
                id="spring-max"
                name="springMax"
                value={newTrail.springMax}
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
