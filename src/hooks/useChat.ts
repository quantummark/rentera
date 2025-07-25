'use client';

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
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Импортируем Timestamp из Firebase

type Message = {
  id?: string;
  text: string;
  senderId: string;
  timestamp: Timestamp; // Используем тип Timestamp
  read: boolean;
  lastMessage?: string;
  lastUpdated?: Timestamp; // Используем тип Timestamp для последнего обновления
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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Message),
      }));
      setMessages(msgs);
      setIsLoading(false);
    });

    return unsubscribe; // Возвращаем функцию отписки
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

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), message);
      await setDoc(
        doc(db, 'chats', chatId),
        {
          lastMessage: text,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (currentUserId && otherUserId) {
      initChat().then((unsub) => {
        unsubscribe = unsub;
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Отписываемся от подписки при размонтировании компонента
      }
    };
  }, [initChat, currentUserId, otherUserId]);

  return {
    messages,
    isLoading,
    sendMessage,
    chatId,
  };
}
