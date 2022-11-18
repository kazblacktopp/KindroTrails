import { useState } from "react";
import ImageCompressor from "./ImageCompressor";
import {
  IMAGE_MAX_WIDTH,
  THUMBNAIL_MAX_WIDTH,
  IS_THUMBNAIL,
} from "../config/config";
// import classes from "./UploadFile.module.css";

// Resize and Compress file (x2)
// https://github.com/ymaghzaz/compressor-img

export default function UploadFile(props) {
  const initialState = {
    originalImage: null,
    compressedImage: null,
    compressedImageWidth: null,
    compressedImageHeight: null,
    thumbnailImage: null,
    thumbnailImageWidth: null,
    thumbnailImageHeight: null,
  };

  const [imageState, setImageState] = useState(initialState);

  function fileUploadHandler(event) {
    event.preventDefault();

    const file = event.target.files[0];

    if (!file) return;

    try {
      const reader = new FileReader();

      reader.onerror = () => {
        throw new Error(
          `Could not read ${file.name}. Please try uploading a different file.`
        );
      };

      reader.onload = async () => {
        const imageCompressor = new ImageCompressor({
          onSuccess: (imgObj) => {
            setImageState((prevState) => {
              return {
                ...prevState,
                ...(!prevState.originalImage && {
                  originalImage: reader.result,
                }),
                ...(imgObj.compressed && {
                  compressedImage: imgObj.compressed,
                  compressedImageWidth: imgObj.compressedWidth,
                  compressedImageHeight: imgObj.compressedHight,
                }),
                ...(imgObj.thumbnail && {
                  thumbnailImage: imgObj.thumbnail,
                  thumbnailImageWidth: imgObj.thumbnailWidth,
                  thumbnailImageHeight: imgObj.thumbnailHeight,
                }),
              };
            });
          },
          originalImage: reader.result,
        });

        // Compress original image to IMAGE_MAX_WIDTH
        imageCompressor.compress(IMAGE_MAX_WIDTH);

        // Create thumbnail at THUMBNAIL_MAX_WIDTH
        imageCompressor.compress(THUMBNAIL_MAX_WIDTH, IS_THUMBNAIL);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error.message);
    }
  }

  // const {
  //   upload_file_container: uploadFileContainer,
  //   image_container: imgContainer,
  //   compressed_image: compressedImg,
  //   thumbnail_image: thumbnailImg,
  // } = classes;

  // return (
  //   <div className={uploadFileContainer}>
  //     <input
  //       id="photo"
  //       name="photo"
  //       type="file"
  //       accept="image/png, image/jpeg"
  //       onChange={fileUploadHandler}
  //     />
  //     {imageState.originalImage && (
  //       <div className={imgContainer}>
  //         <p>Original Image</p>
  //         <img
  //           className={compressedImg}
  //           src={imageState.originalImage}
  //           alt=""
  //         />
  //       </div>
  //     )}
  //     {imageState.compressedImage && (
  //       <div className={imgContainer}>
  //         <p>Compressed Image</p>
  //         <img
  //           className={compressedImg}
  //           src={imageState.compressedImage}
  //           alt=""
  //           width={imageState.compressedImageWidth}
  //           height={imageState.compressedImageHeight}
  //         />
  //       </div>
  //     )}
  //     {imageState.thumbnailImage && (
  //       <div className={imgContainer}>
  //         <p>Thumbnail Image</p>
  //         <img
  //           className={thumbnailImg}
  //           src={imageState.thumbnailImage}
  //           alt=""
  //           width={imageState.thumbnailImageWidth}
  //           height={imageState.thumbnailImageHeight}
  //         />
  //       </div>
  //     )}
  //   </div>
  // );
}

// Upload file to storage (receive img URL)

// Add img URL to trail object and upload to database
