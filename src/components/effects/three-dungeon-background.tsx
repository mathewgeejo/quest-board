'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeDungeonBackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
  enableTorches?: boolean
  enableFog?: boolean
}

export function ThreeDungeonBackground({
  intensity = 'medium',
  enableTorches = true,
  enableFog = true,
}: ThreeDungeonBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameIdRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      return // Show static gradient instead
    }

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    
    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: intensity === 'high',
      alpha: true,
      powerPreference: intensity === 'low' ? 'low-power' : 'default',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(intensity === 'low' ? 1 : Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = intensity !== 'low'
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Fog
    if (enableFog) {
      scene.fog = new THREE.FogExp2(0x0a0612, 0.08)
    }

    // Background color
    scene.background = new THREE.Color(0x0a0612)

    // Ambient light (dim)
    const ambientLight = new THREE.AmbientLight(0x1a1025, 0.3)
    scene.add(ambientLight)

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.9,
      metalness: 0.1,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -1
    floor.receiveShadow = true
    scene.add(floor)

    // Stone pillars
    const pillarGeometry = new THREE.CylinderGeometry(0.4, 0.5, 6, 8)
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      roughness: 0.8,
      metalness: 0.2,
    })

    const pillarPositions = [
      [-4, 2, -4],
      [4, 2, -4],
      [-4, 2, 2],
      [4, 2, 2],
    ]

    pillarPositions.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
      pillar.position.set(x, y, z)
      pillar.castShadow = true
      pillar.receiveShadow = true
      scene.add(pillar)
    })

    // Torches with point lights
    const torches: { light: THREE.PointLight; baseIntensity: number }[] = []

    if (enableTorches) {
      const torchPositions = [
        [-4, 3.5, -4],
        [4, 3.5, -4],
        [-4, 3.5, 2],
        [4, 3.5, 2],
      ]

      torchPositions.forEach(([x, y, z]) => {
        // Torch holder
        const holderGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.4, 6)
        const holderMaterial = new THREE.MeshStandardMaterial({
          color: 0x3a3a4e,
          roughness: 0.7,
        })
        const holder = new THREE.Mesh(holderGeometry, holderMaterial)
        holder.position.set(x, y, z)
        scene.add(holder)

        // Fire glow (simple sphere)
        const fireGeometry = new THREE.SphereGeometry(0.15, 8, 8)
        const fireMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6600,
          transparent: true,
          opacity: 0.8,
        })
        const fire = new THREE.Mesh(fireGeometry, fireMaterial)
        fire.position.set(x, y + 0.3, z)
        scene.add(fire)

        // Point light
        const light = new THREE.PointLight(0xff6600, 2, 8)
        light.position.set(x, y + 0.3, z)
        light.castShadow = intensity !== 'low'
        scene.add(light)

        torches.push({ light, baseIntensity: 2 })
      })
    }

    // Floating particles (arcane energy)
    const particleCount = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 200
    const particlesGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 20
      particlePositions[i * 3 + 1] = Math.random() * 8 - 1
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20

      // Purple/blue arcane colors
      const colorChoice = Math.random()
      if (colorChoice < 0.5) {
        // Purple
        particleColors[i * 3] = 0.6
        particleColors[i * 3 + 1] = 0.3
        particleColors[i * 3 + 2] = 0.9
      } else {
        // Gold
        particleColors[i * 3] = 1.0
        particleColors[i * 3 + 1] = 0.8
        particleColors[i * 3 + 2] = 0.2
      }
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    )
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(particleColors, 3)
    )

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Animation
    let time = 0
    const animate = () => {
      time += 0.016

      // Torch flicker
      torches.forEach(({ light, baseIntensity }, i) => {
        light.intensity =
          baseIntensity +
          Math.sin(time * 10 + i) * 0.3 +
          Math.random() * 0.2
      })

      // Particle movement
      const positions = particlesGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.005 + Math.sin(time + i) * 0.002
        if (positions[i * 3 + 1] > 7) {
          positions[i * 3 + 1] = -1
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true

      // Slow camera drift
      camera.position.x = Math.sin(time * 0.1) * 0.5
      camera.position.y = 2 + Math.sin(time * 0.15) * 0.2
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      frameIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameIdRef.current)
      renderer.dispose()
      container.removeChild(renderer.domElement)

      // Dispose geometries and materials
      floorGeometry.dispose()
      floorMaterial.dispose()
      pillarGeometry.dispose()
      pillarMaterial.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [intensity, enableTorches, enableFog])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(ellipse at center, #1a1025 0%, #0a0612 50%, #050308 100%)',
      }}
    />
  )
}
