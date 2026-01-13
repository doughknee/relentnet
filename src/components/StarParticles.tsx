import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { type ISourceOptions } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

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
        color: { value: '#050505' },
      },
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      fpsLimit: 120,
      particles: {
        // 1. DENSITY: Good amount of particles for a "field"
        number: {
          value: 120,
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
        },
        // 2. COLOR: Mix of White and your Brand Gold for richness
        color: {
          value: ['#ffffff', '#E1BE4C'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          // DEPTH: Varied opacity
          value: { min: 0.1, max: 0.8 },
          animation: {
            enable: true,
            speed: 1, // Subtle shimmer
            mode: 'auto',
            sync: false,
          },
        },
        size: {
          // VARIETY: mostly small dust, some larger embers
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            mode: 'auto',
            sync: false,
          },
        },
        // 3. MOVEMENT: Rising "Champagne" Effect
        move: {
          enable: true,
          speed: { min: 0.5, max: 1.5 }, // Variable speed adds life
          direction: 'top', // Rising upwards
          random: false,
          straight: false, // "Wiggle" slightly, don't move in straight lines
          outModes: {
            default: 'out', // Reappear at bottom when they leave top
          },
        },
        links: {
          enable: false, // Keep lines off for clean luxury look
        },
      },
      // 4. INTERACTIVITY: Parallax (3D Depth) on Mouse Move
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'parallax', // 3D Effect
          },
        },
        modes: {
          parallax: {
            enable: true,
            force: 60, // How much they shift
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
