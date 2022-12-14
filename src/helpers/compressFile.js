import ImageCompressor from './ImageCompressor/ImageCompressor';

export default function compressFile(
  file,
  processDataFn,
  imageMaxWidth = null,
  thumbnail = false,
  thumbnailMaxWidth = null
) {
  try {
    const reader = new FileReader();

    if (!file) {
      throw new Error('compressFile: Please set the required file parameter.');
    }

    if (!processDataFn) {
      throw new Error(
        'compressFile: Please set the required processDataFn function in order to receive the compressed image data.'
      );
    }

    if (imageMaxWidth && isNaN(imageMaxWidth)) {
      throw new Error(
        'compressFile: Invalid imageMaxWidth value. Please enter a valid width in pixels (omit "px"). E.g. 1200.'
      );
    }

    if (thumbnail && typeof thumbnail !== 'boolean') {
      throw new Error(
        'compressFile: Invalid thumbnail value. Please set thumbnail parameter to a boolean in order to create a thumbnail image.'
      );
    }

    if (thumbnailMaxWidth && isNaN(thumbnailMaxWidth)) {
      throw new Error(
        'compressFile: Invalid thumbnailMaxWidth value. Please enter a valid width in pixels (omit "px"). E.g. 250.'
      );
    }

    reader.onerror = () => {
      throw new Error(
        `Could not read ${file.name}. Please try uploading a different file.`
      );
    };

    reader.onload = () => {
      const imageCompressor = new ImageCompressor({
        onSuccess: imgObj => {
          const imageFullscreen = imgObj.compressedImage;
          imageFullscreen.name = file.name;

          let imageThumbnail;

          if (imgObj.compressedThumbnail) {
            imageThumbnail = imgObj.compressedThumbnail;
            imageThumbnail.name = `Thumbnail_${file.name}`;
          }

          const attribution = file.attribution ? file.attribution : null;

          const imageData = {
            imageFullscreen,
            imageThumbnail: imageThumbnail || null,
            imageAttribution: attribution,
          };

          processDataFn(imageData);
        },
        originalImage: reader.result,
      });

      imageCompressor.compress(imageMaxWidth, thumbnail, thumbnailMaxWidth);
    };

    reader.readAsDataURL(file);
  } catch (error) {
    console.error(error.message);
  }
}
