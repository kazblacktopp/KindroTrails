import { useState } from 'react';
import useDatabase from '../../hooks/use-database';
import NewTrailForm from './NewTrailForm';

export default function NewTrail() {
  const [newTrail, setNewTrail] = useState({});
  const { error, uploadToStorage, uploadToDatabase } = useDatabase();

  async function uploadNewTrailHandler(newTrailData, newTrailImages) {
    setNewTrail(newTrailData);

    const trailID = newTrailData.title.toLowerCase().split(' ').join('_');

    const uploadedImagesArray = await uploadImages(newTrailImages, trailID);

    setNewTrail(prevTrailState => {
      const newTrailObj = {
        ...prevTrailState,
        trailImages: [...uploadedImagesArray],
      };

      return newTrailObj;
    });

    // Upload newTrail to database
    uploadToDatabase(newTrail, 'trails');

    // uploadToDatabase(newTrail, 'trailLocations');

    // Upload newTrailLocation to database
  }

  async function uploadImages(imageDataArray, trailID) {
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

        const { url: fullscreenURL, snapshot: fullscreenSnapshot } =
          uploadedFullscreenData;

        const { url: thumbnailURL, snapshot: thumbnailSnapshot } =
          uploadedThumbnailData;

        const uploadedImageObj = {
          imageFullscreen: {
            image: fullscreenURL,
            name: imageFullscreen.name,
            size: fullscreenSnapshot.metadata.size,
            width: imageFullscreen.width,
            height: imageFullscreen.height,
          },
          imageThumbnail: {
            image: thumbnailURL,
            name: imageThumbnail.name,
            size: thumbnailSnapshot.metadata.size,
            width: imageThumbnail.width,
            height: imageThumbnail.height,
          },
          imageAttribution,
        };

        return uploadedImageObj;
      })
    );

    return uploadedImagesObjArray;
  }

  // const { country, state, name } = newTrail;
  // Upload newTrail to database using trail name, modified with underscores, as 'id'
  // Use below format for trailLocation data:
  // const newTrailLocation = {
  //   [country]: {
  //     [state]: {
  //       [id]: true,
  //     },
  //   },
  // };

  return (
    <div>
      {!error && <NewTrailForm onSubmitNewTrail={uploadNewTrailHandler} />}
      {error && <p>{error}</p>}
    </div>
  );
}
