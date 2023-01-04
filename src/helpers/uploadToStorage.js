import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
// import {getAuth} from 'firebase/auth';
import { firebaseConfig } from '../config/firebaseConfig';

export async function uploadToStorage(imageDataObj) {
  const { name, image, width, height } = imageDataObj;

  const firebaseApp = initializeApp(firebaseConfig);
  // const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage);
  const imagesRef = ref(storageRef, 'images');
  const imageFileName = name;
  const imageFileRef = ref(imagesRef, imageFileName);

  const imageDataURL = image;

  const fileMetadata = {
    customMetadata: {
      width,
      height,
    },
  };

  try {
    const imageSnapshot = await uploadString(
      imageFileRef,
      imageDataURL,
      'data_url',
      fileMetadata
    );

    const imageURL = await getDownloadURL(imageFileRef);

    return { imageSnapshot, imageURL };
  } catch (error) {
    console.error(error);
  }
}
