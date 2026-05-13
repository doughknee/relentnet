import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

import type { ISourceOptions } from '@tsparticles/engine'

const StarParticles = () => {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = async (): Promise<void> => {
    // container loaded
  }

  const options: ISourceOptions = useMemo(
    () => ({
      autoPlay: true,
      background: {
        color: { value: 'transparent' },
      },
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      fpsLimit: 120,
      particles: {
        number: {
          value: 120,
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
        },
        color: {
          value: ['#ffffff', '#1a1a1a', '#E1BE4C'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.1, max: 0.8 },
          animation: {
            enable: true,
            speed: 1,
            mode: 'auto' as const,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            mode: 'auto' as const,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: { min: 0.5, max: 1.5 },
          direction: 'top' as const,
          random: false,
          straight: false,
          outModes: {
            default: 'out' as const,
          },
        },
        links: {
          enable: false,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'parallax',
          },
        },
        modes: {
          parallax: {
            enable: true,
            force: 60,
            smooth: 10,
          },
        },
      },
      detectRetina: false,
    }),
    [],
  )

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    )
  }

  return <></>
}

export default StarParticles
