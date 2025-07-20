// types/message.ts
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  content: string;
  timestamp: any; // Firestore Timestamp
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  seen?: boolean;
}
