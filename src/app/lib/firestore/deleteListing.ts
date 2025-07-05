// lib/firestore/deleteListing.ts

import { db } from '@/app/firebase/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

/**
 * Удаляет объект аренды и связанные с ним фото из Firebase.
 * @param listingId ID документа (объекта)
 */
export async function deleteListing(listingId: string): Promise<void> {
  try {
    const docRef = doc(db, 'listings', listingId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`Объект с ID ${listingId} не найден.`);
      return;
    }

    const data = docSnap.data();
    const photos: string[] = data.photos || [];

    // Удаляем фото из Firebase Storage
    const storage = getStorage();
    const deletePhotoPromises = photos.map(async (url) => {
      try {
        const decodedUrl = decodeURIComponent(url.split('?')[0]);
        const path = decodedUrl.split('/o/')[1];
        if (!path) return;

        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
      } catch (err) {
        console.warn(`Не удалось удалить фото: ${url}`, err);
      }
    });

    await Promise.all(deletePhotoPromises);

    // Удаляем сам документ
    await deleteDoc(docRef);
    console.log(`Объект с ID ${listingId} успешно удалён.`);
  } catch (error) {
    console.error(`Ошибка при удалении объекта ${listingId}:`, error);
    throw new Error('Не удалось удалить объект.');
  }
}
