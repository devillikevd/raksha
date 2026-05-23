import { useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEmergencyStore } from '../../stores/emergencyStore'
import MagneticButton from '../ui/MagneticButton'

export default function SOSSection() {
  const { isEmergency, sosCountdown, alertPhase, activateSOS } = useEmergencyStore()
  const canvasRef = useRef(null)

  const drawEmergencyRings = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    let t = 0

    const animate = () => {
      t += 0.02
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2, cy = h / 2

      // Emergency rings
      for (let i = 0; i < 8; i++) {
        const radius = ((t * 100 + i * 50) % 400)
        const alpha = (1 - radius / 400) * (isEmergency ? 0.5 : 0.15)
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = isEmergency ? `rgba(255, 46, 46, ${alpha})` : `rgba(0, 217, 255, ${alpha})`
        ctx.lineWidth = isEmergency ? 3 : 1
        ctx.stroke()
      }

      // Center pulse
      const pulseR = 40 + Math.sin(t * 4) * 10
      ctx.beginPath()
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2)
      ctx.fillStyle = isEmergency ? 'rgba(255, 46, 46, 0.15)' : 'rgba(0, 217, 255, 0.08)'
      ctx.fill()

      requestAnimationFrame(animate)
    }
    animate()
  }, [isEmergency])

  useEffect(() => { drawEmergencyRings() }, [drawEmergencyRings])

  return (
    <section className="section-container min-h-screen relative overflow-hidden" id="sos-section">
      {/* Emergency overlay */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <div className="emergency-vignette" />
            {/* Siren sweep */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-emergency/10 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-hud text-[10px] tracking-[0.4em] text-emergency/60 mb-4">◆ EMERGENCY PROTOCOL</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow-emergency mb-4">SOS COMMAND</h2>
          <p className="text-white/40 text-sm mb-12">One touch. Instant protection. Every second counts.</p>
        </motion.div>

        {/* SOS Button */}
        <AnimatePresence mode="wait">
          {alertPhase === 'idle' && (
            <motion.div key="idle" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <button
                onClick={activateSOS}
                id="sos-trigger-btn"
                className="relative w-40 h-40 md:w-52 md:h-52 rounded-full cursor-pointer group"
              >
                <div className="absolute inset-0 rounded-full bg-emergency/10 border-2 border-emergency/30 group-hover:border-emergency/60 group-hover:bg-emergency/20 transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(255,46,46,0.4)]" />
                <div className="absolute inset-4 rounded-full bg-emergency/5 border border-emergency/20 animate-pulse-glow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-hud text-3xl md:text-4xl font-bold text-emergency">SOS</span>
                </div>
              </button>
            </motion.div>
          )}

          {alertPhase === 'countdown' && (
            <motion.div key="countdown" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="animate-glitch">
              <p className="font-hud text-[120px] md:text-[200px] font-black text-emergency text-glow-emergency">{sosCountdown}</p>
              <p className="font-hud text-xs tracking-[0.3em] text-emergency/60 mt-4">TRANSMITTING IN...</p>
            </motion.div>
          )}

          {alertPhase === 'transmitting' && (
            <motion.div key="transmitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-20 h-20 mx-auto border-4 border-emergency/30 border-t-emergency rounded-full animate-spin" />
              <p className="font-hud text-lg text-emergency mt-6 animate-pulse-glow">TRANSMITTING ALERT...</p>
            </motion.div>
          )}

          {alertPhase === 'transmitted' && (
            <motion.div key="transmitted" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 border-2 border-green-500/60 flex items-center justify-center mb-6">
                <span className="text-4xl">✓</span>
              </div>
              <p className="font-hud text-2xl text-green-400 text-glow mb-2">ALERT TRANSMITTED</p>
              <p className="text-white/40 text-sm">Emergency contacts notified • Police alerted • GPS shared</p>
              <div className="mt-8 space-y-2">
                {['आई (Mom) — Notified ✓', 'Police Control — Alert Sent ✓', 'Women Helpline — Connected ✓'].map((c, i) => (
                  <motion.div key={c} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.3 }} className="glass px-4 py-2 rounded-sm font-hud text-[10px] text-cyan/70">{c}</motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
