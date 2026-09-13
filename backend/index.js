require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');

const Artwork = require('./models/Artwork');
const StudentWork = require('./models/StudentWork');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null
].filter(Boolean);

// Enable CORS & JSON Parsing
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Serve static uploads
app.use('/uploads', express.Router().use(express.static(uploadsDir)));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/artograph')
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    await seedArtworksIfEmpty();
    await seedStudentWorksIfEmpty();
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
  console.warn('CRITICAL: Cloudinary credentials missing. File uploads will fail in production.');
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only images (jpeg, jpg, png, webp) are allowed!'));
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter 
});

// Middleware to gracefully handle Multer errors
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message || 'Unknown upload error' });
    }
    next();
  });
};

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

async function seedStudentWorksIfEmpty() {
  try {
    const count = await StudentWork.countDocuments();
    if (count === 0) {
      console.log('Database empty. Seeding initial student works...');
      const initialStudentWorks = [
        {
          title: 'Serenity at Dawn',
          artist: 'Eliza Reed',
          mentorshipYear: 'Mentorship Class of 2025',
          medium: 'Oil on Canvas',
          dimensions: '24 × 30 inches',
          image: '/artwork/student_lake.png',
          concept: 'A landscape study capturing the soft reflections and light gradients of early morning. Eliza developed this piece focusing on brushwork control and atmospheric perspective.'
        },
        {
          title: 'Gaze of Innocence',
          artist: 'Aarav Mehta',
          mentorshipYear: 'Mentorship Class of 2026',
          medium: 'Charcoal & Soft Pastel on Paper',
          dimensions: '20 × 20 inches',
          image: '/artwork/student_portrait.png',
          concept: 'A high-contrast study of emotion and structure. Aarav combined delicate blending with raw charcoal lines to achieve a powerful portrait filled with depth.'
        }
      ];
      await StudentWork.insertMany(initialStudentWorks);
      console.log('Successfully seeded database with initial student works.');
    }
  } catch (error) {
    console.error('Error seeding student database:', error);
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

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per `window`
  message: { success: false, error: 'Too many login attempts, please try again later' }
});

// Separate rate limiter for the public contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // 5 submissions per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many messages sent. Please try again in 15 minutes.' }
});

// Passcode validation check
app.post('/api/admin/validate-passcode', loginLimiter, (req, res) => {
  const { passcode } = req.body;
  
  if (!process.env.ADMIN_PASSCODE) {
    return res.status(500).json({ success: false, error: 'Server configuration error: Admin passcode not set' });
  }
  
  if (passcode === process.env.ADMIN_PASSCODE) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'fallback_secret_change_in_production', { expiresIn: '1d' });
    // Return token in response body so frontend can use Authorization header
    return res.json({ success: true, message: 'Authenticated successfully', token });
  }
  return res.status(401).json({ success: false, error: 'Incorrect passcode' });
});

app.post('/api/admin/logout', (req, res) => {
  // Token-based auth: nothing to clear server-side, frontend handles removal
  return res.json({ success: true });
});

// Middleware for protected routes
const authenticateAdmin = (req, res, next) => {
  // Accept token from Authorization header (preferred) or cookie (fallback)
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.cookies.admin_token;
  }
  
  if (!token) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_change_in_production');
    next();
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Add new artwork (Upload image + save to MongoDB)
app.post('/api/artworks', authenticateAdmin, handleUpload, async (req, res) => {
  try {
    const { title, year, medium, dimensions, aspect, description, isSold } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    let imageUrl = '';

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'artograph_drawings'
        });
        imageUrl = result.secure_url;
        // Delete local temporary file
        fs.unlinkSync(req.file.path);
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: 'Image upload failed. Cloudinary is required.' });
      }
    } else {
      // Cloudinary strictly required, but for local testing:
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newArtwork = new Artwork({
      title,
      year,
      medium,
      dimensions,
      image: imageUrl,
      aspect: aspect || 'aspect-square',
      description,
      isSold: isSold === 'true' || isSold === true
    });

    await newArtwork.save();
    res.status(201).json(newArtwork);
  } catch (err) {
    console.error('Error adding artwork:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Server error saving artwork' });
  }
});

