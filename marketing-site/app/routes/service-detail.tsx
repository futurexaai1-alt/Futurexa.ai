import type { Route } from "./+types/service-detail";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `${params.slug?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())} - Futurexa.ai` },
    { name: "description", content: "Service details" },
  ];
}

export default function ServiceDetail({ params }: Route.ComponentProps) {
  const title = params.slug?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Link to="/services" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
           </Link>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
                {title}
              </h1>
              <p className="max-w-3xl text-xl text-gray-500 leading-relaxed">
                Comprehensive solutions designed to accelerate your growth and future-proof your business.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16">
              <div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
                 <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                   We specialize in delivering high-performance, scalable, and secure {title?.toLowerCase()} solutions. Our team leverages the latest technologies to build products that stand out in the digital landscape.
                 </p>
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                 <ul className="space-y-4">
                    {[
                      "Custom Architecture Design",
                      "Scalable & Secure Implementation",
                      "Integration with Modern Tech Stack",
                      "24/7 Support & Maintenance",
                      "Performance Optimization"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0" />
                        <span className="text-gray-600 font-medium">{feature}</span>
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-[2.5rem] transform rotate-3" />
                 <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl h-full min-h-[400px] flex items-center justify-center">
                    <p className="text-gray-400 font-medium">Service Visualization Placeholder</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
