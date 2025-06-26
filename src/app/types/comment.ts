export interface CommentType {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  content: string;
  createdAt: string; // ISO строка
  contextType: 'owner' | 'renter' | 'listings';
  contextId: string;
  reply?: {
    text: string;
    createdAt: string; // ISO строка
  };
}
