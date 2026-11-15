import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../firebase";
import { Shield, Lock, Mail, ArrowRight, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate("/admin/dashboard", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const verifyAndProceed = async (user) => {
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      await signOut(auth);
      throw new Error(
        `Access Denied: The authenticated account (${user?.email || "unknown"}) is not authorized. Only ${ADMIN_EMAIL} has administrator privileges.`
      );
    }
    navigate("/admin/dashboard", { replace: true });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await verifyAndProceed(userCredential.user);
    } catch (err) {
      console.error("Login error:", err);
      let msg = err.message || "Failed to authenticate. Please check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. Please verify your credentials.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Access temporarily locked. Try again later.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      await verifyAndProceed(result.user);
    } catch (err) {
      console.error("Google Auth error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google sign-in encountered an error.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient grid & lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg bg-white/5 border border-white/10"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-4 shadow-lg shadow-sky-500/10">
            <Shield size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mr.MK Administrator Gateway
          </h1>
          <p className="text-xs font-mono text-slate-400 tracking-wider mt-2">
            SECURE ACCESS RESTRICTED TO AUTHORIZED ADMIN
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0d111a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-all duration-200 hover:border-white/20 disabled:opacity-50 mb-6 cursor-pointer"
          >
            <FaGoogle className="text-red-400" />
            <span>{googleLoading ? "Verifying Google Account..." : "Sign in with Google"}</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0d111a] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest absolute">
              or continue with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manikandan10bs@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-500 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-sky-500 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-sky-500/20 disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Authorize Admin Session"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-start gap-2.5 text-[11px] text-slate-500 leading-relaxed font-mono">
            <CheckCircle2 size={14} className="text-sky-400 shrink-0 mt-0.5" />
            <span>
              Identity enforced via Firebase Authentication. Only <strong>{ADMIN_EMAIL}</strong> will be granted administrative tokens.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
