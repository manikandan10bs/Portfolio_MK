import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { linkedinPosts } from "../data/socialLinks";
import { personal } from "../data/personal";

function LinkedInPost({ post }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden">
      {!failed ? (
        <div className="relative" style={{ paddingBottom: `${post.height}px` }}>
          <iframe
            src={post.embedUrl}
            height={post.height}
            width="100%"
            frameBorder="0"
            allowFullScreen
            title={`LinkedIn post ${post.id}`}
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="p-8 text-center">
          <FaLinkedinIn size={28} className="text-blue-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-4">
            This LinkedIn post couldn't be embedded. View it directly on LinkedIn.
          </p>
          <a
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all"
          >
            <ExternalLink size={14} />
            Open on LinkedIn
          </a>
        </div>
      )}

      {/* Fallback link always visible */}
      <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-slate-600 text-xs">LinkedIn Post</span>
        <a
          href={post.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={11} /> View on LinkedIn
        </a>
      </div>
    </div>
  );
}

export default function LinkedInActivity() {
  return (
    <section id="linkedin" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Social Presence
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Latest from{" "}
            <span className="gradient-text">LinkedIn</span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
        </motion.div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {linkedinPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="w-full"
            >
              <LinkedInPost post={post} />
            </motion.div>
          ))}
        </div>

        {/* Profile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            <FaLinkedinIn size={18} />
            View LinkedIn Profile
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
