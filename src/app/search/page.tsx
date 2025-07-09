import Hero from '@/app/components/search/Hero';
import Benefits from '@/app/components/search/Benefits';
import ListingsGrid from '@/app/components/search/ListingsGrid';
import Action from '@/app/components/search/Action';

export default function HomePage() {
  return (
    <main className="min-h-screen space-y-1">
      <Hero />
      <Benefits />
      <ListingsGrid />
      <Action />
    </main>
  );
}