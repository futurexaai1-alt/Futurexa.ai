import type { Route } from "./+types/case-study-detail";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";


export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `${params.slug?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())} - Futurexa.ai Case Study` },
    { name: "description", content: "Case Study Details" },
  ];
}

export default function CaseStudyDetail({ params }: Route.ComponentProps) {
  const title = params.slug?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Link to="/case-studies" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case Studies
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
                How we solved complex challenges with cutting-edge technology.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16">
              <div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
                 <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                   The client faced scalability issues and outdated infrastructure, limiting their ability to innovate and serve customers effectively.
                 </p>
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Solution</h3>
                 <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                   We re-engineered their platform using microservices, implemented CI/CD pipelines, and migrated to a cloud-native architecture.
                 </p>
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Results</h3>
                 <ul className="space-y-4">
                    {[
                      "300% Performance Increase",
                      "50% Cost Reduction",
                      "99.99% Uptime",
                      "Accelerated Time-to-Market"
                    ].map((result, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                        <span className="text-gray-600 font-medium">{result}</span>
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 rounded-[2.5rem] transform -rotate-3" />
                 <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl h-full min-h-[400px] flex items-center justify-center">
                    <p className="text-gray-400 font-medium">Results Visualization Placeholder</p>
                 </div>
              </div>
           </div>
        </div>
      </section>


    </div>
  );
}
