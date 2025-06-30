// firebase/storage.ts
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import app from '@/app/firebase/firebase';

const storage = getStorage(app);

export const uploadListingPhoto = async (file: File, listingId: string): Promise<string> => {
  const uniqueName = `${uuidv4()}-${file.name}`;
  const storageRef = ref(storage, `listings/${listingId}/${uniqueName}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

export const deleteListingPhoto = async (url: string): Promise<void> => {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
};
