'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/app/firebase/firebase';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock3, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RentRequestButtonProps {
  listingId: string;
  ownerId: string;
  listingTitle: string;
  listingImageUrl?: string | null;
}

type RequestStatus = 'none' | 'pending' | 'active' | 'signed';

export default function RentRequestButton({ listingId, ownerId, listingTitle, listingImageUrl }: RentRequestButtonProps) {
  const { t } = useTranslation('rentRequest');
  const router = useRouter();

  const [status, setStatus] = useState<RequestStatus>('none');
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();

  const currentUser = auth.currentUser;
  const renterId = currentUser?.uid;

  const requestDocRef = renterId ? doc(db, 'contracts', `${listingId}_${renterId}`) : null;

  useEffect(() => {
    if (!requestDocRef) {
      setStatus('none');
      return;
    }

    (async () => {
      try {
        const snap = await getDoc(requestDocRef);
        if (!snap.exists()) {
          setStatus('none');
          return;
        }
        const data = snap.data();
        if (data.status === 'signed') setStatus('signed');
        else if (data.status === 'active') setStatus('active');
        else setStatus('pending');
      } catch {
        // optional: toast/log
      }
    })();
  }, [requestDocRef]);

  const labels: Record<RequestStatus, string> = useMemo(
    () => ({
      none: t('cta.rentOnline'),
      pending: t('status.pending'),
      active: t('status.accepted'),
      signed: t('status.signed'),
    }),
    [t]
  );

  const handleClick = async () => {
    // Не авторизован — ведём на логин (или модалку, если есть)
    if (!renterId) {
      router.push('/login');
      return;
    }

    // Уже отправлено
    if (status === 'pending') {
      addToast({ title: t('toast.alreadySent.title'), description: t('toast.alreadySent.desc') });
      return;
    }

    // active/signed — просто не кликаем (можно позже сделать переход в "Мои документы")
    if (status !== 'none') return;

    setLoading(true);
    try {
      await setDoc(requestDocRef!, {
        listingId,
        ownerId,
        renterId,
        status: 'pending',
        requestDate: serverTimestamp(),
        title: listingTitle,
        listingImageUrl: listingImageUrl ?? null,
      });

      setStatus('pending');
      addToast({ title: t('toast.sent.title'), description: t('toast.sent.desc') });
    } catch {
      addToast({ title: t('toast.error.title'), description: t('toast.error.desc') });
    } finally {
      setLoading(false);
    }
  };

  const icon =
    status === 'none' ? <Sparkles className="h-4 w-4" /> :
    status === 'pending' ? <Clock3 className="h-4 w-4" /> :
    status === 'active' ? <CheckCircle2 className="h-4 w-4" /> :
    <FileText className="h-4 w-4" />;

  // Визуальные стили по статусам (Revolut/Airbnb vibe)
  const variantClasses =
    status === 'none'
      ? `
        bg-gradient-to-r from-orange-500 to-orange-400
        text-white
        shadow-[0_10px_30px_rgba(249,115,22,0.35)]
        hover:shadow-[0_14px_40px_rgba(249,115,22,0.45)]
        hover:brightness-[1.02]
      `
      : status === 'pending'
      ? `
        bg-orange-500/15 text-orange-700
        border border-orange-500/25
        shadow-sm
      `
      : status === 'active'
      ? `
        bg-emerald-500/15 text-emerald-700
        border border-emerald-500/25
        shadow-sm
      `
      : `
        bg-indigo-500/15 text-indigo-700
        border border-indigo-500/25
        shadow-sm
      `;

  return (
    <Button
      onClick={handleClick}
      aria-label={labels[status]}
      disabled={loading || (renterId ? status !== 'none' : false)}
      className={cn(
        `
        w-full h-12
        rounded-2xl
        font-semibold
        flex items-center justify-center gap-2
        transition-all
        active:scale-[0.98]
        backdrop-blur-md
        `,
        variantClasses,
        loading && 'opacity-90 cursor-wait',
        status === 'pending' && 'pointer-events-auto', // чтобы toast показывался при клике в pending
      )}
    >
      {/* Лёгкий pulse для pending */}
      {status === 'pending' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
        </span>
      )}

      {icon}
      <span>{labels[status]}</span>
    </Button>
  );
}
