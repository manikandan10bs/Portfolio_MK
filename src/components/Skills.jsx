import { motion } from "framer-motion";
import { skillCategories } from "../data/skills";

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-12 sm:py-16 bg-[#EFEAE3] text-[#171717] border-t border-[#171717]/8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Header — Compact */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-[#171717]/8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold font-mono text-[#B99378]">03</span>
              <span className="w-6 h-px bg-[#171717]/20" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#77736D]">
                TECHNICAL CAPABILITIES
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              Skills & Tools <span className="text-[#B99378]">Taxonomy</span>
            </h2>
          </div>
        </div>

        {/* ─── Compact Responsive Technical Grid ─── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className={`bg-[#F8F6F1] rounded-2xl p-4 sm:p-5 border border-[#171717]/6 hover:border-[#B99378]/40 transition-colors duration-200 flex flex-col justify-between ${
                idx === 2 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#171717]/5">
                  <span className="text-xs font-mono font-bold text-[#171717] flex items-center gap-2">
                    <span className="text-[#B99378]">{cat.number}</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#77736D]">
                    {cat.skills.length}
                  </span>
                </div>

                {/* Compact Skills Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md bg-[#EFEAE3] hover:bg-[#E5DFD7] text-xs font-medium text-[#171717] transition-colors border border-transparent hover:border-[#B99378]/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
