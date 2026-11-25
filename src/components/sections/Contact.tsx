import React, { useState, useEffect, useRef } from 'react';
import { PROFILE } from '../../data/profile';
import { ThinkingOrb } from '../effects/ThinkingOrb';
import { SakugaButton } from '../effects/SakugaButton';
import { HoloCard } from '../effects/HoloCard';
import { globalAnchorManager } from '../../environment/world/DOMAnchors';
import { 
  Mail, 
  Linkedin, 
  Github, 
  FileDown, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const contactRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (contactRef.current) {
      globalAnchorManager.registerElement('contact-campfire', contactRef.current, 'campfire', 'The Wilderness');
    }
    return () => {
      globalAnchorManager.unregisterElement('contact-campfire');
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Construct mailto as fallback direct trigger
      const mailtoLink = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
        formData.subject || `Inquiry from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
    }, 800);
  };

  return (
    <section ref={contactRef} id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl p-5 sm:p-6 bg-[#272343]/88 border-2 border-[#4a4378] backdrop-blur-md pixel-corners shadow-xl">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/50 uppercase tracking-widest font-semibold pixel-corners-sm">
            Get in Touch
          </span>
          <div className="h-[1px] w-12 bg-[#ff9a3c]/40" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#fbf1d4] font-display">
          Initiate Contact & Engineering Collaboration
        </h2>

        <p className="text-sm sm:text-base text-[#fbf1d4] leading-relaxed font-light">
          Open to full-time AI engineering roles, machine learning research, and technical consultations. Reach out via email, LinkedIn, or the message console below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Communication Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <HoloCard intensity={0.9} className="w-full">
            <div className="editorial-card p-6 sm:p-8 border-2 border-[#4a4378] bg-[#272343]/95 space-y-6 shadow-2xl pixel-corners-lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#4a4378]">
                <span className="text-xs font-mono text-[#b8b0d4] uppercase tracking-wider">
                  Contact Telemetry
                </span>
                <ThinkingOrb state="listening" size={24} theme="amber" />
              </div>

              {/* Email Card with Quick Copy */}
              <div className="p-4 bg-[#1b1830] border-2 border-[#4a4378] space-y-2 pixel-corners">
                <div className="text-xs text-[#b8b0d4]">Direct Email</div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="text-base font-bold text-[#fbf1d4] hover:text-[#ff9a3c] transition-colors truncate font-display"
                  >
                    {PROFILE.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 bg-[#272343] hover:bg-[#352f5a] text-[#fbf1d4] hover:text-[#ff9a3c] transition-colors shrink-0 cursor-pointer pixel-corners-sm"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-[#ff9a3c]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Availability & Location Badges */}
              <div className="space-y-3 text-sm text-[#fbf1d4]">
                <div className="flex items-center gap-3 p-3.5 bg-[#1b1830] border-2 border-[#4a4378] pixel-corners">
                  <MapPin className="w-4 h-4 text-[#ff9a3c] shrink-0" />
                  <span>{PROFILE.location}</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-[#1b1830] border-2 border-[#4a4378] pixel-corners">
                  <Clock className="w-4 h-4 text-[#8fc3e8] shrink-0" />
                  <span>Timezone: SAST (UTC+2) • Remote-Ready Global</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-[#1b1830] border-2 border-[#4a4378] pixel-corners">
                  <Sparkles className="w-4 h-4 text-[#d8ff7a] shrink-0" />
                  <span>Response Time: Within 24 Hours</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-[#4a4378] flex flex-wrap gap-2.5">
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1b1830] hover:bg-[#352f5a] border-2 border-[#4a4378] hover:border-[#ff9a3c] text-sm text-[#fbf1d4] hover:text-[#ff9a3c] transition-colors pixel-corners-sm"
                >
                  <Linkedin className="w-4 h-4 text-[#8fc3e8]" />
                  LinkedIn
                </a>

                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1b1830] hover:bg-[#352f5a] border-2 border-[#4a4378] hover:border-[#ff9a3c] text-sm text-[#fbf1d4] hover:text-[#ff9a3c] transition-colors pixel-corners-sm"
                >
                  <Github className="w-4 h-4 text-[#ff9a3c]" />
                  GitHub
                </a>

                <a
                  href={PROFILE.resumeUrl}
                  download="CV_Wongai_Rankin.pdf"
                  className="flex items-center gap-2 px-4 py-2 bg-[#ff9a3c]/20 hover:bg-[#ff9a3c]/30 border-2 border-[#ff9a3c]/60 text-sm text-[#ff9a3c] font-bold transition-colors pixel-corners-sm"
                >
                  <FileDown className="w-4 h-4" />
                  Download CV
                </a>
              </div>
            </div>
          </HoloCard>
        </div>

        {/* Right Column: Direct Message Composer (7 cols) */}
        <div className="lg:col-span-7">
          <div className="editorial-card p-6 sm:p-8 border-2 border-[#4a4378] bg-[#272343]/95 space-y-6 shadow-2xl pixel-corners-lg">
            <div className="space-y-1 pb-3 border-b border-[#4a4378]">
              <h3 className="text-2xl font-bold text-[#fbf1d4] tracking-tight font-display">
                Send a Message
              </h3>
              <p className="text-sm text-[#b8b0d4] font-light">
                Direct inquiry form routing to Wongairank@gmail.com
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-[#d8ff7a]/15 border-2 border-[#d8ff7a]/40 text-center space-y-3 animate-in fade-in duration-300 pixel-corners">
                <CheckCircle2 className="w-10 h-10 text-[#d8ff7a] mx-auto" />
                <h4 className="text-xl font-bold text-[#fbf1d4] font-display">Message Prepared!</h4>
                <p className="text-sm text-[#b8b0d4] max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Your default email client has been opened with your message. I will respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="text-sm text-[#ff9a3c] hover:underline pt-2 cursor-pointer font-bold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-[#fbf1d4] font-semibold">
                      Your Name <span className="text-[#ff9a3c]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Vance"
                      className="w-full px-4 py-3 bg-[#1b1830] border-2 border-[#4a4378] text-[#fbf1d4] text-base placeholder:text-[#b8b0d4]/60 focus:outline-none focus:border-[#ff9a3c] focus:bg-[#272343] transition-colors pixel-corners"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm text-[#fbf1d4] font-semibold">
                      Your Email <span className="text-[#ff9a3c]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 bg-[#1b1830] border-2 border-[#4a4378] text-[#fbf1d4] text-base placeholder:text-[#b8b0d4]/60 focus:outline-none focus:border-[#ff9a3c] focus:bg-[#272343] transition-colors pixel-corners"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#fbf1d4] font-semibold">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. AI Engineering Collaboration / Opportunity"
                    className="w-full px-4 py-3 bg-[#1b1830] border-2 border-[#4a4378] text-[#fbf1d4] text-base placeholder:text-[#b8b0d4]/60 focus:outline-none focus:border-[#ff9a3c] focus:bg-[#272343] transition-colors pixel-corners"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#fbf1d4] font-semibold">
                    Message <span className="text-[#ff9a3c]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, team, or opportunity..."
                    className="w-full px-4 py-3 bg-[#1b1830] border-2 border-[#4a4378] text-[#fbf1d4] text-base placeholder:text-[#b8b0d4]/60 focus:outline-none focus:border-[#ff9a3c] focus:bg-[#272343] transition-colors resize-none pixel-corners"
                  />
                </div>

                <div className="pt-2">
                  <SakugaButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    icon={<Send className="w-4 h-4" />}
                  >
                    {isSubmitting ? 'Transmitting...' : 'Send Message'}
                  </SakugaButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
