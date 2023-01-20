const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp();

import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'


export const getProducts = async() => {
    const db = getFirestore()
    const itemsCollection = query(collection(db, "ItemsList"), where('category', '==', categoryId))

    const productsRequest = await getDocs(itemsCollection)
    const products = productsRequest.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    return products
}

export const getSingleProduct = async (productId) => {
    const db = getFirestore()

    const productRef = db.collection('ItemsList').doc(productId);
    const doc = await productRef.get();
    if (!doc.exists) {
        return 'No such document!';
    } else {
        return doc.data();
    }

}