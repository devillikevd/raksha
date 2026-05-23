import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import HUDPanel from '../ui/HUDPanel'

const safeZones = [
  { name: 'Mumbai Central', x: 42, y: 55, type: 'safe' },
  { name: 'Pune Station', x: 52, y: 62, type: 'safe' },
  { name: 'Nashik HQ', x: 50, y: 35, type: 'safe' },
  { name: 'Nagpur Center', x: 78, y: 38, type: 'safe' },
  { name: 'Thane Sector', x: 44, y: 52, type: 'danger' },
  { name: 'Aurangabad', x: 58, y: 48, type: 'danger' },
]

export default function MapSection() {
  const canvasRef = useRef(null)

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    let t = 0

    const animate = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

      // Maharashtra outline (simplified)
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)'
      ctx.lineWidth = 2
      const points = [
        [0.3, 0.2], [0.45, 0.15], [0.6, 0.18], [0.75, 0.2], [0.85, 0.3],
        [0.9, 0.45], [0.85, 0.6], [0.78, 0.7], [0.65, 0.75], [0.5, 0.78],
        [0.38, 0.75], [0.28, 0.68], [0.22, 0.55], [0.2, 0.4], [0.25, 0.28]
      ]
      points.forEach(([px, py], i) => {
        const x = px * w, y = py * h
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.stroke()
      ctx.fillStyle = 'rgba(0, 217, 255, 0.02)'
      ctx.fill()

      // Radar sweep
      const cx = w * 0.5, cy = h * 0.5
      const angle = t * 0.8
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, Math.min(w, h) * 0.4, angle, angle + 0.5)
      ctx.closePath()
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.4)
      grad.addColorStop(0, 'rgba(0, 217, 255, 0.1)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fill()

      // Nodes
      safeZones.forEach(zone => {
        const x = (zone.x / 100) * w, y = (zone.y / 100) * h
        const color = zone.type === 'safe' ? [0, 217, 255] : [255, 107, 0]
        const pulse = Math.sin(t * 3 + x) * 0.5 + 0.5
        // Outer pulse
        ctx.beginPath()
        ctx.arc(x, y, 8 + pulse * 12, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color.join(',')}, ${0.1 * pulse})`
        ctx.fill()
        // Core
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color.join(',')}, 0.8)`
        ctx.fill()
      })

      // Connection lines
      for (let i = 0; i < safeZones.length - 1; i++) {
        const a = safeZones[i], b = safeZones[i + 1]
        if (a.type === 'safe' && b.type === 'safe') {
          ctx.beginPath()
          ctx.moveTo((a.x / 100) * w, (a.y / 100) * h)
          ctx.lineTo((b.x / 100) * w, (b.y / 100) * h)
          ctx.strokeStyle = 'rgba(0, 217, 255, 0.1)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  useEffect(() => { drawMap() }, [drawMap])

  return (
    <section className="section-container min-h-screen relative" id="map-section">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-hud text-[10px] tracking-[0.4em] text-cyan/60 mb-4">◆ HOLOGRAPHIC SURVEILLANCE</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow">LIVE LOCATION GRID</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <HUDPanel title="MAHARASHTRA — REAL-TIME FEED">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
            </HUDPanel>
          </div>
          {/* Side panels */}
          <div className="space-y-4">
            <HUDPanel title="SAFE ZONES" delay={0.2}>
              <div className="space-y-3">
                {safeZones.filter(z => z.type === 'safe').map(z => (
                  <div key={z.name} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan animate-pulse-glow" />
                    <span className="text-xs text-white/70">{z.name}</span>
                    <span className="ml-auto font-hud text-[9px] text-cyan/60">SECURE</span>
                  </div>
                ))}
              </div>
            </HUDPanel>
            <HUDPanel title="ALERTS" delay={0.4}>
              <div className="space-y-3">
                {safeZones.filter(z => z.type === 'danger').map(z => (
                  <div key={z.name} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-saffron animate-pulse-glow" />
                    <span className="text-xs text-white/70">{z.name}</span>
                    <span className="ml-auto font-hud text-[9px] text-saffron/60">CAUTION</span>
                  </div>
                ))}
              </div>
            </HUDPanel>
            <HUDPanel title="GPS DATA" delay={0.6}>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="font-hud text-[9px] text-white/40">LATITUDE</span><span className="font-hud text-[9px] text-cyan">19.0760°N</span></div>
                <div className="flex justify-between"><span className="font-hud text-[9px] text-white/40">LONGITUDE</span><span className="font-hud text-[9px] text-cyan">72.8777°E</span></div>
                <div className="flex justify-between"><span className="font-hud text-[9px] text-white/40">ACCURACY</span><span className="font-hud text-[9px] text-cyan">±3m</span></div>
              </div>
            </HUDPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
