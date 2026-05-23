import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const bootSequence = [
  'Initializing RAKSHA Core...',
  'Loading neural threat engine...',
  'Calibrating GPS subsystem...',
  'Connecting to guardian network...',
  'Verifying encryption protocols...',
  'AI Guardian v3.2 — Online',
  'Camera subsystem — Standby',
  'Voice recognition — Active',
  'All systems nominal.',
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading') // loading | reveal | done
  const [bootLines, setBootLines] = useState([])
  const canvasRef = useRef(null)

  // Pulse canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animFrame
    let startTime = Date.now()

    const draw = () => {
      const w = canvas.width = canvas.offsetWidth * 2
      const h = canvas.height = canvas.offsetHeight * 2
      ctx.clearRect(0, 0, w, h)
      const t = (Date.now() - startTime) / 1000

      // Pulse rings
      for (let i = 0; i < 6; i++) {
        const radius = ((t * 80 + i * 60) % 400)
        const alpha = 1 - radius / 400
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 217, 255, ${alpha * 0.2})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Floating particles
      for (let i = 0; i < 30; i++) {
        const px = (Math.sin(t * 0.5 + i * 1.3) * 0.5 + 0.5) * w
        const py = (Math.cos(t * 0.3 + i * 1.7) * 0.5 + 0.5) * h
        const alpha = Math.sin(t + i) * 0.3 + 0.3
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 217, 255, ${alpha})`
        ctx.fill()
      }

      animFrame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animFrame)
  }, [])

  // Boot sequence
  useEffect(() => {
    bootSequence.forEach((line, i) => {
      setTimeout(() => {
        setBootLines(prev => [...prev, line])
      }, 300 + i * 250)
    })
  }, [])

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setPhase('reveal'), 300)
          setTimeout(() => {
            setPhase('done')
            onComplete?.()
          }, 2000)
          return 100
        }
        return prev + Math.random() * 6 + 1.5
      })
    }, 80)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-dark"
          id="loading-screen"
        >
          {/* Background canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-50"
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase === 'reveal' ? 1 : progress > 20 ? 1 : 0,
                scale: phase === 'reveal' ? 1.1 : 1,
              }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="mb-6 text-center"
            >
              <h1 className="font-hud text-5xl md:text-7xl font-bold text-glow tracking-[0.15em]">
                RAKSHA
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 40 ? 1 : 0 }}
                className="font-display text-3xl md:text-4xl text-cyan/70 mt-2"
              >
                रक्षा
              </motion.p>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: progress > 50 ? 0.6 : 0 }}
              className="font-hud text-[10px] tracking-[0.3em] text-white/40 mb-8"
            >
              WOMEN SAFETY COMMAND SYSTEM
            </motion.p>

            {/* Boot console */}
            <div className="w-full mb-6 h-32 overflow-hidden">
              <div className="space-y-0.5">
                {bootLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 0.5, x: 0 }}
                    className="font-mono text-[10px] text-cyan/40"
                  >
                    <span className="text-cyan/20">▸</span> {line}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className="font-hud text-[9px] tracking-widest text-cyan/50">
                  {progress < 100 ? 'INITIALIZING' : 'COMPLETE'}
                </span>
                <span className="font-hud text-[9px] tracking-widest text-cyan/50">
                  {Math.min(Math.round(progress), 100)}%
                </span>
              </div>
              <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan via-saffron to-cyan"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="flex justify-between mt-3">
                {['SYS', 'NET', 'GPS', 'AI', 'CAM', 'SEC'].map((label, i) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: progress > (i + 1) * 15 ? 1 : 0.15 }}
                    className={`font-hud text-[8px] tracking-widest ${
                      progress > (i + 1) * 15 ? 'text-green-400/60' : 'text-white/20'
                    }`}
                  >
                    {label} {progress > (i + 1) * 15 ? '✓' : '○'}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
