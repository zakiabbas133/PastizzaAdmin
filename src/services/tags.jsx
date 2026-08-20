import {
	collection,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';


export const getTags = async () => {
	try {
		const tagsRef = collection(
			db,
			'tags'
		);

		const tagsQuery = query(
			tagsRef,
			where('isActive', '==', true)
		);

		const snapshot = await getDocs(
			tagsQuery
		);

		const tags = snapshot.docs.map(
			(doc) => ({
				id: doc.id,
				...doc.data(),
			})
		);

		return {
			success: true,
			data: tags,
		};
	} catch (error) {
		console.error(
			'Error fetching tags:',
			error
		);

		return {
			success: false,
			data: [],
			error:
				error?.message ||
				'Failed to fetch tags.',
		};
	}
};