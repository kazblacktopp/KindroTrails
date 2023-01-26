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
	onValue,
	update,
	off,
} from 'firebase/database';
import { firebaseConfig } from '../config/firebaseConfig';
import { useState } from 'react';

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

	function queryDatabase({ dataProcessFn, queryType, queryID = '' }) {
		setIsLoading(true);
		setError(null);

		try {
			if (!queryType) {
				throw new Error('Please provide a `queryType` parameter.');
			}

			if (!dataProcessFn || typeof dataProcessFn !== 'function') {
				throw new Error(
					'Please provide the required dataProcessFn function parameter in order to process data returned from the database.',
				);
			}

			let id = queryID;

			if (queryType !== 'trails') {
				id = '';
			}

			// TODO: The below queryRef needs testing
			const queryRef = createRefInDatabase(
				database,
				'/' + queryType + '/' + id,
			);

			if (!queryRef) {
				throw new Error(
					'queryRef is undefined. Please check the `queryType` and `queryID` parameters are correct.',
				);
			}

			// Remove all existing event listeners of eventType: 'value' from the queryRef
			off(queryRef, 'value');

			// Executes `dataProcessFn` then applies an event listener of type: 'value', with `dataProcessFn` as the event callback. An event is triggered whenever a change is made in the database at the queryRef (including child nodes)
			onValue(queryRef, snapshot => {
				if (!snapshot.exists()) {
					throw new Error('Database query snapshot does not exist.');
				}

				const data = snapshot.val();

				dataProcessFn(data);
				setIsLoading(false);
			});
		} catch (err) {
			console.error('queryDatabase: ', err);
			setIsLoading(false);
			setError(
				'Something went wrong! Unable to query database. Please try a different query.',
			);
		}
	}

	return { queryDatabase, updateDatabase, uploadToStorage, isLoading, error };
}

