import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import HUDPanel from '../ui/HUDPanel'
import GlowCard from '../ui/GlowCard'
import AIGuardianChat from '../ui/AIGuardianChat'

const features = [
  { icon: '🔍', title: 'Unsafe Route Prediction', desc: 'AI analyzes routes in real-time for potential threats' },
  { icon: '🚨', title: 'Silent Alert Mode', desc: 'Trigger emergency alerts without visible interaction' },
  { icon: '👮', title: 'Police Detection', desc: 'Locates nearest police stations and patrol units' },
  { icon: '🛡', title: 'Smart Guardian', desc: 'Continuous background protection with ML threat models' },
  { icon: '📡', title: 'Emergency Broadcast', desc: 'Multi-channel SOS across SMS, call, and network' },
  { icon: '🧠', title: 'Behavioral Analysis', desc: 'Detects unusual patterns and proactive risk scoring' },
]

export default function AIGuardianSection() {
  const canvasRef = useRef(null)

  const drawNeuralNet = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
    }))

    const animate = () => {
      ctx.fillStyle = 'rgba(6, 15, 26, 0.1)'
      ctx.fillRect(0, 0, w, h)

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 217, 255, 0.5)'
        ctx.fill()
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (d < 150) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0, 217, 255, ${(1 - d / 150) * 0.15})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  useEffect(() => { drawNeuralNet() }, [drawNeuralNet])

  return (
    <section className="section-container min-h-screen relative" id="ai-guardian-section">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-40" />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-hud text-[10px] tracking-[0.4em] text-cyan/60 mb-4">◆ ARTIFICIAL INTELLIGENCE ENGINE</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow mb-4">AI GUARDIAN</h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">Jarvis for women safety. Predictive AI that thinks, analyzes, and protects — before danger arrives.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* AI Orb Visualization */}
          <div className="flex flex-col items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan/20 to-saffron/10 animate-pulse-glow" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan/10 to-transparent border border-cyan/20" style={{ animation: 'radar-sweep 3s linear infinite' }} />
              <div className="absolute inset-8 rounded-full bg-cyan/5 border border-cyan/10 animate-breathe" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-hud text-3xl font-bold text-cyan text-glow">AI</p>
                  <p className="font-hud text-[8px] text-cyan/50 tracking-widest">ACTIVE</p>
                </div>
              </div>
              {/* Orbiting dot */}
              <div className="absolute inset-0 animate-radar">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-saffron shadow-[0_0_12px_rgba(255,107,0,0.8)]" />
              </div>
            </motion.div>

            {/* Quick Metrics */}
            <div className="w-full grid grid-cols-2 gap-2">
              <HUDPanel title="DANGER INDEX">
                <p className="font-hud text-xl text-green-450 font-bold">12%</p>
                <span className="font-hud text-[7px] text-white/20">LOW SECTOR THREAT</span>
              </HUDPanel>
              <HUDPanel title="AI CONFIDENCE">
                <p className="font-hud text-xl text-cyan font-bold">99.7%</p>
                <span className="font-hud text-[7px] text-white/20">STEALTH MODE ACTIVE</span>
              </HUDPanel>
            </div>
          </div>

          {/* Interactive AI Chatbot Console */}
          <div className="lg:col-span-2">
            <AIGuardianChat />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <GlowCard key={f.title} className="p-5">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="font-hud text-xs tracking-wider text-cyan mb-2">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}
