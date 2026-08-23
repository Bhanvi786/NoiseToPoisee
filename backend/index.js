const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running smoothly' });
});

// Hello endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the Noise to Poise backend API!' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
