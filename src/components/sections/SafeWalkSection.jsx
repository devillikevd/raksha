import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HUDPanel from '../ui/HUDPanel'
import MagneticButton from '../ui/MagneticButton'

const routesDb = {
  bandra: {
    destination: 'Bandra Linking Road',
    distance: '1.4 km',
    options: [
      { name: 'MAIN ROAD (ACTIVE SCAN)', safety: 96, time: '12 min', status: 'secure', path: ['Station Gate 1', 'Linking Road Chowk', 'National College Junction', 'Destination'], checkpoints: [
        { name: 'Station Gate 1', status: 'passed', distance: '0m' },
        { name: 'Linking Road Chowk', status: 'current', distance: '400m' },
        { name: 'National College Junction', status: 'pending', distance: '900m' },
        { name: 'Destination', status: 'pending', distance: '1.4km' },
      ]},
      { name: 'DARK ALLEY SHORTCUT', safety: 34, time: '6 min', status: 'warning', path: ['Station Back Alley', 'Construction Zone', 'Unlit Passage', 'Destination'], checkpoints: [
        { name: 'Station Back Alley', status: 'current', distance: '0m' },
        { name: 'Construction Zone', status: 'pending', distance: '200m' },
        { name: 'Unlit Passage', status: 'pending', distance: '450m' },
        { name: 'Destination', status: 'pending', distance: '600m' },
      ]}
    ]
  },
  dadar: {
    destination: 'Dadar Station Plaza',
    distance: '850m',
    options: [
      { name: 'STATION FLYOVER ROUTE', safety: 91, time: '8 min', status: 'secure', path: ['Plaza Gate', 'Flyover Footpath', 'Ticket Counter West', 'Destination'], checkpoints: [
        { name: 'Plaza Gate', status: 'passed', distance: '0m' },
        { name: 'Flyover Footpath', status: 'current', distance: '300m' },
        { name: 'Ticket Counter West', status: 'pending', distance: '600m' },
        { name: 'Destination', status: 'pending', distance: '850m' },
      ]},
      { name: 'SUBWAY WALKWAY', safety: 42, time: '4 min', status: 'warning', path: ['Plaza Subway Entrance', 'Underpass Sector 2', 'Destination'], checkpoints: [
        { name: 'Plaza Subway Entrance', status: 'current', distance: '0m' },
        { name: 'Underpass Sector 2', status: 'pending', distance: '200m' },
        { name: 'Destination', status: 'pending', distance: '400m' },
      ]}
    ]
  }
}

