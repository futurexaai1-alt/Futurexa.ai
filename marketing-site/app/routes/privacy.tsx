import React from "react";
import { Navbar, Footer } from "../components/Layout";
import { motion } from "framer-motion";

export function meta() {
  return [
    { title: "Privacy Policy | Futurexa.ai" },
    { name: "description", content: "Privacy Policy for Futurexa.ai - How we handle your data." },
  ];
}

export default function PrivacyPolicy() {
  const sections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "info-collection", title: "2. Information Collection" },
    { id: "usage", title: "3. How We Use It" },
    { id: "security", title: "4. Data Security" },
    { id: "rights", title: "5. Your Rights" },
    { id: "contact", title: "6. Contact Us" }
  ];

  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      {/* Compact Header Area */}
      <section className="relative pt-24 pb-8 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-gradient-to-b from-blue-50/40 to-indigo-50/30 rounded-full blur-[120px] opacity-40" />
        </div>
      </section>

      {/* Main Grid Layout - Starts Higher */}
      <section className="pb-32 bg-white relative -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-12 gap-8 items-start">
             
             {/* Sticky Side-Nav */}
             <aside className="hidden lg:block lg:col-span-3 sticky top-24">
               <nav className="space-y-1 pt-8">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contents</p>
                 {sections.map((section) => (
                   <a
                     key={section.id}
                     href={`#${section.id}`}
                     className="block py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600 pl-4 transition-all"
                   >
                     {section.title}
                   </a>
                 ))}
               </nav>
             </aside>

             {/* Content Column */}
             <div className="lg:col-span-9">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5"
                >
                  <p className="text-sm font-bold text-blue-600 mb-8 uppercase tracking-widest">Privacy Policy • April 08, 2026</p>
                  
                  <div className="prose prose-blue max-w-none space-y-12 text-gray-600 leading-relaxed">
                    
                    <section id="introduction" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">1. Introduction</h2>
                      <p className="text-lg">
                        At Futurexa.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                      </p>
                    </section>

                    <section id="info-collection" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">2. Information Collection</h2>
                      <p className="text-lg">
                        We collect information that you provide directly to us, such as when you create an account or contact us for support.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4 mt-4">
                        {[
                          "Name and contact data",
                          "Credentials & Security hints",
                          "Payment & Billing data",
                          "Technical Usage data"
                        ].map((item) => (
                          <div key={item} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="font-semibold text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="usage" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">3. How We Use It</h2>
                      <p className="text-lg">
                        We use the information we collect to operate, maintain, and provide the features and functionality of the Service.
                      </p>
                    </section>

                    <section id="security" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">4. Data Security</h2>
                      <p className="text-lg">
                        We use administrative, technical, and physical security measures to help protect your personal information.
                      </p>
                    </section>

                    <section id="rights" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">5. Your Rights</h2>
                      <p className="text-lg">
                        Depending on your location, you may have certain rights regarding your personal information, including access and deletion.
                      </p>
                    </section>

                    <section id="contact" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">6. Contact Us</h2>
                      <p className="text-lg">
                        If you have questions about this policy, contact us at:
                      </p>
                      <a href="mailto:privacy@futurexa.ai" className="inline-block text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        privacy@futurexa.ai
                      </a>
                    </section>

                  </div>
                </motion.div>
             </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


