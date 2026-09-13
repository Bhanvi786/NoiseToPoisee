'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  // Honeypot: kept blank by real users; bots tend to fill every field
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for 'inquireArtwork' event dispatched by gallery modals
  useEffect(() => {
    const handleInquire = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { title, medium, dimensions } = customEvent.detail;
      const prefillMessage = `Hello, I am interested in acquiring the artwork '${title}' (${medium}, ${dimensions}). Please let me know more details.`;
      
      setFormData(prev => ({ ...prev, message: prefillMessage }));
      // If they were looking at the success state from a previous message, clear it
      setIsSubmitted(false); 
    };

    window.addEventListener('inquireArtwork', handleInquire);
    return () => window.removeEventListener('inquireArtwork', handleInquire);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions while a request is in flight
    if (isLoading) return;

    // Frontend validation (authoritative validation is server-side)
    const trimmedName    = formData.name.trim();
    const trimmedEmail   = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (trimmedName.length < 2)    { setError('Name must be at least 2 characters.'); return; }
    if (trimmedMessage.length < 10) { setError('Message must be at least 10 characters.'); return; }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    formData.name,
          email:   formData.email,
          message: formData.message,
          website: honeypot, // honeypot field — always empty for real users
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success — show confirmation screen, then clear the form
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setHoneypot('');
      } else {
        // Show the server's validation error (e.g. "Email is required.")
        // or a generic fallback — never expose internal details
        setError(data.error || 'Unable to send your message right now. Please try again later.');
      }
    } catch {
      // Network failure or unexpected error — generic message only
      setError('Unable to reach the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 lg:py-36 bg-[#FDFBF7] border-t border-wine/5 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[30vw] h-[30vw] rounded-full bg-wine/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 xl:gap-20 items-start">
          
          {/* Left Column: Details */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.12 } }
            }}
            className="lg:col-span-5 space-y-10"
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-3xl text-wine font-light">06</span>
                <span className="h-[1px] w-12 bg-wine/20" />
                <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
                  The Dialogue
                </span>
              </div>
              <h2 className="font-serif text-[clamp(1.75rem,5vw,3.75rem)] font-light text-charcoal tracking-tight">
                Acquisitions &amp; Inquiries
              </h2>
            </div>

            <motion.p variants={fadeUp} className="text-charcoal/70 font-sans font-light leading-relaxed text-base">
              For collection acquisitions, gallery representations, speaking engagements, or commissions, please reach out directly or fill out the form. Let us connect.
            </motion.p>

            {/* Info Items */}
            <div className="space-y-6 font-sans">
              <motion.div variants={fadeUp} className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-wine font-medium">Primary Contact</span>
                <a href="mailto:deeptiarora1881@gmail.com" className="text-lg text-charcoal hover:text-wine transition-colors font-light block">
                  deeptiarora1881@gmail.com
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-wine font-medium">Studio Location</span>
                <p className="text-sm text-charcoal/80 font-light leading-relaxed">
                  Gurugram, India
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={fadeUp}
            className="lg:col-span-7 bg-[#F7F2EB]/50 border border-wine/5 p-8 sm:p-12 rounded-2xl shadow-lg relative paper-texture"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8 font-sans"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-charcoal/50 font-medium">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        disabled={isLoading}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-transparent border-b border-wine/10 hover:border-wine/30 focus:border-wine outline-none py-2 text-charcoal font-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Aarav Mehta"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2 flex flex-col">
                      <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-charcoal/50 font-medium">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        disabled={isLoading}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-transparent border-b border-wine/10 hover:border-wine/30 focus:border-wine outline-none py-2 text-charcoal font-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="aarav@example.com"
                      />
                    </div>
                  </div>

                  {/* Honeypot anti-bot field — hidden from real users via CSS, not display:none */}
                  <input
                    type="text"
                    name="website"
                    id="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      width: '1px',
                      height: '1px',
                      overflow: 'hidden',
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Message */}
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="message" className="text-[10px] uppercase tracking-widest text-charcoal/50 font-medium">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      disabled={isLoading}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-transparent border-b border-wine/10 hover:border-wine/30 focus:border-wine outline-none py-2 text-charcoal font-light transition-colors duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Share details of your inquiry..."
                    />
                  </div>

                  {/* Inline error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        key="error-msg"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-sans font-light"
                        role="alert"
                        aria-live="polite"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      id="contact-submit-btn"
                      disabled={isLoading}
                      className="w-full bg-wine hover:bg-charcoal text-[#F7F2EB] uppercase tracking-[0.2em] text-xs py-4 font-medium rounded-lg transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Sending\u2026' : 'Send Message'}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16 space-y-4"
                >
                  <div className="w-16 h-16 bg-wine/10 rounded-full flex items-center justify-center mx-auto text-wine font-serif text-3xl font-light">
                    ✓
                  </div>
                  <h3 className="font-serif text-2xl font-light text-charcoal">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-charcoal/60 max-w-sm mx-auto font-light leading-relaxed">
                    Thank you. Deepti or her gallery representative will contact you shortly to discuss your request.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs uppercase tracking-widest text-wine border-b border-wine pb-0.5 mt-8 font-medium hover:text-charcoal hover:border-charcoal transition-colors duration-300"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
