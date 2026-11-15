import { useState } from "react";
import { Mail, ArrowUpRight, Copy, Check, Send, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { personal } from "../data/personal";
import Footer from "./Footer";

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personal.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`AI/ML Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className="relative min-h-[calc(100svh-4.5rem)] lg:h-[calc(100svh-4.5rem)] lg:min-h-[640px] lg:max-h-[920px] flex flex-col justify-between pt-16 pb-0 px-6 sm:px-10 lg:px-12 bg-[#171717] text-white border-t border-white/10 overflow-hidden"
    >
      {/* ─── Main Content Container (Fitted within Viewport) ─── */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto py-2">
        {/* Section Header: Compact */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6 shrink-0 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono text-[#B99378]">07</span>
              <span className="w-6 h-px bg-white/20" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B99378]">
                INITIATE DIALOGUE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Let's Build Something <span className="text-[#B99378]">Intelligent.</span>
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md font-normal leading-relaxed">
            Interested in Artificial Intelligence, Machine Learning, or Generative AI? Let's connect and build intelligent solutions.
          </p>
        </div>

        {/* ─── Contact Cards & Note Form ─── */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-8 items-center">
          {/* Left: Direct Outreach Channels */}
          <div className="lg:col-span-5 space-y-3">
            {/* Direct Email Card */}
            <div className="bg-[#212121] rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center justify-between gap-3 shadow-sm">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99378] block">
                  Primary Email
                </span>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-sm sm:text-base font-bold text-white hover:text-[#B99378] transition-colors truncate block mt-0.5"
                >
                  {personal.email}
                </a>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#171717] hover:bg-[#EFEAE3] text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  <Mail size={13} />
                  <span>Email</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                  type="button"
                >
                  {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Direct Phone Card */}
            <div className="bg-[#212121] rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center justify-between gap-3 shadow-sm">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99378] block">
                  Direct Phone
                </span>
                <a
                  href={`tel:${personal.phone}`}
                  className="text-sm sm:text-base font-bold text-white hover:text-[#B99378] transition-colors truncate block mt-0.5"
                >
                  {personal.phoneDisplay || personal.phone}
                </a>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${personal.phone}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#171717] hover:bg-[#EFEAE3] text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  <Phone size={13} />
                  <span>Call</span>
                </a>

                <button
                  onClick={handleCopyPhone}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Copy phone number to clipboard"
                  type="button"
                >
                  {copiedPhone ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Social Links (LinkedIn, GitHub, Instagram) */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* LinkedIn */}
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#212121] hover:bg-[#2b2b2b] border border-white/10 transition-all flex flex-col justify-between group"
                title="LinkedIn Profile"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    Network
                  </span>
                  <ArrowUpRight size={11} className="text-[#B99378] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                  <FaLinkedinIn size={13} />
                  <span className="truncate">LinkedIn</span>
                </div>
              </a>

              {/* GitHub */}
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#212121] hover:bg-[#2b2b2b] border border-white/10 transition-all flex flex-col justify-between group"
                title="GitHub Profile"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    Source
                  </span>
                  <ArrowUpRight size={11} className="text-[#B99378] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                  <FaGithub size={13} />
                  <span className="truncate">GitHub</span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={personal.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#212121] hover:bg-[#2b2b2b] border border-white/10 transition-all flex flex-col justify-between group"
                title="Instagram Profile"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    Social
                  </span>
                  <ArrowUpRight size={11} className="text-[#B99378] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                  <FaInstagram size={13} className="text-[#B99378]" />
                  <span className="truncate">Instagram</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-[#212121] rounded-2xl p-5 sm:p-6 border border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white">
                Send a Direct Note
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Opens email client pre-filled
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-white/10 focus:border-[#B99378] text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-white/10 focus:border-[#B99378] text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Message
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Hello Manikandan, I'd like to discuss an AI/ML opportunity..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-white/10 focus:border-[#B99378] text-xs text-white placeholder-slate-600 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#B99378] hover:bg-[#a68065] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                <span>Dispatch Email Message</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ─── Integrated Footer (Docked right at bottom of the same viewport) ─── */}
      <div className="shrink-0 -mx-6 sm:-mx-10 lg:-mx-12">
        <Footer />
      </div>
    </section>
  );
}
