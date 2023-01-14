import { Fragment, useState, useContext } from 'react';
import { useDatabase } from '../../hooks/use-database';
import TrailContext from '../../store/trail-context';
import Card from '../UI/Card/Card';
import NewTrailForm from './NewTrailForm';

export default function NewTrail({ onClose, onViewTrail }) {
  const { uploadToStorage, updateDatabase, isLoading, error } = useDatabase();
  const [trailName, setTrailName] = useState('');
  const [newTrailID, setNewTrailID] = useState(null);
  const [message, setMessage] = useState(null);
  const trailCxt = useContext(TrailContext);

  async function uploadNewTrailHandler(newTrailData, newTrailImages) {
    setMessage(null);
    setTrailName(newTrailData.title);

    const trailID = newTrailData.title.toLowerCase().split(' ').join('_');

    const lowercaseTitle = newTrailData.title.toLowerCase();
    const lowercaseCountry = newTrailData.country.toLowerCase();
    const lowercaseState = newTrailData.state.toLowerCase();

    const uploadedImagesArray = await uploadImage(newTrailImages, trailID);

    const newTrailObj = {
      ...newTrailData,
      id: trailID,
      title: lowercaseTitle,
      country: lowercaseCountry,
      state: lowercaseState,
      trailImages: [...uploadedImagesArray],
    };

    // TODO: Set newTrailObj to a Context instead of component state as 'currentTrail'? and load it as the current trail
    // setNewTrail(() => {
    //   console.log('Setting New Trail after upload to storage...');
    //   console.log(newTrailObj);

    //   return newTrailObj;
    // });

    const updateIsSuccessful = await updateDatabase(newTrailObj);

    if (!updateIsSuccessful) return;

    console.log('Upload is complete');

    trailCxt.addToTrails(newTrailObj);

    setNewTrailID(trailID);

    setMessage('Trail uploaded successfully!');
  }

  async function uploadImage(imageDataArray, trailID) {
    console.log('Starting to upload images to storage...');

    const uploadedImagesObjArray = await Promise.all(
      imageDataArray.map(async imageObj => {
        const { imageFullscreen, imageThumbnail, imageAttribution } = imageObj;

        const uploadedFullscreenData = await uploadToStorage(
          imageFullscreen,
          trailID
        );

        const isThumbnail = true;

        const uploadedThumbnailData = await uploadToStorage(
          imageThumbnail,
          trailID,
          isThumbnail
        );

        const { url: fullscreenURL, metadata: fullscreenMetadata } =
          uploadedFullscreenData;

        const { url: thumbnailURL, metadata: thumbnailMetadata } =
          uploadedThumbnailData;

        const uploadedImageObj = {
          imageFullscreen: {
            image: fullscreenURL,
            name: imageFullscreen.name,
            size: fullscreenMetadata.size,
            width: imageFullscreen.width,
            height: imageFullscreen.height,
          },
          imageThumbnail: {
            image: thumbnailURL,
            name: imageThumbnail.name,
            size: thumbnailMetadata.size,
            width: imageThumbnail.width,
            height: imageThumbnail.height,
          },
          imageAttribution,
        };

        return uploadedImageObj;
      })
    );

    console.log('Finished uploading images to storage.');

    return uploadedImagesObjArray;
  }

  function viewTrailHandler() {
    setMessage(null);
    onViewTrail(newTrailID);
  }

  function closeMessageHandler() {
    setMessage(null);
    onClose();
  }

  let content = (
    <NewTrailForm onSubmitNewTrail={uploadNewTrailHandler} onClose={onClose} />
  );

  if (isLoading && !error && !message) {
    content = (
      <div className="msg_card">
        <Card>
          <p>{`Uploading ${trailName} ...`}</p>
        </Card>
      </div>
    );
  }

  if (message && !error && !isLoading) {
    content = (
      <div className="msg_card">
        <Card>
          <p>{message}</p>
          <div className="action_btns">
            <button className="btn btn_red" onClick={closeMessageHandler}>
              Close
            </button>
            <button className="btn btn_green" onClick={viewTrailHandler}>
              View Trail
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    content = (
      <div className="msg_card">
        <Card>
          <p>{`Something went wrong: ${error}`}</p>
          <button className="btn btn_red" onClick={closeMessageHandler}>
            Close
          </button>
        </Card>
      </div>
    );
  }

  return <Fragment>{content}</Fragment>;
}
