import { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type {
  Container,
  Engine,
  IOptions,
  RecursivePartial,
} from 'tsparticles-engine';
import { darkModeOptions, lightModeOptions } from '../schema';

export interface LinkParticleProps {
  theme: string;
}

export const LinkParticles = ({ theme }: LinkParticleProps) => {
  const [container, setContainer] = useState<Container | undefined>();

  useEffect(() => {
    if (container) {
      container.loadTheme(theme);
    }
  }, [theme, container]);

  const baseOptions: RecursivePartial<IOptions> | undefined = {
    backgroundMode: {
      enable: true,
      zIndex: -10,
    },
    themes: [
      {
        name: 'light',
        default: {
          value: true,
          mode: 'light',
        },
        options: lightModeOptions,
      },
      {
        name: 'dark',
        options: darkModeOptions,
      },
    ],
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (particlesContainer: Container | undefined) => {
      await setContainer(particlesContainer);
    },
    []
  );

  return (
    <Particles
      id='tsparticles'
      init={particlesInit}
      loaded={particlesLoaded}
      options={baseOptions}
    />
  );
};
