import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { personal } from "../data/personal";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      const sections = ["home", "about", "skills", "projects", "experience", "certificates", "contact"];
      let current = "home";
      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) current = section;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F8F6F1]/94 backdrop-blur-md border-b border-[#171717]/8 shadow-xs"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between h-20 sm:h-22">
            {/* ─── Brand Logo: Mr.MK ─── */}
            <Link
              to="/admin/login"
              className="group flex items-center gap-2 cursor-pointer"
              title="Mr.MK — Admin Login"
              aria-label="Mr.MK Home"
            >
              <span className="text-2xl sm:text-[26px] font-black text-[#171717] tracking-tight group-hover:opacity-85 transition-opacity">
                {personal.brandName || "Mr.MK"}
              </span>
            </Link>

            {/* ─── Desktop Navigation Links (7 items) ─── */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 relative py-1 ${
                      isActive
                        ? "text-[#171717]"
                        : "text-[#77736D] hover:text-[#171717]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B99378] rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* ─── Far Right CTA & Mobile Toggle ─── */}
            <div className="flex items-center gap-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#contact");
                }}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] hover:bg-[#2b2b2b] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
              >
                <span>Let's Talk</span>
                <ArrowUpRight size={13} className="text-[#B99378]" />
              </a>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-xl text-[#171717] hover:bg-[#EFEAE3] transition-colors cursor-pointer"
                aria-label="Toggle mobile navigation menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu Drawer ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-20 z-40 lg:hidden bg-[#F8F6F1]/98 backdrop-blur-xl border-b border-[#171717]/8 px-6 py-8 shadow-xl"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-base font-semibold text-[#171717] hover:text-[#B99378] py-1 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-[#171717]/10 flex items-center justify-between">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact");
                  }}
                  className="text-xs font-semibold uppercase tracking-wider text-[#B99378]"
                >
                  Get in touch →
                </a>
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-[#77736D] hover:text-[#171717]"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
