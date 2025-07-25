// types/message.ts
import { Timestamp } from 'firebase/firestore'; // Импортируем тип Timestamp

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  content: string;
  timestamp: Timestamp; // Теперь это тип Timestamp
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  seen?: boolean;
}
