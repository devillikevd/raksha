import { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import HUDPanel from '../ui/HUDPanel'
import AnimatedCounter from '../ui/AnimatedCounter'

const incidents = [
  { time: '11:07', type: 'SOS + Auto-Capture Triggered', location: 'Andheri West', status: 'resolved', detail: '5 photos + GPS sent' },
  { time: '09:45', type: 'Alert Resolved', location: 'Bandra Link Road', status: 'resolved', detail: 'Police responded' },
  { time: '08:12', type: 'Safe Walk Complete', location: 'Bandra Station', status: 'completed', detail: '1.2km in 12min' },
  { time: '07:30', type: 'Guardian Activated', location: 'Dadar East', status: 'active', detail: 'Stealth mode' },
  { time: '06:55', type: 'Route Flagged by AI', location: 'Kurla Complex', status: 'warning', detail: '78% threat level' },
  { time: '05:20', type: 'Fake Call Used', location: 'Malad', status: 'completed', detail: 'Mom — 2min 14s' },
  { time: '03:40', type: 'Voice Command SOS', location: 'Goregaon', status: 'resolved', detail: '"RAKSHA HELP ME"' },
  { time: '01:15', type: 'Community Alert Verified', location: 'Jogeshwari', status: 'resolved', detail: '47 upvotes' },
]

const hourlyData = [12, 8, 5, 3, 2, 4, 7, 15, 22, 18, 25, 32, 28, 20, 35, 42, 38, 47, 52, 45, 38, 30, 22, 15]

export default function DashboardSection() {
  const chartRef = useRef(null)
  const sparklineRef = useRef(null)
  const [liveAlerts, setLiveAlerts] = useState(47)

  // Live alert counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAlerts(prev => prev + (Math.random() > 0.7 ? 1 : 0))
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Main chart
  const drawCharts = useCallback(() => {
    const canvas = chartRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    let t = 0

    const animate = () => {
      t += 0.015
      ctx.clearRect(0, 0, w, h)

      // Radial chart in the center top area
      const cx = w / 2, cy = h * 0.4, r = Math.min(w, h) * 0.25
      const segments = [
        { value: 0.85, color: '#00D9FF', label: 'Safety' },
        { value: 0.72, color: '#FF6B00', label: 'Response' },
        { value: 0.91, color: '#00D9FF', label: 'Coverage' },
        { value: 0.68, color: '#FF8A00', label: 'AI Score' },
        { value: 0.94, color: '#22c55e', label: 'Network' },
      ]

      segments.forEach((seg, i) => {
        const startAngle = (i / segments.length) * Math.PI * 2 - Math.PI / 2
        const endAngle = startAngle + (seg.value * (Math.PI * 2 / segments.length))
        const segR = r * (0.5 + i * 0.1)

        // Background track
        ctx.beginPath()
        ctx.arc(cx, cy, segR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)'
        ctx.lineWidth = 10
        ctx.stroke()

        // Animated value arc
        const animProgress = Math.min(t * 0.3, 1)
        const animEnd = startAngle + (seg.value * animProgress * (Math.PI * 2 / segments.length))
        ctx.beginPath()
        ctx.arc(cx, cy, segR, startAngle, animEnd)
        ctx.strokeStyle = seg.color
        ctx.lineWidth = 10
        ctx.lineCap = 'round'
        ctx.stroke()

        // Label
        const labelAngle = startAngle + (seg.value * (Math.PI * 2 / segments.length)) / 2
        const lx = cx + Math.cos(labelAngle) * (segR + 25)
        const ly = cy + Math.sin(labelAngle) * (segR + 25)
        ctx.font = '16px Orbitron'
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.textAlign = 'center'
        ctx.fillText(seg.label, lx, ly)
      })

      // Center text
      ctx.font = 'bold 40px Orbitron'
      ctx.fillStyle = '#00D9FF'
      ctx.textAlign = 'center'
      ctx.fillText('94.3', cx, cy - 5)
      ctx.font = '14px Orbitron'
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillText('SAFETY INDEX', cx, cy + 20)

      // Bar chart at bottom
      const barAreaY = h * 0.72
      const barHeight = h * 0.22
      const barW = w / (hourlyData.length + 2)
      const maxVal = Math.max(...hourlyData)
      
      hourlyData.forEach((val, i) => {
        const x = barW * (i + 1)
        const bh = (val / maxVal) * barHeight * Math.min(t * 0.5, 1)
        const y = barAreaY + barHeight - bh

        const gradient = ctx.createLinearGradient(x, y, x, barAreaY + barHeight)
        gradient.addColorStop(0, i === hourlyData.length - 1 ? 'rgba(0, 217, 255, 0.8)' : 'rgba(0, 217, 255, 0.4)')
        gradient.addColorStop(1, 'rgba(0, 217, 255, 0.05)')
        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barW * 0.6, bh)

        // Hour label
        if (i % 3 === 0) {
          ctx.font = '12px Orbitron'
          ctx.fillStyle = 'rgba(255,255,255,0.15)'
          ctx.textAlign = 'center'
          ctx.fillText(`${String(i).padStart(2, '0')}:00`, x + barW * 0.3, barAreaY + barHeight + 18)
        }
      })

      // Axis labels
      ctx.font = '12px Orbitron'
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.textAlign = 'center'
      ctx.fillText('ALERTS BY HOUR — TODAY', w / 2, barAreaY - 8)

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
          <p className="text-white/30 text-sm">Real-time analytics from across the guardian network</p>
        </motion.div>

        {/* Top stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'TOTAL ALERTS', value: liveAlerts, suffix: '', color: 'cyan', change: '+12%', icon: '🚨' },
            { label: 'ACTIVE GUARDIANS', value: 2847, suffix: '', color: 'saffron', change: '+5%', icon: '🛡' },
            { label: 'AVG RESPONSE', value: 7.2, suffix: 's', decimals: 1, color: 'cyan', change: '-18%', icon: '⚡' },
            { label: 'PHOTOS CAPTURED', value: 342, suffix: '', color: 'saffron', change: '+24%', icon: '📸' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <HUDPanel delay={i * 0.08}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-hud text-[8px] text-white/25 tracking-wider">{stat.label}</p>
                    <div className="flex items-end gap-2 mt-2">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        decimals={stat.decimals || 0}
                        className={`font-hud text-2xl md:text-3xl font-bold text-${stat.color}`}
                      />
                    </div>
                    <span className={`font-hud text-[9px] ${stat.change.startsWith('-') ? 'text-green-400' : 'text-green-400'}`}>{stat.change}</span>
                  </div>
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </HUDPanel>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main chart */}
          <div className="lg:col-span-2">
            <HUDPanel title="SYSTEM PERFORMANCE">
              <div className="relative aspect-[4/3]">
                <canvas ref={chartRef} className="w-full h-full" />
              </div>
            </HUDPanel>
          </div>

          {/* Activity feed */}
          <div>
            <HUDPanel title="LIVE ACTIVITY FEED">
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                {incidents.map((inc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="p-2.5 rounded-sm border border-white/5 hover:border-cyan/15 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        inc.status === 'resolved' ? 'bg-green-400' :
                        inc.status === 'completed' ? 'bg-cyan' :
                        inc.status === 'active' ? 'bg-saffron animate-pulse-glow' :
                        'bg-orange'
                      }`} />
                      <span className="font-hud text-[9px] text-white/50 flex-1">{inc.type}</span>
                      <span className="font-hud text-[8px] text-white/20">{inc.time}</span>
                    </div>
                    <div className="flex items-center justify-between ml-3.5">
                      <span className="text-[9px] text-white/25">{inc.location}</span>
                      <span className="text-[8px] text-cyan/30">{inc.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </HUDPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
