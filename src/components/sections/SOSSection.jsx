import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEmergencyStore } from '../../stores/emergencyStore'
import HUDPanel from '../ui/HUDPanel'
import MagneticButton from '../ui/MagneticButton'

export default function SOSSection() {
  const { isEmergency, sosCountdown, alertPhase, activateSOS, capturedPhotos, captureCount, isRecordingVideo, captureMode, locationData } = useEmergencyStore()
  const setCaptureMode = useEmergencyStore(s => s.setCaptureMode)
  const cameraPermission = useEmergencyStore(s => s.cameraPermission)
  const setCameraPermission = useEmergencyStore(s => s.setCameraPermission)
  const canvasRef = useRef(null)
  const [cameraPreviewStream, setCameraPreviewStream] = useState(null)
  const previewRef = useRef(null)

  const drawEmergencyRings = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth * 2
    const h = canvas.height = canvas.offsetHeight * 2
    let t = 0

    const animate = () => {
      t += 0.02
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2, cy = h / 2

      // Emergency rings
      for (let i = 0; i < 8; i++) {
        const radius = ((t * 100 + i * 50) % 400)
        const alpha = (1 - radius / 400) * (isEmergency ? 0.5 : 0.15)
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = isEmergency ? `rgba(255, 46, 46, ${alpha})` : `rgba(0, 217, 255, ${alpha})`
        ctx.lineWidth = isEmergency ? 3 : 1
        ctx.stroke()
      }

      // Center pulse
      const pulseR = 40 + Math.sin(t * 4) * 10
      ctx.beginPath()
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2)
      ctx.fillStyle = isEmergency ? 'rgba(255, 46, 46, 0.15)' : 'rgba(0, 217, 255, 0.08)'
      ctx.fill()

      requestAnimationFrame(animate)
    }
    animate()
  }, [isEmergency])

  useEffect(() => { drawEmergencyRings() }, [drawEmergencyRings])

  // Camera preview for testing
  const testCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      setCameraPreviewStream(stream)
      setCameraPermission('granted')
      if (previewRef.current) {
        previewRef.current.srcObject = stream
      }
    } catch {
      setCameraPermission('denied')
    }
  }

  const stopPreview = () => {
    if (cameraPreviewStream) {
      cameraPreviewStream.getTracks().forEach(t => t.stop())
      setCameraPreviewStream(null)
    }
  }

  useEffect(() => {
    return () => stopPreview()
  }, [])

  return (
    <section className="section-container min-h-screen relative overflow-hidden" id="sos-section">
      {/* Emergency overlay */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <div className="emergency-vignette" />
            {/* Siren sweep */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-emergency/10 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-hud text-[10px] tracking-[0.4em] text-emergency/60 mb-4">◆ EMERGENCY PROTOCOL</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow-emergency mb-4">SOS COMMAND</h2>
          <p className="text-white/40 text-sm mb-8">One touch. Instant protection. Auto-capture evidence. Every second counts.</p>
        </motion.div>

        {/* Capture mode selector */}
        {alertPhase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="font-hud text-[9px] text-white/30 tracking-wider">AUTO-CAPTURE:</span>
            <div className="flex gap-1 glass rounded-full p-1">
              <button
                onClick={() => setCaptureMode('photo')}
                className={`font-hud text-[9px] tracking-wider px-4 py-2 rounded-full cursor-pointer transition-all ${
                  captureMode === 'photo' ? 'bg-cyan/20 text-cyan border border-cyan/30' : 'text-white/30 hover:text-white/50'
                }`}
              >
                📸 PHOTO
              </button>
              <button
                onClick={() => setCaptureMode('video')}
                className={`font-hud text-[9px] tracking-wider px-4 py-2 rounded-full cursor-pointer transition-all ${
                  captureMode === 'video' ? 'bg-emergency/20 text-emergency border border-emergency/30' : 'text-white/30 hover:text-white/50'
                }`}
              >
                📹 VIDEO
              </button>
            </div>

            {/* Camera permission indicator */}
            <div className="flex items-center gap-2">
              {cameraPermission === 'granted' ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="font-hud text-[8px] text-green-400/60">CAMERA READY</span>
                </div>
              ) : cameraPermission === 'denied' ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emergency" />
                  <span className="font-hud text-[8px] text-emergency/60">DENIED</span>
                </div>
              ) : (
                <button
                  onClick={testCamera}
                  className="font-hud text-[8px] text-cyan/50 underline cursor-pointer hover:text-cyan"
                >
                  TEST CAMERA
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Camera preview */}
        <AnimatePresence>
          {cameraPreviewStream && alertPhase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-sm mb-8"
            >
              <HUDPanel title="CAMERA PREVIEW">
                <div className="relative rounded-sm overflow-hidden">
                  <video ref={previewRef} autoPlay playsInline muted className="w-full aspect-video object-cover rounded-sm" />
                  {/* HUD overlay on preview */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan/60" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan/60" />
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan/60" />
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan/60" />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                      <span className="font-hud text-[8px] text-cyan/60 bg-black/40 px-2 py-0.5 rounded">LIVE FEED</span>
                    </div>
                  </div>
                </div>
                <button onClick={stopPreview} className="mt-3 font-hud text-[9px] text-white/30 cursor-pointer hover:text-white/50">
                  CLOSE PREVIEW
                </button>
              </HUDPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOS Button */}
        <AnimatePresence mode="wait">
          {alertPhase === 'idle' && (
            <motion.div key="idle" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <button
                onClick={activateSOS}
                id="sos-trigger-btn"
                className="relative w-44 h-44 md:w-56 md:h-56 rounded-full cursor-pointer group mx-auto block"
              >
                {/* Outer pulse rings */}
                <div className="absolute -inset-4 rounded-full border border-emergency/10 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -inset-8 rounded-full border border-emergency/5 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '0.5s' }} />
                
                <div className="absolute inset-0 rounded-full bg-emergency/10 border-2 border-emergency/30 group-hover:border-emergency/60 group-hover:bg-emergency/20 transition-all duration-500 group-hover:shadow-[0_0_80px_rgba(255,46,46,0.4)]" />
                <div className="absolute inset-4 rounded-full bg-emergency/5 border border-emergency/20 animate-pulse-glow" />
                <div className="absolute inset-8 rounded-full bg-emergency/5 border border-emergency/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-hud text-3xl md:text-4xl font-bold text-emergency">SOS</span>
                  <span className="font-hud text-[7px] text-emergency/40 tracking-wider mt-1">
                    {captureMode === 'photo' ? '📸 AUTO-PHOTO' : '📹 AUTO-VIDEO'}
                  </span>
                </div>
              </button>

              {/* Info text below button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 space-y-2"
              >
                <p className="font-hud text-[9px] text-white/20 tracking-wider">
                  {captureMode === 'photo' 
                    ? 'SOS → AUTO-CAPTURES 5 PHOTOS → SENDS TO EMERGENCY CONTACTS WITH GPS'
                    : 'SOS → RECORDS 15s VIDEO → SENDS TO EMERGENCY CONTACTS WITH GPS'
                  }
                </p>
                <div className="flex justify-center gap-6 mt-4">
                  {['📸 Auto Photo', '📍 GPS Track', '📱 SMS Alert', '🔗 Evidence Chain'].map((feature) => (
                    <span key={feature} className="font-hud text-[8px] text-cyan/40">{feature}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {alertPhase === 'countdown' && (
            <motion.div key="countdown" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="animate-glitch">
              <p className="font-hud text-[120px] md:text-[200px] font-black text-emergency text-glow-emergency">{sosCountdown}</p>
              <p className="font-hud text-xs tracking-[0.3em] text-emergency/60 mt-4">ACTIVATING EMERGENCY PROTOCOL...</p>
              <p className="font-hud text-[9px] tracking-wider text-white/20 mt-2">
                {captureMode === 'photo' ? '📸 Camera ready — auto-capture in progress' : '📹 Camera ready — video recording will start'}
              </p>
            </motion.div>
          )}

          {alertPhase === 'transmitting' && (
            <motion.div key="transmitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-20 h-20 mx-auto border-4 border-emergency/30 border-t-emergency rounded-full animate-spin" />
              <p className="font-hud text-lg text-emergency mt-6 animate-pulse-glow">TRANSMITTING ALERT...</p>
              <p className="text-[10px] text-white/30 mt-2">Broadcasting GPS • Alerting contacts • Initializing camera</p>
            </motion.div>
          )}

          {alertPhase === 'capturing' && (
            <motion.div key="capturing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {isRecordingVideo ? (
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-emergency/20 border-2 border-emergency/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-sm bg-emergency animate-pulse" />
                  </div>
                  <div>
                    <p className="font-hud text-2xl text-emergency animate-pulse">● RECORDING VIDEO</p>
                    <p className="font-hud text-xs text-white/30 mt-2">15-second emergency video being captured</p>
                    <p className="font-hud text-[9px] text-saffron/60 mt-1">Video + audio + GPS being saved to evidence locker</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.5, opacity: 0.3 }}
                        animate={{
                          scale: i <= captureCount ? 1 : 0.7,
                          opacity: i <= captureCount ? 1 : 0.2,
                        }}
                        className={`w-10 h-10 rounded-sm border flex items-center justify-center ${
                          i <= captureCount 
                            ? 'border-cyan/40 bg-cyan/10' 
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        {i <= captureCount ? (
                          <span className="text-cyan text-xs">✓</span>
                        ) : (
                          <span className="text-white/20 text-xs">📸</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <p className="font-hud text-xl text-cyan">CAPTURING EVIDENCE</p>
                    <p className="font-hud text-xs text-white/30 mt-2">Photo {captureCount}/5 • Auto-sending to emergency contacts</p>
                    <p className="font-hud text-[9px] text-saffron/60 mt-1">GPS + timestamp embedded in each photo</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {alertPhase === 'transmitted' && (
            <motion.div key="transmitted" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 border-2 border-green-500/60 flex items-center justify-center mb-6">
                <span className="text-4xl">✓</span>
              </div>
              <p className="font-hud text-2xl text-green-400 text-glow mb-2">ALERT TRANSMITTED</p>
              <p className="text-white/40 text-sm mb-2">Emergency contacts notified • Police alerted • GPS shared</p>
              {capturedPhotos.length > 0 && (
                <p className="font-hud text-[10px] text-cyan/60 mb-4">
                  📸 {capturedPhotos.filter(p => p.type !== 'video').length} photos + 📹 {capturedPhotos.filter(p => p.type === 'video').length} videos captured & sent
                </p>
              )}
              <div className="mt-6 space-y-2">
                {['आई (Mom) — Notified ✓ + Evidence Sent', 'Police Control — Alert Sent ✓ + GPS Shared', 'Women Helpline — Connected ✓'].map((c, i) => (
                  <motion.div key={c} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.3 }} className="glass px-4 py-2 rounded-sm font-hud text-[10px] text-cyan/70">{c}</motion.div>
                ))}
              </div>

              {/* Evidence thumbnails */}
              {capturedPhotos.length > 0 && (
                <div className="mt-6">
                  <p className="font-hud text-[9px] text-white/20 mb-3">CAPTURED EVIDENCE:</p>
                  <div className="flex justify-center gap-2">
                    {capturedPhotos.slice(0, 5).map((photo, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="w-14 h-14 rounded-sm border border-cyan/20 overflow-hidden"
                      >
                        {photo.type === 'video' ? (
                          <div className="w-full h-full bg-emergency/10 flex items-center justify-center">
                            <span className="text-lg">🎬</span>
                          </div>
                        ) : (
                          <img src={photo.data} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
