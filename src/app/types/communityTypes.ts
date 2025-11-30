import { Timestamp } from 'firebase/firestore';

export type CommunityTopic =
  | 'experience'
  | 'roommates'
  | 'household'
  | 'moving'
  | 'finance'
  | 'fun'
  | 'recommendations';

export type CommunityAuthorRole = 'owner' | 'renter';

export type CommunityPostStatus = 'active' | 'hidden' | 'archived';

export interface CommunityPost {
  // автор
  authorUid: string;
  authorRole: CommunityAuthorRole;
  authorName: string;
  authorAvatarUrl?: string;
  authorCity?: string;

  // содержимое
  topic: CommunityTopic;
  city?: string; // місто/район, до якого відноситься пост
  content: string;
  images: string[]; // масив URL’ів (може бути [])

  // счётчики
  likesCount: number;
  commentsCount: number;
  savesCount: number;

  // служебное
  createdAt: Timestamp;
  lastActivityAt: Timestamp;
  isPinned: boolean;
  isDeleted: boolean;
  status: CommunityPostStatus;

  // на будущее для красивых URL
  slug?: string | null;
}

// То, что реально будем использовать повсюду
export interface CommunityPostWithId extends CommunityPost {
  id: string;
}
