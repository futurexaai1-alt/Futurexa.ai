import { JPGSequenceScroller } from "../components/JPGSequenceScroller";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Globe } from "lucide-react";
import { Link } from "react-router";

export default function NewHome() {
  return (
    <main className="bg-slate-900 min-h-screen text-white selection:bg-blue-500/30">
      {/* Hero Section with Scroll Sequence */}
      <section className="relative">
        <JPGSequenceScroller 
          directory="/assets/hero-sequence"
          frameCount={82}
          startFrame={0}
          fileNamePrefix="fcd1d6ee-96f5-45e5-97f3-036f7eefe3ab_"
          extension="webp"
          padding={3}
          scrollDistance="400%"
          className="brightness-75"
        />
        
        
        {/* Cinematic Overlays removed per user request for a cleaner scroll experience */}

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-50">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">Scroll to Explore</div>
          <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent" />
        </div>
      </section>

      {/* Glassmorphism Feature Grid */}
      <section className="py-32 px-6 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Cyber Defense", 
                desc: "Military-grade encryption and real-time threat detection for the modern enterprise ecosystem." 
              },
              { 
                icon: Zap, 
                title: "Neural Engine", 
                desc: "Proprietary AI models trained on your private data to automate workflows and predict market shifts." 
              },
              { 
                icon: Globe, 
                title: "Global Mesh", 
                desc: "Low-latency cloud infrastructure distributed across 6 continents for sub-10ms response times." 
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Concept Call to Action */}
      <section className="py-40 px-6 relative">
         <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Ready to <span className="text-blue-500 italic">Redefine</span> Possible?
            </h2>
            <p className="text-slate-400 text-lg mb-12 font-medium">
              Join 500+ industry leaders who have already migrated to the Futurexa ecosystem. 
              Efficiency is no longer an option—it's survival.
            </p>
            <Link to="/contact" className="inline-flex h-16 px-12 rounded-full bg-white text-slate-900 font-bold items-center gap-3 hover:bg-slate-200 transition-all shadow-xl shadow-white/10 uppercase tracking-widest text-sm">
              Forge Your Future
            </Link>
         </div>
      </section>


    </main>
  );
}
