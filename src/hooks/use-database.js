import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref as createRefInStorage,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import {
  getDatabase,
  ref as createRefInDatabase,
  update,
} from 'firebase/database';
import { firebaseConfig } from '../config/firebaseConfig';
import { useState } from 'react';

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const app = initializeApp(firebaseConfig);

  async function uploadToStorage(imageDataObj, trailID, isThumbnail = false) {
    setError(null);
    setIsLoading(true);

    const { name, image, width, height } = imageDataObj;

    const storage = getStorage(app);
    const imagesRef = createRefInStorage(storage, 'images/');
    const trailRef = createRefInStorage(imagesRef, trailID);
    let imageFileRef = createRefInStorage(trailRef, name);

    if (isThumbnail) {
      imageFileRef = createRefInStorage(trailRef, 'thumbnails/' + name);
    }

    const fileMetadata = {
      customMetadata: {
        width,
        height,
      },
    };

    try {
      const uploadResult = await uploadString(
        imageFileRef,
        image,
        'data_url',
        fileMetadata
      );

      if (!uploadResult) {
        throw new Error('No upload snapshot returned!');
      }

      const url = await getDownloadURL(uploadResult.ref);

      if (!url) {
        throw new Error('No URL returned for uploaded image.');
      }

      const { metadata } = uploadResult;

      setIsLoading(false);

      return { url, metadata };
    } catch (error) {
      console.error(`uploadToStorage: ${error}`);
      setIsLoading(false);
      setError(`Failed to upload image!`);
    }
  }

  async function updateDatabase(trailObj) {
    setError(null);
    setIsLoading(true);

    const { id, country, state } = trailObj;

    const trailCountry = country.split(' ').join('_');
    const trailState = state.split(' ').join('_');

    const updates = {};

    updates['/trails/' + id] = trailObj;
    updates[
      '/trailLocations/' + trailCountry + '/' + trailState + '/' + id
    ] = true;

    const database = getDatabase(app);
    const dbRef = createRefInDatabase(database);

    try {
      const updateResult = await update(dbRef, updates);

      if (updateResult) {
        throw new Error(updateResult);
      }

      setIsLoading(false);

      return true;
    } catch (error) {
      console.error(`updateDatabase: ${error}`);
      setIsLoading(false);
      setError(`Failed to upload Trail. ${error.message}`);
    }
  }

  return { uploadToStorage, updateDatabase, isLoading, error };
}
