import ImageCompressor from './ImageCompressor/ImageCompressor';

export function compressImage(
  image,
  processDataFn,
  imageMaxWidth = null,
  thumbnail = false,
  thumbnailMaxWidth = null
) {
  try {
    if (!image) {
      throw new Error(
        'compressImage: Please set the required image parameter.'
      );
    }

    if (!processDataFn) {
      throw new Error(
        'compressImage: Please set the required processDataFn function in order to receive the compressed image data.'
      );
    }

    if (imageMaxWidth && isNaN(imageMaxWidth)) {
      throw new Error(
        'compressImage: Invalid imageMaxWidth value. Please enter a valid width in pixels (omit "px"). E.g. 1200.'
      );
    }

    if (thumbnail && typeof thumbnail !== 'boolean') {
      throw new Error(
        'compressImage: Invalid thumbnail value. Please set thumbnail parameter to a boolean in order to create a thumbnail image.'
      );
    }

    if (thumbnailMaxWidth && isNaN(thumbnailMaxWidth)) {
      throw new Error(
        'compressImage: Invalid thumbnailMaxWidth value. Please enter a valid width in pixels (omit "px"). E.g. 250.'
      );
    }

    const reader = new FileReader();

    reader.onerror = () => {
      throw new Error(
        `Could not read ${image.name}. Please try uploading a different image.`
      );
    };

    reader.onload = () => {
      const imageCompressor = new ImageCompressor({
        onSuccess: imgObj => {
          const { compressedImage, compressedThumbnail } = imgObj;
          const imageFullscreen = compressedImage;

          imageFullscreen.name = image.name;

          let imageThumbnail;

          if (compressedThumbnail) {
            imageThumbnail = compressedThumbnail;
            imageThumbnail.name = `Thumbnail_${image.name}`;
          }

          const attribution = image.attribution ? image.attribution : null;

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

    reader.readAsDataURL(image);
  } catch (error) {
    console.error(error.message);
  }
}
