import { initializeApp } from 'firebase/app';
import {
	getDatabase,
	ref as createRefInDatabase,
	child,
	get,
} from 'firebase/database';
import { firebaseConfig } from '../config/firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export async function queryDatabase({ queryType, queryID = '' }) {
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

		const data = snapshot.val();

		return data;
	} catch (err) {
		console.error('queryDatabase: ', err);
	}
}
