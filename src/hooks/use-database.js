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
	child,
	get,
} from 'firebase/database';
import { firebaseConfig } from '../config/firebaseConfig';
import { useState, useCallback } from 'react';

export function useDatabase() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const app = initializeApp(firebaseConfig);
	const storage = getStorage(app);
	const database = getDatabase(app);

	async function uploadToStorage(imageDataObj, trailID, isThumbnail = false) {
		setError(null);
		setIsLoading(true);

		const { name, image, width, height } = imageDataObj;

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
				fileMetadata,
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
		} catch (err) {
			console.error('uploadToStorage: ', err);
			setIsLoading(false);
			setError(`Something went wrong! Failed to upload image!`);
		}
	}

	async function updateDatabase(trailObj) {
		setError(null);
		setIsLoading(true);

		const { id, country, state, facts } = trailObj;

		const trailCountry = country.split(' ').join('_');
		const trailState = state.split(' ').join('_');

		const { difficulty } = facts;

		const updates = {};

		updates[`/trails/${id}`] = trailObj;
		updates[`/trailIDs/${id}`] = true;
		updates[`/trailGrades/grade_${difficulty}/${id}`] = true;
		updates[`/pendingTrails/${id}`] = null;
		updates[`/trailLocations/${trailCountry}/${trailState}/${id}`] = true;

		const dbRef = createRefInDatabase(database);

		try {
			const updateResult = await update(dbRef, updates);

			if (updateResult) {
				throw new Error(updateResult);
			}

			setIsLoading(false);

			return true;
		} catch (err) {
			console.err('updateDatabase: ', err);
			setIsLoading(false);
			setError(`Something went wrong! Failed to upload Trail.`);
		}
	}

	const queryDatabase = useCallback(
		async function ({ queryType, queryID = '' }) {
			setIsLoading(true);
			setError(null);

			try {
				if (!queryType) {
					throw new Error('Please provide a `queryType` parameter.');
				}

				const dbRef = createRefInDatabase(database);

				const queryRef = '/' + queryType + '/' + queryID;

				if (!queryRef) {
					throw new Error(
						'queryRef is undefined. Please check the `queryType` and `queryID` parameters are correct.',
					);
				}

				const snapshot = await get(child(dbRef, queryRef));

				if (!snapshot.exists()) {
					throw new Error('Database query snapshot does not exist.');
				}

				const data = snapshot.val();

				setIsLoading(false);

				return data;
			} catch (err) {
				console.error('queryDatabase: ', err);
				setIsLoading(false);
				setError(
					'Something went wrong! Unable to query database. Please try a different query.',
				);
			}
		},
		[database],
	);

	return {
		queryDatabase,
		updateDatabase,
		uploadToStorage,
		isLoading,
		error,
	};
}

