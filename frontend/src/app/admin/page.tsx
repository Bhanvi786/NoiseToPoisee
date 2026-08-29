'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Lock, 
  Upload, 
  Trash2, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  FileImage
} from 'lucide-react';
import Link from 'next/link';

interface ArtworkType {
  _id?: string;
  id?: number;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  aspect: string;
  description: string;
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    return `${apiUrl}${imagePath}`;
  }
  return imagePath;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [aspect, setAspect] = useState('aspect-square');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // States for actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Artworks list
  const [artworks, setArtworks] = useState<ArtworkType[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check sessionStorage for pre-existing session
  useEffect(() => {
    const savedPasscode = sessionStorage.getItem('admin_passcode');
    if (savedPasscode) {
      validateStoredPasscode(savedPasscode);
    }
  }, []);

  const validateStoredPasscode = async (stored: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/admin/validate-passcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: stored }),
      });
      if (res.ok) {
        setPasscode(stored);
        setIsAuthenticated(true);
        fetchArtworks();
      } else {
        sessionStorage.removeItem('admin_passcode');
      }
    } catch (err) {
      console.error('Session validation error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/admin/validate-passcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('admin_passcode', passcode);
        setIsAuthenticated(true);
        fetchArtworks();
      } else {
        setAuthError(data.error || 'Incorrect passcode');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Unable to connect to the backend server.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_passcode');
    setIsAuthenticated(false);
    setPasscode('');
    setArtworks([]);
  };

  const fetchArtworks = async () => {
    setLoadingArtworks(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/artworks`);
      if (res.ok) {
        const data = await res.json();
        setArtworks(data);
      }
    } catch (err) {
      console.error('Error fetching artworks:', err);
    } finally {
      setLoadingArtworks(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setSubmitError('Please upload an image for the drawing.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const formData = new FormData();
    formData.append('passcode', passcode);
    formData.append('title', title);
    formData.append('year', year);
    formData.append('medium', medium);
    formData.append('dimensions', dimensions);
    formData.append('aspect', aspect);
    formData.append('description', description);
    formData.append('image', imageFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/artworks`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSubmitSuccess(true);
        // Clear fields
        setTitle('');
        setMedium('');
        setDimensions('');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
        // Refresh list
        fetchArtworks();
        // Hide success message after 4s
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Failed to upload artwork');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error uploading drawing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/artworks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        setArtworks(artworks.filter(art => art._id !== id && String(art.id) !== id));
        setDeleteId(null);
      } else {
        alert('Could not delete artwork');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting drawing');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F2EC] text-charcoal selection:bg-wine selection:text-[#F7F2EC]">
      
      {/* Navigation Header */}
      <header className="border-b border-wine/10 bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-wine hover:text-charcoal transition-colors duration-300 font-sans text-sm tracking-widest uppercase">
            <ArrowLeft size={16} />
            <span>View Website</span>
          </Link>
          
          <h1 className="font-serif text-xl tracking-tight text-wine font-semibold">
            Noise to Poise <span className="font-light text-charcoal/60">Dashboard</span>
          </h1>

          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-charcoal/60 hover:text-wine transition-colors duration-300 font-sans text-xs tracking-wider uppercase cursor-pointer"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          ) : (
            <div className="w-[100px]" />
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* Authentication Gate */
          <motion.div 
            key="auth"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex items-center justify-center min-h-[80vh] px-4"
          >
            <div className="max-w-md w-full bg-[#FAF8F5] border border-wine/10 p-8 md:p-10 rounded-2xl shadow-xl flex flex-col items-center">
              <div className="p-4 bg-wine/5 rounded-full text-wine mb-6">
                <Lock size={32} />
              </div>
              
              <h2 className="font-serif text-2xl text-charcoal text-center font-light mb-2">
                Admin Authentication
              </h2>
              <p className="text-sm font-sans text-charcoal/50 text-center mb-8">
                Enter the client passcode to access the website management dashboard.
              </p>

              <form onSubmit={handleLogin} className="w-full space-y-5">
                <div>
                  <input
                    type="password"
                    placeholder="Enter Passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-transparent text-center text-lg tracking-[0.25em] focus:outline-none focus:border-wine focus:ring-1 focus:ring-wine transition-all"
                  />
                  {authError && (
                    <div className="flex items-center space-x-2 text-wine mt-3 text-sm justify-center">
                      <AlertCircle size={14} />
                      <span className="font-sans font-light">{authError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-wine hover:bg-wine/90 text-[#F7F2EC] rounded-xl font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-wine/10 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Unlock Dashboard</span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* Main Dashboard UI */
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            
            {/* Left: Upload Form Section (7 Columns) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-[#FAF8F5] border border-wine/10 p-8 rounded-2xl shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2.5 bg-wine/5 rounded-lg text-wine">
                    <Plus size={20} />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-charcoal">Add New Artwork</h2>
                    <p className="text-xs font-sans text-charcoal/50">Upload images of your drawings to the live gallery.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload Zone */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-2 font-sans">
                      Artwork Image File
                    </label>
                    <div className="relative border-2 border-dashed border-charcoal/15 hover:border-wine/40 rounded-xl p-6 transition-colors duration-300 bg-transparent flex flex-col items-center justify-center min-h-[200px]">
                      {imagePreview ? (
                        <div className="relative w-full flex flex-col items-center space-y-4">
                          <div className="relative w-40 h-40 bg-[#EADFD0] border border-charcoal/5 overflow-hidden shadow-sm">
                            <Image 
                              src={imagePreview} 
                              alt="Preview" 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                            className="text-xs text-wine hover:underline uppercase tracking-widest font-bold"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            required
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload size={28} className="text-charcoal/40 mb-3" />
                          <p className="text-sm font-medium text-charcoal/70 text-center">
                            Drag & Drop drawing image, or <span className="text-wine underline cursor-pointer">browse</span>
                          </p>
                          <p className="text-xs text-charcoal/40 text-center mt-1">
                            Supports PNG, JPG, JPEG, WebP
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Text Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                        Title / Name
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Silence in Crimson"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                        Creation Year
                      </label>
                      <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g. 2026"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                        Medium / Materials
                      </label>
                      <input
                        type="text"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        placeholder="e.g. Oil on Canvas"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder="e.g. 40 × 50 inches"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm"
                      />
                    </div>
                  </div>

                  {/* Framing Layout Aspect Ratio */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                      Display Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { val: 'aspect-square', label: 'Square (1:1)' },
                        { val: 'aspect-[3/4]', label: 'Portrait (3:4)' },
                        { val: 'aspect-[4/5]', label: 'Portrait (4:5)' },
                        { val: 'aspect-[4/3]', label: 'Landscape (4:3)' },
                        { val: 'aspect-[1/2]', label: 'Tall (1:2)' }
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setAspect(opt.val)}
                          className={`px-3 py-2 rounded-xl text-xs font-sans text-center transition-all cursor-pointer border ${
                            aspect === opt.val
                              ? 'border-wine bg-wine/5 text-wine font-medium'
                              : 'border-charcoal/10 hover:border-charcoal/20 bg-transparent text-charcoal/70'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                      Description / Story
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write a brief story or artistic concept behind this drawing..."
                      rows={4}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm resize-none"
                    />
                  </div>

                  {/* Success & Error feedbacks */}
                  {submitSuccess && (
                    <div className="flex items-center space-x-2 text-green-700 bg-green-50 border border-green-150 p-4 rounded-xl text-sm">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span className="font-sans">Artwork uploaded successfully! It is now live in the exhibition gallery.</span>
                    </div>
                  )}

                  {submitError && (
                    <div className="flex items-center space-x-2 text-wine bg-wine/5 border border-wine/10 p-4 rounded-xl text-sm">
                      <AlertCircle size={16} className="shrink-0" />
                      <span className="font-sans">{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-wine hover:bg-wine/90 text-[#F7F2EC] rounded-xl font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-wine/10 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Publish drawing to website</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Existing Catalog View (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FAF8F5] border border-wine/10 p-8 rounded-2xl shadow-md h-full flex flex-col">
                <h3 className="font-serif text-lg text-charcoal mb-2">Exhibition Catalog ({artworks.length})</h3>
                <p className="text-xs font-sans text-charcoal/50 mb-6">Manage live drawing assets. Delete items instantly.</p>

                {loadingArtworks ? (
                  <div className="flex flex-col items-center justify-center flex-grow py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-wine animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-charcoal/40 font-sans">Loading catalog...</p>
                  </div>
                ) : artworks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-grow py-20 text-center border border-dashed border-charcoal/10 rounded-xl bg-charcoal/5 p-6">
                    <FileImage className="w-12 h-12 text-charcoal/20 mb-3" />
                    <p className="font-serif text-charcoal/40 font-light text-base mb-1">No Drawings Registered</p>
                    <p className="font-sans text-xs text-charcoal/40">Seeded data will load as soon as server connection is live.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {artworks.map((art) => (
                      <div 
                        key={art._id || art.id}
                        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-wine/5 border border-charcoal/5 bg-transparent transition-all group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 bg-[#EADFD0] overflow-hidden border border-charcoal/10 shrink-0">
                          <Image
                            src={getImageUrl(art.image)}
                            alt={art.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-grow min-w-0">
                          <h4 className="font-serif text-sm text-charcoal font-medium truncate">{art.title}</h4>
                          <p className="text-xs font-sans text-charcoal/60 truncate mt-0.5">{art.medium}</p>
                          <p className="text-[10px] uppercase tracking-widest text-wine/75 font-semibold mt-1">{art.year}</p>
                        </div>

                        {/* Action: Delete */}
                        <div className="shrink-0">
                          {deleteId === art._id || deleteId === String(art.id) ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDelete(art._id || String(art.id))}
                                disabled={isDeleting}
                                className="text-xs text-wine hover:underline font-bold uppercase tracking-widest cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-xs text-charcoal/50 hover:underline uppercase tracking-widest cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(art._id || String(art.id))}
                              className="p-2 text-charcoal/30 hover:text-wine bg-transparent hover:bg-wine/5 rounded-lg transition-colors cursor-pointer"
                              aria-label={`Delete ${art.title}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
