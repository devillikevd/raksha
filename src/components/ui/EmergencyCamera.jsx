import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEmergencyStore } from '../../stores/emergencyStore'

export default function EmergencyCamera() {
  const {
    isEmergency, alertPhase, isCapturing, capturedPhotos, captureCount,
    isRecordingVideo, cameraPermission, setCameraPermission, addCapturedPhoto,
    captureMode, locationData,
  } = useEmergencyStore()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const [flashActive, setFlashActive] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  // Request camera access
  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraPermission('granted')
      return stream
    } catch (err) {
      console.warn('Camera access denied:', err)
      setCameraPermission('denied')
      return null
    }
  }, [setCameraPermission])

  // Initialize camera when emergency starts
  useEffect(() => {
    if (isEmergency && alertPhase === 'countdown') {
      requestCamera()
    }
    return () => {
      if (streamRef.current && !isEmergency) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [isEmergency, alertPhase, requestCamera])

  // Photo capture handler
  useEffect(() => {
    const handleCapture = () => {
      if (!videoRef.current || !canvasRef.current) return
      
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      // Add timestamp overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60)
      ctx.fillStyle = '#00D9FF'
      ctx.font = '14px Orbitron, monospace'
      ctx.fillText(`RAKSHA EMERGENCY — ${new Date().toLocaleString('en-IN')}`, 10, canvas.height - 35)
      if (locationData) {
        ctx.fillStyle = '#FF6B00'
        ctx.fillText(`GPS: ${locationData.lat.toFixed(6)}°N, ${locationData.lng.toFixed(6)}°E | Accuracy: ±${Math.round(locationData.accuracy)}m`, 10, canvas.height - 12)
      }
      
      const photoData = canvas.toDataURL('image/jpeg', 0.9)
      addCapturedPhoto({
        data: photoData,
        timestamp: new Date().toISOString(),
        location: locationData,
      })
      
      // Flash effect
      setFlashActive(true)
      setTimeout(() => setFlashActive(false), 200)
    }

    window.addEventListener('raksha-capture-photo', handleCapture)
    return () => window.removeEventListener('raksha-capture-photo', handleCapture)
  }, [addCapturedPhoto, locationData])

  // Video recording handler
  useEffect(() => {
    const handleStartVideo = () => {
      if (!streamRef.current) return
      
      chunksRef.current = []
      try {
        const recorder = new MediaRecorder(streamRef.current, {
          mimeType: 'video/webm;codecs=vp8,opus'
        })
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }
        
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          const url = URL.createObjectURL(blob)
          addCapturedPhoto({
            data: url,
            type: 'video',
            timestamp: new Date().toISOString(),
            location: locationData,
          })
        }
        
        mediaRecorderRef.current = recorder
        recorder.start(1000) // Collect data every second
      } catch (err) {
        console.warn('MediaRecorder not supported:', err)
      }
    }

    const handleStopVideo = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }

    window.addEventListener('raksha-start-video', handleStartVideo)
    window.addEventListener('raksha-stop-video', handleStopVideo)
    return () => {
      window.removeEventListener('raksha-start-video', handleStartVideo)
      window.removeEventListener('raksha-stop-video', handleStopVideo)
    }
  }, [addCapturedPhoto, locationData])

  // Recording timer
  useEffect(() => {
    if (!isRecordingVideo) {
      setRecordingTime(0)
      return
    }
    const interval = setInterval(() => setRecordingTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [isRecordingVideo])

  // Don't render if no emergency
  if (!isEmergency || cameraPermission === 'denied') return null

  return (
    <>
      {/* Hidden video element for camera access */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1 }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Camera capture overlay */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180] pointer-events-none"
          >
            {/* Camera viewfinder overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="glass rounded-lg px-4 py-2 flex items-center gap-3">
                {isRecordingVideo ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-emergency animate-pulse" />
                    <span className="font-hud text-[10px] tracking-wider text-emergency">
                      REC {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                    <span className="font-hud text-[10px] tracking-wider text-cyan">
                      AUTO-CAPTURE {captureCount}/5
                    </span>
                  </>
                )}
              </div>
              <div className="glass rounded-lg px-3 py-2">
                <span className="font-hud text-[9px] text-saffron">
                  📍 {locationData ? `${locationData.lat.toFixed(4)}°N` : 'GPS ACTIVE'}
                </span>
              </div>
            </div>

            {/* Viewfinder corners */}
            <div className="absolute top-20 left-8 w-12 h-12 border-l-2 border-t-2 border-cyan/60" />
            <div className="absolute top-20 right-8 w-12 h-12 border-r-2 border-t-2 border-cyan/60" />
            <div className="absolute bottom-32 left-8 w-12 h-12 border-l-2 border-b-2 border-cyan/60" />
            <div className="absolute bottom-32 right-8 w-12 h-12 border-r-2 border-b-2 border-cyan/60" />

            {/* Info bar at bottom */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📸</span>
                  <div className="flex-1">
                    <p className="font-hud text-[10px] text-white/60 tracking-wider">
                      {isRecordingVideo 
                        ? 'Video recording in progress — evidence auto-saved'
                        : `Capturing evidence photos — ${captureCount}/5 sent to emergency contacts`
                      }
                    </p>
                  </div>
                </div>

                {/* Captured photo thumbnails */}
                {capturedPhotos.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {capturedPhotos.map((photo, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-12 h-12 rounded-sm overflow-hidden border border-cyan/30 shrink-0"
                      >
                        {photo.type === 'video' ? (
                          <div className="w-full h-full bg-emergency/20 flex items-center justify-center">
                            <span className="text-xs">🎬</span>
                          </div>
                        ) : (
                          <img src={photo.data} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera flash effect */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[190] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  )
}
