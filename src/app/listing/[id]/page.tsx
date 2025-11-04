'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase';
import { getListingById } from '@/app/lib/firestore/listings';
import { Listing } from '@/app/types/listing';
import ListingHeader from '@/app/components/property/ListingHeader';
import ListingRentConditions from '@/app/components/property/ListingRentConditions';
import ListingDescription from '@/app/components/property/ListingDescription';
import ListingAmenities from '@/app/components/property/ListingAmenities';
import CommentSection from '@/app/components/comments/CommentSection';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Check, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function ListingPage() {
  const params = useParams();
  const listingId = params?.id as string;
  const router = useRouter();
  const search = useSearchParams();
  const { t } = useTranslation('common');

  const { user, loading: authLoading } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [subError, setSubError] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // edit mode по query ?edit=1
  const urlWantsEdit = search.get('edit') === '1';
  const [editMode, setEditMode] = useState<boolean>(urlWantsEdit);

  useEffect(() => {
    setEditMode(urlWantsEdit);
  }, [urlWantsEdit]);

  // является ли текущий пользователь владельцем
  const isOwner = useMemo(
    () => Boolean(user?.uid && listing?.ownerId && user.uid === listing.ownerId),
    [user?.uid, listing?.ownerId]
  );

  const canEdit = isOwner && editMode;

  // первичная загрузка + подписка на документ (реал-тайм)
  useEffect(() => {
    let unsub: (() => void) | undefined;

    const run = async () => {
      if (!listingId) return;

      // 1) первичная загрузка (быстрый старт до прихода снапшота)
      try {
        const data = await getListingById(listingId);
        if (data) setListing({ ...data, listingId });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[ListingPage] initial fetch error:', e);
      } finally {
        setInitialLoaded(true);
      }

      // 2) realtime подписка
      const ref = doc(db, 'listings', listingId);
      unsub = onSnapshot(
        ref,
        (snap) => {
          setSubError(null);
          if (snap.exists()) {
            const live = snap.data() as Listing;
            setListing({ ...live, listingId });
          } else {
            setListing(null);
          }
        },
        (err) => {
          // eslint-disable-next-line no-console
          console.error('[ListingPage] onSnapshot error:', err);
          setSubError('Unable to retrieve real-time updates.');
        }
      );
    };

    run();
    return () => {
      if (unsub) unsub();
    };
  }, [listingId]);

  // переходы в/из режима редактирования (меняем query без скролла)
  const enterEdit = () => {
    if (!listingId) return;
    const sp = new URLSearchParams(search.toString());
    sp.set('edit', '1');
    router.replace(`/listing/${listingId}?${sp.toString()}`, { scroll: false });
    setEditMode(true);
  };

  const exitEdit = () => {
    if (!listingId) return;
    const sp = new URLSearchParams(search.toString());
    sp.delete('edit');
    const qs = sp.toString();
    router.replace(qs ? `/listing/${listingId}?${qs}` : `/listing/${listingId}`, { scroll: false });
    setEditMode(false);
  };

  // шапка режима редактирования (стекло)
  const EditBar = canEdit ? (
    <div
      className={cn(
        'sticky top-0 z-40 mx-auto mb-4 flex w-full max-w-6xl items-center justify-between gap-2 rounded-xl',
        'border border-white/10 bg-background/60 backdrop-blur-lg px-3 py-2 shadow-lg'
      )}
    >
      <div className="flex items-center gap-2 text-base">
        <Pencil className="h-4 w-4" />
        <span>{t('common:editMode')}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={exitEdit}>
          <Check className="mr-1 h-4 w-4" />
          {t('common:done')}
        </Button>
      </div>
    </div>
  ) : null;

  // лоадер
  if (authLoading || (!listing && !initialLoaded)) {
    return (
      <div className="mt-10 flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-orange-500" />
      </div>
    );
  }

  // не найден
  if (!listing) {
    return <p className="mt-10 text-center text-destructive">Listing not found</p>;
  }

  return (
    <div className="mx-auto w-full max-w-full px-2 py-6 space-y-10 sm:max-w-8xl sm:px-4 md:px-8 sm:py-8">
      {/* уведомление о подписке, если вдруг что-то пошло не так */}
      {subError && (
        <div className="rounded-md border border-yellow-300/50 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-800 dark:text-yellow-200">
          {subError}
        </div>
      )}

      {/* панелька редактирования (если владелец и edit=1) */}
      {EditBar}

      {/* хедер: можно добавить внутри кнопку «Редактировать», если owner и не в edit */}
      <ListingHeader listing={{ ...listing, listingId }} canEdit={canEdit} />

      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />

      <ListingRentConditions listing={listing} canEdit={canEdit} />

      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />

      <ListingDescription listing={listing} canEdit={canEdit} />

      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />

      <ListingAmenities listing={listing} canEdit={canEdit} />

      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />

      <div>
        <CommentSection contextType="listings" contextId={listingId} />
      </div>
    </div>
  );
}
