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
import { useAuth } from '@/hooks/useAuth';

export default function ListingPage() {

  const params = useParams();
  const listingId = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);

  const { loading } = useAuth(); // 🔥 заменили getAuth

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;
      const data = await getListingById(listingId);
      if (data) setListing({ ...data, listingId });
    };

    fetchListing();
  }, [listingId]);

  if (!listing || loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
      </div>
    );
  }
  

  return (
    <div className="w-full max-w-full sm:max-w-8xl mx-auto px-2 sm:px-4 md:px-8 py-6 sm:py-8 space-y-10">
      <ListingHeader listing={{ ...listing, listingId }} />
      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />
      <ListingRentConditions listing={listing} />
      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />
      <ListingDescription listing={listing} />
      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />
      <ListingAmenities listing={listing} />
      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />
      <div>
        <CommentSection
          contextType="listings"
          contextId={listingId}
        />
      </div>
    </div>
  );
}
