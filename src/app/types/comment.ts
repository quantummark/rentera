import { Timestamp } from 'firebase/firestore';

export interface CommentType {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  content: string;
  createdAt: Timestamp | null; // ISO строка
  contextType: 'owner' | 'renter' | 'listings';
  contextId: string;
  reply?: {
    text: string;
    createdAt: string; // ISO строка
  };
}
