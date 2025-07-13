'use client';

import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

export default function BackgroundParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      className="absolute inset-0 -z-10"
      options={{
        fullScreen: false,
        background: {
          color: {
            value: 'transparent',
          },
        },
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: '#ff6900',
          },
          opacity: {
            value: 0.3,
          },
          size: {
            value: 2,
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: 'none',
            outMode: 'bounce',
          },
        },
      }}
    />
  );
}
