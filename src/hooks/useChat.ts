// hooks/useChat.ts
import { useEffect, useState, useCallback } from 'react';
import { db } from '@/app/firebase/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

type Message = {
  id?: string;
  text: string;
  senderId: string;
  timestamp: any;
  read: boolean;
};

type Chat = {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastUpdated?: any;
};

export function useChat(currentUserId: string, otherUserId: string) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔐 Генерация chatId (uid1 + uid2 отсортированные)
  const generateChatId = useCallback(() => {
    return [currentUserId, otherUserId].sort().join('_');
  }, [currentUserId, otherUserId]);

  // 🔄 Загрузка или создание чата
  const initChat = useCallback(async () => {
    const id = generateChatId();
    setChatId(id);

    const chatRef = doc(db, 'chats', id);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: [currentUserId, otherUserId],
        lastMessage: '',
        lastUpdated: serverTimestamp(),
      });
    }

    // Подписка на сообщения
    const messagesRef = collection(db, 'chats', id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Message),
      }));
      setMessages(msgs);
      setIsLoading(false);
    });
  }, [currentUserId, otherUserId, generateChatId]);

  // ✉️ Отправка сообщения
  const sendMessage = async (text: string) => {
    if (!chatId || !text.trim()) return;

    const message = {
      text,
      senderId: currentUserId,
      timestamp: serverTimestamp(),
      read: false,
    };

    await addDoc(collection(db, 'chats', chatId, 'messages'), message);
    await setDoc(
      doc(db, 'chats', chatId),
      {
        lastMessage: text,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  };

  useEffect(() => {
    if (currentUserId && otherUserId) {
      const unsubscribe = initChat();
      return () => {
        unsubscribe?.then((u) => u());
      };
    }
  }, [initChat, currentUserId, otherUserId]);

  return {
    messages,
    isLoading,
    sendMessage,
    chatId,
  };
}
