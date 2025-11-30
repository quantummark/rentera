'use client';

import { useRef, useState } from 'react';
import type { CommunityTopicFilter } from './CommunityTopicMenu';
import CommunityHero from './CommunityHero';
import CommunityTopicMenu from './CommunityTopicMenu';
import CommunityPostComposer from './CommunityPostComposer';
import CommunityFeed from './CommunityFeed';

export default function CommunityScreen() {
  const [activeTopic, setActiveTopic] = useState<CommunityTopicFilter>('all');
  const composerRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToComposer = () => {
    if (composerRef.current) {
      composerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-1 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8">
        
        {/* Hero-блок */}
        <CommunityHero onCreatePostClick={handleScrollToComposer} />

        {/* Меню + Composer + Лента */}
        <section className="mt-4 flex w-full flex-col gap-4 sm:gap-6">
          
          <CommunityTopicMenu
            activeTopic={activeTopic}
            onTopicChange={setActiveTopic}
          />

          {/* Composer */}
          <div ref={composerRef}>
            <CommunityPostComposer
              activeTopic={activeTopic}
              onPostCreated={() => {}}
            />
          </div>

          <CommunityFeed activeTopic={activeTopic} />
        </section>
      </div>
    </main>
  );
}
