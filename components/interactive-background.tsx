"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  rotation: number
  rotationSpeed: number
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: Particle[] = []
    const particleCount = 150 // Triplicado de 50 a 150

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2, // Tamaño aumentado de 1-4 a 2-7
        speedY: Math.random() * 1 + 0.3, // Velocidad aumentada
        speedX: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.6 + 0.3, // Opacidad aumentada de 0.1-0.4 a 0.3-0.9
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      })
    }

    let mouseX = 0
    let mouseY = 0
    let isMouseMoving = false

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isMouseMoving = true
      setTimeout(() => {
        isMouseMoving = false
      }, 100)
    }

    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        if (isMouseMoving) {
          const dx = particle.x - mouseX
          const dy = particle.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            particle.x += (dx / distance) * force * 3
            particle.y += (dy / distance) * force * 3
          }
        }

        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)

        // Alternar entre círculos y cuadrados para variedad
        if (index % 3 === 0) {
          // Círculos (harina)
          ctx.fillStyle = `rgba(161, 136, 127, ${particle.opacity})`
          ctx.beginPath()
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (index % 3 === 1) {
          // Cuadrados pequeños (migas)
          ctx.fillStyle = `rgba(109, 76, 65, ${particle.opacity})`
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        } else {
          // Círculos con borde (granos de café)
          ctx.fillStyle = `rgba(62, 39, 35, ${particle.opacity})`
          ctx.beginPath()
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = `rgba(161, 136, 127, ${particle.opacity * 0.5})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        ctx.restore()

        // Actualizar posición y rotación
        particle.y += particle.speedY
        particle.x += particle.speedX
        particle.rotation += particle.rotationSpeed

        // Reiniciar partícula cuando sale de la pantalla
        if (particle.y > canvas.height + 10) {
          particle.y = -10
          particle.x = Math.random() * canvas.width
        }

        if (particle.x > canvas.width + 10) {
          particle.x = -10
        } else if (particle.x < -10) {
          particle.x = canvas.width + 10
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.7 }} />
}