// Edit/Update artwork
app.put('/api/artworks/:id', authenticateAdmin, handleUpload, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, year, medium, dimensions, aspect, description, isSold } = req.body;

    const artwork = await Artwork.findById(id);
    if (!artwork) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // Update text fields
    artwork.title = title || artwork.title;
    artwork.year = year || artwork.year;
    artwork.medium = medium || artwork.medium;
    artwork.dimensions = dimensions || artwork.dimensions;
    artwork.aspect = aspect || artwork.aspect;
    artwork.description = description || artwork.description;
    if (isSold !== undefined) {
      artwork.isSold = isSold === 'true' || isSold === true;
    }

    // If new image is uploaded
    if (req.file) {
      // Clean up old local image if it existed
      if (artwork.image.startsWith('/uploads/')) {
        const oldFileName = artwork.image.split('/').pop();
        const oldFilePath = path.join(uploadsDir, oldFileName);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }

      let imageUrl = '';
      if (isCloudinaryConfigured) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'artograph_drawings'
          });
          imageUrl = result.secure_url;
          fs.unlinkSync(req.file.path);
        } catch (cloudErr) {
          console.error('Cloudinary upload error during update:', cloudErr);
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          return res.status(500).json({ error: 'Image upload failed. Cloudinary is required.' });
        }
      } else {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      artwork.image = imageUrl;
    }

    await artwork.save();
    res.json(artwork);
  } catch (err) {
    console.error('Error updating artwork:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Server error updating artwork' });
  }
});

// Delete artwork
app.delete('/api/artworks/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // If local file, delete it from filesystem
    if (artwork.image.startsWith('/uploads/')) {
      const fileName = artwork.image.split('/').pop();
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Artwork.findByIdAndDelete(id);
    res.json({ message: 'Artwork deleted successfully' });
  } catch (err) {
    console.error('Error deleting artwork:', err);
    res.status(500).json({ error: 'Server error deleting artwork' });
  }
});

// -------------------------------------------------------------
// Student Work Endpoints
// -------------------------------------------------------------

// Fetch all student works
app.get('/api/student-works', async (req, res) => {
  try {
    const works = await StudentWork.find().sort({ createdAt: -1 });
    res.json(works);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching student works' });
  }
});

// Add new student work
app.post('/api/student-works', authenticateAdmin, handleUpload, async (req, res) => {
  try {
    const { title, artist, mentorshipYear, medium, dimensions, concept } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    let imageUrl = '';

    if (isCloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'artograph_drawings'
        });
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: 'Image upload failed. Cloudinary is required.' });
      }
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newWork = new StudentWork({
      title,
      artist,
      mentorshipYear,
      medium,
      dimensions,
      image: imageUrl,
      concept
    });

    await newWork.save();
    res.status(201).json(newWork);
  } catch (err) {
    console.error('Error adding student work:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Server error saving student work' });
  }
});

// Edit/Update student work
app.put('/api/student-works/:id', authenticateAdmin, handleUpload, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, mentorshipYear, medium, dimensions, concept } = req.body;

    const work = await StudentWork.findById(id);
    if (!work) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Student work not found' });
    }

    // Update text fields
    work.title = title || work.title;
    work.artist = artist || work.artist;
    work.mentorshipYear = mentorshipYear || work.mentorshipYear;
    work.medium = medium || work.medium;
    work.dimensions = dimensions || work.dimensions;
    work.concept = concept || work.concept;

    // If new image is uploaded
    if (req.file) {
      if (work.image.startsWith('/uploads/')) {
        const oldFileName = work.image.split('/').pop();
        const oldFilePath = path.join(uploadsDir, oldFileName);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }

      let imageUrl = '';
      if (isCloudinaryConfigured) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'artograph_drawings'
          });
          imageUrl = result.secure_url;
          fs.unlinkSync(req.file.path);
        } catch (cloudErr) {
          console.error('Cloudinary upload error during update:', cloudErr);
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          return res.status(500).json({ error: 'Image upload failed. Cloudinary is required.' });
        }
      } else {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      work.image = imageUrl;
    }

    await work.save();
    res.json(work);
  } catch (err) {
    console.error('Error updating student work:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Server error updating student work' });
  }
});

