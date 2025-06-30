'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getListingById } from '@/app/lib/firestore/listings';
import { Listing } from '@/app/types/listing';
import ListingHeader from '@/app/components/property/ListingHeader';
import ListingRentConditions from '@/app/components/property/ListingRentConditions';
import ListingDescription from '@/app/components/property/ListingDescription';
import ListingAmenities from '@/app/components/property/ListingAmenities';
import CommentSection from '@/app/components/comments/CommentSection';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

export default function ListingPage() {
  const { t } = useTranslation();
  const params = useParams();
  const listingId = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);

  const { user, loading } = useAuth(); // 🔥 заменили getAuth

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;
      const data = await getListingById(listingId);
      if (data) setListing(data);
    };

    fetchListing();
  }, [listingId]);

  if (!listing || loading) {
    return <p className="text-center py-10">{t('listing.loading', 'Загрузка объекта...')}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-10">
      <ListingHeader listing={listing} />
      <Separator />
      <ListingRentConditions listing={listing} />
      <Separator />
      <ListingDescription listing={listing} />
      <Separator />
      <ListingAmenities listing={listing} />
      <Separator />
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('comments.title', 'Комментарии об объекте')}</h2>
        <CommentSection
          contextType="listings"
          contextId={listingId}
          currentUserId={user?.uid ?? ''}
          userRole="renter" // ❗ можно сделать динамически, если надо
        />
      </div>
    </div>
  );
}
