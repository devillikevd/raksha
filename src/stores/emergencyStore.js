import { create } from 'zustand'

export const useEmergencyStore = create((set, get) => ({
  isEmergency: false,
  sosCountdown: null,
  alertPhase: 'idle', // idle | countdown | transmitting | capturing | transmitted
  sosContacts: [
    { name: 'आई (Mom)', phone: '+91 98XXX XXXXX', status: 'ready' },
    { name: 'Police Control', phone: '112', status: 'ready' },
    { name: 'Women Helpline', phone: '181', status: 'ready' },
  ],

  // Camera capture state
  cameraPermission: null, // null | 'granted' | 'denied'
  isCapturing: false,
  capturedPhotos: [],
  isRecordingVideo: false,
  captureMode: 'photo', // 'photo' | 'video'
  captureCount: 0,
  videoStream: null,
  locationData: null,

  setCameraPermission: (perm) => set({ cameraPermission: perm }),
  setCaptureMode: (mode) => set({ captureMode: mode }),

  activateSOS: () => {
    set({ isEmergency: true, alertPhase: 'countdown', sosCountdown: 3 })
    const interval = setInterval(() => {
      const { sosCountdown } = get()
      if (sosCountdown <= 1) {
        clearInterval(interval)
        set({ sosCountdown: 0, alertPhase: 'transmitting' })

        // Get location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              set({
                locationData: {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                  timestamp: new Date().toISOString(),
                }
              })
            },
            () => {},
            { enableHighAccuracy: true }
          )
        }

        setTimeout(() => {
          set({ alertPhase: 'capturing', isCapturing: true })
          // Start auto-capture sequence
          get().startAutoCapture()
        }, 1500)
      } else {
        set({ sosCountdown: sosCountdown - 1 })
      }
    }, 1000)
  },

  startAutoCapture: async () => {
    const { captureMode, cameraPermission } = get()
    
    if (cameraPermission !== 'granted') {
      // Skip capture if no permission, go straight to transmitted
      setTimeout(() => {
        set({ 
          alertPhase: 'transmitted', 
          isCapturing: false,
        })
        setTimeout(() => {
          set({ isEmergency: false, alertPhase: 'idle', sosCountdown: null, capturedPhotos: [], captureCount: 0 })
        }, 6000)
      }, 1000)
      return
    }

    if (captureMode === 'photo') {
      // Auto-capture 5 photos at 2-second intervals
      let count = 0
      const captureInterval = setInterval(() => {
        count++
        set({ captureCount: count })
        
        // Trigger photo capture event
        window.dispatchEvent(new CustomEvent('raksha-capture-photo'))
        
        if (count >= 5) {
          clearInterval(captureInterval)
          setTimeout(() => {
            set({ 
              alertPhase: 'transmitted', 
              isCapturing: false,
            })
            setTimeout(() => {
              set({ isEmergency: false, alertPhase: 'idle', sosCountdown: null, capturedPhotos: [], captureCount: 0 })
            }, 6000)
          }, 1000)
        }
      }, 2000)
    } else {
      // Video mode - record for 15 seconds
      set({ isRecordingVideo: true })
      window.dispatchEvent(new CustomEvent('raksha-start-video'))
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('raksha-stop-video'))
        set({ 
          isRecordingVideo: false, 
          alertPhase: 'transmitted', 
          isCapturing: false,
        })
        setTimeout(() => {
          set({ isEmergency: false, alertPhase: 'idle', sosCountdown: null, capturedPhotos: [], captureCount: 0 })
        }, 6000)
      }, 15000)
    }
  },

  addCapturedPhoto: (photoData) => {
    set(state => ({ capturedPhotos: [...state.capturedPhotos, photoData] }))
  },

  resetSOS: () => {
    set({ 
      isEmergency: false, sosCountdown: null, alertPhase: 'idle',
      isCapturing: false, capturedPhotos: [], captureCount: 0,
      isRecordingVideo: false,
    })
  },
}))
