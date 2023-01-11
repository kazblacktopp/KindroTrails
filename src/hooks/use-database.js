import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref as createRefInStorage,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import { getDatabase, ref as createRefInDatabase } from 'firebase/database';
import { firebaseConfig } from '../config/firebaseConfig';
import { useState } from 'react';

export default function useDatabase() {
  const [error, setError] = useState('');

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  async function uploadToStorage(imageDataObj, trailID, isThumbnail = false) {
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
      const snapshot = await uploadString(
        imageFileRef,
        image,
        'data_url',
        fileMetadata
      );

      const url = await getDownloadURL(imageFileRef);

      return { snapshot, url };
    } catch (error) {
      console.error(error);
      setError('Something went wrong!' + error.message);
    }
  }

  function uploadToDatabase(dataObj, dbBucket) {
    setError('');
    console.log(createRefInDatabase, database);
    console.log('Uploading new trail');
  }

  return { error, uploadToStorage, uploadToDatabase };
}
