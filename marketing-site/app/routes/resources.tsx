import type { Route } from "./+types/resources";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { BookOpen, FileText, Wrench, CheckSquare, ArrowRight } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resources - Futurexa.ai" },
    { name: "description", content: "Playbooks, reports, and readiness toolkits curated for modern IT leadership." },
  ];
}

const resources = [
  {
    title: "Cloud migration readiness",
    description: "A step-by-step assessment to de-risk modernization programs.",
    label: "Playbook",
    icon: BookOpen,
  },
  {
    title: "Security operations benchmark",
    description: "Key metrics for SOC performance, automation, and response time.",
    label: "Report",
    icon: FileText,
  },
  {
    title: "AI enablement blueprint",
    description: "Framework to move from pilots to production AI capabilities.",
    label: "Toolkit",
    icon: Wrench,
  },
  {
    title: "Incident response checklist",
    description: "Operational checklist for high-severity events and audits.",
    label: "Checklist",
    icon: CheckSquare,
  },
];

export default function Resources() {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                Knowledge <span className="text-blue-600">Hub</span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-gray-500 mb-12">
                Executive playbooks, transformation guides, and AI readiness toolkits curated for leaders building the future.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 gap-8">
              {resources.map((resource, i) => {
                const Icon = resource.icon;
                return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-[2rem] border border-gray-100 bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 flex items-start gap-6"
                >
                   <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                           {resource.label}
                         </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                      <p className="text-gray-500 leading-relaxed mb-6">{resource.description}</p>
                      <button className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        Download Now <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                   </div>
                </motion.div>
                );
              })}
           </div>
        </div>
      </section>

      <section className="py-24 bg-blue-600 text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center md:text-left">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a custom briefing?</h2>
               <p className="text-xl text-blue-50">
                  We build tailored research for your board, leadership team, or program office to navigate complex IT landscapes.
               </p>
            </div>
            <Link to="/contact" className="h-16 px-10 rounded-full bg-white text-blue-600 font-bold text-lg flex items-center justify-center hover:bg-blue-50 transition-colors shadow-xl shrink-0">
               Request a briefing
            </Link>
         </div>
      </section>

      <Footer />
    </div>
  );
}
