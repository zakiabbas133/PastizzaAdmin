import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';


export const getAllergens = async () => {
  try {
    const allergensRef = collection(
      db,
      'allergens'
    );

    const allergensQuery = query(
      allergensRef,
      where('isActive', '==', true)
    );

    const snapshot = await getDocs(
      allergensQuery
    );

    const allergens = snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    return {
      success: true,
      data: allergens,
    };
  } catch (error) {
    console.error(
      'Error fetching allergens:',
      error
    );

    return {
      success: false,
      data: [],
      error:
        error?.message ||
        'Failed to fetch allergens.',
    };
  }
};