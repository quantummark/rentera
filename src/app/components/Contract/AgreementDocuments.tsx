'use client';

import { useState, useEffect } from 'react';
import { useUserTypeWithProfile } from '@/hooks/useUserType';
import { db } from '@/app/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Download, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AgreementDocument {
  id: string;
  ownerId: string;
  renterId: string;
  title: string;
  lastUpdated: string;
  pdfUrl: string;
  isPaid?: boolean;
}

export default function AgreementDocuments() {
  // игнорим первый элемент из useUserTypeWithProfile, берём только профиль и loading
  const [, userProfile, userLoading] = useUserTypeWithProfile();
  const currentUid = userProfile?.uid ?? '';
  const { t } = useTranslation(['contracts', 'common']);

  const [documents, setDocuments] = useState<AgreementDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoadingDocs(true);

      try {
        const snapshot = await getDocs(collection(db, 'contracts'));
        const docs = snapshot.docs
          .map(d => {
            const data = d.data() as Omit<AgreementDocument, 'id' | 'lastUpdated'> & {
              lastUpdated: { seconds: number; nanoseconds: number };
            };

            return {
              id: d.id,
              ownerId: data.ownerId || '',
              renterId: data.renterId || '',
              title: data.title || t('contracts:Agreement'),
              lastUpdated: data.lastUpdated
                ? new Date(data.lastUpdated.seconds * 1000).toLocaleDateString()
                : '',
              pdfUrl: data.pdfUrl,
              isPaid: data.isPaid || false,
            };
          })
          .filter(d => Boolean(d.pdfUrl));

        setDocuments(docs);
      } catch (err: unknown) {
        console.error('Error fetching documents:', err);
        setDocuments([]);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocuments();
  }, []);

  if (userLoading || loadingDocs) {
    return <p className="text-center py-4">{t('common:loading')}</p>;
  }

  if (documents.length === 0) {
    return (
      <p className="text-center py-4 text-muted-foreground">
        {t('contracts:noActiveContracts')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map(doc => {
        const isOwner = doc.ownerId === currentUid;
        const isRenter = doc.renterId === currentUid;
        const isPaid = doc.isPaid ?? false;

        return (
          <div
            key={doc.id}
            className="bg-card dark:bg-card-dark p-6 rounded-xl shadow
                       hover:shadow-lg transform hover:-translate-y-1
                       transition duration-200"
          >
            <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark">
              {doc.title}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark mt-1">
              {t('contracts:Date')} {doc.lastUpdated}
            </p>

            {isOwner && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2
                             bg-primary dark:bg-primary-dark
                             text-primary-foreground dark:text-primary-foreground-dark
                             rounded-md text-sm font-medium hover:opacity-90 transition"
                >
                  <Download className="w-5 h-5" /> {t('contracts:downloadPDF')}
                </a>

                <span
                  className={`font-medium ${
                    isPaid ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {isPaid ? 'Оплачено' : 'Ещё не оплачено'}
                </span>
              </div>
            )}

            {isRenter && (
              <div className="mt-6 flex items-center justify-between">
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium
                             text-primary dark:text-primary-dark hover:underline"
                >
                  <Download className="w-5 h-5" /> {t('contracts:downloadPDF')}
                </a>

                {!isPaid ? (
                  <button
                    onClick={() => alert('Запускаем процесс оплаты…')}
                    className="flex items-center gap-2 bg-orange-500 text-white
                               px-4 py-2 rounded-md text-sm font-medium
                               hover:bg-orange-600 transition"
                  >
                    <CreditCard className="w-4 h-4" /> {t('contracts:pay')}
                  </button>
                ) : (
                  <span className="text-green-600 font-semibold">{t('contracts:paid')}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
