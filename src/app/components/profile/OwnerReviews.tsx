// components/owner/OwnerReviews.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function OwnerReviews() {
  const reviews = [
    {
      author: 'Андрей С.',
      text: 'Все было отлично! Квартира чистая, хозяин на связи. Буду обращаться снова.',
      rating: 5,
    },
    {
      author: 'Марина Т.',
      text: 'Снимала жилье на 3 месяца — всё понравилось, никаких проблем.',
      rating: 4,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Отзывы арендаторов</h3>
        <Button variant="outline" size="sm">Написать отзыв</Button>
      </div>

      <Separator />

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <Card key={idx} className="bg-muted">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{review.author}</span>
                  <span className="text-yellow-500 text-sm">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{review.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Пока нет отзывов.</p>
      )}
    </section>
  );
}
