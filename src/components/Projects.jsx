import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Maximize,
  ChevronLeft,
  ChevronRight,
  ScanFace,
  ArrowUpRight,
  ExternalLink,
  X,
  Eye,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { projects as defaultProjects } from "../data/projects";
import { getPublishedProjects } from "../services/portfolioService";

/**
 * Automatic Project Showcase Rotation Interval: 2,300 milliseconds (2.3 seconds)
 */
const PROJECT_ROTATION_INTERVAL = 2300;

/* ─── Interactive 3D Tilt Card (Hero-grade 3D Movement) ─── */
function ThreeDTiltCard({ children, className = "", enableTilt = true }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!enableTilt) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle natural 3D tilt angles
    const rX = -((y - centerY) / centerY) * 9;
    const rY = ((x - centerX) / centerX) * 9;

    setRotateX(rX);
    setRotateY(rY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        mass: 0.6,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      className={`relative w-full h-full ${className}`}
    >
      <div style={{ transform: "translateZ(18px)", transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </div>

      {/* Dynamic 3D Glare / Specular Sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl lg:rounded-3xl transition-opacity duration-300 z-30"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.24) 0%, transparent 60%)`,
          opacity: glare.opacity,
        }}
      />
    </motion.div>
  );
}

/* ─── Compact Spacious Video & Screenshot Player (object-contain with Fullscreen) ─── */
function ProjectMediaViewer({ project, onOpenLightbox, onVideoPlayChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const hasVideo = Boolean(project.video);
  const hasThumbnail = Boolean(project.thumbnail);

  // Sync video playback state with parent to avoid auto-rotating mid-video
  useEffect(() => {
    onVideoPlayChange?.(isPlaying);
    return () => onVideoPlayChange?.(false);
  }, [isPlaying, onVideoPlayChange]);

  // Play video on hover if present
  useEffect(() => {
    if (!videoRef.current || !hasVideo) return;
    if (isHovered) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isHovered, hasVideo]);

  // Pause when scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !hasVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasVideo]);

  const togglePlayClick = (e) => {
    e.stopPropagation();
    if (!videoRef.current || !hasVideo) {
      if (hasThumbnail && onOpenLightbox) {
        onOpenLightbox(project.thumbnail, project.title);
      }
      return;
    }
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    if (hasVideo && videoRef.current) {
      const video = videoRef.current;
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    } else if (hasThumbnail && onOpenLightbox) {
      onOpenLightbox(project.thumbnail, project.title);
    }
  };

  return (
    <ThreeDTiltCard>
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={togglePlayClick}
        className="relative w-full h-full min-h-[220px] sm:min-h-[270px] lg:min-h-[310px] max-h-[440px] aspect-[16/10] rounded-2xl lg:rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl group cursor-pointer select-none flex items-center justify-center"
      >
        {/* Subtle Ambient Shadow & Gloss */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-10" />

        {/* Video layer with object-contain */}
        {hasVideo && (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.thumbnail}
            playsInline
            muted
            loop
            preload="metadata"
            className={`w-full h-full object-contain transition-opacity duration-500 z-10 ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Static Poster Image layer (object-contain to preserve every detail) */}
        {hasThumbnail && (
          <div
            className={`absolute inset-0 w-full h-full flex items-center justify-center p-2 sm:p-4 transition-opacity duration-500 ${
              isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-contain filter contrast-[1.03] transition-transform duration-700 group-hover:scale-[1.01]"
              loading="lazy"
            />
          </div>
        )}

        {/* Controls Bar (3D layer) */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2"
        >
          {/* Fullscreen / Expand Button */}
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="View Fullscreen"
            title="Expand to Fullscreen"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/75 hover:bg-black text-white/80 hover:text-white backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer"
          >
            {hasVideo ? <Maximize size={14} /> : <Eye size={14} />}
          </button>

          {/* Play/Pause Toggle if video is present */}
          {hasVideo && (
            <button
              type="button"
              onClick={togglePlayClick}
              aria-label={isPlaying ? "Pause video demo" : "Play video demo"}
              title={isPlaying ? "Pause" : "Play Demo"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#171717] hover:bg-[#EFEAE3] backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
          )}
        </div>

        {/* Bottom Status Pill (3D layer) */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 flex items-center gap-2"
        >
          <div className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPlaying ? "bg-emerald-400 animate-pulse" : "bg-[#B99378]"
              }`}
            />
            <span>
              {hasVideo
                ? isPlaying
                  ? "Live Screen Recording"
                  : "Hover to Play Video"
                : "Interactive Dashboard Preview"}
            </span>
          </div>
        </div>
      </div>
    </ThreeDTiltCard>
  );
}

/* ─── Computer Vision Deepfake Detection Architecture (Project 04) ─── */
function DeepfakeVisionArchitecturePreview() {
  return (
    <ThreeDTiltCard>
      <div className="relative w-full h-full min-h-[220px] sm:min-h-[270px] lg:min-h-[310px] max-h-[440px] aspect-[16/10] rounded-2xl lg:rounded-3xl bg-[#141414] text-white p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10 group select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(185,147,120,0.18),transparent_70%)] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#B99378]">
            <ScanFace size={16} />
            <span className="font-bold tracking-wider uppercase">CNN + ViT Dual-Stream Forensics</span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#B99378]/20 text-[#B99378] border border-[#B99378]/30">
            30 FPS Stream Inference
          </span>
        </div>

        {/* Dual Backbone Architecture Display */}
        <div className="relative z-10 my-auto grid grid-cols-2 gap-2 sm:gap-3 font-mono text-xs">
          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-lg border border-[#B99378]/40 grid grid-cols-3 gap-0.5 p-1 mb-1.5">
              {[...Array(9)].map((_, i) => (
                <span key={i} className="bg-[#B99378]/50 rounded-xs" />
              ))}
            </div>
            <span className="text-white text-xs font-bold">CNN Spatial Backbone</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Boundary blend artifacts</span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-[#B99378] font-bold text-xs mb-1.5">
              ViT
            </div>
            <span className="text-white text-xs font-bold">Vision Transformer</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Temporal self-attention</span>
          </div>
        </div>

        {/* Telemetry footer */}
        <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400">
          <span>Evaluation: AUC 0.94+</span>
          <span className="text-[#B99378] font-semibold">Binary Forensics</span>
        </div>
      </div>
    </ThreeDTiltCard>
  );
}

/* ─── Main Viewport-Fitted Horizontal Project Showcase Section ─── */
export default function Projects() {
  const [projectList, setProjectList] = useState(defaultProjects);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightbox, setLightbox] = useState({ open: false, src: "", title: "" });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sectionRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch published projects from Firestore (with local fallback)
  useEffect(() => {
    let isMounted = true;
    getPublishedProjects()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setProjectList(data);
        }
      })
      .catch((err) => {
        console.warn("Using local project defaults:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const total = projectList.length;

  // Timer helper: auto-rotates projects every 2.3 seconds (pauses only while video/lightbox is active)
  const startRotationTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total <= 1 || isVideoPlaying || lightbox.open) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, PROJECT_ROTATION_INTERVAL);
  }, [total, isVideoPlaying, lightbox.open]);

  useEffect(() => {
    startRotationTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startRotationTimer]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    startRotationTimer();
  }, [total, startRotationTimer]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
    startRotationTimer();
  }, [total, startRotationTimer]);

  const handleJump = useCallback(
    (idx) => {
      if (idx === currentIndex) return;
      setDirection(idx > currentIndex ? 1 : -1);
      setCurrentIndex(idx);
      startRotationTimer();
    },
    [currentIndex, startRotationTimer]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightbox.open && e.key === "Escape") {
        setLightbox({ open: false, src: "", title: "" });
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, lightbox.open]);

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const current = projectList[currentIndex] || projectList[0];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 70 : -70,
      opacity: 0,
      scale: 0.985,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -70 : 70,
      opacity: 0,
      scale: 0.985,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-[calc(100svh-4.5rem)] lg:h-[calc(100svh-5rem)] lg:min-h-[640px] lg:max-h-[900px] flex flex-col justify-between pt-20 pb-6 sm:pt-24 sm:pb-8 px-6 sm:px-10 lg:px-12 bg-[#F8F6F1] text-[#171717] border-t border-[#171717]/8 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between my-auto">
        {/* ─── Top Control Header Bar: Section Label, CLICKABLE PROJECT NAMES AT TOP, & Arrows ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-5 shrink-0 border-b border-[#171717]/8 pb-3">
          {/* Left: Section Label */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-[#B99378]">04</span>
              <span className="w-5 h-px bg-[#171717]/20" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#77736D]">
                SELECTED WORKS
              </span>
            </div>
          </div>

          {/* Center: CLICKABLE PROJECT NAMES AT THE TOP */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            {projectList.map((p, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => handleJump(idx)}
                  className={`px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    isActive
                      ? "bg-[#171717] text-white font-bold shadow-xs ring-1 ring-black/20"
                      : "bg-[#EFEAE3] hover:bg-[#E4DED4] text-[#77736D] hover:text-[#171717]"
                  }`}
                  title={`View project: ${p.title}`}
                >
                  <span className={isActive ? "text-[#B99378] font-bold" : "opacity-60"}>
                    {p.number || `0${idx + 1}`}
                  </span>
                  <span className="font-semibold">{p.shortTitle || p.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Counter & Prev/Next Arrows */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <div className="px-2.5 py-1 rounded-full bg-[#EFEAE3] border border-[#171717]/8 text-xs font-mono font-bold text-[#171717]">
              0{currentIndex + 1} <span className="text-[#77736D] font-normal">/ 0{total}</span>
            </div>

            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous Project"
              title="Previous Project (Left Arrow)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EFEAE3] hover:bg-[#171717] text-[#171717] hover:text-white border border-[#171717]/8 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              onClick={handleNext}
              type="button"
              aria-label="Next Project"
              title="Next Project (Right Arrow)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EFEAE3] hover:bg-[#171717] text-[#171717] hover:text-white border border-[#171717]/8 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* ─── Horizontal Slide Presentation Frame with 3D Movement ─── */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden my-auto py-1">
          <AnimatePresence custom={direction} mode="wait">
            {current && (
              <motion.div
                key={current.id || currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full flex items-center"
              >
                <div className="w-full bg-[#FAF9F6] rounded-3xl p-5 sm:p-7 lg:p-9 border border-[#171717]/8 shadow-sm grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* ─── Left Column: Project Information & Actions ─── */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    {/* Category & Project Number */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#B99378] text-[#171717] font-mono font-bold text-[10px] uppercase tracking-wider">
                        {current.number}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#77736D] truncate">
                        {current.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#171717] tracking-tight leading-[1.12] mb-1">
                      {current.title}
                    </h3>

                    {/* Subtitle / Focus */}
                    <p className="text-[11px] sm:text-xs font-mono text-[#B99378] font-bold uppercase tracking-wider mb-2.5">
                      {current.subtitle}
                    </p>

                    {/* Concise Description */}
                    <p className="text-xs sm:text-sm text-[#77736D] leading-relaxed mb-3.5 line-clamp-3 lg:line-clamp-4 font-normal">
                      {current.description}
                    </p>

                    {/* Core Features */}
                    {current.features && (
                      <div className="space-y-1 mb-3.5 hidden sm:block">
                        {current.features.slice(0, 3).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-[#171717]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B99378] shrink-0 mt-1" />
                            <span className="leading-snug text-[11px] sm:text-xs">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {current.technologies?.slice(0, 6).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-[#EFEAE3] text-[10px] sm:text-[11px] font-medium text-[#171717]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {current.github && (
                        <a
                          href={current.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#171717] hover:bg-[#2b2b2b] text-white text-[11px] font-bold uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer"
                        >
                          <FaGithub size={13} />
                          <span>Code</span>
                        </a>
                      )}

                      {current.demo && (
                        <a
                          href={current.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B99378] hover:bg-[#a68065] text-white text-[11px] font-bold uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight size={12} />
                        </a>
                      )}

                      {current.demoNote && (
                        <span className="text-[10px] font-mono text-[#77736D] truncate max-w-xs">
                          {current.demoNote}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ─── Right Column: Large Media Presentation Frame with 3D Tilt ─── */}
                  <div className="lg:col-span-7 flex items-center justify-center">
                    {current.id === "deepfake-detection" && !current.thumbnail && !current.video ? (
                      <DeepfakeVisionArchitecturePreview />
                    ) : (
                      <ProjectMediaViewer
                        project={current}
                        onOpenLightbox={(src, title) =>
                          setLightbox({ open: true, src, title })
                        }
                        onVideoPlayChange={setIsVideoPlaying}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Minimal Bottom Hint (Keeps section screen-fitted) ─── */}
        <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#77736D] shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isVideoPlaying || lightbox.open
                  ? "bg-[#B99378]"
                  : "bg-emerald-500 animate-pulse"
              }`}
            />
            <span>
              {isVideoPlaying
                ? "Auto-Rotate Paused (Playing Demo)"
                : "Auto-Rotating (2.3s) • Interactive 3D Gallery"}
            </span>
          </div>
          <span className="hidden sm:inline">
            Use <kbd className="px-1 py-0.5 rounded bg-[#EFEAE3] text-[#171717] font-semibold text-[9px]">←</kbd> <kbd className="px-1 py-0.5 rounded bg-[#EFEAE3] text-[#171717] font-semibold text-[9px]">→</kbd> or click project titles above
          </span>
        </div>
      </div>

      {/* ─── Fullscreen Image Lightbox Modal ─── */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox({ open: false, src: "", title: "" })}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightbox({ open: false, src: "", title: "" })}
              aria-label="Close Preview"
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer z-50"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[88vh] flex flex-col items-center select-none"
            >
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              <p className="text-white/80 font-mono text-xs mt-3">{lightbox.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
