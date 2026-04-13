import type { Route } from "./+types/service-detail";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";


export function meta({ params }: Route.MetaArgs) {
  const serviceName = params.slug?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());
  return [
    { title: `${serviceName} - Futurexa.ai` },
    { name: "description", content: `Explore our advanced ${serviceName} solutions designed for the future.` },
  ];
}

export default function ServiceDetail({ params }: Route.ComponentProps) {
  const title = params.slug?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());
  
  const imageMap: Record<string, string> = {
    "cloud-services": "/assets/services/cloud-services.png",
    "cybersecurity": "/assets/services/cybersecurity.png",
    "managed-services": "/assets/services/managed-services.png",
    "data-analytics": "/assets/services/data-analytics.png",
    "software-development": "/assets/services/software-development.png",
    "devops-automation": "/assets/services/devops-automation.png",
    "ai-ml-implementation": "/assets/services/ai-data.png",
    "network-infrastructure": "/assets/services/network-infrastructure.png",
  };
  
  const imageSrc = imageMap[params.slug || ""] || "/assets/services/cloud-services.png";

  return (
    <div className="bg-[var(--page-background)] text-slate-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 min-h-screen">
      {/* Permanent Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="floating-mesh-orb top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-b from-blue-100/30 to-sky-200/10 opacity-60 animate-pulse" />
        <div className="floating-mesh-orb top-[40%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-sky-100/30 to-indigo-50/10 opacity-50 animate-pulse" style={{ animationDelay: "-5s", animationDuration: "15s" }} />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-8 overflow-hidden">
        <div className="container relative z-10">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5 }}
           >
             <Link to="/services" className="group inline-flex items-center text-sm font-bold text-blue-600 mb-4 transition-colors px-4 py-2 glass-morphism rounded-full hover:bg-blue-600 hover:text-white">
               <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Services
             </Link>
           </motion.div>
           
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
           >
              <h1 className="font-['Outfit'] text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
                {title?.split(' ').map((word, i) => (
                  <span key={i} className={i === title?.split(' ').length - 1 ? "text-gradient-ocean" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="max-w-3xl text-lg md:text-xl text-slate-500 leading-relaxed font-light">
                Engineering a new standard of excellence with precision-crafted {title?.toLowerCase()} strategies.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-16 lg:pb-24 relative z-10 pt-4">
        <div className="container">
           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass-morphism p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/40 flex flex-col justify-center"
              >
                 <h2 className="font-['Outfit'] text-2xl md:text-3xl font-bold text-slate-900 mb-6">Service Architecture</h2>
                 <p className="text-base lg:text-lg text-slate-600 mb-8 leading-relaxed font-light">
                   We specialize in delivering high-performance, scalable, and secure {title?.toLowerCase()} systems. Our team leverages the latest neural architectures and cloud-native frameworks to build products that redefine the digital landscape.
                 </p>
                 <h3 className="font-['Outfit'] text-lg font-bold text-slate-900 mb-4 uppercase tracking-widest">Key Capabilities</h3>
                 <ul className="space-y-4">
                    {[
                      "Custom Architecture Design",
                      "Scalable & Secure Implementation",
                      "Integration with Modern Tech Stack",
                      "24/7 Support & Managed Optimization",
                      "Performance & Reliability Engineering"
                    ].map((feature, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-slate-600 font-medium">{feature}</span>
                      </motion.li>
                    ))}
                 </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative min-h-[350px] lg:min-h-full group"
              >
                 <div className="absolute inset-0 bg-blue-600/5 rounded-[2.5rem] transform rotate-3 blur-2xl" />
                 <div className="relative h-full w-full glass-morphism border border-white/60 rounded-[2.5rem] overflow-hidden p-2">
                   <div className="absolute inset-0 liquid-shimmer opacity-20 z-10 pointer-events-none" />
                   <img 
                     src={imageSrc} 
                     alt={title} 
                     className="w-full h-full object-cover rounded-[2rem] shadow-2xl transition-transform duration-700 group-hover:scale-105"
                   />
                 </div>
              </motion.div>
           </div>
        </div>
      </section>


    </div>
  );
}
