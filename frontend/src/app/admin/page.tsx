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
  FileImage,
  Pencil
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
  isSold?: boolean;
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

const mapMediumToStandard = (med: string): string => {
  if (!med) return '';
  const lower = med.toLowerCase();
  if (lower.startsWith('oil') || lower.includes('oil')) return 'Oils';
  if (lower.startsWith('acrylic') || lower.includes('acrylic')) return 'Acrylics';
  if (lower.includes('shading') || lower.includes('pencil shading')) return 'Pencil Shading';
  if (lower.includes('charcoal')) return 'Charcoal';
  if (lower.includes('colour') || lower.includes('color') || lower.includes('colours')) return 'Pencil Colour';
  return med;
};


export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'exhibition' | 'student'>('exhibition');

  // Form fields
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [aspect, setAspect] = useState('aspect-square');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSold, setIsSold] = useState(false);

  // Student specific form fields
  const [artist, setArtist] = useState('');
  const [mentorshipYear, setMentorshipYear] = useState('Mentorship Class of 2025');

  // States for actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Artworks list
  const [artworks, setArtworks] = useState<ArtworkType[]>([]);
  const [studentWorks, setStudentWorks] = useState<any[]>([]);
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
        fetchStudentWorks();
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
        fetchStudentWorks();
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
    setStudentWorks([]);
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

  const fetchStudentWorks = async () => {
    setLoadingArtworks(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/student-works`);
      if (res.ok) {
        const data = await res.json();
        setStudentWorks(data);
      }
    } catch (err) {
      console.error('Error fetching student works:', err);
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
    if (!editId && !imageFile) {
      setSubmitError('Please upload an image.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const formData = new FormData();
    formData.append('passcode', passcode);
    formData.append('title', title);
    formData.append('medium', medium);
    formData.append('dimensions', dimensions);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const isExhibition = activeTab === 'exhibition';
    if (isExhibition) {
      formData.append('year', year);
      formData.append('aspect', aspect);
      formData.append('description', description);
      formData.append('isSold', String(isSold));
    } else {
      formData.append('artist', artist);
      formData.append('mentorshipYear', mentorshipYear);
      formData.append('concept', description);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const method = editId ? 'PUT' : 'POST';
      const baseRoute = isExhibition ? 'artworks' : 'student-works';
      const endpoint = editId ? `${apiUrl}/api/${baseRoute}/${editId}` : `${apiUrl}/api/${baseRoute}`;

      const res = await fetch(endpoint, {
        method,
        body: formData,
      });

      if (res.ok) {
        setSubmitSuccess(true);
        // Clear fields & reset edit mode
        handleCancelEdit();
        // Refresh list
        if (isExhibition) {
          fetchArtworks();
        } else {
          fetchStudentWorks();
        }
        // Hide success message after 4s
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        let errMsg = `Failed to ${editId ? 'update' : 'upload'} ${isExhibition ? 'artwork' : 'student work'}`;
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch (_) {
          try {
            const textData = await res.text();
            if (textData && textData.length < 100) {
              errMsg = textData;
            }
          } catch (_) {}
        }
        setSubmitError(errMsg);
      }
    } catch (err) {
      console.error(err);
      setSubmitError(`Network error ${editId ? 'updating' : 'uploading'} drawing.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const isExhibition = activeTab === 'exhibition';
    const baseRoute = isExhibition ? 'artworks' : 'student-works';
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/${baseRoute}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        if (isExhibition) {
          setArtworks(artworks.filter(art => art._id !== id && String(art.id) !== id));
        } else {
          setStudentWorks(studentWorks.filter(w => w._id !== id && String(w.id) !== id));
        }
        setDeleteId(null);
      } else {
        alert(`Could not delete ${isExhibition ? 'artwork' : 'student work'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStartEdit = (art: any) => {
    setEditId(art._id || String(art.id));
    setTitle(art.title);
    setMedium(mapMediumToStandard(art.medium));
    setDimensions(art.dimensions);
    setImageFile(null);
    setImagePreview(getImageUrl(art.image));

    if (activeTab === 'exhibition') {
      setYear(art.year);
      setAspect(art.aspect || 'aspect-square');
      setDescription(art.description || '');
      setIsSold(art.isSold || false);
    } else {
      setArtist(art.artist || '');
      setMentorshipYear(art.mentorshipYear || 'Mentorship Class of 2025');
      setDescription(art.concept || '');
    }
    
    // Smooth scroll to form
    const formElement = document.getElementById('artwork-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setTitle('');
    setYear(new Date().getFullYear().toString());
    setMedium('');
    setDimensions('');
    setAspect('aspect-square');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setArtist('');
    setMentorshipYear('Mentorship Class of 2025');
    setIsSold(false);
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
            className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col space-y-8"
          >
            {/* Tab Selector */}
            <div className="flex border-b border-wine/10 pb-1 self-start">
              <button
                onClick={() => {
                  setActiveTab('exhibition');
                  handleCancelEdit();
                }}
                className={`text-xs uppercase tracking-[0.25em] px-6 py-3 font-sans transition-all duration-300 relative cursor-pointer ${
                  activeTab === 'exhibition' ? 'text-wine font-medium' : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                Manage Exhibition
                {activeTab === 'exhibition' && (
                  <motion.div
                    layoutId="adminActiveTabUnderline"
                    className="absolute left-6 right-6 bottom-0 h-[2px] bg-wine"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('student');
                  handleCancelEdit();
                }}
                className={`text-xs uppercase tracking-[0.25em] px-6 py-3 font-sans transition-all duration-300 relative cursor-pointer ${
                  activeTab === 'student' ? 'text-wine font-medium' : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                Manage Student Work
                {activeTab === 'student' && (
                  <motion.div
                    layoutId="adminActiveTabUnderline"
                    className="absolute left-6 right-6 bottom-0 h-[2px] bg-wine"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            
            {/* Left: Upload Form Section (7 Columns) */}
            <div className="lg:col-span-7 space-y-8">
              <div id="artwork-form-container" className="bg-[#FAF8F5] border border-wine/10 p-8 rounded-2xl shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2.5 bg-wine/5 rounded-lg text-wine">
                    {editId ? <Pencil size={20} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-charcoal">
                      {editId 
                        ? (activeTab === 'exhibition' ? 'Edit Artwork' : 'Edit Student Work') 
                        : (activeTab === 'exhibition' ? 'Add New Artwork' : 'Add Student Work')
                      }
                    </h2>
                    <p className="text-xs font-sans text-charcoal/50">
                      {editId 
                        ? 'Modify details of your previously uploaded drawing.' 
                        : (activeTab === 'exhibition' 
                            ? 'Upload images of your drawings to the live gallery.' 
                            : 'Add curated masterpieces created by your students.'
                          )
                      }
                    </p>
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
                            required={!editId}
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
                        Artwork Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={activeTab === 'exhibition' ? 'e.g. Silence in Crimson' : 'e.g. Serenity at Dawn'}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm"
                      />
                    </div>
                    {activeTab === 'exhibition' && (
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
                    )}
                  </div>

                  {activeTab === 'student' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                          Mentorship Class / Year
                        </label>
                        <input
                          type="text"
                          value={mentorshipYear}
                          onChange={(e) => setMentorshipYear(e.target.value)}
                          placeholder="e.g. Mentorship Class of 2025"
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                        Medium / Materials
                      </label>
                      <select
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm text-charcoal"
                      >
                        <option value="" disabled className="text-charcoal/50">Select Medium</option>
                        <option value="Acrylics" className="text-charcoal bg-[#F7F2EB]">Acrylics</option>
                        <option value="Oils" className="text-charcoal bg-[#F7F2EB]">Oils</option>
                        <option value="Pencil Shading" className="text-charcoal bg-[#F7F2EB]">Pencil Shading</option>
                        <option value="Charcoal" className="text-charcoal bg-[#F7F2EB]">Charcoal</option>
                        <option value="Pencil Colour" className="text-charcoal bg-[#F7F2EB]">Pencil Colour</option>
                      </select>
                    </div>
                    {activeTab === 'exhibition' && (
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          value={dimensions}
                          onChange={(e) => setDimensions(e.target.value)}
                          placeholder="e.g. 40 × 50 inches"
                          required={activeTab === 'exhibition'}
                          className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm"
                        />
                      </div>
                    )}
                  </div>
                   {/* Framing Layout Aspect Ratio */}
                  {activeTab === 'exhibition' && (
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
                  )}

                  {activeTab === 'exhibition' && (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                        Artwork Status
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-w-xs">
                        {[
                          { val: false, label: 'Available (Unsold)' },
                          { val: true, label: 'Sold' }
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setIsSold(opt.val)}
                            className={`px-3 py-2 rounded-xl text-xs font-sans text-center transition-all cursor-pointer border ${
                              isSold === opt.val
                                ? 'border-wine bg-wine/5 text-wine font-medium'
                                : 'border-charcoal/10 hover:border-charcoal/20 bg-transparent text-charcoal/70'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal/60 font-medium mb-1.5 font-sans">
                      {activeTab === 'exhibition' ? 'Description / Story' : 'Student Concept / Description'}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={activeTab === 'exhibition' ? 'Write a brief story or artistic concept behind this drawing...' : 'Describe the student\'s process, mentorship focus, or artwork concept...'}
                      rows={4}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/15 bg-transparent focus:outline-none focus:border-wine transition-colors font-sans text-sm resize-none"
                    />
                  </div>

                  {/* Success & Error feedbacks */}
                  {submitSuccess && (
                    <div className="flex items-center space-x-2 text-green-700 bg-green-50 border border-green-150 p-4 rounded-xl text-sm">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span className="font-sans">
                        {activeTab === 'exhibition' 
                          ? 'Artwork saved successfully! It is now live in the exhibition gallery.'
                          : 'Student work saved successfully! It is now live in the mentorship section.'
                        }
                      </span>
                    </div>
                  )}

                  {submitError && (
                    <div className="flex items-center space-x-2 text-wine bg-wine/5 border border-wine/10 p-4 rounded-xl text-sm">
                      <AlertCircle size={16} className="shrink-0" />
                      <span className="font-sans">{submitError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    {editId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 py-3.5 border border-charcoal/10 hover:border-charcoal/20 text-charcoal/70 hover:text-charcoal rounded-xl font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 cursor-pointer bg-transparent"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`${editId ? 'flex-[2]' : 'w-full'} py-3.5 bg-wine hover:bg-wine/90 text-[#F7F2EC] rounded-xl font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-wine/10 cursor-pointer disabled:opacity-50`}
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          {editId ? <Pencil size={16} /> : <Plus size={16} />}
                          <span>
                            {editId 
                              ? 'Save Changes' 
                              : (activeTab === 'exhibition' ? 'Publish drawing to website' : 'Publish student work to website')
                            }
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Existing Catalog View (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FAF8F5] border border-wine/10 p-8 rounded-2xl shadow-md h-full flex flex-col">
                <h3 className="font-serif text-lg text-charcoal mb-2">
                  {activeTab === 'exhibition' ? `Exhibition Catalog (${artworks.length})` : `Mentorship Works (${studentWorks.length})`}
                </h3>
                <p className="text-xs font-sans text-charcoal/50 mb-6">
                  {activeTab === 'exhibition' ? 'Manage live drawing assets. Delete items instantly.' : 'Manage live student portfolio items. Delete items instantly.'}
                </p>

                {loadingArtworks ? (
                  <div className="flex flex-col items-center justify-center flex-grow py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-wine animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-charcoal/40 font-sans">Loading catalog...</p>
                  </div>
                ) : (activeTab === 'exhibition' ? artworks.length === 0 : studentWorks.length === 0) ? (
                  <div className="flex flex-col items-center justify-center flex-grow py-20 text-center border border-dashed border-charcoal/10 rounded-xl bg-charcoal/5 p-6">
                    <FileImage className="w-12 h-12 text-charcoal/20 mb-3" />
                    <p className="font-serif text-charcoal/40 font-light text-base mb-1">
                      {activeTab === 'exhibition' ? 'No Drawings Registered' : 'No Student Works Registered'}
                    </p>
                    <p className="font-sans text-xs text-charcoal/40">Seeded data will load as soon as server connection is live.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {(activeTab === 'exhibition' ? artworks : studentWorks).map((art) => (
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
                          <p className="text-xs font-sans text-charcoal/60 truncate mt-0.5">
                            {activeTab === 'exhibition' ? art.medium : (art.artist ? `${art.artist} • ${art.medium}` : art.medium)}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-wine/75 font-semibold mt-1 flex items-center gap-2">
                            <span>{activeTab === 'exhibition' ? art.year : art.mentorshipYear}</span>
                            {activeTab === 'exhibition' && art.isSold && (
                              <span className="bg-wine/10 text-wine text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Sold
                              </span>
                            )}
                          </p>
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
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleStartEdit(art)}
                                className={`p-2 hover:text-wine bg-transparent hover:bg-wine/5 rounded-lg transition-colors cursor-pointer ${
                                  editId === art._id || editId === String(art.id)
                                    ? 'text-wine bg-wine/5'
                                    : 'text-charcoal/30'
                                }`}
                                aria-label={`Edit ${art.title}`}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteId(art._id || String(art.id))}
                                className="p-2 text-charcoal/30 hover:text-wine bg-transparent hover:bg-wine/5 rounded-lg transition-colors cursor-pointer"
                                aria-label={`Delete ${art.title}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
