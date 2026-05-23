import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HUDPanel from '../ui/HUDPanel'
import { useEmergencyStore } from '../../stores/emergencyStore'

const voiceCommands = [
  { trigger: '"RAKSHA, HELP ME" / "HELP"', action: 'Triggers silent SOS + GPS broadcast', icon: '🆘', keywords: ['help', 'emergency', 'bachao', 'raksha'], severity: 'critical' },
  { trigger: '"MUJHE DARR LAG RAHA HAI"', action: 'Activates Guardian + Fake Call', icon: '🛡', keywords: ['darr', 'lag', 'raha', 'scared', 'afraid'], severity: 'warning' },
  { trigger: '"RAKSHA, SAFE WALK" / "WALK"', action: 'Starts safe walk with AI monitoring', icon: '🚶', keywords: ['walk', 'safewalk', 'chalo'], severity: 'normal' },
  { trigger: '"POLICE BULAO" / "POLICE"', action: 'Direct line to nearest police station', icon: '👮', keywords: ['police', 'cop', 'kanoon'], severity: 'critical' },
  { trigger: '"RAKSHA, KOI HAI?"', action: 'Scans for nearby people & safe zones', icon: '📡', keywords: ['koi', 'hai', 'anyone'], severity: 'normal' },
  { trigger: '"EMERGENCY CALL" / "CALL"', action: 'Calls configured emergency contact', icon: '📞', keywords: ['call', 'phone', 'contact'], severity: 'warning' },
]

const waveformBars = 40

