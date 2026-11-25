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
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 bg-[#FC75B4]/15 text-[#FC75B4] border border-[#FC75B4]/40 uppercase tracking-widest font-semibold pixel-corners-sm">
            Get in Touch
          </span>
          <div className="h-[1px] w-12 bg-[#FC75B4]/30" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F0E5DB] font-display">
          Initiate Contact & Engineering Collaboration
        </h2>

        <p className="text-sm sm:text-base text-[#c7bcab] leading-relaxed font-light">
          Open to full-time AI engineering roles, machine learning research, and technical consultations. Reach out via email, LinkedIn, or the message console below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Communication Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <HoloCard intensity={0.9} className="w-full">
            <div className="editorial-card p-6 sm:p-8 border border-[#474329] bg-[#1e1c15]/95 space-y-6 shadow-2xl pixel-corners-lg">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-xs font-mono text-[#8e8472] uppercase tracking-wider">
                  Contact Telemetry
                </span>
                <ThinkingOrb state="listening" size={24} theme="cyan" />
              </div>

              {/* Email Card with Quick Copy */}
              <div className="p-4 bg-[#181611] border border-[#474329] space-y-2 pixel-corners">
                <div className="text-xs text-[#8e8472]">Direct Email</div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="text-base font-bold text-[#F0E5DB] hover:text-[#FC75B4] transition-colors truncate font-display"
                  >
                    {PROFILE.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 bg-white/5 hover:bg-white/10 text-[#F0E5DB] hover:text-[#FC75B4] transition-colors shrink-0 cursor-pointer pixel-corners-sm"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-[#FC75B4]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Availability & Location Badges */}
              <div className="space-y-3 text-sm text-[#F0E5DB]">
                <div className="flex items-center gap-3 p-3.5 bg-[#181611] border border-[#474329] pixel-corners">
                  <MapPin className="w-4 h-4 text-[#FC75B4] shrink-0" />
                  <span>{PROFILE.location}</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-[#181611] border border-[#474329] pixel-corners">
                  <Clock className="w-4 h-4 text-[#ffa3d1] shrink-0" />
                  <span>Timezone: SAST (UTC+2) • Remote-Ready Global</span>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-[#181611] border border-[#474329] pixel-corners">
                  <Sparkles className="w-4 h-4 text-[#FC75B4] shrink-0" />
                  <span>Response Time: Within 24 Hours</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2.5">
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#181611] hover:bg-[#474329]/40 border border-[#474329] text-sm text-[#F0E5DB] hover:text-[#FC75B4] transition-colors pixel-corners-sm"
                >
                  <Linkedin className="w-4 h-4 text-[#FC75B4]" />
                  LinkedIn
                </a>

                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#181611] hover:bg-[#474329]/40 border border-[#474329] text-sm text-[#F0E5DB] hover:text-[#FC75B4] transition-colors pixel-corners-sm"
                >
                  <Github className="w-4 h-4 text-[#FC75B4]" />
                  GitHub
                </a>

                <a
                  href={PROFILE.resumeUrl}
                  download="CV_Wongai_Rankin.pdf"
                  className="flex items-center gap-2 px-4 py-2 bg-[#FC75B4]/15 hover:bg-[#FC75B4]/25 border border-[#FC75B4]/40 text-sm text-[#FC75B4] font-bold transition-colors pixel-corners-sm"
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
          <div className="editorial-card p-6 sm:p-8 border border-[#474329] bg-[#1e1c15]/95 space-y-6 shadow-2xl pixel-corners-lg">
            <div className="space-y-1 pb-3 border-b border-white/10">
              <h3 className="text-2xl font-bold text-[#F0E5DB] tracking-tight font-display">
                Send a Message
              </h3>
              <p className="text-sm text-[#c7bcab] font-light">
                Direct inquiry form routing to Wongairank@gmail.com
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-[#FC75B4]/10 border border-[#FC75B4]/30 text-center space-y-3 animate-in fade-in duration-300 pixel-corners">
                <CheckCircle2 className="w-10 h-10 text-[#FC75B4] mx-auto" />
                <h4 className="text-xl font-bold text-[#F0E5DB] font-display">Message Prepared!</h4>
                <p className="text-sm text-[#c7bcab] max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Your default email client has been opened with your message. I will respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="text-sm text-[#FC75B4] hover:underline pt-2 cursor-pointer font-bold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-[#F0E5DB] font-semibold">
                      Your Name <span className="text-[#FC75B4]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Vance"
                      className="w-full px-4 py-3 bg-[#181611] border border-[#474329] text-[#F0E5DB] text-base placeholder:text-[#8e8472] focus:outline-none focus:border-[#FC75B4] transition-colors pixel-corners"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm text-[#F0E5DB] font-semibold">
                      Your Email <span className="text-[#FC75B4]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 bg-[#181611] border border-[#474329] text-[#F0E5DB] text-base placeholder:text-[#8e8472] focus:outline-none focus:border-[#FC75B4] transition-colors pixel-corners"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#F0E5DB] font-semibold">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. AI Engineering Collaboration / Opportunity"
                    className="w-full px-4 py-3 bg-[#181611] border border-[#474329] text-[#F0E5DB] text-base placeholder:text-[#8e8472] focus:outline-none focus:border-[#FC75B4] transition-colors pixel-corners"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#F0E5DB] font-semibold">
                    Message <span className="text-[#FC75B4]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, team, or opportunity..."
                    className="w-full px-4 py-3 bg-[#181611] border border-[#474329] text-[#F0E5DB] text-base placeholder:text-[#8e8472] focus:outline-none focus:border-[#FC75B4] transition-colors resize-none pixel-corners"
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
