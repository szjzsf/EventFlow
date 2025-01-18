const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit
app.use(express.static(path.join(__dirname, 'public')));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'IMG', 'Kartyak'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid name conflicts
  }
});

const upload = multer({ storage: storage });

// Utility function to read JSON files
const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading file from disk: ${error}`);
    return [];
  }
};

// Utility function to write to JSON files
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing file to disk: ${error}`);
  }
};

// API Endpoints

// Fetch all events
app.get('/api/events', (req, res) => {
  const events = readJsonFile('./database.json');
  res.json(events);
});

// Add a new event with image upload
app.post('/api/events', upload.single('image'), (req, res) => {
  const newEvent = req.body;
  const events = readJsonFile('./database.json');
  newEvent.id = events.length + 1; // Simple ID assignment
  if (req.file) {
    newEvent.imgSrc = `IMG/Kartyak/${req.file.filename}`;
  }
  events.push(newEvent);
  writeJsonFile('./database.json', events);
  res.status(201).json(newEvent);
});

// Authenticate user
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  const users = readJsonFile('./users.json');
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Serve event_flow.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'event_flow.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});