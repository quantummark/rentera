import Hero from '@/app/components/search/Hero';
import ListingsGrid from '@/app/components/search/ListingsGrid';
import Action from '@/app/components/search/Action';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <main className="min-h-screen space-y-1">
      <Hero />
      <Separator className="my-6 border-t border-gray-300 dark:border-gray-700" />
      <ListingsGrid />
      <Action />
    </main>
  );
}