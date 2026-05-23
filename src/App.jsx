import { useState, useEffect } from 'react'
import Lenis from 'lenis'
import { motion, AnimatePresence } from 'framer-motion'
import MainScene from './components/three/MainScene'
import LoadingScreen from './components/sections/LoadingScreen'
import LandingSection from './components/sections/LandingSection'
import HeroSection from './components/sections/HeroSection'
import MapSection from './components/sections/MapSection'
import SOSSection from './components/sections/SOSSection'
import AIGuardianSection from './components/sections/AIGuardianSection'
import FakeCallSection from './components/sections/FakeCallSection'
import SafeWalkSection from './components/sections/SafeWalkSection'
import DashboardSection from './components/sections/DashboardSection'
import VoiceCommandSection from './components/sections/VoiceCommandSection'
import EvidenceLockerSection from './components/sections/EvidenceLockerSection'
import CommunityShieldSection from './components/sections/CommunityShieldSection'
import ThreatHeatmapSection from './components/sections/ThreatHeatmapSection'
import SettingsTerminalSection from './components/sections/SettingsTerminalSection'
import TechStackSection from './components/sections/TechStackSection'
import TestimonialsSection from './components/sections/TestimonialsSection'
import FloatingSOSButton from './components/ui/FloatingSOSButton'
import NotificationToast from './components/ui/NotificationToast'
import EmergencyCamera from './components/ui/EmergencyCamera'
import { useEmergencyStore } from './stores/emergencyStore'

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <span className="font-hud text-[9px] tracking-wider text-cyan/40 hidden md:block">
      {time.toLocaleTimeString('en-IN', { hour12: false })} IST
    </span>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('landing-section')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      // Detect active section
      const sections = document.querySelectorAll('section[id]')
      let current = 'landing-section'
      sections.forEach(section => {
        const top = section.offsetTop - 200
        if (window.scrollY >= top) current = section.id
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'HOME', href: '#landing-section', id: 'landing-section' },
    { label: 'SOS', href: '#sos-section', id: 'sos-section' },
    { label: 'GUARDIAN', href: '#ai-guardian-section', id: 'ai-guardian-section' },
    { label: 'VOICE', href: '#voice-command-section', id: 'voice-command-section' },
    { label: 'HEATMAP', href: '#threat-heatmap-section', id: 'threat-heatmap-section' },
    { label: 'MAP', href: '#map-section', id: 'map-section' },
    { label: 'COMMAND', href: '#settings-terminal-section', id: 'settings-terminal-section' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'glass py-2' : 'py-4'}`} id="main-navbar">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#landing-section" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-cyan/30 to-saffron/20 border border-cyan/30 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all duration-500">
              <span className="font-hud text-[10px] font-bold text-cyan">R</span>
              <div className="absolute inset-0 rounded-full border border-cyan/10 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-hud text-sm tracking-[0.15em] text-white/80 leading-none">RAKSHA</span>
              <span className="font-display text-[10px] text-saffron/50 leading-none">रक्षा</span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                className={`relative font-hud text-[9px] tracking-[0.15em] px-3 py-2 rounded-sm transition-all duration-300 ${
                  activeSection === l.id 
                    ? 'text-cyan bg-cyan/5' 
                    : 'text-white/35 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
              >
                {activeSection === l.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan rounded-full"
                  />
                )}
                {l.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LiveClock />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-glow" />
              <span className="font-hud text-[8px] tracking-wider text-green-400/60 hidden sm:block">ONLINE</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <motion.div animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 5 : 0 }} className="w-5 h-[1.5px] bg-white/50" />
              <motion.div animate={{ opacity: mobileOpen ? 0 : 1 }} className="w-5 h-[1.5px] bg-white/50" />
              <motion.div animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -5 : 0 }} className="w-5 h-[1.5px] bg-white/50" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-0 right-0 z-[99] glass border-b border-white/5 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className={`font-hud text-[10px] tracking-widest px-4 py-3 rounded-sm transition-all ${
                    activeSection === l.id ? 'text-cyan bg-cyan/5' : 'text-white/40'
                  }`}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SectionDivider({ label }) {
  return (
    <div className="relative z-10 flex items-center gap-4 max-w-6xl mx-auto px-8 py-2">
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
      {label && <span className="font-hud text-[8px] tracking-[0.3em] text-white/15 shrink-0">{label}</span>}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
    </div>
  )
}

