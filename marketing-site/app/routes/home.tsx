import type { Route } from "./+types/home";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, CheckCircle, Zap, Globe, Shield, Activity } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Futurexa.ai - The Future of SaaS" },
    { name: "description", content: "Build faster, scale better." },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home(_: Route.ComponentProps) {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-purple-50/50 rounded-full blur-[100px] opacity-60" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-t from-indigo-50/40 to-transparent rounded-full blur-[120px]" />
         </div>
         
         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
               <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/80 border border-blue-100 text-blue-600 text-sm font-semibold mb-8 shadow-sm backdrop-blur-sm">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                 </span>
                 v2.0 is now live
               </span>
               <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                 Build the future <br/>
                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
                   without limits.
                 </span>
               </h1>
               <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed">
                 We specialize in turning complex concepts into practical, profitable solutions. <br className="hidden md:block"/> 14 years of building digital futures with 500+ projects delivered.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link to="/contact" className="group h-14 px-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:scale-105 hover:shadow-blue-600/40">
                   Start Building Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link to="/about" className="h-14 px-8 rounded-full bg-white text-gray-900 font-bold flex items-center justify-center border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all hover:scale-105">
                   View Demo
                 </Link>
               </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.4, duration: 1, type: "spring" }}
              className="mt-24 relative mx-auto max-w-6xl perspective-1000"
            >
               <div className="rounded-[2rem] bg-white/40 p-2 shadow-2xl shadow-blue-200/40 ring-1 ring-white/60 backdrop-blur-md transform transition-transform duration-500 hover:scale-[1.01]">
                 <div className="rounded-[1.5rem] bg-white overflow-hidden aspect-[16/9] relative group border border-blue-50/50 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
                       {/* Mock UI Interface */}
                       <div className="w-full h-full p-8 flex flex-col">
                          <div className="flex items-center justify-between mb-8">
                             <div className="flex gap-4">
                                <div className="w-32 h-8 bg-gray-100 rounded-lg animate-pulse" />
                                <div className="w-20 h-8 bg-gray-50 rounded-lg" />
                             </div>
                             <div className="flex gap-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-full" />
                                <div className="w-8 h-8 bg-blue-100 rounded-full" />
                             </div>
                          </div>
                          <div className="flex gap-8 h-full">
                             <div className="w-64 bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 hidden md:block">
                                <div className="space-y-3">
                                   {[1,2,3,4,5].map(i => (
                                      <div key={i} className="h-10 w-full bg-white rounded-xl shadow-sm border border-gray-50" />
                                   ))}
                                </div>
                             </div>
                             <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-bl-full pointer-events-none" />
                                <div className="h-12 w-1/3 bg-gray-100 rounded-xl mb-6 animate-pulse" />
                                <div className="grid grid-cols-3 gap-6 mb-8">
                                   <div className="h-32 bg-blue-50/50 rounded-2xl border border-blue-50" />
                                   <div className="h-32 bg-purple-50/50 rounded-2xl border border-purple-50" />
                                   <div className="h-32 bg-indigo-50/50 rounded-2xl border border-indigo-50" />
                                </div>
                                <div className="space-y-4">
                                   <div className="h-4 w-full bg-gray-50 rounded-full" />
                                   <div className="h-4 w-5/6 bg-gray-50 rounded-full" />
                                   <div className="h-4 w-4/6 bg-gray-50 rounded-full" />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
               
               {/* Floating Elements */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -right-12 top-1/3 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 hidden lg:block"
               >
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <Activity className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 font-medium">Growth</p>
                        <p className="text-lg font-bold text-gray-900">+124%</p>
                     </div>
                  </div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 20, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute -left-12 bottom-1/3 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 hidden lg:block"
               >
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Shield className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 font-medium">Uptime</p>
                        <p className="text-lg font-bold text-gray-900">99.99%</p>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         </div>
      </section>

      <section className="py-10 border-y border-gray-100 bg-gray-50/30">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Trusted by industry leaders & global teams</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {["Gap Inc.", "Continental", "Gojek", "Ubisoft", "Sears", "Dropbox", "Spotify", "Airbnb"].map((name) => (
                  <span key={name} className="text-xl font-bold text-gray-800 flex items-center gap-2">
                     <div className="h-6 w-6 bg-gray-300 rounded-full" /> {name}
                  </span>
               ))}
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Services built for modern IT teams</h2>
              <p className="text-xl text-gray-500 leading-relaxed">Dedicated squads across cloud, security, data, and AI with clear delivery milestones and outcome-driven results.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Built on Cloudflare Workers for edge-speed performance globally.",
                  iconBg: "bg-blue-50",
                  iconText: "text-blue-600",
                },
                {
                  icon: Shield,
                  title: "Enterprise Secure",
                  desc: "Bank-grade security with SOC2 compliance ready infrastructure.",
                  iconBg: "bg-indigo-50",
                  iconText: "text-indigo-600",
                },
                {
                  icon: Activity,
                  title: "Real-time Analytics",
                  desc: "Track every metric that matters with built-in dashboarding.",
                  iconBg: "bg-purple-50",
                  iconText: "text-purple-600",
                },
                {
                  icon: Globe,
                  title: "Global Scale",
                  desc: "Deploy to 200+ cities in seconds with zero configuration.",
                  iconBg: "bg-green-50",
                  iconText: "text-green-600",
                },
                {
                  icon: CheckCircle,
                  title: "99.99% Uptime",
                  desc: "Reliability you can count on, backed by industry SLAs.",
                  iconBg: "bg-teal-50",
                  iconText: "text-teal-600",
                },
                {
                  icon: ArrowRight,
                  title: "Developer First",
                  desc: "API-first design with world-class documentation and SDKs.",
                  iconBg: "bg-orange-50",
                  iconText: "text-orange-600",
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group"
                >
                   <div className={`h-14 w-14 rounded-2xl ${feature.iconBg} ${feature.iconText} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                     <Icon className="h-7 w-7" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                   <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
                );
              })}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-gray-900/30">
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -ml-32 -mb-32" />
               </div>
               
               <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to transform your business?</h2>
                  <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of developers building the future of software with Futurexa.ai today.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                     <Link to="/contact" className="h-16 px-10 rounded-full bg-white text-gray-900 font-bold text-lg flex items-center justify-center hover:bg-gray-100 transition-colors shadow-xl">
                       Get Started Now
                     </Link>
                     <Link to="/pricing" className="h-16 px-10 rounded-full bg-transparent text-white border border-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                       View Pricing
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
