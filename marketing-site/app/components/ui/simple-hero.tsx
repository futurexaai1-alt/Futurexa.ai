import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, CheckCircle, Smartphone, Globe, Shield, Search, Bell, User, BarChart3, Cloud, Cpu, Layers } from "lucide-react";

export function SimpleHero() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-white overflow-hidden pt-20">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>
      <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-50/30 blur-[120px] rounded-full -mr-[25%] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* Text Content */}
          <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 mb-8 text-sm font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-full uppercase">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse" />
                Next-Generation IT Solutions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-[5rem] font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-8"
            >
              Building the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Future of SaaS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-500 mb-12 max-w-xl leading-relaxed font-medium"
            >
              Futurexa.ai empowers enterprise teams to design, develop, and scale high-performance software with edge computing and global infrastructure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
            >
              <Link
                to="/contact"
                className="h-16 px-10 rounded-2xl bg-gray-900 text-white font-bold text-lg flex items-center justify-center hover:bg-gray-800 transition-all shadow-xl hover:shadow-gray-900/20 hover:-translate-y-1 w-full sm:w-auto"
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="h-16 px-10 rounded-2xl bg-white text-gray-900 border border-gray-200 font-bold text-lg flex items-center justify-center hover:bg-gray-50 transition-all w-full sm:w-auto hover:border-gray-300"
              >
                View Pricing
              </Link>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1, delay: 0.6 }}
               className="mt-16 flex items-center gap-6"
            >
                    {[
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
                    ].map((src, i) => (
                        <img 
                            key={i} 
                            src={src} 
                            alt={`User ${i + 1}`}
                            className="w-12 h-12 rounded-full border-4 border-white shadow-sm bg-gray-100 object-cover" 
                        />
                    ))}
                <div>
                   <div className="flex items-center gap-1 text-yellow-500 mb-0.5">
                      {[1,2,3,4,5].map(i => <CheckCircle key={i} className="h-4 w-4 fill-current" />)}
                   </div>
                   <p className="text-sm text-gray-500 font-bold">Joined by 10k+ innovators</p>
                </div>
            </motion.div>
          </div>

          {/* Visual Content (Premium Dashboard Preview) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-[45%] relative"
          >
            <div className="relative z-10 p-2 bg-gradient-to-br from-white to-gray-50 rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               
               {/* Realistic UI Dashboard */}
               <div className="aspect-[4/3] w-full rounded-[2rem] bg-white p-0 relative overflow-hidden border border-gray-100 flex shadow-inner">
                  {/* Sidebar */}
                  <div className="w-12 border-r border-gray-50 bg-gray-50/50 flex flex-col items-center py-4 gap-4">
                     <div className="w-7 h-7 bg-blue-600 rounded-lg" />
                     <Layers className="w-5 h-5 text-gray-400" />
                     <BarChart3 className="w-5 h-5 text-gray-400" />
                     <Cloud className="w-5 h-5 text-gray-400" />
                     <Cpu className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Main Area */}
                  <div className="flex-1 flex flex-col">
                     {/* Header */}
                     <div className="h-12 border-b border-gray-50 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-16 bg-gray-100 rounded-full" />
                           <span className="text-[10px] text-gray-300">/</span>
                           <div className="h-2 w-12 bg-gray-200 rounded-full" />
                        </div>
                        <div className="flex items-center gap-3">
                           <Search className="w-4 h-4 text-gray-400" />
                           <Bell className="w-4 h-4 text-gray-400" />
                           <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-blue-600" />
                           </div>
                        </div>
                     </div>

                     {/* Content */}
                     <div className="p-4 flex-1">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                           <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-3">
                              <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">CPU Usage</p>
                              <div className="flex items-end gap-1">
                                 <span className="text-xl font-bold text-gray-900">84</span>
                                 <span className="text-[10px] text-gray-500 mb-1">%</span>
                              </div>
                              <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "84%" }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="h-full bg-blue-500" 
                                 />
                              </div>
                           </div>
                           <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-3">
                              <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">Network</p>
                              <div className="flex items-end gap-1">
                                 <span className="text-xl font-bold text-gray-900">2.4</span>
                                 <span className="text-[10px] text-gray-500 mb-1">GB/s</span>
                              </div>
                              <div className="mt-2 flex gap-0.5 items-end h-4">
                                 {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8].map((h, i) => (
                                    <div key={i} className="flex-1 bg-indigo-200 rounded-t-[1px]" style={{ height: `${h * 100}%` }} />
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Activity List */}
                        <div className="space-y-2">
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Recent Deployments</p>
                           {[
                              { label: "v2.4.0 Final", status: "Success", time: "2m ago", color: "text-green-600", bg: "bg-green-100" },
                              { label: "Auth Mesh", status: "Deploying", time: "Just now", color: "text-blue-600", bg: "bg-blue-100", pulse: true },
                              { label: "Edge Cache", status: "Success", time: "15m ago", color: "text-green-600", bg: "bg-green-100" }
                           ].map((item, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-lg border border-gray-100">
                                 <div className={`h-1.5 w-1.5 rounded-full ${item.bg.replace("100", "500")} ${item.pulse ? 'animate-pulse' : ''}`} />
                                 <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-800">{item.label}</p>
                                    <p className="text-[8px] text-gray-400">{item.time}</p>
                                 </div>
                                 <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${item.bg} ${item.color}`}>{item.status}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-400/5 blur-[40px] rounded-full" />
               </div>

               {/* Floating Badges */}
               <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 p-6 bg-white shadow-2xl rounded-3xl border border-gray-100 z-20"
               >
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-green-600" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Security</p>
                        <p className="text-lg font-bold text-gray-900 leading-none mt-1">100% Secure</p>
                     </div>
                  </div>
               </motion.div>

               <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -left-6 p-6 bg-white shadow-2xl rounded-3xl border border-gray-100 z-20"
               >
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-600" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Infrastructure</p>
                        <p className="text-lg font-bold text-gray-900 leading-none mt-1">Scale Everywhere</p>
                     </div>
                  </div>
               </motion.div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] -z-10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
