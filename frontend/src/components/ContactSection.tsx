'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      // Simulate API submit
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
      }, 2000);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section id="contact" className="py-24 md:py-36 bg-[#FDFBF7] border-t border-wine/5 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[30vw] h-[30vw] rounded-full bg-wine/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
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
                <span className="font-serif text-3xl text-wine font-light">07</span>
                <span className="h-[1px] w-12 bg-wine/20" />
                <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
                  The Dialogue
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal tracking-tight">
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
                <a href="mailto:deepti@noisetopoise.com" className="text-lg text-charcoal hover:text-wine transition-colors font-light block">
                  deepti@noisetopoise.com
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-wine font-medium">Studio Location</span>
                <p className="text-sm text-charcoal/80 font-light leading-relaxed">
                  Studio 104, Old Mill Residency,<br />
                  Colaba, Mumbai, India
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-wine font-medium">Gallery Representation</span>
                <p className="text-sm text-charcoal/80 font-light leading-relaxed">
                  Represented in London by <span className="font-medium text-charcoal">The Fine Art Alliance</span>.<br />
                  Represented in Mumbai by <span className="font-medium text-charcoal">Aura Gallery India</span>.
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
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-transparent border-b border-wine/10 hover:border-wine/30 focus:border-wine outline-none py-2 text-charcoal font-light transition-colors duration-300"
                        placeholder="John Doe"
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-transparent border-b border-wine/10 hover:border-wine/30 focus:border-wine outline-none py-2 text-charcoal font-light transition-colors duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="message" className="text-[10px] uppercase tracking-widest text-charcoal/50 font-medium">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-transparent border-b border-wine/10 hover:border-wine/30 focus:border-wine outline-none py-2 text-charcoal font-light transition-colors duration-300 resize-none"
                      placeholder="Share details of your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-wine hover:bg-charcoal text-[#F7F2EB] uppercase tracking-[0.2em] text-xs py-4 font-medium rounded-lg transition-colors duration-300"
                    >
                      Send Message
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
                    Thank you, {formData.name || 'friend'}. Deepti or her gallery representative will contact you shortly to discuss your request.
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
