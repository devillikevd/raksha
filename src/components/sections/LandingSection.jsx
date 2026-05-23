import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

function LiveTimeDisplay() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="font-hud text-[9px] tracking-widest text-cyan/40">
      <div>{time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
      <div className="text-cyan/60 text-[11px] mt-0.5">{time.toLocaleTimeString('en-IN', { hour12: false })}</div>
    </div>
  )
}

const featureHighlights = [
  { icon: '📸', label: 'Auto-Capture' },
  { icon: '🧠', label: 'AI Guardian' },
  { icon: '🗣', label: 'Voice Command' },
  { icon: '🛡', label: 'Community Shield' },
]

export default function LandingSection() {
  const sectionRef = useRef(null)
  const radarRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.landing-line', {
        y: 80,
        opacity: 0,
        stagger: 0.12,
        duration: 1.4,
        ease: 'power4.out',
        delay: 2.2,
      })

      gsap.from('.landing-feature', {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        delay: 3.5,
      })

      gsap.to(radarRef.current, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: 'none',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section-container min-h-screen relative"
      id="landing-section"
    >
      {/* Radar background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-15">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="absolute inset-0 m-auto rounded-full border border-cyan/15 animate-border-glow"
              style={{
                width: `${i * 16.6}%`,
                height: `${i * 16.6}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
          <div
            ref={radarRef}
            className="absolute inset-0 m-auto w-full h-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 217, 255, 0.12) 20deg, rgba(255, 107, 0, 0.05) 40deg, transparent 60deg)',
              borderRadius: '50%',
            }}
          />
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan/8" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan/8" />
          {/* Diagonal lines */}
          <div className="absolute inset-0 m-auto w-full h-full" style={{ transform: 'rotate(45deg)' }}>
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan/5" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan/5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="overflow-hidden mb-4">
          <p className="landing-line font-hud text-[10px] md:text-xs tracking-[0.4em] text-cyan/50 mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse-glow align-middle" />
            EMERGENCY NETWORK ACTIVE — ALL SYSTEMS ONLINE
          </p>
        </div>

        <div className="overflow-hidden">
          <h1 className="landing-line font-hud text-6xl md:text-[120px] font-black text-glow tracking-[0.12em] leading-none">
            RAKSHA
          </h1>
        </div>
        <div className="overflow-hidden">
          <p className="landing-line font-display text-4xl md:text-6xl text-saffron/70 mt-3 text-glow-saffron">
            रक्षा
          </p>
        </div>

        <div className="overflow-hidden mt-8">
          <p className="landing-line font-hud text-xs md:text-sm tracking-[0.25em] text-white/40">
            WOMEN SAFETY COMMAND SYSTEM
          </p>
        </div>

        <div className="overflow-hidden mt-5">
          <p className="landing-line text-sm md:text-base text-white/25 max-w-xl mx-auto leading-relaxed">
            An AI-powered emergency operating system designed to protect, 
            predict, and respond — with auto-capture evidence, voice commands, and real-time guardian network.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {featureHighlights.map((f) => (
            <div
              key={f.label}
              className="landing-feature flex items-center gap-2 px-4 py-2 glass rounded-full"
            >
              <span className="text-sm">{f.icon}</span>
              <span className="font-hud text-[8px] tracking-wider text-white/40">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="font-hud text-[8px] tracking-[0.3em] text-cyan/30">SCROLL TO ENTER</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-cyan/20 flex justify-center pt-1.5"
          >
            <motion.div
              animate={{ opacity: [1, 0.2, 1], y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-cyan/50"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Left HUD panel */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-30 hidden md:flex">
        {['LAT 19.0760°N', 'LNG 72.8777°E', 'ALT 14m', 'SIGNAL: 4G+', 'MODE: STEALTH'].map((text, i) => (
          <motion.span
            key={text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: 3 + i * 0.15 }}
            className="font-hud text-[8px] tracking-widest text-cyan/50"
          >
            {text}
          </motion.span>
        ))}
      </div>

      {/* Right HUD panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 3.5 }}
        className="absolute right-4 md:right-8 top-1/3 text-right hidden md:block"
      >
        <LiveTimeDisplay />
        <div className="mt-3 space-y-1">
          <div className="font-hud text-[8px] text-saffron/40">MAHARASHTRA, INDIA</div>
          <div className="font-hud text-[8px] text-white/20">SECTOR: ACTIVE</div>
          <div className="font-hud text-[8px] text-green-400/30">ENCRYPTION: AES-256</div>
        </div>
      </motion.div>

      {/* Bottom HUD bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 4 }}
        className="absolute bottom-6 left-4 right-4 flex justify-between items-center"
      >
        <span className="font-hud text-[7px] tracking-widest text-white/15">RAKSHA v3.2.0</span>
        <div className="flex items-center gap-4">
          {['GPS', 'AI', 'CAM', 'NET', 'ENC'].map((sys, i) => (
            <div key={sys} className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-green-400/50" />
              <span className="font-hud text-[7px] text-white/15">{sys}</span>
            </div>
          ))}
        </div>
        <span className="font-hud text-[7px] tracking-widest text-white/15">ENCRYPTED SESSION</span>
      </motion.div>
    </section>
  )
}
