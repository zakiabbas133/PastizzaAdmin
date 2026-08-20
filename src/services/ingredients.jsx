import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';


export const getIngredients = async () => {
  try {
    const ingredientsRef = collection(
      db,
      'ingredients'
    );

    const snapshot = await getDocs(
      ingredientsRef
    );

    const ingredients = snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    return {
      success: true,
      data: ingredients,
    };
  } catch (error) {
    console.error(
      'Error fetching ingredients:',
      error
    );

    return {
      success: false,
      data: [],
      error:
        error?.message ||
        'Failed to fetch ingredients.',
    };
  }
};