require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const Artwork = require('./models/Artwork');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Serve static uploads
app.use('/uploads', express.Router().use(express.static(uploadsDir)));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/noisetopoise')
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    await seedArtworksIfEmpty();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary is configured and ready.');
} else {
  console.log('Cloudinary credentials missing. Falling back to local filesystem storage.');
}

// Multer Storage Configuration (Local fallback)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Helper to seed initial artworks
async function seedArtworksIfEmpty() {
  try {
    const count = await Artwork.countDocuments();
    if (count === 0) {
      console.log('Database empty. Seeding initial artworks...');
      const initialArtworks = [
        {
          title: 'Silence in Crimson',
          year: '2025',
          medium: 'Oil on Linen',
          dimensions: '40 × 50 inches',
          image: '/artwork/1.jpeg',
          aspect: 'aspect-[3/4]',
          description: 'A study in quiet contemplation and emotional resonance. The heavy crimson red drapery forms a sanctuary around the subject, contrasting with the soft, warm golden light.'
        },
        {
          title: 'The Courtyard Thread',
          year: '2026',
          medium: 'Oil on Canvas',
          dimensions: '48 × 48 inches',
          image: '/artwork/2.jpeg',
          aspect: 'aspect-[4/3]',
          description: 'Capturing the peaceful rhythms of domestic heritage in rural India. The textures of stone and cotton are rendered with intricate palette knife strokes.'
        },
        {
          title: 'Solitude of Autumn',
          year: '2025',
          medium: 'Oil on Panel',
          dimensions: '36 × 36 inches',
          image: '/artwork/3.jpeg',
          aspect: 'aspect-square',
          description: 'A landscape reflecting internal emotional states. The solitary red-leafed tree stands as a sentinel of patience amidst stormy, atmospheric skies.'
        },
        {
          title: 'Three Sisters',
          year: '2026',
          medium: 'Oil on Canvas',
          dimensions: '36 × 48 inches',
          image: '/artwork/4.jpeg',
          aspect: 'aspect-[4/3]',
          description: 'A beautiful portrayal of sisterhood, drawing inspiration from classical Indian miniatures merged with modern editorial spacing.'
        },
        {
          title: 'Echoes of Poise',
          year: '2026',
          medium: 'Mixed Media Oil',
          dimensions: '60 × 60 inches',
          image: '/artwork/5.jpeg',
          aspect: 'aspect-[1/2]',
          description: 'An abstract expression of balance. Rich textures and bold sweeps of wine red intersect with charcoal and ivory, conveying a sense of resolved tension.'
        },
        {
          title: 'The Lotus Mudra',
          year: '2025',
          medium: 'Oil on Panel',
          dimensions: '30 × 30 inches',
          image: '/artwork/6.jpeg',
          aspect: 'aspect-square',
          description: 'A close study of hand mudras in classical Indian dance. Symbolizing the unfolding of consciousness and poise in the center of mud and water.'
        },
        {
          title: 'Pillars of Devotion',
          year: '2026',
          medium: 'Oil on Canvas',
          dimensions: '50 × 50 inches',
          image: '/artwork/7.jpeg',
          aspect: 'aspect-[4/5]',
          description: 'An architectural exploration of light and shadow in an ancient stone temple. The composition leads the eye through layers of intricate carvings.'
        },
        {
          title: 'Mother & Daughter',
          year: '2025',
          medium: 'Oil on Canvas',
          dimensions: '40 × 40 inches',
          image: '/artwork/8.jpeg',
          aspect: 'aspect-square',
          description: 'A gentle painting of connection and nurturing guidance, rendered in soft earth tones and burgundy accents.'
        }
      ];
      await Artwork.insertMany(initialArtworks);
      console.log('Successfully seeded database with initial artworks.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend connected to MongoDB' });
});

// Fetch all artworks
app.get('/api/artworks', async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching artworks' });
  }
});

// Passcode validation check
app.post('/api/admin/validate-passcode', (req, res) => {
  const { passcode } = req.body;
  const adminPasscode = process.env.ADMIN_PASSCODE || '123456';
  
  if (passcode === adminPasscode) {
    return res.json({ success: true, message: 'Authenticated successfully' });
  }
  return res.status(401).json({ success: false, error: 'Incorrect passcode' });
});

// Add new artwork (Upload image + save to MongoDB)
app.post('/api/artworks', upload.single('image'), async (req, res) => {
  try {
    const { passcode, title, year, medium, dimensions, aspect, description } = req.body;
    
    // Auth check
    const adminPasscode = process.env.ADMIN_PASSCODE || '123456';
    if (passcode !== adminPasscode) {
      // Clean up file if uploaded locally
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(401).json({ error: 'Unauthorized: Incorrect passcode' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    let imageUrl = '';

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'noisetopoise_drawings'
        });
        imageUrl = result.secure_url;
        // Delete local temporary file
        fs.unlinkSync(req.file.path);
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        // Fallback to local url if upload fails
        imageUrl = `/uploads/${req.file.filename}`;
      }
    } else {
      // Fallback: use local backend URL
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newArtwork = new Artwork({
      title,
      year,
      medium,
      dimensions,
      image: imageUrl,
      aspect: aspect || 'aspect-square',
      description
    });

    await newArtwork.save();
    res.status(201).json(newArtwork);
  } catch (err) {
    console.error('Error adding artwork:', err);
    res.status(500).json({ error: 'Server error saving artwork' });
  }
});

// Delete artwork
app.delete('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { passcode } = req.body; // Passcode can be sent in request body

    const adminPasscode = process.env.ADMIN_PASSCODE || '123456';
    if (passcode !== adminPasscode) {
      return res.status(401).json({ error: 'Unauthorized: Incorrect passcode' });
    }

    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // If local file, delete it from filesystem
    if (artwork.image.startsWith('/uploads/')) {
      const fileName = artwork.image.split('/').pop();
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Artwork.findByIdAndDelete(id);
    res.json({ message: 'Artwork deleted successfully' });
  } catch (err) {
    console.error('Error deleting artwork:', err);
    res.status(500).json({ error: 'Server error deleting artwork' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