// Delete student work
app.delete('/api/student-works/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const work = await StudentWork.findById(id);
    if (!work) {
      return res.status(404).json({ error: 'Student work not found' });
    }

    if (work.image.startsWith('/uploads/')) {
      const fileName = work.image.split('/').pop();
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await StudentWork.findByIdAndDelete(id);
    res.json({ message: 'Student work deleted successfully' });
  } catch (err) {
    console.error('Error deleting student work:', err);
    res.status(500).json({ error: 'Server error deleting student work' });
  }
});


// -------------------------------------------------------------
// Contact Form Endpoint
// -------------------------------------------------------------

// Email format validator (RFC 5321 practical limit)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/contact', contactLimiter, async (req, res) => {
  // Reject non-object or missing bodies early
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid request body.' });
  }

  // Extract and trim fields — never trust raw user input
  const name    = typeof req.body.name    === 'string' ? req.body.name.trim()    : '';
  const email   = typeof req.body.email   === 'string' ? req.body.email.trim()   : '';
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

  // --- Server-side validation ---
  const errors = [];

  if (!name)                errors.push('Name is required.');
  else if (name.length > 100) errors.push('Name must be 100 characters or fewer.');

  if (!email)                         errors.push('Email is required.');
  else if (email.length > 254)        errors.push('Email address is too long.');
  else if (!EMAIL_REGEX.test(email))  errors.push('Please provide a valid email address.');

  if (!message)                    errors.push('Message is required.');
  else if (message.length > 5000)  errors.push('Message must be 5,000 characters or fewer.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors[0] });
  }

  // --- Resend API key check ---
  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] Resend API key not configured. Set RESEND_API_KEY.');
    return res.status(500).json({
      success: false,
      error: 'Unable to send your message right now. Please try again later.'
    });
  }

  // --- Build Resend client (HTTPS API — works on all Render tiers, no SMTP needed) ---
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Sanitise helper for HTML output
  const esc = s => s.replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));

  // --- Send ---
  try {
    console.log(`[contact] Attempting to send email from <${email}>...`);
    const { data, error } = await resend.emails.send({
      from: 'Artograph Contact <noreply@artographbydeepti.com>',
      to:      ['deeptiarora1881@gmail.com'],
      replyTo: email,
      subject: `New Contact Inquiry from ${name}`,
      text: [`Name:    ${name}`, `Email:   ${email}`, ``, `Message:`, message].join('\n'),
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:32px;background:#FDFBF7;border:1px solid #e5e0d8;border-radius:8px">
          <h2 style="font-weight:400;color:#3d1f2b;margin-bottom:4px">New Contact Inquiry</h2>
          <p style="font-size:12px;color:#888;letter-spacing:0.1em;text-transform:uppercase;margin-top:0">Artograph</p>
          <hr style="border:none;border-top:1px solid #e5e0d8;margin:20px 0"/>
          <p style="margin:0 0 6px"><strong>Name:</strong> ${esc(name)}</p>
          <p style="margin:0 0 20px"><strong>Email:</strong> ${esc(email)}</p>
          <p style="margin:0 0 6px"><strong>Message:</strong></p>
          <div style="background:#f4ede3;padding:16px;border-radius:4px;white-space:pre-wrap;font-size:14px;color:#444">${esc(message)}</div>
          <hr style="border:none;border-top:1px solid #e5e0d8;margin:24px 0"/>
          <p style="font-size:11px;color:#aaa">Reply to this email to respond directly to the visitor.</p>
        </div>
      `
    });

    if (error) {
      console.error(`[contact] Resend error:`, error);
      return res.status(500).json({
        success: false,
        error: 'Unable to send your message right now. Please try again later.'
      });
    }

    console.log(`[contact] Email sent successfully! ID: ${data.id}`);
    return res.json({ success: true, message: 'Your message has been sent successfully.' });
  } catch (err) {
    console.error(`[contact] Failed to send email:`, err);
    return res.status(500).json({
      success: false,
      error: 'Unable to send your message right now. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