export default function SafeWalkSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeRoute, setActiveRoute] = useState(null)
  const [selectedOption, setSelectedOption] = useState(0)
  const [simulating, setSimulating] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [timer, setTimer] = useState(720)
  const [escortDrone, setEscortDrone] = useState(true)

  // Timer simulation
  useEffect(() => {
    if (!simulating) return
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 10) {
          setSimulating(false)
          return 0
        }
        return t - 15
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [simulating])

  // Checkpoint automatic traversal simulator
  useEffect(() => {
    if (!simulating || !activeRoute) return
    const interval = setInterval(() => {
      setActiveStep(s => {
        const total = activeRoute.options[selectedOption].checkpoints.length
        if (s >= total - 1) {
          clearInterval(interval)
          setSimulating(false)
          return total - 1
        }
        return s + 1
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [simulating, activeRoute, selectedOption])

  const searchDestination = (e) => {
    e.preventDefault()
    const query = searchQuery.toLowerCase().trim()
    if (query.includes('bandra') || query.includes('link')) {
      setActiveRoute(routesDb.bandra)
      setSelectedOption(0)
      setTimer(720)
      setActiveStep(1)
    } else {
      setActiveRoute(routesDb.dadar)
      setSelectedOption(0)
      setTimer(480)
      setActiveStep(1)
    }
  }

  const mins = Math.floor(timer / 60)
  const secs = timer % 60

  return (
    <section className="section-container min-h-screen relative" id="safe-walk-section">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-hud text-[10px] tracking-[0.4em] text-cyan/60 mb-4">◆ TACTICAL INTERACTIVE NAVIGATION</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow mb-4">SAFE WALK MODE</h2>
          <p className="text-white/40 text-sm">ML-powered route optimization. Select highly illuminated secure pathways or dark alley shortcuts with live drone escort.</p>
        </motion.div>

        {/* Input box */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={searchDestination} className="flex gap-2">
            <input
              type="text"
              placeholder="ENTER DESTINATION (e.g. Bandra, Dadar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-hud text-[10px] bg-navy-dark border border-white/10 rounded-sm px-4 py-3 text-cyan placeholder-white/20 focus:outline-none focus:border-cyan/50"
            />
            <MagneticButton variant="primary" type="submit">
              PLAN ROUTE
            </MagneticButton>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main planner display */}
          <div className="lg:col-span-2 space-y-4">
            {activeRoute ? (
              <>
                {/* Route selector tabs */}
                <div className="flex gap-2">
                  {activeRoute.options.map((opt, idx) => (
                    <button
                      key={opt.name}
                      onClick={() => { setSelectedOption(idx); setActiveStep(1); setTimer(idx === 0 ? 720 : 360) }}
                      className={`flex-1 text-left p-4 rounded-sm border transition-all cursor-pointer ${
                        selectedOption === idx
                          ? 'border-cyan/40 bg-cyan/5'
                          : 'border-white/5 hover:border-white/10 bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-hud text-[9px] tracking-wider text-white/50">{opt.name}</span>
                        <span className={`font-hud text-[9px] font-bold ${
                          opt.safety > 80 ? 'text-green-400' : 'text-emergency animate-pulse'
                        }`}>{opt.safety}% SAFE</span>
                      </div>
                      <div className="flex gap-2 text-[10px] text-white/30">
                        <span>⏱ {opt.time}</span>
                        <span>•</span>
                        <span>{idx === 0 ? 'Fully Illuminated' : 'High Risk Area'}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Route visualization progress */}
                <HUDPanel title={`TACTICAL NAVIGATION — TO ${activeRoute.destination.toUpperCase()}`}>
                  <div className="relative py-6 px-4">
                    {/* Route track */}
                    <div className="absolute left-8 top-8 bottom-8 w-[2px] bg-white/5" />
                    {/* Traversed color track */}
                    <div
                      className="absolute left-8 top-8 w-[2px] bg-cyan transition-all duration-1000"
                      style={{
                        height: `${(activeStep / (activeRoute.options[selectedOption].checkpoints.length - 1)) * 82}%`
                      }}
                    />

                    <div className="space-y-6">
                      {activeRoute.options[selectedOption].checkpoints.map((cp, idx) => {
                        const isPassed = idx < activeStep
                        const isCurrent = idx === activeStep
                        const isPending = idx > activeStep

                        return (
                          <motion.div
                            key={cp.name}
                            className="relative flex items-center gap-6"
                          >
                            {/* Node point */}
                            <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                              isPassed ? 'bg-cyan border-cyan' :
                              isCurrent ? 'bg-saffron border-saffron scale-110 shadow-[0_0_10px_rgba(255,107,0,0.6)]' :
                              'bg-navy-dark border-white/20'
                            }`}>
                              {isCurrent && <div className="absolute -inset-1.5 rounded-full bg-saffron/30 animate-ping" />}
                            </div>

                            {/* Node label */}
                            <div className={`flex-1 glass rounded-sm p-3.5 border transition-all ${
                              isCurrent ? 'border-saffron/40 bg-saffron/5' :
                              isPassed ? 'border-cyan/15 bg-cyan/[0.01]' :
                              'border-white/5 bg-transparent opacity-40'
                            }`}>
                              <div className="flex justify-between items-center">
                                <span className={`font-hud text-xs tracking-wider ${
                                  isCurrent ? 'text-saffron text-glow-saffron' :
                                  isPassed ? 'text-cyan/70' :
                                  'text-white/30'
                                }`}>{cp.name}</span>
                                <span className="font-hud text-[8px] text-white/35">{cp.distance}</span>
                              </div>
                              {isCurrent && (
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                                  <span className="font-hud text-[8px] text-saffron/70">ACTIVE MONITORING</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Simulation buttons */}
                    <div className="mt-8 flex justify-center gap-4">
                      {simulating ? (
                        <button
                          onClick={() => setSimulating(false)}
                          className="font-hud text-[9px] tracking-wider px-5 py-2.5 rounded-sm bg-emergency/15 border border-emergency/30 text-emergency cursor-pointer hover:bg-emergency/25 transition-all"
                        >
                          ⏹ PAUSE WALK
                        </button>
                      ) : (
                        <button
                          onClick={() => setSimulating(true)}
                          className="font-hud text-[9px] tracking-wider px-5 py-2.5 rounded-sm bg-cyan/15 border border-cyan/30 text-cyan cursor-pointer hover:bg-cyan/25 transition-all"
                        >
                          ▶ START WALK SIMULATOR
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActiveStep(0)
                          setTimer(selectedOption === 0 ? 720 : 360)
                          setSimulating(false)
                        }}
                        className="font-hud text-[9px] text-white/20 hover:text-white/40 cursor-pointer"
                      >
                        RESET
                      </button>
                    </div>
                  </div>
                </HUDPanel>
              </>
            ) : (
              <HUDPanel title="ACTIVE ROUTE MAP">
                <div className="text-center py-20">
                  <span className="text-4xl mb-4 block">🗺</span>
                  <p className="font-hud text-xs text-white/40 tracking-wider">ENTER A DESTINATION TO PLAN SECURE WALKWAYS</p>
                  <p className="text-[10px] text-white/20 mt-1">Simulate paths for Bandra Linking Road or Dadar Plaza</p>
                </div>
              </HUDPanel>
            )}
          </div>

          {/* Sidebar telemetry */}
          <div className="space-y-4">
            {/* Countdown / ETA */}
            <HUDPanel title="ETA TIMER">
              <div className="text-center">
                <p className={`font-hud text-5xl font-bold text-cyan ${simulating ? 'animate-pulse' : ''}`}>
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </p>
                <p className="font-hud text-[9px] text-white/30 mt-2 tracking-wider">ESTIMATED TRANSIT TIME</p>
                <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan to-saffron rounded-full transition-all duration-500"
                    style={{
                      width: `${activeRoute ? ((activeStep / (activeRoute.options[selectedOption].checkpoints.length - 1)) * 100) : 0}%`
                    }}
                  />
                </div>
              </div>
            </HUDPanel>

            {/* Smart Escort Drone toggle */}
            <HUDPanel title="SHIELD SYSTEM">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-hud text-[9px] tracking-wider text-white/60">ESCORT DRONE SHIELD</p>
                  <p className="text-[9px] text-white/25 mt-0.5">Launches virtual patrol overlay</p>
                </div>
                <button
                  onClick={() => setEscortDrone(!escortDrone)}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    escortDrone ? 'bg-cyan/20 border border-cyan/40' : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${
                    escortDrone ? 'left-5 bg-cyan shadow-[0_0_5px_rgba(0,217,255,0.6)]' : 'left-1 bg-white/20'
                  }`} />
                </button>
              </div>
            </HUDPanel>

            {/* Drone simulation radar */}
            <HUDPanel title="THREAT RADAR">
              <div className="relative w-full aspect-square max-w-[180px] mx-auto">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="absolute inset-0 m-auto rounded-full border border-cyan/10" style={{ width: `${i * 25}%`, height: `${i * 25}%` }} />
                ))}
                <div className="absolute inset-0 m-auto animate-radar" style={{ background: 'conic-gradient(from 0deg, transparent, rgba(0,217,255,0.15) 30deg, transparent 60deg)', borderRadius: '50%', width: '100%', height: '100%' }} />
                
                {/* Simulated targets */}
                <div className="absolute top-[25%] left-[55%] w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" title="Verified Safe Zone" />
                <div className="absolute top-[68%] left-[28%] w-2 h-2 rounded-full bg-saffron animate-pulse-glow" title="High Risk Entity" />
                
                {escortDrone && (
                  <div className="absolute top-[45%] left-[45%] w-3 h-3 rounded-full bg-cyan/20 border border-cyan flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
                  </div>
                )}
              </div>
              <p className="font-hud text-[9px] text-center text-cyan/50 mt-2">
                {escortDrone ? 'ESCORT DRONE LOCK: SECURE' : 'RADAR SWEEP ACTIVE'}
              </p>
            </HUDPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
