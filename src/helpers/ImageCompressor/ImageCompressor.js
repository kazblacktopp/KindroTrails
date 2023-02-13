import {
	DEFAULT_SCALE,
	DEFAULT_QUALITY,
	DEFAULT_THUMBNAIL_MAX_WIDTH,
} from './compressorConfig';

export default class ImageCompressor {
	constructor(props) {
		try {
			if (!props) {
				throw new Error(
					'ImageCompressor: Please set the required parameters: { onSuccess, originalImage }',
				);
			}

			this.props = props;
			this.props.scale = props.scale || DEFAULT_SCALE;
			this.props.quality = props.quality || DEFAULT_QUALITY;

			if (!props.originalImage) {
				throw new Error(
					'ImageCompressor: Please set the required originalImage parameter.',
				);
			}

			if (!props.onSuccess) {
				throw new Error(
					'ImageCompressor: Please set the required onSuccess function parameter to get the compressed image.',
				);
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	compress(maxWidth = null, thumbnail = false, thumbnailMaxWidth = null) {
		const img = new Image();

		img.onload = () => {
			const compressedImage = this.compressImage(img, maxWidth);

			const compressedThumbnail = thumbnail
				? this.compressImage(img, thumbnailMaxWidth, thumbnail)
				: null;

			this.props.onSuccess({ compressedImage, compressedThumbnail });
		};

		img.src = this.props.originalImage;
	}

	compressImage(img, maxWidth, thumbnail = false) {
		const canvas = document.createElement('canvas');
		const canvasCxt = canvas.getContext('2d');

		const imgWidthToHeightRatio = img.naturalWidth / img.naturalHeight; // Portrail ~0.5, landscape ~ 2.0

		const thumbMaxWidth = maxWidth || DEFAULT_THUMBNAIL_MAX_WIDTH;

		let thumbnailWidth;

		if (imgWidthToHeightRatio <= 1) {
			thumbnailWidth = thumbMaxWidth;
		} else {
			thumbnailWidth = thumbMaxWidth * imgWidthToHeightRatio;
		}

		const scale = thumbnail
			? thumbnailWidth / img.naturalWidth
			: maxWidth / img.naturalWidth || this.props.scale / 100;

		const imageWidth = img.naturalWidth * scale,
			imageHeight = img.naturalHeight * scale;

		canvas.setAttribute('width', imageWidth);
		canvas.setAttribute('height', imageHeight);
		canvasCxt.drawImage(img, 0, 0, imageWidth, imageHeight);

		const quality = this.props.quality / 100;

		const output = {
			image: canvas.toDataURL('image/jpeg', quality),
			width: Math.floor(imageWidth),
			height: Math.floor(imageHeight),
		};

		return output;
	}
}

