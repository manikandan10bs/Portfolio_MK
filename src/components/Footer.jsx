import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { personal } from "../data/personal";

export default function Footer({ profile }) {
  const p = profile || personal;
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#171717] text-white border-t border-white/10 py-3.5 px-6 sm:px-10 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-base font-bold text-white tracking-tight">
              {p.brandName || "Mr.MK"}
            </span>
            <span className="text-[10px] font-mono text-[#B99378] uppercase tracking-wider hidden sm:inline">
              // {p.designation || p.title}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            {p.location || "India"} • <a href={`mailto:${p.email}`} className="hover:text-white transition-colors">{p.email}</a> • <a href={`tel:${p.phone}`} className="hover:text-white transition-colors">{p.phoneDisplay || p.phone}</a>
          </p>
        </div>

        {/* Social Links & Back to Top */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#171717] flex items-center justify-center transition-colors"
              title="GitHub Profile"
            >
              <FaGithub size={11} />
            </a>

            <a
              href={p.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#171717] flex items-center justify-center transition-colors"
              title="LinkedIn Profile"
            >
              <FaLinkedinIn size={11} />
            </a>

            <a
              href={p.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#171717] flex items-center justify-center transition-colors"
              title="Instagram Profile"
            >
              <FaInstagram size={11} />
            </a>
          </div>

          <button
            onClick={handleScrollTop}
            aria-label="Scroll to top"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#171717] text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp size={10} />
          </button>
        </div>
      </div>

      {/* Copyright Note */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-slate-500 gap-1">
        <p>© {currentYear} {p.name || personal.name}. All rights reserved.</p>
        <p className="text-slate-400">
          Machine Learning • Large Language Models • RAG • Computer Vision
        </p>
      </div>
    </footer>
  );
}
