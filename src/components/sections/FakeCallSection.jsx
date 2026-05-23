import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const callers = [
  { id: 'mom', name: 'आई', label: 'Mom', avatar: '👩', phone: '+91 98XXX XXXXX' },
  { id: 'boss', name: 'Manager', label: 'Boss', avatar: '👔', phone: '+91 97XXX XXXXX' },
  { id: 'police', name: 'Police Control', label: 'Police', avatar: '👮', phone: '112' },
  { id: 'husband', name: 'पति', label: 'Husband', avatar: '👨', phone: '+91 96XXX XXXXX' },
  { id: 'friend', name: 'Best Friend', label: 'Friend', avatar: '👩‍🦱', phone: '+91 95XXX XXXXX' },
  { id: 'office', name: 'Office Reception', label: 'Office', avatar: '🏢', phone: '+91 22 XXXX XXXX' },
]

export default function FakeCallSection() {
  const [activeCaller, setActiveCaller] = useState(null)
  const [callState, setCallState] = useState('idle')
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)
  const [delaySeconds, setDelaySeconds] = useState(0)
  const [delayActive, setDelayActive] = useState(false)

  // Call timer
  useEffect(() => {
    if (callState !== 'connected') {
      setCallDuration(0)
      return
    }
    const interval = setInterval(() => setCallDuration(d => d + 1), 1000)
    return () => clearInterval(interval)
  }, [callState])

  const startCall = (caller) => {
    if (delaySeconds > 0) {
      setDelayActive(true)
      setActiveCaller(caller)
      setTimeout(() => {
        setDelayActive(false)
        setCallState('ringing')
        setTimeout(() => setCallState('connected'), 3000)
      }, delaySeconds * 1000)
    } else {
      setActiveCaller(caller)
      setCallState('ringing')
      setTimeout(() => setCallState('connected'), 3000)
    }
  }

  const endCall = () => {
    setCallState('ended')
    setTimeout(() => { setCallState('idle'); setActiveCaller(null); setDelayActive(false) }, 1000)
  }

  const formatDuration = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <section className="section-container min-h-screen relative" id="fake-call-section">
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-hud text-[10px] tracking-[0.4em] text-cyan/60 mb-4">◆ DECOY PROTOCOL</p>
          <h2 className="font-hud text-3xl md:text-5xl font-bold text-glow mb-4">FAKE CALL</h2>
          <p className="text-white/40 text-sm">Hyper-realistic emergency call simulation. Escape any situation instantly with delayed trigger.</p>
        </motion.div>

        {/* Delay timer */}
        {callState === 'idle' && !delayActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-4 mb-8">
            <span className="font-hud text-[9px] text-white/30">CALL DELAY:</span>
            <div className="flex gap-1">
              {[0, 5, 10, 30, 60].map(sec => (
                <button
                  key={sec}
                  onClick={() => setDelaySeconds(sec)}
                  className={`font-hud text-[9px] px-3 py-1.5 rounded-sm cursor-pointer transition-all ${
                    delaySeconds === sec
                      ? 'bg-cyan/15 border border-cyan/30 text-cyan'
                      : 'bg-white/5 border border-white/5 text-white/30 hover:border-white/10'
                  }`}
                >
                  {sec === 0 ? 'INSTANT' : `${sec}s`}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Delay countdown */}
        <AnimatePresence>
          {delayActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-8"
            >
              <p className="font-hud text-xs text-cyan/60 tracking-wider">CALL WILL RING IN</p>
              <p className="font-hud text-4xl text-cyan mt-2">{delaySeconds}s</p>
              <p className="text-[10px] text-white/20 mt-2">Put your phone down naturally — the call will come</p>
              <button onClick={endCall} className="mt-4 font-hud text-[9px] text-emergency/50 cursor-pointer hover:text-emergency/80">
                CANCEL
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Caller selection */}
        {callState === 'idle' && !delayActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {callers.map(c => (
              <motion.button
                key={c.id}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startCall(c)}
                className="glass rounded-lg p-5 text-center cursor-pointer hover:border-cyan/30 transition-all group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{c.avatar}</span>
                <p className="font-display text-sm text-white/80">{c.name}</p>
                <p className="font-hud text-[8px] text-white/25 tracking-wider mt-0.5">{c.label}</p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Call simulation - Phone UI */}
        <AnimatePresence>
          {activeCaller && callState !== 'idle' && !delayActive && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="mx-auto max-w-[340px]"
            >
              <div className="rounded-[2rem] overflow-hidden border border-white/10" style={{ background: 'linear-gradient(180deg, rgba(13,27,42,0.95) 0%, rgba(6,15,26,0.98) 100%)' }}>
                {/* Notch */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-20 h-5 rounded-full bg-black/80 border border-white/5" />
                </div>

                {/* Status bar */}
                <div className="flex justify-between items-center px-8 py-1 text-[10px] text-white/40">
                  <span className="font-hud">9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span>●●●●</span>
                    <span className="font-hud text-[9px]">4G</span>
                    <span>🔋</span>
                  </div>
                </div>

                <div className="px-8 py-6 text-center min-h-[420px] flex flex-col items-center justify-between">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Avatar */}
                    <div className="relative w-28 h-28 mx-auto mb-6">
                      {callState === 'ringing' && (
                        <>
                          <div className="absolute -inset-2 rounded-full bg-cyan/5 animate-ping" />
                          <div className="absolute -inset-4 rounded-full bg-cyan/3 animate-pulse" />
                        </>
                      )}
                      <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-cyan/20 to-saffron/20 border-2 border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(0,217,255,0.1)]">
                        <span className="text-6xl">{activeCaller.avatar}</span>
                      </div>
                    </div>

                    <p className="font-display text-2xl text-white mb-1">{activeCaller.name}</p>
                    <p className="font-hud text-[10px] text-white/30 tracking-widest mb-1">{activeCaller.phone}</p>
                    <p className={`font-hud text-[10px] tracking-widest ${
                      callState === 'ringing' ? 'text-cyan/60 animate-pulse' :
                      callState === 'connected' ? 'text-green-400/60' :
                      'text-emergency/60'
                    }`}>
                      {callState === 'ringing' ? 'INCOMING CALL...' : callState === 'connected' ? `● ${formatDuration(callDuration)}` : 'CALL ENDED'}
                    </p>

                    {/* Audio waveform */}
                    {callState === 'connected' && (
                      <div className="flex items-center justify-center gap-[3px] mt-6 h-10">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [3, Math.random() * 32 + 3, 3] }}
                            transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, repeatType: 'reverse', delay: i * 0.03 }}
                            className="w-[3px] bg-gradient-to-t from-cyan/20 to-cyan/60 rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Call controls */}
                  <div className="w-full mt-6">
                    {callState === 'connected' && (
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl cursor-pointer transition-all ${
                            isMuted ? 'bg-white/10' : 'bg-white/5'
                          }`}
                        >
                          <span className="text-lg">{isMuted ? '🔇' : '🔈'}</span>
                          <span className="font-hud text-[7px] text-white/30">MUTE</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 cursor-pointer">
                          <span className="text-lg">⌨️</span>
                          <span className="font-hud text-[7px] text-white/30">KEYPAD</span>
                        </button>
                        <button
                          onClick={() => setIsSpeaker(!isSpeaker)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl cursor-pointer transition-all ${
                            isSpeaker ? 'bg-white/10' : 'bg-white/5'
                          }`}
                        >
                          <span className="text-lg">{isSpeaker ? '🔊' : '🔉'}</span>
                          <span className="font-hud text-[7px] text-white/30">SPEAKER</span>
                        </button>
                      </div>
                    )}

                    <div className="flex justify-center gap-6">
                      {callState === 'ringing' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={endCall}
                            className="w-16 h-16 rounded-full bg-emergency/30 border border-emergency/50 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,46,46,0.2)]"
                          >
                            <span className="text-2xl">📵</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCallState('connected')}
                            className="w-16 h-16 rounded-full bg-green-500/30 border border-green-500/50 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                          >
                            <span className="text-2xl">📞</span>
                          </motion.button>
                        </>
                      )}
                      {callState === 'connected' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={endCall}
                          className="w-16 h-16 rounded-full bg-emergency/30 border border-emergency/50 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,46,46,0.2)]"
                        >
                          <span className="text-2xl">📵</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-3 pt-1">
                  <div className="w-32 h-1 rounded-full bg-white/15" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
