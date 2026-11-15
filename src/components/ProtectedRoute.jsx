import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../firebase";
import { Loader2, ShieldAlert } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
    authorized: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setAuthState({
          loading: false,
          user,
          authorized: true,
        });
      } else {
        setAuthState({
          loading: false,
          user: null,
          authorized: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (authState.loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-slate-300">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
        </div>
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-sky-400">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  if (!authState.authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
