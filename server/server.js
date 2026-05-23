require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Memory database for active emergencies & tracking
const activeEmergencies = new Map();

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'nominal', system: 'RAKSHA CORE SERVER v3.2', uptime: process.uptime() });
});

// Broadcast/Trigger emergency alert
app.post('/api/sos/trigger', (req, res) => {
  const { userId, name, latitude, longitude, contacts, captureMode } = req.body;
  
  if (!userId || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing telemetry variables.' });
  }

  const emergencyData = {
    userId,
    name: name || 'Anonymous User',
    latitude,
    longitude,
    captureMode: captureMode || 'photo',
    timestamp: new Date().toISOString(),
    status: 'ACTIVE_BROADCAST',
    evidence: []
  };

  activeEmergencies.set(userId, emergencyData);

  // Broadcast to Socket.io mesh network
  io.emit('raksha-emergency-broadcast', emergencyData);

  // Twilio integration trigger logic placeholder
  console.log(`[RAKSHA SMS BROADCAST] Alerting contacts: ${JSON.stringify(contacts)} for User: ${name}`);
  
  res.status(200).json({
    success: true,
    message: 'SOS Broadcast initiated successfully.',
    data: emergencyData
  });
});

// Upload evidence files (photos/videos)
app.post('/api/evidence/upload', (req, res) => {
  const { userId, base64Data, type } = req.body;

  if (!userId || !base64Data) {
    return res.status(400).json({ error: 'Telemetry evidence is required.' });
  }

  const emergency = activeEmergencies.get(userId);
  if (!emergency) {
    return res.status(404).json({ error: 'No active emergency found for this user context.' });
  }

  const evidenceItem = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type: type || 'photo',
    timestamp: new Date().toISOString(),
    url: 'https://raksha-vault-placeholder.s3.amazonaws.com/evidence/data-signed.jpg', // Signed URL placeholder
    hash: 'sha256-' + Math.random().toString(36).substr(2, 15) // Blockchain-ready proof
  };

  emergency.evidence.push(evidenceItem);
  activeEmergencies.set(userId, emergency);

  // Broadcast new evidence update to guardians
  io.emit('raksha-evidence-updated', { userId, evidence: emergency.evidence });

  res.status(200).json({
    success: true,
    message: 'Evidence blockchain-logged successfully.',
    evidence: evidenceItem
  });
});

// Resolve alert
app.post('/api/sos/resolve', (req, res) => {
  const { userId } = req.body;
  if (activeEmergencies.has(userId)) {
    const data = activeEmergencies.get(userId);
    data.status = 'RESOLVED';
    activeEmergencies.delete(userId);
    
    io.emit('raksha-emergency-resolved', { userId, timestamp: new Date().toISOString() });
    return res.json({ success: true, message: 'Emergency marked as resolved.' });
  }
  res.status(404).json({ error: 'No active emergency found.' });
});

// Fetch active incidents
app.get('/api/incidents', (req, res) => {
  res.json(Array.from(activeEmergencies.values()));
});

// Socket.io Real-time Navigation Mesh coordination
io.on('connection', (socket) => {
  console.log(`[RAKSHA SECURE SOCKET] Client linked: ${socket.id}`);

  // User broadcasts real-time GPS stream
  socket.on('raksha-gps-stream', (telemetry) => {
    const { userId, latitude, longitude } = telemetry;
    if (activeEmergencies.has(userId)) {
      const current = activeEmergencies.get(userId);
      current.latitude = latitude;
      current.longitude = longitude;
      activeEmergencies.set(userId, current);

      // Broadcast position delta to guardians
      io.emit('raksha-gps-delta', { userId, latitude, longitude });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[RAKSHA SECURE SOCKET] Link severed: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`RAKSHA CORE EMBEDDED SYSTEM - COMMAND TERMINAL`);
  console.log(`STATUS: NOMINAL (ONLINE)`);
  console.log(`PORT: ${PORT}`);
  console.log(`===============================================`);
});
