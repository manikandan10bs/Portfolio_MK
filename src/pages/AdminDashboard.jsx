import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../firebase";
import {
  getAllProjectsAdmin,
  saveProject,
  deleteProjectDoc,
  getAllCertificatesAdmin,
  saveCertificate,
  deleteCertificateDoc,
  getPublicProfile,
  saveProfileSettings,
  seedDefaultDataToFirestore,
  uploadFileToStorage,
} from "../services/portfolioService";
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  User,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle,
  XCircle,
  Database,
  Upload,
  RefreshCw,
  Eye,
  AlertCircle,
  ShieldCheck,
  Save,
  X,
  FileCode,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // State
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState(null);

  // Modals
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);

  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleResumeFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    try {
      const downloadUrl = await uploadFileToStorage(file, "resume");
      setProfile((prev) => ({ ...prev, resumePath: downloadUrl }));
      setMessage({
        type: "success",
        text: `Resume PDF (${file.name}) uploaded to Firebase Storage! Click 'Save Profile Changes' to publish.`,
      });
    } catch (err) {
      console.error("Resume upload error:", err);
      setMessage({ type: "error", text: `Failed to upload resume: ${err.message}` });
    } finally {
      setUploadingResume(false);
    }
  };

  // Load Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [projData, certData, profData] = await Promise.all([
        getAllProjectsAdmin(),
        getAllCertificatesAdmin(),
        getPublicProfile(),
      ]);
      setProjects(projData);
      setCertificates(certData);
      setProfile(profData);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setMessage({ type: "error", text: "Failed to load data from Firestore." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm("This will synchronize default projects, verified certificates, and profile to your Firestore database. Continue?")) {
      return;
    }
    setSeeding(true);
    try {
      const res = await seedDefaultDataToFirestore();
      setMessage({
        type: "success",
        text: `Successfully synced ${res.seededProjects} projects and ${res.seededCerts} certificates to Firestore!`,
      });
      await loadDashboardData();
    } catch (err) {
      console.error("Sync error:", err);
      setMessage({ type: "error", text: `Sync failed: ${err.message}` });
    } finally {
      setSeeding(false);
    }
  };

  /* ─── PROJECT HANDLERS ─── */
  const handleOpenAddProject = () => {
    setEditingProject({
      isNew: true,
      title: "",
      subtitle: "",
      category: "Generative AI",
      badge: "AI Application",
      number: `0${projects.length + 1}`,
      description: "",
      architecture: "",
      tech: "",
      github: "https://github.com/manikandan10bs",
      demo: "",
      accentColor: "#38bdf8",
      order: projects.length + 1,
      published: true,
    });
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (p) => {
    setEditingProject({
      ...p,
      isNew: false,
      architecture: Array.isArray(p.features)
        ? p.features.join("\n")
        : Array.isArray(p.architecture)
        ? p.architecture.join("\n")
        : p.features || p.architecture || "",
      tech: Array.isArray(p.technologies)
        ? p.technologies.join(", ")
        : Array.isArray(p.tech)
        ? p.tech.join(", ")
        : p.technologies || p.tech || "",
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      await saveProject(editingProject);
      setProjectModalOpen(false);
      setMessage({ type: "success", text: "Project saved successfully to Firestore." });
      await loadDashboardData();
    } catch (err) {
      setMessage({ type: "error", text: `Failed to save project: ${err.message}` });
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await deleteProjectDoc(id);
      setMessage({ type: "success", text: `Project "${title}" deleted.` });
      await loadDashboardData();
    } catch (err) {
      setMessage({ type: "error", text: `Delete failed: ${err.message}` });
    }
  };

  /* ─── CERTIFICATE HANDLERS ─── */
  const handleOpenAddCert = () => {
    setEditingCert({
      isNew: true,
      title: "",
      issuer: "IBM",
      issuerOrg: "IBM SkillsBuild",
      date: "Issued 2025",
      status: "Verified Credential",
      verifyUrl: "",
      credlyUrl: "",
      credentialId: "",
      summary: "",
      skills: "",
      badgeTag: "Certified",
      accentColor: "#0062FF",
      order: certificates.length + 1,
      published: true,
      image: "",
    });
    setCertModalOpen(true);
  };

  const handleOpenEditCert = (c) => {
    setEditingCert({
      ...c,
      isNew: false,
      skills: Array.isArray(c.skills) ? c.skills.join(", ") : c.skills || "",
    });
    setCertModalOpen(true);
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    try {
      await saveCertificate(editingCert);
      setCertModalOpen(false);
      setMessage({ type: "success", text: "Certificate saved successfully to Firestore." });
      await loadDashboardData();
    } catch (err) {
      setMessage({ type: "error", text: `Failed to save certificate: ${err.message}` });
    }
  };

  const handleDeleteCert = async (id, title) => {
    if (!window.confirm(`Delete certificate "${title}"?`)) return;
    try {
      await deleteCertificateDoc(id);
      setMessage({ type: "success", text: `Certificate "${title}" deleted.` });
      await loadDashboardData();
    } catch (err) {
      setMessage({ type: "error", text: `Delete failed: ${err.message}` });
    }
  };

  /* ─── PROFILE HANDLERS ─── */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await saveProfileSettings(profile);
      setMessage({ type: "success", text: "Profile settings saved to Firestore." });
      await loadDashboardData();
    } catch (err) {
      setMessage({ type: "error", text: `Profile save failed: ${err.message}` });
    }
  };

  const handleFileUpload = async (e, targetField, modalType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAsset(true);
    try {
      const url = await uploadFileToStorage(file, modalType === "project" ? "projects" : "certificates");
      if (modalType === "project") {
        setEditingProject((prev) => ({ ...prev, [targetField]: url }));
      } else {
        setEditingCert((prev) => ({ ...prev, [targetField]: url }));
      }
      setMessage({ type: "success", text: "File uploaded to Firebase Storage." });
    } catch (err) {
      setMessage({ type: "error", text: `Upload failed: ${err.message}` });
    } finally {
      setUploadingAsset(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-full md:w-64 bg-[#0d111a] border-r border-white/10 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xl font-black text-white tracking-wider">
                Mr.MK
              </span>
              <p className="text-[10px] font-mono text-sky-400 uppercase tracking-widest mt-0.5">
                Admin Console
              </p>
            </div>
            <Link
              to="/"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="View Public Website"
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 font-medium text-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard size={17} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FolderGit2 size={17} />
              <span>Manage Projects</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "certificates"
                  ? "bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award size={17} />
              <span>Manage Certificates</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                {certificates.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <User size={17} />
              <span>Profile Settings</span>
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
              MK
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Manikandan N.</p>
              <p className="text-[10px] font-mono text-slate-500 truncate">{ADMIN_EMAIL}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Toast Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center justify-between text-xs font-medium ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ─── TAB: OVERVIEW ─── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">System Overview</h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  AI/ML PORTFOLIO MANAGEMENT CONSOLE
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSeedDefaults}
                  disabled={seeding}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs tracking-wide transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={seeding ? "animate-spin" : ""} />
                  <span>{seeding ? "Syncing..." : "Sync Default Data to Firestore"}</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0d111a] border border-white/10">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Total Projects</p>
                <p className="text-3xl font-black text-white mt-2">{projects.length}</p>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle size={12} /> {projects.filter((p) => p.published).length} Published
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d111a] border border-white/10">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Certificates</p>
                <p className="text-3xl font-black text-white mt-2">{certificates.length}</p>
                <p className="text-[11px] text-sky-400 mt-1 flex items-center gap-1">
                  <ShieldCheck size={12} /> Authentic Credly & Anthropic
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d111a] border border-white/10">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Cloud Firestore</p>
                <p className="text-lg font-bold text-emerald-400 mt-2 flex items-center gap-2">
                  <Database size={16} /> Active & Secured
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Rule: Admin Write Only</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d111a] border border-white/10">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Firebase Auth</p>
                <p className="text-sm font-bold text-white mt-2 truncate">{ADMIN_EMAIL}</p>
                <p className="text-[11px] text-slate-400 mt-1">Role: Super Administrator</p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 rounded-2xl bg-[#0d111a] border border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-400" /> Administrative Security Status
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed font-mono">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <p className="text-white font-semibold">Client-Side Email Authorization:</p>
                  <p>
                    All routes and login endpoints enforce identity checking against <code className="text-sky-300">{ADMIN_EMAIL}</code>. Any other email account is immediately signed out.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <p className="text-white font-semibold">Firestore & Storage Security Rules:</p>
                  <p>
                    Defined in <code className="text-sky-300">firestore.rules</code> and <code className="text-sky-300">storage.rules</code>. Only authenticated tokens with <code className="text-sky-300">{ADMIN_EMAIL}</code> have write and delete privileges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: MANAGE PROJECTS ─── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Manage Projects</h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Add, edit, reorder, or publish case studies
                </p>
              </div>
              <button
                onClick={handleOpenAddProject}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs tracking-wide transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <Plus size={16} /> Add New Project
              </button>
            </div>

            {/* Projects List */}
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-[#0d111a] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-lg font-mono font-black text-slate-500">
                      {p.number || "01"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-white">{p.title}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                          {p.category}
                        </span>
                        {p.published ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Published
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1 max-w-2xl">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditProject(p)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id, p.title)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: MANAGE CERTIFICATES ─── */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Manage Certificates</h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Verified credentials, Credly badges & Anthropic certificates
                </p>
              </div>
              <button
                onClick={handleOpenAddCert}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs tracking-wide transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <Plus size={16} /> Add Certificate
              </button>
            </div>

            {/* Certificates List */}
            <div className="space-y-3">
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-[#0d111a] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-12 h-12 rounded-xl object-contain bg-black/40 border border-white/10 p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                        <Award size={20} />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-white">{c.title}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                          {c.issuer}
                        </span>
                        {c.verifyUrl && (
                          <a
                            href={c.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <span>Verified</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Credential ID: {c.credentialId || "N/A"} • {c.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditCert(c)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteCert(c.id, c.title)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: PROFILE SETTINGS ─── */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-2xl font-black text-white">Profile Settings</h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Update professional titles, introduction and social links
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 bg-[#0d111a] border border-white/10 rounded-2xl p-6">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={profile.title || ""}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="AI/ML & GENERATIVE AI DEVELOPER"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-500 focus:outline-none text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  value={profile.headline || ""}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="Engineering Intelligence. Building the Future with AI."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-500 focus:outline-none text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Short Professional Introduction
                </label>
                <textarea
                  rows={3}
                  value={profile.shortIntro || ""}
                  onChange={(e) => setProfile({ ...profile, shortIntro: e.target.value })}
                  placeholder="I develop intelligent applications using Machine Learning, Generative AI..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-500 focus:outline-none text-sm text-white"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profile.github || ""}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-500 focus:outline-none text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin || ""}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-500 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Resume Document / Download URL
                  </label>
                  {profile.resumePath && (
                    <a
                      href={profile.resumePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Preview Current Resume</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profile.resumePath || ""}
                    onChange={(e) => setProfile({ ...profile, resumePath: e.target.value })}
                    placeholder="/resume/Manikandan_N_AI_ML_Developer_Resume.pdf"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-500 focus:outline-none text-sm text-white"
                  />
                  <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold cursor-pointer transition-colors shrink-0">
                    <Upload size={14} className={uploadingResume ? "animate-bounce" : ""} />
                    <span>{uploadingResume ? "Uploading..." : "Upload New PDF"}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  Default local path: <code className="text-slate-400">/resume/Manikandan_N_AI_ML_Developer_Resume.pdf</code>
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs tracking-wide transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <Save size={15} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ─── PROJECT EDIT / ADD MODAL ─── */}
      {projectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0d111a] border border-white/10 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingProject.isNew ? "Add New AI Project" : `Edit Project: ${editingProject.title}`}
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Project Number (e.g. 01, 02)
                  </label>
                  <input
                    type="text"
                    value={editingProject.number}
                    onChange={(e) => setEditingProject({ ...editingProject, number: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingProject.subtitle}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Category & Badge
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    placeholder="Knowledge Graph RAG / MLOps"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={editingProject.badge}
                    onChange={(e) => setEditingProject({ ...editingProject, badge: e.target.value })}
                    placeholder="Recommendation Engine"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Architecture Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.architecture}
                  onChange={(e) => setEditingProject({ ...editingProject, architecture: e.target.value })}
                  placeholder="Knowledge Graph RAG for contextual retrieval&#10;MLOps latency & drift tracking"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editingProject.tech}
                  onChange={(e) => setEditingProject({ ...editingProject, tech: e.target.value })}
                  placeholder="Python, FastAPI, RAG, PyTorch, Docker"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.github}
                    onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.demo || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, demo: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.published}
                    onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                    className="rounded border-white/20 text-sky-500 focus:ring-0"
                  />
                  <span>Published on public portfolio</span>
                </label>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Display Order:</span>
                  <input
                    type="number"
                    value={editingProject.order || 1}
                    onChange={(e) => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CERTIFICATE EDIT / ADD MODAL ─── */}
      {certModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#0d111a] border border-white/10 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingCert.isNew ? "Add New Certificate" : `Edit Certificate: ${editingCert.title}`}
              </h3>
              <button
                onClick={() => setCertModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Certificate Title
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="IBM / Anthropic"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    value={editingCert.date}
                    onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                    placeholder="Issued 2024"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Credential Verification URL (Credly / Claude Academy)
                </label>
                <input
                  type="url"
                  value={editingCert.verifyUrl}
                  onChange={(e) => setEditingCert({ ...editingCert, verifyUrl: e.target.value })}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={editingCert.credentialId}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Certificate Image URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCert.image}
                    onChange={(e) => setEditingCert({ ...editingCert, image: e.target.value })}
                    placeholder="/certificates/AI_IBM.png"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer">
                    <Upload size={14} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, "image", "cert")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Key Skills Covered (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editingCert.skills}
                  onChange={(e) => setEditingCert({ ...editingCert, skills: e.target.value })}
                  placeholder="Artificial Intelligence, Machine Learning, Deep Learning"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingCert.published}
                    onChange={(e) => setEditingCert({ ...editingCert, published: e.target.checked })}
                    className="rounded border-white/20 text-sky-500 focus:ring-0"
                  />
                  <span>Published on public portfolio</span>
                </label>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Display Order:</span>
                  <input
                    type="number"
                    value={editingCert.order || 1}
                    onChange={(e) => setEditingCert({ ...editingCert, order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
