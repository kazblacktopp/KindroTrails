import { Fragment, useState, useRef } from 'react';
import { compressImage } from '../../helpers/compressImage';
import {
	IMAGE_MAX_WIDTH,
	THUMBNAIL_MAX_WIDTH,
	THUMBNAIL,
	CC_LICENSE_NAMES,
	CC_LICENSE_BASE_URLS,
	CC_LICENSE_LATEST_VERSION,
	CC_LICENSE_PDM_VERSION,
} from '../../config/appConfig';
import TrailPage from '../Trail/TrailPage/TrailPage';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import { createNewObject } from '../../helpers/createNewObject';

import { trailData } from '../../config/trailData';

import icons from '../../assets/icons.svg';
import classes from './NewTrailForm.module.css';

export default function NewTrailForm({ onSubmitNewTrail, onClose }) {
	const photoInputRef = useRef();

	const [urlInputValue, setUrlInputValue] = useState('');
	const [imageTitle, setImageTitle] = useState('');
	const [imageDescription, setImageDescription] = useState('');
	const [imageAuthor, setImageAuthor] = useState('');
	const [imageCopyright, setImageCopyright] = useState('');
	const [imageSource, setImageSource] = useState('');
	const [imageSourceURL, setImageSourceURL] = useState('');
	const [imageLicenseName, setImageLicenseName] = useState('');
	const [needsAttribution, setNeedsAttribution] = useState(false);
	const [imageLicenseVersion, setImageLicenseVersion] = useState(
		CC_LICENSE_LATEST_VERSION,
	);
	const [licenseHasVersions, setLicenseHasVersions] = useState(false);
	const [previewImages, setPreviewImages] = useState([]);
	const [isPreview, setIsPreview] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const initialTrailState = {
		title: '',
		description: '',
		infoUrl: '',
		country: '',
		state: '',
		facts: {
			distance: '',
			time: {
				timeAmount: '',
				timeType: '',
			},
			direction: '',
			difficulty: '',
			ownGear: '',
			environment: '',
			elevation: {
				lowest: '',
				highest: '',
			},
		},
		temperatures: {
			summer: {
				sumMin: '',
				sumMax: '',
			},
			autumn: {
				autMin: '',
				autMax: '',
			},
			winter: {
				winMin: '',
				winMax: '',
			},
			spring: {
				sprMin: '',
				sprMax: '',
			},
		},
		trailImages: [],
	};

	//   TODO: Save 'newTrailPreview' to a context instead of a component state
	const [newTrailPreview, setNewTrailPreview] = useState(initialTrailState);

	function loadTestData() {
		setNewTrailPreview(trailData);
	}

	function inputChangeHandler(event) {
		event.preventDefault();

		const targetInput = event.target;
		const { name, value, type } = targetInput;

		if (type === 'textarea') {
			targetInput.parentNode.dataset.replicatedValue = value;
		}

		if (name === 'imageTitle') {
			setImageTitle(value);
			return;
		}

		if (name === 'imageDescription') {
			setImageDescription(value);
			return;
		}

		if (name === 'imageURL') {
			setUrlInputValue(value);
			return;
		}

		if (name === 'imageAuthor') {
			setImageAuthor(value);
			return;
		}

		if (name === 'imageCopyright') {
			setImageCopyright(value);
		}

		if (name === 'imageSource') {
			setImageSource(value);
			return;
		}

		if (name === 'imageSourceURL') {
			setImageSourceURL(value);
			return;
		}

		if (name === 'imageLicenseName') {
			let hasVersion = true;

			if (value === '' || value === 'PDM' || value === 'CC0') {
				hasVersion = false;
				setImageLicenseVersion(CC_LICENSE_PDM_VERSION);
				setNeedsAttribution(false);
			} else {
				setImageLicenseVersion(CC_LICENSE_LATEST_VERSION);
				setNeedsAttribution(true);
			}

			setImageLicenseName(value);
			setLicenseHasVersions(hasVersion);
			return;
		}

		if (name === 'licenseVersion') {
			setImageLicenseVersion(value);
			return;
		}

		setNewTrailPreview(prevTrailState => {
			const newTrailState = createNewObject(prevTrailState, name, value);

			return newTrailState;
		});
	}

	function uploadImageHandler(evnt) {
		evnt.preventDefault();

		const files = evnt.target.files;

		if (!files) return;

		const fileListArray = [...files];

		fileListArray.forEach(file => {
			// TODO: `file.attribution` and `file.description` needs to be set once user accounts are implemented
			file.description = null;
			file.attribution = null;

			// TODO: `file.name` may need to be unique (randomly generated?). Is this possible?

			setIsLoading(true);

			compressImage(
				file,
				createPreviewImages,
				IMAGE_MAX_WIDTH,
				THUMBNAIL,
				THUMBNAIL_MAX_WIDTH,
			);
		});
	}

	function createPreviewImages(imageData) {
		setPreviewImages(prevPreviewState => {
			return [...prevPreviewState, imageData];
		});

		setIsLoading(false);
	}

	async function submitUrlHandler(e) {
		e.preventDefault();

		const file = await makeFileFromUrl(urlInputValue);

		const licenceBaseURL = CC_LICENSE_BASE_URLS[`URL_${imageLicenseName}`];
		const imageLicenseURL = `${licenceBaseURL}${imageLicenseVersion}`;

		const title = imageTitle ? imageTitle : 'Photo';

		const acronymArray = imageLicenseName.split('_');
		const firstAcronymEl = acronymArray.shift();

		const licenseAcronym = firstAcronymEl + ' ' + acronymArray.join('-');

		let attributionHTML = null;

		if (imageLicenseName !== 'PDM' && imageLicenseName !== 'CC0') {
			attributionHTML = `<p>${title}<br>by <a href="${imageSourceURL}">${imageAuthor}</a>,<br><a href="${imageLicenseURL}">${licenseAcronym} ${imageLicenseVersion}</a><br>${
				imageCopyright ? imageCopyright : ''
			}via ${imageSource}</p>`;
		}

		file.description = imageDescription || null;
		file.attribution = attributionHTML;

		setIsLoading(true);

		compressImage(
			file,
			createPreviewImages,
			IMAGE_MAX_WIDTH,
			THUMBNAIL,
			THUMBNAIL_MAX_WIDTH,
		);

		setUrlInputValue('');
		setImageTitle('');
		setImageDescription('');
		setImageAuthor('');
		setImageCopyright('');
		setImageSource('');
		setImageSourceURL('');
		setImageLicenseName('');
		setNeedsAttribution(false);
		setLicenseHasVersions(false);
		setImageLicenseVersion(CC_LICENSE_LATEST_VERSION);
	}

	async function makeFileFromUrl(url) {
		try {
			const response = await fetch(url);
			const blob = await response.blob();

			if (!response.ok) {
				throw new Error(`Something went wrong: ${blob.status}`);
			}

			const fileName = url.split('/').pop();
			const fileMetadata = {
				type: blob.type,
				size: blob.size,
			};

			const file = new File([blob], fileName, fileMetadata);

			return file;
		} catch (error) {
			console.error(error.message);
		}
	}

	function displayTrailPreviewHandler(e) {
		e.preventDefault();

		setIsPreview(true);
	}

	function closePreviewHandler(e) {
		e.preventDefault();

		setIsPreview(false);
	}

	function submitNewTrailHandler() {
		onSubmitNewTrail(newTrailPreview, previewImages);
	}

	function clearNewTrailForm() {
		setNewTrailPreview(initialTrailState);
	}

	const { facts, temperatures } = newTrailPreview;
	const { timeAmount, timeType } = facts.time;
	const { lowest, highest } = facts.elevation;
	const { summer, autumn, winter, spring } = temperatures;

	const {
		NAME_PDM,
		NAME_CC0,
		NAME_CC_BY,
		NAME_CC_BY_SA,
		NAME_CC_BY_NC,
		NAME_CC_BY_NC_SA,
		NAME_CC_BY_NC_ND,
		NAME_CC_BY_ND,
	} = CC_LICENSE_NAMES;

	const {
		form_container,
		title,
		description,
		textarea_grow_wrap,
		info_url,
		location_container,
		country,
		state,
		facts_container,
		image_input_container,
		photo_input_container,
		photoInput,
		url_input_container,
		url_input_wrapper,
		photo_preview,
		preview_header_wrapper,
		preview_wrapper,
		preveiw_spinner,
	} = classes;

	const disableAddURLBtn = imageLicenseName === '';

	const attributionInputs = (
		<Fragment>
			<label htmlFor="trailImageTitle">
				Enter Image Title (if supplied)
			</label>
			<input
				id="trailImageTitle"
				type="text"
				name="imageTitle"
				value={imageTitle}
				onChange={inputChangeHandler}
			/>
			<label htmlFor="trailImageAuthor">Enter Image Author</label>
			<input
				type="text"
				id="trailImageAuthor"
				name="imageAuthor"
				value={imageAuthor}
				onChange={inputChangeHandler}
			/>
			<label htmlFor="trailImageCopyright">
				Enter Image Copyright Notice (if supplied)
			</label>
			<input
				type="text"
				id="trailImageCopyright"
				name="imageCopyright"
				value={imageCopyright}
				onChange={inputChangeHandler}
			/>
			<label htmlFor="trailImageSource">
				Enter Image Source (i.e. website where the image was published)
			</label>
			<input
				type="text"
				id="trailImageSource"
				name="imageSource"
				value={imageSource}
				onChange={inputChangeHandler}
			/>
			<label htmlFor="trailImageSourceURL">Enter Image Source URL</label>
			<input
				type="text"
				id="trailImageSourceURL"
				name="imageSourceURL"
				value={imageSourceURL}
				onChange={inputChangeHandler}
			/>
		</Fragment>
	);

	const spinner = (
		<div className="spinner">
			<svg className={preveiw_spinner}>
				<use href={`${icons}#icon-loader`}></use>
			</svg>
		</div>
	);

	return (
		<Fragment>
			{isPreview && (
				<Fragment>
					<TrailPage
						trailData={newTrailPreview}
						trailImages={previewImages}
					/>
					<div className="action_btns pad-30">
						<button
							className="btn btn_red"
							onClick={closePreviewHandler}
						>
							Close
						</button>
						<button
							className="btn btn_green"
							onClick={submitNewTrailHandler}
						>
							Submit
						</button>
					</div>
				</Fragment>
			)}

			{!isPreview && (
				<form className={form_container}>
					<div className={title}>
						<label htmlFor="title">Trail title:</label>
						<input
							type="text"
							id="title"
							name="title"
							value={newTrailPreview.title}
							placeholder="Please enter a title for the trail."
							required
							onChange={inputChangeHandler}
						/>
					</div>
					<div className={description}>
						<label htmlFor="trailDescription">
							Trail description:
						</label>
						<div className={textarea_grow_wrap}>
							<textarea
								id="trailDescription"
								name="description"
								value={newTrailPreview.description}
								placeholder="Please enter a description for the trail."
								rows="3"
								required
								onChange={inputChangeHandler}
							/>
						</div>
					</div>
					<div className={info_url}>
						<label htmlFor="info-url">
							URL for more trail info:
						</label>
						<input
							type="url"
							id="info-url"
							name="infoUrl"
							value={newTrailPreview.infoUrl}
							placeholder="E.g.: https://website.com"
							required
							onChange={inputChangeHandler}
						/>
					</div>
					<div className={location_container}>
						<div className={country}>
							<label htmlFor="country">Trail Country:</label>
							<input
								type="text"
								id="country"
								name="country"
								value={newTrailPreview.country}
								placeholder="E.g. Australia"
								required
								onChange={inputChangeHandler}
							/>
						</div>
						<div className={state}>
							<label htmlFor="state">Trail State:</label>
							<input
								type="text"
								id="state"
								name="state"
								value={newTrailPreview.state}
								placeholder="E.g.: Queensland"
								required
								onChange={inputChangeHandler}
							/>
						</div>
					</div>
					<div className={facts_container}>
						<div>
							<label htmlFor="distance">
								Trail distance (km):
							</label>
							<input
								type="number"
								id="distance"
								name="distance"
								value={facts.distance}
								required
								onChange={inputChangeHandler}
							/>
						</div>
						<div>
							<label>
								Time to Complete:
								<input
									type="number"
									name="timeAmount"
									value={timeAmount}
									required
									onChange={inputChangeHandler}
								/>
								<select
									name="timeType"
									value={timeType}
									onChange={inputChangeHandler}
								>
									<option value="hours">Hours</option>
									<option value="days">Days</option>
								</select>
							</label>
						</div>
						<div>
							<label htmlFor="direction">Trail direction:</label>
							<select
								id="direction"
								name="direction"
								value={facts.direction}
								required
								onChange={inputChangeHandler}
							>
								<option value="">
									--Please Choose an Option--
								</option>
								<option value="One-way">One Way</option>
								<option value="Loop">Loop</option>
							</select>
						</div>
						<div>
							<label htmlFor="difficulty">
								Trail difficulty:
							</label>
							<select
								id="difficulty"
								name="difficulty"
								value={facts.difficulty}
								required
								onChange={inputChangeHandler}
							>
								<option value="">
									--Please Select Difficulty--
								</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</select>
						</div>
						<div>
							<label htmlFor="own-gear">Carry own gear?</label>
							<select
								id="own-gear"
								name="ownGear"
								value={facts.ownGear}
								required
								onChange={inputChangeHandler}
							>
								<option value="">
									--Please Select an Option--
								</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>
						</div>
						<div>
							<label htmlFor="environment">
								Trail environment:
							</label>
							<input
								type="text"
								id="environment"
								name="environment"
								value={facts.environment}
								placeholder="E.g.: Remote Alpine"
								required
								onChange={inputChangeHandler}
							/>
						</div>
						<h3>Elevation</h3>
						<div>
							<label htmlFor="elevation-low">Lowest:</label>
							<input
								type="number"
								id="elevation-low"
								name="lowest"
								value={lowest}
								required
								onChange={inputChangeHandler}
							/>
						</div>
						<div>
							<label htmlFor="elevation-high">Highest:</label>
							<input
								type="number"
								id="elevation-high"
								name="highest"
								value={highest}
								required
								onChange={inputChangeHandler}
							/>
						</div>
					</div>
					<h3>Temperatures</h3>
					<div>
						<h4>Summer</h4>
						<div>
							<label htmlFor="summer-min">Min:</label>
							<input
								type="number"
								id="summer-min"
								name="sumMin"
								step="0.1"
								value={summer.sumMin}
								required
								onChange={inputChangeHandler}
							/>
						</div>
						<div>
							<label htmlFor="summer-max">Max:</label>
							<input
								type="number"
								id="summer-max"
								name="sumMax"
								step="0.1"
								value={summer.sumMax}
								required
								onChange={inputChangeHandler}
							/>
						</div>
					</div>
					<div>
						<div>
							<h4>Autumn</h4>
							<div>
								<label htmlFor="autumn-min">Min:</label>
								<input
									type="number"
									id="autumn-min"
									name="autMin"
									step="0.1"
									value={autumn.autMin}
									required
									onChange={inputChangeHandler}
								/>
							</div>
							<div>
								<label htmlFor="autumn-max">Max:</label>
								<input
									type="number"
									id="autumn-max"
									name="autMax"
									step="0.1"
									value={autumn.autMax}
									required
									onChange={inputChangeHandler}
								/>
							</div>
						</div>
						<h4>Winter</h4>
						<div>
							<label htmlFor="winter-min">Min:</label>
							<input
								type="number"
								id="winter-min"
								name="winMin"
								step="0.1"
								value={winter.winMin}
								required
								onChange={inputChangeHandler}
							/>
						</div>
						<div>
							<label htmlFor="winter-max">Max:</label>
							<input
								type="number"
								id="winter-max"
								name="winMax"
								step="0.1"
								value={winter.winMax}
								required
								onChange={inputChangeHandler}
							/>
						</div>
					</div>
					<div>
						<h4>Spring</h4>
						<div>
							<label htmlFor="spring-min">Min:</label>
							<input
								type="number"
								id="spring-min"
								name="sprMin"
								step="0.1"
								value={spring.sprMin}
								required
								onChange={inputChangeHandler}
							/>
						</div>
						<div>
							<label htmlFor="spring-max">Max:</label>
							<input
								type="number"
								id="spring-max"
								name="sprMax"
								step="0.1"
								value={spring.sprMax}
								required
								onChange={inputChangeHandler}
							/>
						</div>
					</div>
					<div className={image_input_container}>
						<div className={photo_input_container}>
							<label htmlFor="trailPhoto">Select a photo:</label>
							<input
								id="trailPhoto"
								type="file"
								name="trailPhoto"
								accept="image/*"
								multiple
								ref={photoInputRef}
								onChange={uploadImageHandler}
								className={photoInput}
							/>
							<button
								className="btn btn_blue"
								type="button"
								onClick={() => photoInputRef.current.click()}
							>
								Upload Photos
							</button>
						</div>
						<p>OR</p>
						<div className={url_input_container}>
							<div className={url_input_wrapper}>
								<label htmlFor="trailImageURL">
									Enter Image File URL (i.e. the URL where the
									image lives)
								</label>
								<input
									id="trailImageURL"
									type="text"
									name="imageURL"
									value={urlInputValue}
									onChange={inputChangeHandler}
								/>
								<label htmlFor="trailImageDescription">
									Enter Image Description (optional)
								</label>
								<input
									id="trailImageDescription"
									type="text"
									name="imageDescription"
									value={imageDescription}
									onChange={inputChangeHandler}
								/>
								<label htmlFor="imageLicenseName">
									Select appropriate image re-use license:
								</label>
								<select
									id="imageLicenseName"
									name="imageLicenseName"
									value={imageLicenseName}
									onChange={inputChangeHandler}
								>
									<option value="">
										--Please Select a License--
									</option>
									<option value="PDM">{NAME_PDM}</option>
									<option value="CC0">{NAME_CC0}</option>
									<option value="CC_BY">{NAME_CC_BY}</option>
									<option value="CC_BY_SA">
										{NAME_CC_BY_SA}
									</option>
									<option value="CC_BY_NC">
										{NAME_CC_BY_NC}
									</option>
									<option value="CC_BY_NC_SA">
										{NAME_CC_BY_NC_SA}
									</option>
									<option value="CC_BY_NC_ND">
										{NAME_CC_BY_NC_ND}
									</option>
									<option value="CC_BY_ND">
										{NAME_CC_BY_ND}
									</option>
								</select>
								<label>
									Version
									<select
										name="licenseVersion"
										value={imageLicenseVersion}
										onChange={inputChangeHandler}
										disabled={!licenseHasVersions}
									>
										<option value="4.0">4.0</option>
										<option value="3.0">3.0</option>
										<option value="2.5">2.5</option>
										<option value="2.0">2.0</option>
										<option value="1.0">1.0</option>
									</select>
								</label>
								{needsAttribution && attributionInputs}
							</div>
							<button
								className="btn btn_blue"
								type="button"
								onClick={submitUrlHandler}
								disabled={disableAddURLBtn}
							>
								Add
							</button>
						</div>
					</div>
					<div className={photo_preview}>
						<div className={preview_header_wrapper}>
							<h3>Uploaded Photos:</h3>
							{isLoading && spinner}
						</div>
						<div className={preview_wrapper}>
							{previewImages.length ? (
								<PhotoGallery photos={previewImages} />
							) : (
								''
							)}
						</div>
					</div>
					<div className="action_btns">
						<div className="clear_close_btn_group">
							<button
								className="btn btn_red"
								type="button"
								onClick={onClose}
							>
								Close
							</button>
							<button
								className="btn btn_yellow"
								type="button"
								onClick={clearNewTrailForm}
							>
								Clear
							</button>
						</div>
						<button
							className="btn btn_green"
							type="button"
							onClick={displayTrailPreviewHandler}
						>
							Preview
						</button>
					</div>
					{/* Removes below button before building for production */}
					<button
						className="btn btn_test"
						type="button"
						onClick={loadTestData}
					>
						Load
					</button>
					{/* *************************************************** */}
				</form>
			)}
		</Fragment>
	);
}