function Footer() {
  const [year] = useState(new Date().getFullYear())
  
  return (
    <footer className="relative z-10 border-t border-white/5 py-16 px-4" id="footer">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan/30 to-saffron/20 border border-cyan/30 flex items-center justify-center">
                <span className="font-hud text-sm font-bold text-cyan">R</span>
              </div>
              <div>
                <h3 className="font-hud text-lg text-glow leading-none">RAKSHA</h3>
                <p className="font-display text-sm text-saffron/50">रक्षा</p>
              </div>
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              India's futuristic AI-powered women safety command system. Protecting women with technology that never sleeps.
            </p>
          </div>
          <div>
            <h4 className="font-hud text-[10px] tracking-widest text-cyan/60 mb-4">FEATURES</h4>
            <div className="space-y-2 text-xs text-white/30">
              {['SOS + Auto Capture', 'AI Guardian', 'Voice Commands', 'Safe Walk', 'Fake Call', 'Evidence Locker', 'Community Shield', 'Threat Heatmap'].map(f => (
                <p key={f} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-cyan/30" />{f}</p>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-hud text-[10px] tracking-widest text-cyan/60 mb-4">EMERGENCY</h4>
            <div className="space-y-3 text-xs text-white/40">
              <p>Women Helpline: <span className="text-cyan font-hud">181</span></p>
              <p>Police: <span className="text-cyan font-hud">112</span></p>
              <p>Ambulance: <span className="text-cyan font-hud">108</span></p>
              <p>Child Helpline: <span className="text-cyan font-hud">1098</span></p>
              <p>NCW: <span className="text-cyan font-hud">7827-170-170</span></p>
            </div>
          </div>
          <div>
            <h4 className="font-hud text-[10px] tracking-widest text-cyan/60 mb-4">SYSTEM</h4>
            <div className="space-y-2 text-xs text-white/40">
              <p>Version: <span className="text-cyan">3.2.0</span></p>
              <p>Status: <span className="text-green-400">All Systems Operational</span></p>
              <p>Region: <span className="text-cyan">Maharashtra, India</span></p>
              <p>Uptime: <span className="text-cyan">99.97%</span></p>
              <p>Encryption: <span className="text-cyan">AES-256</span></p>
            </div>
            <div className="mt-4 p-3 rounded-sm bg-green-500/5 border border-green-500/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
                <span className="font-hud text-[8px] text-green-400/60">ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-hud text-[9px] tracking-widest text-white/15">
            © {year} RAKSHA COMMAND SYSTEMS — SLOKAS HACKATHON
          </p>
          <div className="flex items-center gap-6">
            <span className="font-hud text-[8px] text-white/10">REACT + THREE.JS + GSAP + ZUSTAND</span>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-saffron/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-400/20" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Scroll progress indicator
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      setProgress(Math.min(scrollTop / docHeight, 1))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[101] h-[2px]">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan via-saffron to-cyan"
        style={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  )
}

// Side navigation dots
function SideNav() {
  const [activeSection, setActiveSection] = useState(0)
  
  const sections = [
    { id: 'landing-section', label: 'HOME' },
    { id: 'hero-section', label: 'HERO' },
    { id: 'sos-section', label: 'SOS' },
    { id: 'ai-guardian-section', label: 'AI' },
    { id: 'voice-command-section', label: 'VOICE' },
    { id: 'threat-heatmap-section', label: 'THREAT' },
    { id: 'map-section', label: 'MAP' },
    { id: 'safe-walk-section', label: 'WALK' },
    { id: 'fake-call-section', label: 'CALL' },
    { id: 'evidence-locker-section', label: 'EVIDENCE' },
    { id: 'community-shield-section', label: 'SHIELD' },
    { id: 'dashboard-section', label: 'DASH' },
  ]

  useEffect(() => {
    const onScroll = () => {
      const sectionEls = sections.map(s => document.getElementById(s.id)).filter(Boolean)
      let idx = 0
      sectionEls.forEach((el, i) => {
        if (window.scrollY >= el.offsetTop - 300) idx = i
      })
      setActiveSection(idx)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col gap-2">
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group flex items-center gap-2 justify-end"
          title={s.label}
        >
          <span className={`font-hud text-[7px] tracking-widest transition-all duration-300 ${
            i === activeSection ? 'opacity-100 text-cyan' : 'opacity-0 group-hover:opacity-60 text-white/40'
          }`}>
            {s.label}
          </span>
          <div className={`transition-all duration-300 rounded-full ${
            i === activeSection 
              ? 'w-3 h-3 bg-cyan shadow-[0_0_8px_rgba(0,217,255,0.5)]' 
              : 'w-1.5 h-1.5 bg-white/20 group-hover:bg-white/40'
          }`} />
        </a>
      ))}
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const isEmergency = useEmergencyStore(s => s.isEmergency)

  // Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className={`relative min-h-screen ${isEmergency ? 'emergency-active' : ''}`}>
      {/* Loading */}
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* 3D Background */}
      <MainScene />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Scanlines */}
      <div className="scanlines" />

      {/* Emergency vignette */}
      {isEmergency && <div className="emergency-vignette" />}

      {/* Emergency Camera */}
      <EmergencyCamera />

      {/* Scroll progress */}
      {loaded && <ScrollProgress />}

      {/* Navbar */}
      {loaded && <Navbar />}

      {/* Side navigation */}
      {loaded && <SideNav />}

      {/* Floating SOS */}
      {loaded && <FloatingSOSButton />}

      {/* Notifications */}
      {loaded && <NotificationToast />}

      {/* Main content */}
      {loaded && (
        <main className="relative z-10">
          <LandingSection />
          <HeroSection />
          <SectionDivider label="EMERGENCY SYSTEMS" />
          <SOSSection />
          <SectionDivider />
          <AIGuardianSection />
          <SectionDivider label="INTELLIGENT FEATURES" />
          <VoiceCommandSection />
          <SectionDivider />
          <ThreatHeatmapSection />
          <SectionDivider />
          <MapSection />
          <SectionDivider label="PROTECTION TOOLS" />
          <SafeWalkSection />
          <SectionDivider />
          <FakeCallSection />
          <SectionDivider />
          <EvidenceLockerSection />
          <SectionDivider label="COMMUNITY & ANALYTICS" />
          <CommunityShieldSection />
          <SectionDivider />
          <DashboardSection />
          <SectionDivider label="TESTIMONIALS & TECH" />
          <TestimonialsSection />
          <SectionDivider />
          <TechStackSection />
          <SectionDivider />
          <SettingsTerminalSection />
          <Footer />
        </main>
      )}
    </div>
  )
}
