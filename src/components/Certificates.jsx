import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Eye,
  X,
  Sparkles,
} from "lucide-react";
import { certificates as defaultCertificates } from "../data/certificates";
import { getPublishedCertificates, subscribePublishedCertificates } from "../services/portfolioService";

/**
 * Automatic Rotation Interval: 1,800 milliseconds (1.8 seconds)
 * Loops indefinitely without stopping on hover or interaction.
 */
const ROTATION_INTERVAL = 1800;

export default function Certificates() {
  const [certList, setCertList] = useState(defaultCertificates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCertModal, setSelectedCertModal] = useState(null);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const total = certList.length;

  // Real-time Firestore Database subscription
  useEffect(() => {
    const unsubscribe = subscribePublishedCertificates((data) => {
      if (data && data.length > 0) {
        setCertList(data);
      }
    });
    return () => unsubscribe?.();
  }, []);

  // Timer helper: starts or restarts the 1.8-second rotation
  const startRotationTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total <= 1) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, ROTATION_INTERVAL);
  };

  // Continuous automatic rotation: runs indefinitely, never pauses on hover
  useEffect(() => {
    startRotationTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  // Manual navigation handlers that preserve and continue automatic rotation
  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    startRotationTimer();
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
    startRotationTimer();
  };

  const handleDotClick = (idx) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    startRotationTimer();
  };

  const current = certList[currentIndex] || certList[0];

  const slideVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
      scale: 0.985,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      scale: 0.985,
      transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      id="certificates"
      className="section-padding bg-[#EFEAE3] text-[#171717] border-t border-[#171717]/8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Index */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold font-mono text-[#B99378]">06</span>
          <span className="w-8 h-px bg-[#171717]/20" />
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#77736D]">
            ACCREDITATIONS & CREDENTIALS
          </span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight leading-[1.08]">
              Verified credentials & <br />
              <span className="text-[#B99378]">certifications.</span>
            </h2>
            <p className="text-sm text-[#77736D] mt-2 max-w-lg font-normal">
              Official accreditations from IBM and Anthropic Claude Academy with live public verification links.
            </p>
          </div>

          {/* Autoplay Pulse & Manual Prev/Next Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F6F1] border border-[#171717]/8 text-[11px] font-mono text-[#77736D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B99378] animate-pulse" />
              <span>Auto-Rotating (1.8s)</span>
            </div>

            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous certificate"
              title="Previous certificate"
              className="w-10 h-10 rounded-full bg-[#F8F6F1] hover:bg-[#171717] text-[#171717] hover:text-white border border-[#171717]/8 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="px-3 py-1.5 rounded-full bg-[#F8F6F1] border border-[#171717]/8 text-xs font-mono font-bold text-[#171717] select-none">
              0{currentIndex + 1} / 0{total}
            </div>

            <button
              onClick={handleNext}
              type="button"
              aria-label="Next certificate"
              title="Next certificate"
              className="w-10 h-10 rounded-full bg-[#F8F6F1] hover:bg-[#171717] text-[#171717] hover:text-white border border-[#171717]/8 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ─── Animated Certificate Slider (Continuous 1.8s) ─── */}
        <div className="relative min-h-[460px] sm:min-h-[440px] flex items-center justify-center">
          <AnimatePresence custom={direction} mode="wait">
            {current && (
              <motion.div
                key={current.id || currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full bg-[#F8F6F1] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#171717]/8 shadow-md relative overflow-hidden"
              >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left: Large Visual Certificate Frame */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center">
                    <div
                      onClick={() => setSelectedCertModal(current)}
                      className="relative w-full max-w-sm aspect-[4/3] rounded-2xl bg-[#EFEAE3] border border-[#171717]/8 p-4 flex items-center justify-center overflow-hidden shadow-xs cursor-pointer group"
                    >
                      {current.image ? (
                        <img
                          src={current.image}
                          alt={`${current.title} Certificate`}
                          className="w-full h-full object-contain filter contrast-[1.02] group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#77736D]">
                          <Award size={48} className="text-[#B99378] mb-2" />
                          <span className="text-xs font-mono uppercase tracking-wider">
                            Official Certificate
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-[#171717]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-2xs">
                        <Eye size={16} />
                        <span>Inspect Certificate</span>
                      </div>
                    </div>

                    <p className="text-[11px] font-mono text-[#77736D] mt-3 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-[#B99378]" />
                      <span>Verified by {current.issuerOrg || current.issuer}</span>
                    </p>
                  </div>

                  {/* Right: Editorial Certificate Details */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    {/* Issuing Organization Label */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#B99378]" />
                      <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-[#77736D]">
                        {current.issuer} // {current.issuerOrg || "Accreditation"}
                      </span>
                    </div>

                    {/* Certificate Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171717] tracking-tight mb-3 leading-[1.12]">
                      {current.title}
                    </h3>

                    {/* Metadata: Status & Credential ID */}
                    <div className="flex items-center gap-4 flex-wrap text-xs font-mono text-[#77736D] mb-6">
                      <span>
                        Status: <strong className="text-[#171717]">{current.date || "Verified"}</strong>
                      </span>
                      {current.credentialId && (
                        <span className="truncate max-w-xs">
                          ID: <code className="text-[#171717] font-semibold">{current.credentialId}</code>
                        </span>
                      )}
                    </div>

                    {/* Verified Topics / Skills */}
                    {current.skills && (
                      <div className="mb-8">
                        <p className="text-[11px] font-mono uppercase tracking-widest text-[#77736D] mb-2.5">
                          Key Competencies Verified:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {current.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-3 py-1 rounded-full bg-[#EFEAE3] text-xs font-medium text-[#171717]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      {current.verifyUrl && (
                        <a
                          href={current.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] hover:bg-[#2b2b2b] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
                        >
                          <ShieldCheck size={14} className="text-[#B99378]" />
                          <span>Verify Certificate</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedCertModal(current)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EFEAE3] hover:bg-[#E5DFD7] text-[#171717] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>View Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Pagination Dots: Clickable, Resumes 1.8s Auto-Rotation ─── */}
        <div className="flex justify-center items-center gap-2.5 mt-8">
          {certList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              aria-label={`Jump to certificate 0${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-8 bg-[#171717]"
                  : "w-2 bg-[#171717]/25 hover:bg-[#171717]/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── High-Definition Certificate Modal ─── */}
      <AnimatePresence>
        {selectedCertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-3xl bg-[#F8F6F1] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#171717]/10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10 mb-4">
                <div>
                  <h4 className="text-base font-bold text-[#171717]">
                    {selectedCertModal.title}
                  </h4>
                  <p className="text-xs font-mono text-[#77736D]">
                    {selectedCertModal.issuer} • {selectedCertModal.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCertModal(null)}
                  className="p-2 rounded-full bg-[#EFEAE3] hover:bg-[#171717] text-[#171717] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="w-full max-h-[62vh] flex items-center justify-center bg-[#EFEAE3] rounded-2xl p-4 overflow-auto">
                <img
                  src={selectedCertModal.image}
                  alt={selectedCertModal.title}
                  className="max-h-[58vh] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>

              {selectedCertModal.verifyUrl && (
                <div className="mt-4 pt-4 border-t border-[#171717]/10 flex justify-end">
                  <a
                    href={selectedCertModal.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] text-white hover:bg-[#2b2b2b] text-xs font-bold uppercase tracking-wider"
                  >
                    <span>Open Official Verification</span>
                    <ExternalLink size={12} className="text-[#B99378]" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
