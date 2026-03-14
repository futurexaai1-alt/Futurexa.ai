import type { Route } from "./+types/industries";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { CheckCircle, ArrowRight, Shield, Zap, Activity } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Industries - Futurexa.ai" },
    { name: "description", content: "Industry expertise across financial services, healthcare, retail, mobility, and enterprise SaaS." },
  ];
}

const industries = [
  {
    name: "Financial Services",
    focus: "Regulatory-aligned cloud migration, fraud prevention, and data resiliency.",
  },
  {
    name: "Healthcare",
    focus: "HIPAA-ready platforms, patient engagement, and interoperability programs.",
  },
  {
    name: "Retail & Commerce",
    focus: "Omnichannel experiences, inventory intelligence, and secure payments.",
  },
  {
    name: "Mobility & Logistics",
    focus: "Real-time telemetry, fleet optimization, and secure device management.",
  },
  {
    name: "Enterprise SaaS",
    focus: "Scalable multi-tenant infrastructure, observability, and retention tooling.",
  },
  {
    name: "Public Sector",
    focus: "Resilient digital services, compliance reporting, and zero-trust adoption.",
  },
];

const outcomes = [
  { title: "Security posture uplift", description: "Reduce risk with continuous monitoring and response automation.", icon: Shield },
  { title: "Platform reliability", description: "Improve uptime with SRE playbooks and incident readiness.", icon: Activity },
  { title: "Operational velocity", description: "Accelerate releases with modern DevOps workflows.", icon: Zap },
];

export default function Industries() {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-50/40 to-indigo-50/40 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                Industry <span className="text-blue-600">Expertise</span>
              </h1>
              <p className="max-w-2xl text-xl text-gray-500 mb-12">
                Futurexa.ai delivers sector-specific playbooks that align with your compliance, customer experience, and operational requirements.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, i) => (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300"
                >
                   <h3 className="text-2xl font-bold text-gray-900 mb-4">{industry.name}</h3>
                   <p className="text-gray-500 leading-relaxed mb-6">{industry.focus}</p>
                   <div className="flex items-center text-blue-600 font-bold text-sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Regulatory-ready
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-32 -mt-32" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6">Typical Outcomes</h2>
               <p className="max-w-2xl mx-auto text-xl text-gray-400">
                  We align strategy, product, and engineering to deliver measurable transformation programs.
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {outcomes.map((outcome, i) => {
                 const Icon = outcome.icon;
                 return (
                  <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                     <div className="h-12 w-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6">
                        <Icon className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{outcome.title}</h3>
                     <p className="text-gray-400 leading-relaxed">{outcome.description}</p>
                  </div>
                 );
               })}
            </div>
         </div>
      </section>

      <section className="py-24">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Start with an industry assessment</h2>
            <p className="text-xl text-gray-500 mb-12">
               Schedule a call to map your current landscape and prioritize initiatives.
            </p>
            <Link to="/contact" className="h-16 px-10 rounded-full bg-blue-600 text-white font-bold text-lg inline-flex items-center hover:bg-blue-700 transition-colors shadow-xl">
               Book an assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
         </div>
      </section>

      <Footer />
    </div>
  );
}
