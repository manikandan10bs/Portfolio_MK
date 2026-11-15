import { motion } from "framer-motion";
import { timelineStages } from "../data/experience";

export default function Experience() {
  return (
    <section
      id="experience"
      className="section-padding bg-[#F8F6F1] text-[#171717] border-t border-[#171717]/8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Index */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold font-mono text-[#B99378]">05</span>
          <span className="w-8 h-px bg-[#171717]/20" />
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#77736D]">
            PROGRESSION PATHWAY
          </span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight leading-[1.08]">
              Career Journey & <br />
              <span className="text-[#B99378]">Experience Timeline.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#77736D] max-w-md font-normal leading-relaxed">
            Connected evolution from engineering fundamentals to professional enterprise data analytics, advancing into applied AI/ML and Generative AI systems.
          </p>
        </div>

        {/* ─── Visual Connected Timeline / Graph ─── */}
        <div className="relative max-w-4xl mx-auto">
          {/* Continuous Vertical Timeline Line */}
          <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-[2px] bg-[#171717]/10" />

          {/* Connected Stages */}
          <div className="space-y-12 sm:space-y-16">
            {timelineStages.map((item, idx) => (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex items-start gap-6 sm:gap-10"
              >
                {/* Milestone Node Marker */}
                <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#EFEAE3] border-2 border-[#171717]/10 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 hover:border-[#B99378]">
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#171717]">
                    {item.stage}
                  </span>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-[#EFEAE3] rounded-3xl p-6 sm:p-8 border border-[#171717]/6 hover:border-[#B99378]/50 transition-all duration-200 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
                      {item.title}
                    </h3>
                    <span className="text-xs font-mono font-semibold text-[#B99378]">
                      {item.period}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[#77736D] uppercase tracking-wider mb-3">
                    {item.subtitle}
                  </p>

                  <p className="text-sm text-[#77736D] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Responsibilities / Points */}
                  <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-[#171717]/6">
                    {item.highlights.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[#171717]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B99378] shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
