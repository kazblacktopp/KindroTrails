import { Fragment, useState, useContext } from 'react';
import { useDatabase } from '../../hooks/use-database';
import TrailContext from '../../store/trail-context';
import Card from '../UI/Card/Card';
import NewTrailForm from './NewTrailForm';

export default function NewTrail({ onClose, onViewTrail }) {
	const { uploadToStorage, updateDatabase, queryDatabase, isLoading, error } =
		useDatabase();
	const [trailName, setTrailName] = useState('');
	const [newTrailID, setNewTrailID] = useState(null);
	const [message, setMessage] = useState(null);
	const trailCxt = useContext(TrailContext);

	async function uploadNewTrailHandler(newTrailData, newTrailImages) {
		setMessage(null);
		setTrailName(newTrailData.title);

		const trailID = newTrailData.title.toLowerCase().split(' ').join('_');

		const lowercaseTitle = newTrailData.title.toLowerCase();
		const lowercaseCountry = newTrailData.country.toLowerCase();
		const lowercaseState = newTrailData.state.toLowerCase();

		try {
			const uploadedImagesArray = await uploadImage(
				newTrailImages,
				trailID,
			);

			const newTrailObj = {
				...newTrailData,
				id: trailID,
				title: lowercaseTitle,
				country: lowercaseCountry,
				state: lowercaseState,
				trailImages: [...uploadedImagesArray],
			};

			const updateIsSuccessful = await updateDatabase(newTrailObj);

			if (!updateIsSuccessful)
				throw new Error('Database update was unsuccessful.');

			// TODO: The below database query needs testing
			queryDatabase({
				queryType: 'trails',
				queryID: trailID,
				dataProcessFn: trailCxt.updateTrails,
			});

			setNewTrailID(trailID);

			setMessage('Trail uploaded successfully!');
		} catch (err) {
			console.error('uploadNewTrailHandler: ', err);
		}
	}

	async function uploadImage(imageDataArray, trailID) {
		try {
			const uploadedImagesObjArray = await Promise.all(
				imageDataArray.map(async imageObj => {
					const {
						imageFullscreen,
						imageThumbnail,
						imageAttribution,
					} = imageObj;

					const uploadedFullscreenData = await uploadToStorage(
						imageFullscreen,
						trailID,
					);

					const isThumbnail = true;

					const uploadedThumbnailData = await uploadToStorage(
						imageThumbnail,
						trailID,
						isThumbnail,
					);

					if (!uploadedFullscreenData || !uploadedThumbnailData)
						throw new Error('Unable to upload image to storage');

					const { url: fullscreenURL, metadata: fullscreenMetadata } =
						uploadedFullscreenData;

					const { url: thumbnailURL, metadata: thumbnailMetadata } =
						uploadedThumbnailData;

					const uploadedImageObj = {
						imageFullscreen: {
							image: fullscreenURL,
							name: imageFullscreen.name,
							size: fullscreenMetadata.size,
							width: imageFullscreen.width,
							height: imageFullscreen.height,
						},
						imageThumbnail: {
							image: thumbnailURL,
							name: imageThumbnail.name,
							size: thumbnailMetadata.size,
							width: imageThumbnail.width,
							height: imageThumbnail.height,
						},
						imageAttribution,
					};

					return uploadedImageObj;
				}),
			);

			return uploadedImagesObjArray;
		} catch (err) {
			console.error('uploadImage: ', err);
		}
	}

	function viewTrailHandler() {
		setMessage(null);
		onViewTrail(newTrailID);
	}

	function closeMessageHandler() {
		setMessage(null);
		onClose();
	}

	let content = (
		<NewTrailForm
			onSubmitNewTrail={uploadNewTrailHandler}
			onClose={onClose}
		/>
	);

	if (isLoading && !error && !message) {
		content = (
			<div className="msg_card">
				<Card>
					<p>{`Uploading ${trailName} ...`}</p>
				</Card>
			</div>
		);
	}

	if (message && !error && !isLoading) {
		content = (
			<div className="msg_card">
				<Card>
					<p>{message}</p>
					<div className="action_btns">
						<button
							className="btn btn_red"
							onClick={closeMessageHandler}
						>
							Close
						</button>
						<button
							className="btn btn_green"
							onClick={viewTrailHandler}
						>
							View Trail
						</button>
					</div>
				</Card>
			</div>
		);
	}

	if (error) {
		content = (
			<div className="msg_card">
				<Card>
					<p>{`Something went wrong: ${error}`}</p>
					<button
						className="btn btn_red"
						onClick={closeMessageHandler}
					>
						Close
					</button>
				</Card>
			</div>
		);
	}

	return <Fragment>{content}</Fragment>;
}

