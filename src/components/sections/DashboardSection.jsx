import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import HUDPanel from '../ui/HUDPanel'

const incidents = [
  { time: '09:45', type: 'Alert Resolved', location: 'Andheri West', status: 'resolved' },
  { time: '08:12', type: 'Safe Walk Complete', location: 'Bandra Station', status: 'completed' },
  { time: '07:30', type: 'Guardian Activated', location: 'Dadar East', status: 'active' },
  { time: '06:55', type: 'Route Flagged', location: 'Kurla Complex', status: 'warning' },
]

export default function DashboardSection() {
  const chartRef = useRef(null)

  const drawCharts = useCallback(() => {
    const canvas = chartRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    let t = 0

    const animate = () => {
      t += 0.02
      ctx.clearRect(0, 0, w, h)

      // Radial chart
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.35
      const segments = [
        { value: 0.85, color: 'rgba(0, 217, 255, 0.6)', label: 'Safety' },
        { value: 0.72, color: 'rgba(255, 107, 0, 0.6)', label: 'Response' },
        { value: 0.91, color: 'rgba(0, 217, 255, 0.3)', label: 'Coverage' },
        { value: 0.68, color: 'rgba(255, 138, 0, 0.4)', label: 'AI Score' },
      ]

      segments.forEach((seg, i) => {
        const startAngle = (i / segments.length) * Math.PI * 2 - Math.PI / 2
        const endAngle = startAngle + (seg.value * (Math.PI * 2 / segments.length))
        const segR = r * (0.6 + i * 0.1)

        ctx.beginPath()
        ctx.arc(cx, cy, segR, startAngle, endAngle)
        ctx.strokeStyle = seg.color
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.stroke()

        // Background track
        ctx.beginPath()
        ctx.arc(cx, cy, segR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)'
        ctx.lineWidth = 8
        ctx.stroke()
      })

      // Pulse wave
      const waveY = h * 0.85
      ctx.beginPath()
      ctx.moveTo(0, waveY)
      for (let x = 0; x < w; x++) {
        const y = waveY + Math.sin(x * 0.02 + t * 2) * 15 + Math.sin(x * 0.005 + t) * 8
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  useEffect(() => { drawCharts() }, [drawCharts])

  return (
    <section className="section-container min-h-screen relative" id="dashboard-section">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-hud text-[10px] tracking-[0.4em] text-cyan/60 mb-4">◆ COMMAND ANALYTICS</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow mb-4">LIVE DASHBOARD</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radial chart */}
          <div className="lg:col-span-2">
            <HUDPanel title="SYSTEM PERFORMANCE">
              <div className="relative aspect-[4/3]">
                <canvas ref={chartRef} className="w-full h-full" />
              </div>
            </HUDPanel>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            {[
              { label: 'TOTAL ALERTS TODAY', value: '47', change: '+12%', color: 'cyan' },
              { label: 'ACTIVE GUARDIANS', value: '2,847', change: '+5%', color: 'saffron' },
              { label: 'AVG RESPONSE', value: '7.2s', change: '-18%', color: 'cyan' },
              { label: 'SAFETY INDEX', value: '94.3', change: '+3%', color: 'saffron' },
            ].map((stat, i) => (
              <HUDPanel key={stat.label} delay={i * 0.1}>
                <p className="font-hud text-[9px] text-white/30 tracking-wider">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className={`font-hud text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
                  <span className="font-hud text-[10px] text-green-400">{stat.change}</span>
                </div>
              </HUDPanel>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <HUDPanel title="INCIDENT TIMELINE">
            <div className="space-y-3">
              {incidents.map((inc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0"
                >
                  <span className="font-hud text-[10px] text-white/30 w-12">{inc.time}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    inc.status === 'resolved' ? 'bg-green-400' :
                    inc.status === 'completed' ? 'bg-cyan' :
                    inc.status === 'active' ? 'bg-saffron animate-pulse-glow' :
                    'bg-orange'
                  }`} />
                  <span className="text-xs text-white/60 flex-1">{inc.type}</span>
                  <span className="font-hud text-[9px] text-white/30">{inc.location}</span>
                </motion.div>
              ))}
            </div>
          </HUDPanel>
        </div>
      </div>
    </section>
  )
}
