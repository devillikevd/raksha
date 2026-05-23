# RAKSHA रक्षा — Women Safety Command System

<div align="center">

### 🛡 An AI-Powered Futuristic Emergency Operating System for Women's Safety

**Built with React + Three.js + GSAP + Framer Motion + Zustand**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Click_Here-00D9FF?style=for-the-badge)](https://raksha.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.184-000000?style=flat-square&logo=threedotjs)](https://threejs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

</div>

---

## 🚀 Features

### 🆘 Emergency SOS with Auto-Capture
- **One-touch SOS** with 3-second countdown
- **📸 Auto-captures 5 photos** with GPS & timestamp overlay on trigger
- **📹 Records 15-second video** evidence (user selectable mode)
- Sends evidence to all emergency contacts automatically
- Blockchain-verified tamper-proof evidence chain

### 🧠 AI Guardian Engine
- Real-time threat prediction with ML neural networks
- Behavioral anomaly detection
- Unsafe route prediction
- Continuous background protection in stealth mode

### 🗣 Voice Command System
- Hindi & English voice activation
- "RAKSHA, HELP ME" — triggers silent SOS
- "MUJHE DARR LAG RAHA HAI" — activates Guardian + Fake Call
- Waveform visualization with live audio processing

### 📞 Fake Call System
- 6 realistic caller profiles (Mom, Boss, Police, Husband, Friend, Office)
- **Delayed trigger** (0s, 5s, 10s, 30s, 60s) — act natural before call rings
- Realistic phone UI with notch, call timer, mute, speaker, keypad
- Audio waveform during connected calls

### 🚶 Safe Walk Mode
- AI-guided walking protection with checkpoints
- Real-time threat radar
- ETA countdown timer
- Nearby safe zone detection

### 🗺 Live Location Grid
- Canvas-animated Maharashtra surveillance map
- Real-time radar sweep
- Safe zone & danger zone markers
- GPS data panel

### 🔥 Threat Heatmap
- ML-powered crime probability heatmap
- 8-hour predictive threat analysis
- Color-coded risk zones
- Animated confidence bars

### 🔐 Evidence Locker
- Live audio recording with waveform visualization
- Auto-captured photo/video storage
- Blockchain verification for each evidence
- Cloud storage with AES-256 encryption

### 👥 Community Shield
- Decentralized guardian mesh network
- Nearby guardian discovery
- Community safety alerts with upvotes
- Gamified leaderboard system

### 📊 Live Dashboard
- Real-time analytics with animated counters
- Radial system performance chart
- Hourly alert bar chart
- Live activity feed with auto-capture events

### ⚙️ Command Center
- Interactive CLI terminal with full command processing
- Toggle & slider settings for all features
- Emergency, AI Guardian, and Privacy categories
- Auto SOS on fall detection, shake-to-SOS

### 🏗 Tech Stack Showcase
- Holographic 3D tilt cards
- Layered architecture visualization
- Technology grid display

### 💬 Testimonials
- Auto-playing story carousel
- Impact statistics with animated counters

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary | `#00D9FF` (Cyan) |
| Accent | `#FF6B00` (Saffron) |
| Emergency | `#FF2E2E` (Red) |
| Background | `#060F1A` (Navy Dark) |
| Fonts | Orbitron, Inter, Rajdhani |
| Glass | Backdrop blur 20px + saturate |

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, React Three Fiber, Framer Motion, GSAP |
| **3D Engine** | Three.js, Post-processing (Bloom, Chromatic Aberration) |
| **State** | Zustand |
| **Styling** | Tailwind CSS 4, Custom CSS Design System |
| **Camera** | getUserMedia API, MediaRecorder API |
| **Scrolling** | Lenis Smooth Scroll |

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/devillikevd/raksha.git
cd raksha

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── sections/          # Page sections (14 sections)
│   │   ├── LandingSection.jsx
│   │   ├── HeroSection.jsx
│   │   ├── SOSSection.jsx          # ← Auto-capture feature
│   │   ├── AIGuardianSection.jsx
│   │   ├── VoiceCommandSection.jsx
│   │   ├── ThreatHeatmapSection.jsx
│   │   ├── MapSection.jsx
│   │   ├── SafeWalkSection.jsx
│   │   ├── FakeCallSection.jsx
│   │   ├── EvidenceLockerSection.jsx
│   │   ├── CommunityShieldSection.jsx
│   │   ├── DashboardSection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   ├── TechStackSection.jsx
│   │   └── SettingsTerminalSection.jsx
│   ├── three/             # 3D components
│   │   ├── MainScene.jsx
│   │   ├── Globe.jsx
│   │   ├── ParticleField.jsx
│   │   ├── GridPlane.jsx
│   │   └── SOSSphere.jsx
│   └── ui/                # Reusable UI components
│       ├── EmergencyCamera.jsx     # ← Camera auto-capture
│       ├── FloatingSOSButton.jsx
│       ├── CommandTerminal.jsx
│       ├── HolographicCard.jsx
│       ├── AnimatedCounter.jsx
│       ├── NotificationToast.jsx
│       ├── TypewriterText.jsx
│       ├── MagneticButton.jsx
│       ├── HUDPanel.jsx
│       └── GlowCard.jsx
├── stores/
│   └── emergencyStore.js   # Zustand state management
├── hooks/
│   └── useInteractions.js  # Magnetic & parallax hooks
├── App.jsx                 # Main app with all sections
├── index.css               # Design system
└── main.jsx                # Entry point
```

---

## 🏆 Hackathon Highlights

- **14 full-featured sections** with cinematic transitions
- **3D WebGL background** with globe, particles, and post-processing
- **Real camera integration** — auto-captures photos/video on SOS
- **Interactive command terminal** with 10+ commands
- **Voice command simulation** with Hindi/English support
- **Community gamification** with leaderboard
- **Blockchain evidence verification** system
- **100+ micro-animations** and hover effects
- **Fully responsive** — mobile to desktop
- **Scroll progress indicator** + side navigation dots

---

## 📜 Emergency Numbers (India)

| Service | Number |
|---------|--------|
| Women Helpline | **181** |
| Police | **112** |
| Ambulance | **108** |
| Child Helpline | **1098** |
| NCW | **7827-170-170** |

---

<div align="center">

**Built with ❤️ for women's safety**

*RAKSHA — Because every woman deserves to feel safe.*

</div>
