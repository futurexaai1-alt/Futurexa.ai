import { motion } from "framer-motion";
import { Lock, Clock, ArrowRight, Loader2 } from "lucide-react";

interface LockedStateProps {
  userName: string;
  userStatus: string;
  onRequestDemo: () => void;
  isDemoRequested?: boolean;
}

export default function LockedState({
  userName,
  userStatus,
  onRequestDemo,
  isDemoRequested,
}: LockedStateProps) {
  const isPending = userStatus === "PENDING" || userStatus === "LEAD";
  const isDemoRequestedState = isDemoRequested || userStatus === "LEAD";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      {isDemoRequestedState ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
            <Clock className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Demo Request Submitted</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We've received your request{userName ? ` from ${userName}` : ""}. Our team will review it and get back to you within 24-48 hours. You'll receive an email once your workspace is ready.
          </p>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">What's next?</span>
              <br />
              Our team will review your project details and create your personalized workspace. You'll get access to milestones, tasks, tickets, and more.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-inner">
            <Lock className="h-12 w-12 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isPending ? "Almost there!" : "Welcome, " + (userName || "there") + "!"}
          </h2>

          <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-md mx-auto">
            {isPending
              ? "Your email is verified. Submit a demo request to unlock your workspace."
              : "Your account is almost ready. To access your workspace, submit a demo request and our team will activate your account."}
          </p>

          <div className="mb-10 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Submit demo request</p>
                <p className="text-sm text-gray-500">Tell us about your project</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">We review your request</p>
                <p className="text-sm text-gray-500">Within 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Workspace unlocked</p>
                <p className="text-sm text-gray-500">Full access to all features</p>
              </div>
            </div>
          </div>

          <button
            onClick={onRequestDemo}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            Request a Demo
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="mt-4 text-sm text-gray-400">
            No credit card required · Takes 2 minutes
          </p>
        </motion.div>
      )}
    </div>
  );
}