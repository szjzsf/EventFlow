const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/addEvent', (req, res) => {
  const newEvent = req.body;

  // Load existing events
  fs.readFile('database.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading database file' });
    }

    const events = JSON.parse(data);
    newEvent.id = events.length ? events[events.length - 1].id + 1 : 1; // Generate a new ID
    events.push(newEvent);

    // Save updated events
    fs.writeFile('database.json', JSON.stringify(events, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ message: 'Error saving event' });
      }
      res.status(200).json({ message: 'Event added successfully' });
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
