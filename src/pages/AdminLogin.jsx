import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp, getSession } from "../utils/supabaseClient";
import { Shield, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to admin panel
    getSession().then((session) => {
      if (session) {
        navigate("/admin");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        setToast({
          message: "Registration successful! You can now log in.",
          type: "success",
        });
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        setToast({ message: "Welcome back!", type: "success" });
        setTimeout(() => navigate("/admin"), 1000);
      }
    } catch (err) {
      setToast({ message: err.message || "Authentication failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Decorative gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-violet-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white mb-4 shadow-xl shadow-indigo-500/30">
            <Shield size={28} />
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">
            {isSignUp ? "Create Admin Account" : "Admin Portal"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {isSignUp
              ? "Register as the site administrator"
              : "Sign in to manage your portfolio content"}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-gray-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-gray-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              icon={loading ? Loader2 : ArrowRight}
              iconPosition="right"
              disabled={loading}
            >
              {loading ? "Processing..." : isSignUp ? "Register" : "Sign In"}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-400 hover:text-indigo-300 transition font-medium"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up as Admin"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
