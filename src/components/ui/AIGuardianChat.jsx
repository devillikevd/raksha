import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HUDPanel from './HUDPanel'
import TypewriterText from './TypewriterText'

const predefinedPrompts = [
  { id: 'scan', label: '🔍 SCAN COORDINATES', response: 'Initiating full-sector environment scan... Analyzing terrain data... Found 3 nearby secure zones. Crime history in current sector is 12% below average. Security rating: EXCELLENT.' },
  { id: 'routes', label: '🚶 CHECK SAFE ROUTES', response: 'Calculating safest path to destination... Bandra Linking Road is heavily illuminated and active. Alternate shortcut via 5th Lane is flagged as POORLY LIT. Recommend primary route.' },
  { id: 'decoy', label: '📞 DECOY SCRIPTS', response: 'Generating custom Decoy Phone Script... "Hey, I just stepped out of the station. Yes, I can see you now, I am walking towards your car. See you in 1 minute." Ready for Fake Call activation.' },
  { id: 'backup', label: '🚨 REQUEST BACKUP', response: 'Standby. Broadcasting telemetry to community guardians... 5 active guardians within 500m notified. They have acknowledged silent beacon. All systems on alert.' },
]

export default function AIGuardianChat() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'RAKSHA AI Guardian initialized. I am monitoring your telemetry and environmental risk factors. How can I assist your walk?' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const triggerPrompt = (prompt) => {
    if (isTyping) return
    
    // Add user message
    const userMsg = { id: Date.now(), type: 'user', text: prompt.label }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = { id: Date.now() + 1, type: 'ai', text: prompt.response }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <HUDPanel title="🛡 AI GUARDIAN CONSOLE">
      <div className="flex flex-col h-[380px]">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-3" style={{ scrollbarWidth: 'thin' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] rounded-sm p-3 border text-xs leading-relaxed ${
                msg.type === 'user'
                  ? 'border-cyan/30 bg-cyan/5 text-cyan'
                  : 'border-white/5 bg-white/[0.02] text-white/70'
              }`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-hud text-[8px] tracking-wider text-white/30">
                    {msg.type === 'user' ? 'USER' : 'RAKSHA AI'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-cyan/50" />
                  <span className="font-hud text-[8px] text-white/20">
                    {new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {msg.type === 'ai' && messages.indexOf(msg) === messages.length - 1 ? (
                  <TypewriterText text={msg.text} delay={15} />
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start">
              <div className="rounded-sm p-3 border border-cyan/10 bg-cyan/5 text-cyan text-xs">
                <span className="font-hud text-[8px] tracking-widest animate-pulse">AI IS CALIBRATING RESPONSE...</span>
                <div className="flex gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Action prompts */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {predefinedPrompts.map(p => (
            <button
              key={p.id}
              onClick={() => triggerPrompt(p)}
              disabled={isTyping}
              className="font-hud text-[8px] tracking-wider py-2 px-2.5 rounded-sm border border-white/5 bg-white/[0.02] text-white/40 hover:border-cyan/30 hover:text-cyan transition-all cursor-pointer text-left truncate disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </HUDPanel>
  )
}
