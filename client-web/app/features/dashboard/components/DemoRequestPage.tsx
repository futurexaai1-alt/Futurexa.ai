import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CalendarClock, DollarSign, Loader2, MessageSquare, Globe, Send, CheckCircle2, Rocket, Users, Shield, Clock, ArrowRight } from "lucide-react";

interface DemoRequestPageProps {
  userName: string;
  userEmail: string;
  apiBaseUrl: string;
  accessToken: string;
  onSuccess?: () => void;
}

const budgetRanges = [
  { value: "under_5k", label: "Under $5,000" },
  { value: "5k_15k", label: "$5,000 – $15,000" },
  { value: "15k_50k", label: "$15,000 – $50,000" },
  { value: "50k_100k", label: "$50,000 – $100,000" },
  { value: "over_100k", label: "$100,000+" },
];

const timelines = [
  { value: "1_3_months", label: "1–3 months" },
  { value: "3_6_months", label: "3–6 months" },
  { value: "6_12_months", label: "6–12 months" },
  { value: "over_12months", label: "12+ months" },
];

const hearAboutUs = [
  { value: "google", label: "Google Search" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "Friend/Colleague Referral" },
  { value: "twitter", label: "Twitter/X" },
  { value: "blog", label: "Blog/Article" },
  { value: "other", label: "Other" },
];

const features = [
  { icon: Rocket, title: "Fast Delivery", desc: "Get your project live quickly" },
  { icon: Users, title: "Dedicated Team", desc: "Professional developers assigned" },
  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade infrastructure" },
  { icon: Clock, title: "24/7 Support", desc: "We're always here to help" },
];

export default function DemoRequestPage({
  userName,
  userEmail,
  apiBaseUrl,
  accessToken,
  onSuccess,
}: DemoRequestPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    projectDescription: "",
    budgetRange: "",
    timeline: "",
    hearAboutUs: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.companyName.trim() || !form.projectDescription.trim()) {
      setError("Please fill in company name and project description");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/lead-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          type: "DEMO",
          description: form.projectDescription,
          companyName: form.companyName,
          budgetRange: form.budgetRange,
          timeline: form.timeline,
          hearAboutUs: form.hearAboutUs,
        }),
      });

      if (res.ok) {
        onSuccess?.();
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit request");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30"
          >
            <CheckCircle2 className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Request Submitted!</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We've received your demo request. Our team will review it and get back to you within <span className="font-bold text-gray-900">24-48 hours</span>.
          </p>
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-lg">
            <p className="text-sm text-gray-500 mb-2">What happens next?</p>
            <p className="text-gray-700">
              Our team will review your project details and create your personalized workspace. You'll receive an email once your account is activated.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-6">
              <Rocket className="h-4 w-4" />
              Get Started with Futurexa
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Tell us about your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">project</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {userName ? `Hi ${userName},` : "Hi there,"} fill out the form and our team will create a personalized demo workspace for you within 24-48 hours.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                >
                  <f.icon className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white">
              <p className="font-bold text-lg mb-2">Why Futurexa?</p>
              <p className="text-blue-100 text-sm leading-relaxed">
                We don't just build software – we partner with you to create solutions that scale. Our dedicated team delivers enterprise-grade applications with transparent communication and ongoing support.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Request Your Demo</h2>
                <p className="text-gray-500 mt-1">We'll create a personalized workspace for you</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      placeholder="Acme Corporation"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={form.projectDescription}
                      onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                      placeholder="Describe your project, goals, and what you'd like to build..."
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      Budget Range
                    </label>
                    <select
                      value={form.budgetRange}
                      onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <CalendarClock className="h-4 w-4 inline mr-1" />
                      Timeline
                    </label>
                    <select
                      value={form.timeline}
                      onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    How did you hear about us?
                  </label>
                  <select
                    value={form.hearAboutUs}
                    onChange={(e) => setForm({ ...form, hearAboutUs: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Select an option</option>
                    {hearAboutUs.map((h) => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}