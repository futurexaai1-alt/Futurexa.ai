import type { Route } from "./+types/case-studies";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Case Studies - Futurexa.ai" },
    { name: "description", content: "See how we help companies build the future." },
  ];
}

const cases = [
  {
    id: "fintech-migration",
    client: "Global Fintech Partner",
    title: "Global Fintech Cloud Migration",
    category: "Financial Services",
    outcome: "Reduced infrastructure costs by 31% while improving resilience.",
    metrics: ["99.99% uptime", "3x deployment speed"],
    image: "bg-blue-100",
    color: "blue",
  },
  {
    id: "healthcare-zero-trust",
    client: "National Healthcare Group",
    title: "Healthcare Zero-Trust Rollout",
    category: "Healthcare",
    outcome: "Hardened clinical systems with real-time security telemetry.",
    metrics: ["-48% incident volume", "SOC response in 15 min"],
    image: "bg-teal-100",
    color: "teal",
  },
  {
    id: "retail-data-hub",
    client: "Global Retail Leader",
    title: "Retail Data Intelligence Hub",
    category: "Retail",
    outcome: "Unified inventory, personalization, and forecasting pipelines.",
    metrics: ["+22% revenue lift", "Forecast accuracy 96%"],
    image: "bg-purple-100",
    color: "purple",
  },
  {
    id: "mobility-reliability",
    client: "Mobility & Logistics Leader",
    title: "Platform Reliability Program",
    category: "Mobility",
    outcome: "Proactive monitoring and auto-scaling across 14 regions.",
    metrics: ["-62% outages", "P95 latency -38%"],
    image: "bg-indigo-100",
    color: "indigo",
  },
];

export default function CaseStudies() {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                Our Work
              </h1>
              <p className="max-w-2xl text-xl text-gray-500 mb-12">
                Real results for visionary companies. Explore how we transform challenges into opportunities.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid gap-16">
              {cases.map((study, i) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group grid md:grid-cols-2 gap-8 items-center"
                >
                   <div className={`aspect-[4/3] rounded-[2rem] ${study.image} overflow-hidden relative`}>
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* Placeholder for image */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                        Case Study Image
                      </div>
                   </div>
                   <div className="space-y-6">
                      <span className={`inline-block py-1 px-3 rounded-full bg-${study.color}-50 text-${study.color}-600 text-sm font-bold uppercase tracking-wider`}>
                        {study.category}
                      </span>
                      <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                        {study.title}
                      </h2>
                      <p className="text-lg text-gray-500">
                        {study.outcome}
                      </p>
                      <div className="flex flex-wrap gap-3">
                         {study.metrics.map(metric => (
                            <span key={metric} className="py-1.5 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-700">
                               {metric}
                            </span>
                         ))}
                      </div>
                      <Link 
                        to={`/case-studies/${study.id}`}
                        className="inline-flex items-center text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors group-hover:translate-x-2 duration-300"
                      >
                        Read Case Study <ArrowUpRight className="ml-2 h-5 w-5" />
                      </Link>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
