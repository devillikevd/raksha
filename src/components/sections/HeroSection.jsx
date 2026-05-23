import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../ui/MagneticButton'
import HolographicCard from '../ui/HolographicCard'
import AnimatedCounter from '../ui/AnimatedCounter'
import { useEmergencyStore } from '../../stores/emergencyStore'

gsap.registerPlugin(ScrollTrigger)

const metrics = [
  { label: 'Active Guardians', value: 2847, icon: '🛡', suffix: '', color: 'cyan' },
  { label: 'Safe Zones', value: 1256, icon: '📍', suffix: '+', color: 'saffron' },
  { label: 'Response Time', value: 7.2, icon: '⚡', suffix: 's', prefix: '<', decimals: 1, color: 'cyan' },
  { label: 'AI Confidence', value: 99.7, icon: '🧠', suffix: '%', decimals: 1, color: 'saffron' },
  { label: 'Incidents Prevented', value: 847, icon: '🚨', suffix: '', color: 'green-400' },
  { label: 'Coverage Area', value: 94, icon: '📡', suffix: '%', color: 'cyan' },
]

const features = [
  { icon: '📸', title: 'Auto-Capture', desc: 'Camera auto-clicks photos & records video on SOS — sends to emergency contacts with GPS', highlight: true },
  { icon: '🧠', title: 'AI Prediction', desc: 'ML-powered threat detection predicts danger before it happens' },
  { icon: '🗣', title: 'Voice Activated', desc: 'Say "RAKSHA HELP ME" in Hindi or English for hands-free SOS' },
  { icon: '🔗', title: 'Blockchain Evidence', desc: 'Tamper-proof evidence chain with legal validity' },
]

export default function HeroSection() {
  const sectionRef = useRef(null)
  const activateSOS = useEmergencyStore(s => s.activateSOS)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-metric', {
        y: 50, opacity: 0, stagger: 0.08, duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-container min-h-screen relative" id="hero-section">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <p className="font-hud text-[10px] tracking-[0.4em] text-saffron/60 mb-6">◆ GUARDIAN PROTOCOL v3.2 — OPERATIONAL</p>
            <h2 className="text-4xl md:text-7xl font-bold leading-tight">
              <span className="text-white">Your Safety.</span><br />
              <span className="bg-gradient-to-r from-cyan via-saffron to-orange bg-clip-text text-transparent">Powered By Intelligence.</span>
            </h2>
            <p className="mt-6 text-white/35 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Real-time AI protection, predictive threat analysis, auto-capture evidence system, and instant emergency response — every second counts, and RAKSHA never sleeps.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-wrap justify-center gap-4 mt-10">
            <MagneticButton variant="emergency" onClick={activateSOS} id="hero-sos-btn">◉ ACTIVATE SOS</MagneticButton>
            <MagneticButton variant="primary" id="hero-safe-walk-btn">◈ ENTER SAFE WALK</MagneticButton>
            <MagneticButton variant="saffron" id="hero-guardian-btn">🛡 AI GUARDIAN</MagneticButton>
          </motion.div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {metrics.map((m, i) => (
            <div key={m.label} className="hero-metric">
              <HolographicCard>
                <div className="p-4 text-center">
                  <span className="text-xl mb-2 block">{m.icon}</span>
                  <AnimatedCounter
                    value={m.value}
                    suffix={m.suffix}
                    prefix={m.prefix || ''}
                    decimals={m.decimals || 0}
                    className={`font-hud text-xl md:text-2xl font-bold text-${m.color}`}
                  />
                  <p className="font-hud text-[7px] tracking-[0.2em] text-white/30 mt-1">{m.label}</p>
                </div>
              </HolographicCard>
            </div>
          ))}
        </div>

        {/* Key features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <HolographicCard>
                <div className={`p-5 ${f.highlight ? 'border-l-2 border-l-emergency/50' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{f.icon}</span>
                    {f.highlight && (
                      <span className="font-hud text-[7px] tracking-wider px-2 py-0.5 rounded-full bg-emergency/10 border border-emergency/20 text-emergency/60">NEW</span>
                    )}
                  </div>
                  <h3 className="font-hud text-xs tracking-wider text-cyan mb-2">{f.title}</h3>
                  <p className="text-[11px] text-white/30 leading-relaxed">{f.desc}</p>
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
