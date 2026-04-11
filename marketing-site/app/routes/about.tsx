import type { Route } from "./+types/about";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Users, Globe, Target, Award } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us - Futurexa.ai" },
    { name: "description", content: "Learn about our mission to build the future of software." },
  ];
}

const stats = [
  { id: 1, label: "Building Digital Futures", value: "10+ Years", icon: Globe, iconBg: "bg-blue-50", iconText: "text-blue-600" },
  { id: 2, label: "Projects Delivered", value: "500+", icon: Target, iconBg: "bg-indigo-50", iconText: "text-indigo-600" },
  { id: 3, label: "Return Customers", value: "95%", icon: Award, iconBg: "bg-purple-50", iconText: "text-purple-600" },
  { id: 4, label: "Presence & Delivery", value: "Global", icon: Users, iconBg: "bg-yellow-50", iconText: "text-yellow-600" },
];

export default function About() {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50/50 to-purple-50/50 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
                Building the <span className="text-blue-600">Future</span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-gray-500 mb-12 leading-relaxed">
                Futurexa.ai is a collective of visionary engineers, designers, and strategists dedicated to pushing the boundaries of what's possible with technology.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm text-center hover:shadow-lg transition-shadow duration-300"
                >
                   <div className={`mx-auto h-16 w-16 rounded-full ${stat.iconBg} ${stat.iconText} flex items-center justify-center mb-4`}>
                     <Icon className="h-8 w-8" />
                   </div>
                   <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                   <p className="text-gray-500 font-medium">{stat.label}</p>
                </motion.div>
                );
              })}
           </div>
        </div>
      </section>

      <section className="py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
               <p className="max-w-2xl mx-auto text-lg text-gray-500">
                 Empower businesses with resilient infrastructure, proactive security, and intelligent automation while maintaining premium client experiences at every touchpoint.
               </p>
            </div>
            
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Deliver</h2>
               <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-8">
                 Every engagement combines strategic discovery, solution engineering, and lifecycle optimization.
               </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { title: "Discovery & Assessment", desc: "We map your technology landscape, risks, and growth objectives to identify opportunities." },
                 { title: "Solution Architecture", desc: "Dedicated architects craft a secure, scalable roadmap tailored to your target state." },
                 { title: "Execution & Optimization", desc: "We deliver, monitor, and continuously improve with transparent reporting and insights." },
               ].map((value, i) => (
                 <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{value.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
