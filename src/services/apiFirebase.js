//* Import firebase compat packages, instead of modular packages, to support the FirebaseUI widget - compat packages to be removed after FirebaseUI widget is updated to support v9+ modular SDK
// import { initializeApp } from 'firebase/app'; //* v9 modular package import
// import { getAuth } from 'firebase/auth'; //* v9 modular package import
import firebase from 'firebase/compat/app'; //* compat namespace package import
import 'firebase/compat/auth'; //* compat namespace package import

import {
	getDatabase,
	ref as createRefInDatabase,
	child,
	get,
} from 'firebase/database';
import { firebaseConfig } from '../config/firebaseConfig';

//* Initialise app using compat namespace method instead of v9 modular function
// const app = initializeApp(firebaseConfig); //* v9 modular function
const app = firebase.initializeApp(firebaseConfig); //* compat namespace method

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
