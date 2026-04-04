import type { Route } from "./+types/signup";
import { Link, useLoaderData, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { createSupabaseBrowserClient } from "../utils/supabase";

type LoaderData = {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  supabaseConfigured: boolean;
};

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as any;
  const supabaseUrl = env?.SUPABASE_URL ?? null;
  const supabaseAnonKey = env?.SUPABASE_ANON_KEY ?? null;
  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  } satisfies LoaderData;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Join Futurexa | Create Your Account" },
    {
      name: "description",
      content:
        "Join futurexa.ai and start managing your projects with a premium workspace.",
    },
  ];
}

export default function SignUp(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, supabaseConfigured } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
  }, [supabaseUrl, supabaseAnonKey]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!cancelled && data.session) {
        navigate("/dashboard", { replace: true });
      }
    }

    checkSession().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [navigate, supabase]);

  async function handleOAuthSignUp(provider: "google" | "github") {
    if (!supabase) return;
    setIsLoading(true);
    setErrorMessage("");
    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }

  async function handleEmailSignUp(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setIsLoading(true);
    setErrorMessage("");
    const origin = window.location.origin;

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] h-[780px] w-[780px] rounded-full bg-blue-100/50 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[620px] w-[620px] rounded-full bg-purple-100/40 blur-[110px]" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white/80 border border-white/60 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl shadow-blue-100/20 relative z-10"
        >
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Check your email
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We&apos;ve sent a verification link to{" "}
            <span className="text-gray-900 font-semibold">
              {formData.email}
            </span>
            . Please check your inbox to activate your account.
          </p>
          <button
            onClick={() => navigate("/signin")}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            Go to Sign In
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100 font-sans relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-[780px] w-[780px] rounded-full bg-blue-100/50 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[620px] w-[620px] rounded-full bg-purple-100/40 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-white/40 border-r border-white/60 backdrop-blur-sm">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-600/30">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              futurexa.ai
            </span>
          </Link>

          <div className="max-w-lg">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold leading-tight mb-6 text-gray-900"
            >
              The future of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                workspace
              </span>{" "}
              management.
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 leading-relaxed font-medium"
            >
              Join thousands of teams shipping faster with Futurexa. Integrated
              projects, tasks, and billing in one unified interface.
            </motion.p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-10 w-10 rounded-full border-2 border-white bg-gray-100"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 font-semibold tracking-tight">
              Join 500+ professionals
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md bg-white/70 border border-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-100/30"
          >
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-600/30">
                  F
                </div>
              </Link>
            </div>

            <motion.div variants={itemVariants} className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-gray-500 font-medium">
                Get started with your premium workspace today.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <button
                onClick={() => handleOAuthSignUp("google")}
                disabled={!supabaseConfigured}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group shadow-sm"
              >
                <svg
                  className="h-5 w-5 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-bold text-sm text-gray-700">Google</span>
              </button>
              <button
                onClick={() => handleOAuthSignUp("github")}
                disabled={!supabaseConfigured}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group shadow-sm"
              >
                <Github className="h-5 w-5 text-gray-900 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm text-gray-700">GitHub</span>
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/10 px-4 text-gray-400 font-bold tracking-widest backdrop-blur-md">
                  Or continue with
                </span>
              </div>
            </motion.div>

            <motion.form
              variants={itemVariants}
              onSubmit={handleEmailSignUp}
              className="space-y-4"
            >
              {!supabaseConfigured && (
                <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>Supabase env missing in this Cloudflare environment (SUPABASE_URL, SUPABASE_ANON_KEY).</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-500 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300 shadow-sm"
                    value={formData.fullName}
                    onChange={(event) =>
                      setFormData({ ...formData, fullName: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-500 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300 shadow-sm"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-500 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300 shadow-sm"
                    value={formData.password}
                    onChange={(event) =>
                      setFormData({ ...formData, password: event.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading || !supabaseConfigured}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </motion.form>

            <motion.p
              variants={itemVariants}
              className="mt-8 text-center text-gray-500 text-sm font-medium"
            >
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
