import type { Route } from "./+types/contact";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us - Futurexa.ai" },
    { name: "description", content: "Get in touch with our team." },
  ];
}

export default function Contact() {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">

      <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-4">
                Let's Build <span className="text-blue-600">Together</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-8">
                Have a project in mind? We'd love to hear from you.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              <div className="space-y-12">
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                             <Mail className="h-6 w-6" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email</p>
                             <p className="text-lg font-medium text-gray-900">hello@futurexa.ai</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                             <Phone className="h-6 w-6" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                             <p className="text-lg font-medium text-gray-900">+1 (555) 123-4567</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                             <MapPin className="h-6 w-6" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Office</p>
                             <p className="text-lg font-medium text-gray-900">123 Innovation Dr, Tech City</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
                    <h3 className="text-2xl font-bold mb-4">Book a Consultation</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                      Schedule a free 30-minute discovery call with our experts to discuss your project needs.
                    </p>
                    <a href="#" className="inline-flex w-full h-14 items-center justify-center bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                      Schedule via Calendly
                    </a>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/40 rounded-full -mr-16 -mt-16 pointer-events-none" />
                 
                 <h3 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h3>
                 <form className="space-y-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                         <input type="text" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-[border-color,box-shadow] duration-200" placeholder="John" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                         <input type="text" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-[border-color,box-shadow] duration-200" placeholder="Doe" />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                       <input type="email" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-[border-color,box-shadow] duration-200" placeholder="john@company.com" />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700 ml-1">Project Type</label>
                       <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-[border-color,box-shadow] duration-200 appearance-none text-gray-500">
                          <option>Web Development</option>
                          <option>Mobile App</option>
                          <option>AI Solution</option>
                          <option>Other</option>
                       </select>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                       <textarea rows={4} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-[border-color,box-shadow] duration-200 resize-none" placeholder="Tell us about your project..."></textarea>
                    </div>
                    
                    <button type="submit" className="w-full h-16 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 group">
                      Send Message <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </form>
              </div>

           </div>
        </div>
      </section>

    </div>
  );
}
