import { DEFAULT_SCALE, DEFAULT_QUALITY } from "../config/config";

export default class ImageCompressor {
  constructor(props) {
    try {
      if (!props) {
        throw new Error(
          "ImageCompressor: Please set the required parameters: { onSuccess, originalImage }"
        );
      }

      this.props = props;
      this.props.scale = props.scale || DEFAULT_SCALE;
      this.props.quality = props.quality || DEFAULT_QUALITY;

      if (!props.originalImage) {
        throw new Error(
          "ImageCompressor: Please set the required originalImage parameter"
        );
      }

      if (!props.onSuccess) {
        throw new Error(
          "ImageCompressor: Please set the required onSuccess function parameter to get the compressed image"
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  compress(maxWidth = null, isThumbnail = false) {
    const canvas = document.createElement("canvas"),
      canvasCxt = canvas.getContext("2d"),
      img = new Image();

    img.onload = () => {
      const scale = isThumbnail
        ? maxWidth / img.naturalWidth
        : maxWidth / img.naturalWidth || this.props.scale / 100;

      const width = img.naturalWidth * scale,
        height = img.naturalHeight * scale;

      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      canvasCxt.drawImage(img, 0, 0, width, height);

      const quality = this.props.quality / 100,
        compressedImgType = isThumbnail ? "thumbnail" : "compressed",
        compressedImgWidth = `${compressedImgType}Width`,
        compressedImgHeight = `${compressedImgType}Height`,
        output = {
          [compressedImgType]: canvas.toDataURL("image/jpeg", quality),
          [compressedImgWidth]: Math.floor(width),
          [compressedImgHeight]: Math.floor(height),
        };
      console.log(output);
      this.props.onSuccess(output);
    };

    img.src = this.props.originalImage;
  }
}
