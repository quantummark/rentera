import { db } from '@/app/firebase/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function patchOwner(uid: string, patch: Record<string, unknown>) {
  await updateDoc(doc(db, 'owner', uid), { ...patch, updatedAt: serverTimestamp() });
}
export async function patchRenter(uid: string, patch: Record<string, unknown>) {
  await updateDoc(doc(db, 'renter', uid), { ...patch, updatedAt: serverTimestamp() });
}
export async function patchListing(id: string, patch: Record<string, unknown>) {
  await updateDoc(doc(db, 'listings', id), { ...patch, updatedAt: serverTimestamp() });
}