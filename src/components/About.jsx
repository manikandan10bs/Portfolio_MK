import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, BrainCircuit, Cpu } from "lucide-react";
import { personal } from "../data/personal";

export default function About() {
  return (
    <section
      id="about"
      className="section-padding bg-[#F8F6F1] text-[#171717] border-t border-[#171717]/8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Index */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold font-mono text-[#B99378]">02</span>
          <span className="w-8 h-px bg-[#171717]/20" />
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#77736D]">
            PERSPECTIVE & BACKGROUND
          </span>
        </div>

        {/* Section Heading & Natural Copy */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-16 items-start">
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight leading-[1.08]">
              Exploring modern AI to build{" "}
              <span className="text-[#B99378]">practical intelligent systems.</span>
            </h2>
          </div>

          <div className="lg:col-span-6 space-y-6 text-[#77736D] text-base sm:text-lg leading-relaxed font-normal">
            {personal.aboutText.map((para, idx) => (
              <p key={idx} className="border-l-2 border-[#B99378]/50 pl-4 py-0.5">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* ─── Editorial Highlights Grid ─── */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-[#EFEAE3] rounded-3xl p-6 sm:p-8 border border-[#171717]/6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99378] font-bold">
                01 // FOUNDATION
              </span>
              <h3 className="text-lg font-bold text-[#171717] mt-2 mb-2">
                Engineering Graduate
              </h3>
              <p className="text-xs text-[#77736D] leading-relaxed">
                Strong engineering and computational grounding, applied directly to complex algorithmic challenges.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#171717]/8 text-[11px] font-mono text-[#171717] font-semibold">
              B.E. Degree Foundations
            </div>
          </div>

          <div className="bg-[#EFEAE3] rounded-3xl p-6 sm:p-8 border border-[#171717]/6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99378] font-bold">
                02 // DATA EXPERIENCE
              </span>
              <h3 className="text-lg font-bold text-[#171717] mt-2 mb-2">
                Data Analyst Practice
              </h3>
              <p className="text-xs text-[#77736D] leading-relaxed">
                Nearly one year of hands-on dataset analysis, structured cleaning, standardization, and verification at eClerx.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#171717]/8 text-[11px] font-mono text-[#171717] font-semibold">
              Enterprise Data Integrity
            </div>
          </div>

          <div className="bg-[#171717] text-white rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between shadow-md">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99378] font-bold">
                03 // SPECIALIZATION
              </span>
              <h3 className="text-lg font-bold text-white mt-2 mb-2">
                AI/ML & Generative AI
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Six-month intensive training at Vista Tech, India plus real-world RAG, LLM agent, and computer vision projects.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-mono text-[#B99378] font-semibold flex items-center justify-between">
              <span>Applied Systems</span>
              <ArrowUpRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