export default function VoiceCommandSection() {
  const [isListening, setIsListening] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [activeCommand, setActiveCommand] = useState(null)
  const canvasRef = useRef(null)
  const recognitionRef = useRef(null)
  const activateSOS = useEmergencyStore(s => s.activateSOS)

  // Audio waveform visualization
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    let t = 0

    const animate = () => {
      t += 0.03
      ctx.clearRect(0, 0, w, h)
      
      const barWidth = w / waveformBars
      
      for (let i = 0; i < waveformBars; i++) {
        const x = i * barWidth + barWidth / 4
        const noise = Math.sin(t * 3 + i * 0.5) * Math.cos(t * 2 + i * 0.3)
        const amplitude = isListening 
          ? (30 + Math.abs(noise) * 60) * (Math.sin(i / waveformBars * Math.PI) * 0.7 + 0.3)
          : 3 + Math.abs(Math.sin(t * 0.5 + i * 0.2)) * 8
        
        const barH = amplitude * 2
        const y = (h - barH) / 2
        
        const gradient = ctx.createLinearGradient(x, y, x, y + barH)
        if (isListening) {
          gradient.addColorStop(0, 'rgba(0, 217, 255, 0.1)')
          gradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.8)')
          gradient.addColorStop(1, 'rgba(0, 217, 255, 0.1)')
        } else {
          gradient.addColorStop(0, 'rgba(0, 217, 255, 0.05)')
          gradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.2)')
          gradient.addColorStop(1, 'rgba(0, 217, 255, 0.05)')
        }
        
        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth / 2, barH)
      }
      
      requestAnimationFrame(animate)
    }
    animate()
  }, [isListening])

  useEffect(() => { drawWaveform() }, [drawWaveform])

  // Setup actual browser Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = true
      rec.lang = 'en-US'

      rec.onstart = () => {
        setIsListening(true)
        setRecognizedText('')
        setActiveCommand(null)
      }

      rec.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        
        setRecognizedText(transcript)
      }

      rec.onend = () => {
        setIsListening(false)
        processRecognizedText()
      }

      rec.onerror = () => {
        setIsListening(false)
        simulateFallback()
      }

      recognitionRef.current = rec
    }
  }, [])

  // Process the spoken text and match keywords
  const processRecognizedText = () => {
    setRecognizedText(prev => {
      const text = prev.toLowerCase().trim()
      if (!text) return prev

      let matchedCmd = null
      for (const cmd of voiceCommands) {
        if (cmd.keywords.some(k => text.includes(k))) {
          matchedCmd = cmd
          break
        }
      }

      if (matchedCmd) {
        setActiveCommand(matchedCmd)
        // If matched SOS trigger, trigger the core store SOS
        if (matchedCmd.severity === 'critical') {
          setTimeout(() => {
            activateSOS()
          }, 800)
        }
      } else {
        // Did not match specific keyword, but recognize something
        setActiveCommand({
          trigger: `"${prev}"`,
          action: 'Telemetry analyzed. No emergency keywords detected.',
          icon: 'ℹ️'
        })
      }
      return prev
    })
  }

  // Fallback simulator if Web Speech API isn't supported or fails
  const simulateFallback = () => {
    setIsListening(true)
    setRecognizedText('')
    setActiveCommand(null)

    const phrases = ['"', '"R', '"RA', '"RAK', '"RAKS', '"RAKSH', '"RAKSHA', '"RAKSHA,', '"RAKSHA, ', '"RAKSHA, H', '"RAKSHA, HE', '"RAKSHA, HEL', '"RAKSHA, HELP', '"RAKSHA, HELP ', '"RAKSHA, HELP M', '"RAKSHA, HELP ME', '"RAKSHA, HELP ME"']
    
    phrases.forEach((text, i) => {
      setTimeout(() => {
        setRecognizedText(text)
      }, 200 + i * 100)
    })

    setTimeout(() => {
      setIsListening(false)
      setActiveCommand(voiceCommands[0])
      activateSOS()
    }, 200 + phrases.length * 100 + 500)
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch {
          simulateFallback()
        }
      } else {
        simulateFallback()
      }
    }
  }

  return (
    <section className="section-container min-h-screen relative" id="voice-command-section">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-hud text-[10px] tracking-[0.4em] text-cyan/60 mb-4">◆ VOICE RECOGNITION ENGINE</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow mb-4">VOICE COMMAND</h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Hands-free emergency activation. Speak to RAKSHA using real voice processing — triggers silent SOS on threat keywords.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Visualizer */}
          <div>
            <HUDPanel title="AUDIO PROCESSOR">
              <div className="text-center py-6">
                {/* Microphone button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`relative w-28 h-28 rounded-full mx-auto mb-6 cursor-pointer transition-all duration-500 ${
                    isListening 
                      ? 'bg-cyan/20 border-2 border-cyan shadow-[0_0_40px_rgba(0,217,255,0.3)]' 
                      : 'bg-white/5 border-2 border-white/10 hover:border-cyan/30'
                  }`}
                >
                  {isListening && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-cyan/10 animate-ping" />
                      <div className="absolute -inset-3 rounded-full border border-cyan/20 animate-pulse" />
                      <div className="absolute -inset-6 rounded-full border border-cyan/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isListening ? '#00D9FF' : 'rgba(255,255,255,0.4)'} strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                </motion.button>

                {/* Waveform */}
                <div className="relative h-20 mb-4">
                  <canvas ref={canvasRef} className="w-full h-full" />
                </div>

                {/* Recognized text */}
                <div className="h-12 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isListening ? (
                      <motion.p
                        key="listening"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-display text-xl text-cyan"
                      >
                        {recognizedText || (
                          <span className="font-hud text-[10px] text-white/30 tracking-widest animate-pulse">LISTENING... SPEAK NOW</span>
                        )}
                      </motion.p>
                    ) : activeCommand ? (
                      <motion.div
                        key="command"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <p className="font-hud text-xs text-green-400 tracking-wider">✓ STATUS ANALYZED</p>
                        <p className="text-[11px] text-white/70 mt-1">{activeCommand.trigger}</p>
                        <p className="text-[10px] text-white/40 mt-0.5">{activeCommand.action}</p>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-hud text-[10px] text-white/25 tracking-widest"
                      >
                        TAP MICROPHONE TO VOICE TRIGGER
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </HUDPanel>
          </div>

          {/* Voice commands list */}
          <div>
            <HUDPanel title="REGISTERED VOICE TRIGGERS">
              <div className="space-y-3">
                {voiceCommands.map((cmd, i) => {
                  const isMatch = activeCommand?.trigger.toLowerCase().includes(cmd.keywords[0])
                  return (
                    <motion.div
                      key={cmd.trigger}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-4 p-3 rounded-sm border transition-all duration-300 cursor-default ${
                        isMatch
                          ? 'border-cyan/40 bg-cyan/5' 
                          : 'border-white/5 hover:border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <span className="text-xl">{cmd.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm text-white/80">{cmd.trigger}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">{cmd.action}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        cmd.severity === 'critical' ? 'bg-emergency animate-pulse-glow' :
                        cmd.severity === 'warning' ? 'bg-saffron' :
                        'bg-cyan/50'
                      }`} />
                    </motion.div>
                  )
                })}
              </div>
            </HUDPanel>
          </div>
        </div>
      </div>
    </section>
  )
}
