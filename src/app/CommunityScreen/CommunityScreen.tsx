'use client';

import { useRef, useState } from 'react';
import type { CommunityTopicFilter } from './CommunityTopicMenu';
import CommunityHero from './CommunityHero';
import CommunityTopicMenu from './CommunityTopicMenu';
import CommunityPostComposer from './CommunityPostComposer';
import CommunityFeed from './CommunityFeed';
import { useCommunityStats } from '@/hooks/useCommunityStats';

export default function CommunityScreen() {
  const [activeTopic, setActiveTopic] = useState<CommunityTopicFilter>('all');
  const composerRef = useRef<HTMLDivElement | null>(null);
  const { stats, loading } = useCommunityStats();

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
        {/* Hero-блок (широкий как и был) */}
        <CommunityHero
          onCreatePostClick={handleScrollToComposer}
          stats={
            stats
              ? {
                  membersCount: stats.totalUsers,
                  postsCount: stats.postsCount,
                }
              : undefined
          }
        />

        {/* Меню + Composer + Лента */}
        <section className="mt-4 flex w-full flex-col gap-4 sm:gap-6">
          {/* Топик-меню тоже широкое, как раньше */}
          <CommunityTopicMenu
            activeTopic={activeTopic}
            onTopicChange={setActiveTopic}
          />

          {/* Центральная колонка как в Twitter:
              - на мобилке: w-full
              - на десктопе: центрированная узкая колонка */}
          <div className="flex w-full justify-center">
            <div className="w-full md:max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6">
              {/* Composer */}
              <div ref={composerRef}>
                <CommunityPostComposer
                  activeTopic={activeTopic}
                  onPostCreated={() => {}}
                />
              </div>

              {/* Лента постов */}
              <CommunityFeed activeTopic={activeTopic} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
