import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, User } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { personal } from "../data/personal";

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  // Profile photo directly loaded from src/assets/images/profile image mani.png
  const photoPath = personal.profilePhoto;

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(-((y - centerY) / centerY) * 7);
    setRotateY(((x - centerX) / centerX) * 7);
  };

  const handleHeroMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleScrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById("projects");
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 sm:pt-36 sm:pb-16 px-6 sm:px-10 lg:px-12 bg-[#F8F6F1] text-[#171717] overflow-hidden"
    >

      <div className="max-w-7xl mx-auto w-full my-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ─── Left Side: Personal Introduction & CTAs ─── */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#B99378]" />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-[#77736D]">
                {personal.shortIntroLabel || "HELLO, I'M"}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black text-[#171717] tracking-tight leading-[1.02] mb-3"
            >
              Manikandan <span className="text-[#B99378]">N</span>
            </motion.h1>

            {/* Professional Designation */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl font-bold text-[#171717] tracking-tight mb-5"
            >
              {personal.designation}
            </motion.p>

            {/* Personal Introduction */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[#77736D] text-base sm:text-lg leading-relaxed max-w-xl font-normal mb-9"
            >
              {personal.heroIntroduction}
            </motion.p>

            {/* CTA Buttons & Social Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              {/* Explore My Work Button */}
              <a
                href="#projects"
                onClick={handleScrollToProjects}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#171717] text-white hover:bg-[#2b2b2b] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-black/10 group cursor-pointer"
              >
                <span>Explore My Work</span>
                <span className="text-[#B99378] group-hover:translate-x-0.5 transition-transform">➔</span>
              </a>

              {/* Let's Connect Button */}
              <a
                href="#contact"
                onClick={handleScrollToContact}
                className="inline-flex items-center px-7 py-4 rounded-full bg-[#EFEAE3] hover:bg-[#E5DFD7] text-[#171717] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Let's Connect
              </a>

              {/* Minimal LinkedIn and GitHub Icons */}
              <div className="flex items-center gap-3 sm:ml-2">
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Manikandan on GitHub"
                  className="w-11 h-11 rounded-full bg-[#EFEAE3] hover:bg-[#171717] text-[#171717] hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  title="GitHub Profile"
                >
                  <FaGithub size={17} />
                </a>

                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Manikandan on LinkedIn"
                  className="w-11 h-11 rounded-full bg-[#EFEAE3] hover:bg-[#171717] text-[#171717] hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  title="LinkedIn Profile"
                >
                  <FaLinkedinIn size={16} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* ─── Right Side: Responsive 4:3 Portrait Container with 3D Tilt ─── */}
          <div
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            className="lg:col-span-5 flex justify-center items-center"
          >
            {/* SVG ClipPath Definition (Object Bounding Box scaled) */}
            <svg
              width="0"
              height="0"
              className="absolute pointer-events-none opacity-0 overflow-hidden"
              style={{ position: "absolute", width: 0, height: 0 }}
              aria-hidden="true"
            >
              <defs>
                <clipPath id="profile-blob-clip" clipPathUnits="objectBoundingBox">
                  <path d="M 0.4737 0.0272 L 0.4547 0.0281 L 0.4346 0.0297 L 0.4146 0.0321 L 0.3959 0.0350 L 0.3762 0.0387 L 0.3567 0.0432 L 0.3384 0.0481 L 0.3191 0.0542 L 0.3001 0.0614 L 0.2823 0.0691 L 0.2638 0.0786 L 0.2456 0.0895 L 0.2290 0.1012 L 0.2120 0.1152 L 0.1959 0.1309 L 0.1818 0.1472 L 0.1680 0.1662 L 0.1556 0.1868 L 0.1455 0.2075 L 0.1364 0.2307 L 0.1291 0.2550 L 0.1240 0.2787 L 0.1203 0.3045 L 0.1183 0.3308 L 0.1180 0.3558 L 0.1190 0.3824 L 0.1214 0.4089 L 0.1246 0.4337 L 0.1290 0.4597 L 0.1342 0.4854 L 0.1396 0.5092 L 0.1460 0.5342 L 0.1529 0.5587 L 0.1598 0.5815 L 0.1676 0.6054 L 0.1760 0.6290 L 0.1844 0.6509 L 0.1940 0.6740 L 0.2042 0.6968 L 0.2145 0.7179 L 0.2261 0.7401 L 0.2383 0.7620 L 0.2505 0.7822 L 0.2641 0.8032 L 0.2782 0.8236 L 0.2920 0.8422 L 0.3071 0.8611 L 0.3227 0.8790 L 0.3377 0.8949 L 0.3541 0.9105 L 0.3710 0.9246 L 0.3872 0.9365 L 0.4049 0.9475 L 0.4231 0.9566 L 0.4406 0.9635 L 0.4596 0.9689 L 0.4790 0.9723 L 0.4975 0.9738 L 0.5174 0.9735 L 0.5373 0.9714 L 0.5560 0.9678 L 0.5757 0.9624 L 0.5951 0.9554 L 0.6129 0.9476 L 0.6312 0.9380 L 0.6490 0.9272 L 0.6651 0.9160 L 0.6815 0.9031 L 0.6972 0.8891 L 0.7114 0.8749 L 0.7259 0.8589 L 0.7398 0.8418 L 0.7523 0.8249 L 0.7651 0.8059 L 0.7774 0.7861 L 0.7884 0.7666 L 0.7996 0.7452 L 0.8102 0.7230 L 0.8196 0.7016 L 0.8290 0.6783 L 0.8376 0.6546 L 0.8451 0.6319 L 0.8523 0.6074 L 0.8588 0.5826 L 0.8642 0.5589 L 0.8691 0.5334 L 0.8732 0.5076 L 0.8762 0.4830 L 0.8786 0.4566 L 0.8800 0.4300 L 0.8804 0.4047 L 0.8797 0.3778 L 0.8778 0.3511 L 0.8749 0.3261 L 0.8705 0.3001 L 0.8647 0.2748 L 0.8580 0.2518 L 0.8494 0.2285 L 0.8394 0.2064 L 0.8288 0.1869 L 0.8162 0.1677 L 0.8025 0.1500 L 0.7886 0.1347 L 0.7730 0.1200 L 0.7565 0.1067 L 0.7404 0.0954 L 0.7228 0.0847 L 0.7047 0.0751 L 0.6873 0.0669 L 0.6685 0.0592 L 0.6495 0.0524 L 0.6313 0.0468 L 0.6118 0.0415 L 0.5921 0.0371 L 0.5734 0.0337 L 0.5534 0.0308 L 0.5333 0.0287 L 0.5143 0.0275 L 0.4940 0.0269 Z" />
                </clipPath>
              </defs>
            </svg>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX, rotateY }}
              transition={{
                rotateX: { type: "spring", stiffness: 240, damping: 20 },
                rotateY: { type: "spring", stiffness: 240, damping: 20 },
                default: { duration: 0.7, delay: 0.2 },
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
              className="relative w-full max-w-[600px] flex items-center justify-center select-none drop-shadow-[0_20px_45px_rgba(23,23,23,0.10)]"
            >
              {!imgError && photoPath ? (
                <div
                  className="relative w-full aspect-[4/3] max-w-[600px] overflow-hidden select-none transition-transform duration-700 hover:scale-[1.02]"
                  style={{
                    clipPath: "url(#profile-blob-clip)",
                    WebkitClipPath: "url(#profile-blob-clip)",
                    background: "transparent",
                  }}
                >
                  <img
                    src={photoPath}
                    alt="Manikandan N. — AI/ML Developer"
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                /* Fallback Placeholder */
                <div className="flex flex-col items-center justify-center p-8 text-center select-none text-[#77736D]">
                  <User size={40} className="mb-2 text-[#171717]/40" />
                  <span className="text-sm font-semibold">Photograph</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Subtle Scroll Indicator ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="max-w-7xl mx-auto w-full pt-8 flex items-center justify-between text-xs text-[#77736D]"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#171717]">01</span>
          <span className="w-8 h-px bg-[#171717]/20" />
          <span className="uppercase tracking-[0.18em] text-[10px]">INTRODUCTION</span>
        </div>

        <a
          href="#about"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#77736D] hover:text-[#171717] transition-colors"
        >
          <span>SCROLL DOWN</span>
          <ArrowDown size={12} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
