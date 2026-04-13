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
    <div className="app-shell text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative pt-24 pb-10 lg:pt-32 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="floating-mesh-orb top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-50/30 to-indigo-50/30 opacity-50" />
        </div>

        <div className="relative z-10 container">
           <motion.div
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
              <h1 className="font-['Outfit'] text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                Industry <span className="text-gradient-ocean">Expertise</span>
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-gray-500 mb-10">
                Futurexa.ai delivers sector-specific playbooks that align with your compliance, customer experience, and operational requirements.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-24 relative">
        <div className="container">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, i) => (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className="group p-8 rounded-[2rem] glass-morphism-light liquid-shimmer hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500"
                >
                   <h3 className="font-['Outfit'] text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{industry.name}</h3>
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
         <div className="floating-mesh-orb top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 -mr-32 -mt-32" />
         <div className="container relative z-10">
            <div className="text-center mb-16">
               <h2 className="font-['Outfit'] text-3xl md:text-5xl font-bold mb-6">Typical Outcomes</h2>
               <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
                  We align strategy, product, and engineering to deliver measurable transformation programs.
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {outcomes.map((outcome, i) => {
                 const Icon = outcome.icon;
                 return (
                  <div key={i} className="p-8 rounded-3xl glass-morphism-dark group hover:border-blue-500/30 transition-all duration-500">
                     <div className="h-12 w-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
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
         <div className="container text-center">
            <h2 className="font-['Outfit'] text-3xl md:text-4xl font-bold text-gray-900 mb-6">Start with an industry assessment</h2>
            <p className="text-xl text-gray-500 mb-12">
               Schedule a call to map your current landscape and prioritize initiatives.
            </p>
            <Link to="/contact" className="primary-button inline-flex items-center text-lg px-10 py-5">
               Book an assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
         </div>
      </section>

      <Footer />
    </div>
  );
}
