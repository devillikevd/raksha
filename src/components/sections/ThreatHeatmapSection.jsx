import { useRef, useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HUDPanel from '../ui/HUDPanel'
import HolographicCard from '../ui/HolographicCard'
import AnimatedCounter from '../ui/AnimatedCounter'

const heatmapData = [
  { xp: 25, yp: 30, label: 'Andheri Station Area', baseRisk: 0.9, details: 'Heavy congestion, active subway exit, low lighting in West Sector.' },
  { xp: 40, yp: 55, label: 'Bandra Link Chowk', baseRisk: 0.7, details: 'Bustling retail, high transit volume, 3 reported pickpocket alerts.' },
  { xp: 60, yp: 40, label: 'Dadar East Flyover', baseRisk: 0.85, details: 'Subway underpass construction, high density blindspots.' },
  { xp: 75, yp: 25, label: 'Kurla Complex West', baseRisk: 0.6, details: 'Empty industrial pathways, active police patrol within 300m.' },
  { xp: 35, yp: 70, label: 'Worli Sea Path', baseRisk: 0.4, details: 'Wide illuminated walking lane, low risk sector.' },
  { xp: 55, yp: 65, label: 'Lower Parel Junction', baseRisk: 0.5, details: 'Corporate sector, CCTV active, optimal lighting levels.' },
  { xp: 20, yp: 50, label: 'Borivali Main Market', baseRisk: 0.65, details: 'Active crowded bazaar, standard visibility checks.' },
  { xp: 80, yp: 60, label: 'Thane Central Gate', baseRisk: 0.75, details: 'Underpass connection, high relative incident history.' },
]

const predictions = [
  { time: '18:00 - 20:00', area: 'Andheri Station Exit', risk: 'HIGH', confidence: 94, trend: '↑' },
  { time: '20:00 - 22:00', area: 'Bandra Linking Road', risk: 'MEDIUM', confidence: 87, trend: '→' },
  { time: '22:00 - 00:00', area: 'Dadar East Bridge', risk: 'HIGH', confidence: 91, trend: '↑' },
  { time: '00:00 - 02:00', area: 'Lower Parel', risk: 'CRITICAL', confidence: 96, trend: '↑↑' },
]

export default function ThreatHeatmapSection() {
  const canvasRef = useRef(null)
  const [timeOfDay, setTimeOfDay] = useState('midnight') // afternoon | evening | midnight
  const [hoveredPoint, setHoveredPoint] = useState(heatmapData[0])
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Adjust risks based on time of day
  const getRiskMultiplier = () => {
    if (timeOfDay === 'afternoon') return 0.5
    if (timeOfDay === 'evening') return 0.8
    return 1.2 // Midnight is the highest risk
  }

  // Draw Heatmap Canvas
  const drawHeatmap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    setCanvasSize({ width: w, height: h })
    let t = 0

    const animate = () => {
      t += 0.015
      ctx.clearRect(0, 0, w, h)

      // Cyber Grid
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

      const mult = getRiskMultiplier()

      // Render all blobs
      heatmapData.forEach(point => {
        const x = (point.xp / 100) * w
        const y = (point.yp / 100) * h
        const currentRisk = Math.min(point.baseRisk * mult, 1)
        const pulse = Math.sin(t * 2.5 + x * 0.01) * 0.12 + 0.88
        const r = 35 + currentRisk * 70

        // Create elegant radial glows
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * pulse)
        if (currentRisk > 0.8) {
          gradient.addColorStop(0, `rgba(255, 46, 46, ${currentRisk * 0.45})`)
          gradient.addColorStop(0.4, `rgba(255, 107, 0, ${currentRisk * 0.2})`)
          gradient.addColorStop(1, 'transparent')
        } else if (currentRisk > 0.5) {
          gradient.addColorStop(0, `rgba(255, 138, 0, ${currentRisk * 0.35})`)
          gradient.addColorStop(0.4, `rgba(255, 138, 0, ${currentRisk * 0.15})`)
          gradient.addColorStop(1, 'transparent')
        } else {
          gradient.addColorStop(0, `rgba(0, 217, 255, ${currentRisk * 0.35})`)
          gradient.addColorStop(0.4, `rgba(0, 217, 255, ${currentRisk * 0.15})`)
          gradient.addColorStop(1, 'transparent')
        }

        ctx.beginPath()
        ctx.arc(x, y, r * pulse, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core central coordinate pointer
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = currentRisk > 0.8 ? '#FF2E2E' : currentRisk > 0.5 ? '#FF8A00' : '#00D9FF'
        ctx.fill()

        // Radar line surrounding hovered point
        if (hoveredPoint?.label === point.label) {
          ctx.beginPath()
          ctx.arc(x, y, 12 + Math.sin(t * 5) * 4, 0, Math.PI * 2)
          ctx.strokeStyle = '#00D9FF'
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Sector label
        ctx.font = '11px Orbitron'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
        ctx.textAlign = 'center'
        ctx.fillText(point.label.split(' ')[0], x, y - 16)
      })

      // Dynamic horizontal digital scanner line
      const scanY = ((t * 40) % h)
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(w, scanY)
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      requestAnimationFrame(animate)
    }
    animate()
  }, [timeOfDay, hoveredPoint])

  useEffect(() => { drawHeatmap() }, [drawHeatmap])

  // Mouse move hover detector
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = ((e.clientX - rect.left) / rect.width) * 100
    const clickY = ((e.clientY - rect.top) / rect.height) * 100

    // Find nearest point
    let minDistance = 15 // radius sensitivity
    let closestPoint = null
    heatmapData.forEach(point => {
      const d = Math.hypot(point.xp - clickX, point.yp - clickY)
      if (d < minDistance) {
        minDistance = d
        closestPoint = point
      }
    })

    if (closestPoint) {
      setHoveredPoint(closestPoint)
    }
  }

  const currentRiskVal = Math.min((hoveredPoint?.baseRisk || 0) * getRiskMultiplier(), 1)

  return (
    <section className="section-container min-h-screen relative" id="threat-heatmap-section">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-hud text-[10px] tracking-[0.4em] text-cyan/60 mb-4">◆ PREDICTIVE THREAT INTELLIGENCE</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow mb-4">THREAT HEATMAP</h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            ML-powered crime prediction engine. Select a time interval to filter sector variables. Hover over heatmap blobs for deep analytical telemetry.
          </p>
        </motion.div>

        {/* Interactive time filter buttons */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'afternoon', label: '☀️ AFTERNOON (12:00 - 17:00)', desc: 'Low Ambient Threat' },
            { id: 'evening', label: '🌆 EVENING (17:00 - 21:00)', desc: 'Moderate Anomaly Activity' },
            { id: 'midnight', label: '🌙 MIDNIGHT (21:00 - 05:00)', desc: 'High Risk Calibration' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeOfDay(t.id)}
              className={`font-hud text-[9px] px-4 py-2 border rounded-sm cursor-pointer transition-all ${
                timeOfDay === t.id
                  ? 'border-cyan/40 bg-cyan/5 text-cyan shadow-[0_0_10px_rgba(0,217,255,0.1)]'
                  : 'border-white/5 bg-white/[0.01] text-white/30 hover:border-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Heatmap Canvas */}
          <div className="lg:col-span-2">
            <HUDPanel title={`CRIME PROBABILITY HEATMAP — ${timeOfDay.toUpperCase()}`}>
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-navy-dark/40 border border-white/5 cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  className="w-full h-full"
                />
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emergency/80" />
                  <span className="font-hud text-[8px] tracking-wider text-white/30">High Risk (&gt;80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-saffron/80" />
                  <span className="font-hud text-[8px] tracking-wider text-white/30">Medium (50%-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan/80" />
                  <span className="font-hud text-[8px] tracking-wider text-white/30">Low Risk (&lt;50%)</span>
                </div>
              </div>
            </HUDPanel>
          </div>

          {/* Interactive Side Inspector Card */}
          <div className="space-y-4">
            <HUDPanel title="SECTOR INSPECTOR">
              {hoveredPoint ? (
                <div className="space-y-4">
                  <div>
                    <span className="font-hud text-[9px] tracking-widest text-white/30">SECTOR LOCATION</span>
                    <p className="font-display text-lg text-white mt-1">{hoveredPoint.label}</p>
                  </div>

                  <div>
                    <span className="font-hud text-[9px] tracking-widest text-white/30">PROBABILITY RATING</span>
                    <div className="flex items-end gap-3 mt-1.5">
                      <p className={`font-hud text-3xl font-bold ${
                        currentRiskVal > 0.8 ? 'text-emergency text-glow-emergency' :
                        currentRiskVal > 0.5 ? 'text-saffron text-glow-saffron' :
                        'text-cyan text-glow'
                      }`}>{Math.round(currentRiskVal * 100)}%</p>
                      <span className="font-hud text-[10px] text-white/40 mb-1">
                        {currentRiskVal > 0.8 ? 'CRITICAL RISK' : currentRiskVal > 0.5 ? 'MODERATE ALERT' : 'SECURE AREA'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-hud text-[9px] tracking-widest text-white/30">AI PATROL BRIEF</span>
                    <p className="text-[11px] text-white/40 leading-relaxed mt-1.5">{hoveredPoint.details}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between text-[8px] font-hud text-white/20">
                    <span>COORDS: {hoveredPoint.xp}°N / {hoveredPoint.yp}°E</span>
                    <span>SENSORS: ACTIVE</span>
                  </div>
                </div>
              ) : (
                <p className="font-hud text-[9px] text-center text-white/20 py-20">HOVER HEATMAP DOTS TO INSPECT</p>
              )}
            </HUDPanel>

            <HUDPanel title="PREDICTIVE AI TIMELINE">
              <div className="space-y-2">
                {predictions.map((pred, i) => (
                  <div
                    key={pred.area}
                    className={`p-2.5 rounded-sm border ${
                      pred.risk === 'CRITICAL' ? 'border-emergency/25 bg-emergency/[0.02]' :
                      pred.risk === 'HIGH' ? 'border-saffron/25 bg-saffron/[0.01]' :
                      'border-white/5 bg-white/[0.005]'
                    }`}
                  >
                    <div className="flex justify-between text-[8px] font-hud text-white/30">
                      <span>{pred.time}</span>
                      <span className={pred.risk === 'CRITICAL' ? 'text-emergency' : 'text-cyan'}>{pred.risk}</span>
                    </div>
                    <p className="text-[10px] text-white/50 mt-1">{pred.area}</p>
                  </div>
                ))}
              </div>
            </HUDPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
