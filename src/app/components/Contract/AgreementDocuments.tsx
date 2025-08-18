'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { Download } from 'lucide-react';

interface AgreementDocument {
  ownerId: string;
  renterId: string;
  id: string;
  title: string;
  createdAt: string;
  pdfUrl: string;
}

export default function AgreementDocuments() {
  const [userType, userProfile] = useUserTypeWithProfile();
  const [documents, setDocuments] = useState<AgreementDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userType || !userProfile) return;

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const docRef = collection(db, 'agreements');
        const q = query(docRef, where(userType === 'owner' ? 'ownerId' : 'renterId', '==', userProfile?.uid));
        const snapshot = await getDocs(q);
        const docs: AgreementDocument[] = snapshot.docs
          .filter((doc) => doc.data().status === 'signed' && doc.data().pdfUrl) // только подписанные с PDF
          .map((doc) => ({
            id: doc.id,
            ownerId: doc.data().ownerId,
            renterId: doc.data().renterId,
            title: doc.data().title || 'Договор',
            createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || '',
            pdfUrl: doc.data().pdfUrl,
          }));
        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, [userType, userProfile]);

  if (loading) return <p className="text-center py-4">Загрузка документов...</p>;

  if (!documents.length)
    return <p className="text-center py-4 text-muted-foreground">Нет подписанных документов.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <div key={doc.id} className="bg-card p-4 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-foreground">{doc.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">Дата подписания: {doc.createdAt}</p>
          <a
            href={doc.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2 font-medium hover:bg-primary/90 transition"
          >
            <Download className="w-4 h-4" /> Скачать PDF
          </a>
        </div>
      ))}
    </div>
  );
}
