import { motion } from "framer-motion";

export function meta() {
  return [
    { title: "Terms of Service | Futurexa.ai" },
    { name: "description", content: "Terms of Service for Futurexa.ai - Guidelines for using our platform." },
  ];
}

export default function TermsOfService() {
  const sections = [
    { id: "agreement", title: "1. Agreement to Terms" },
    { id: "license", title: "2. Use License" },
    { id: "disclaimer", title: "3. Disclaimer" },
    { id: "limitations", title: "4. Limitations" },
    { id: "revisions", title: "5. Revisions" },
    { id: "governing-law", title: "6. Governing Law" },
    { id: "contact", title: "7. Contact Us" }
  ];

  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">

      <section className="pt-20 pb-24 bg-white relative">
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
                    className="block py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-600 pl-4 transition-colors duration-200"
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
                  <p className="text-sm font-bold text-blue-600 mb-8 uppercase tracking-widest">Terms of Service • April 08, 2026</p>
                  
                  <div className="prose prose-blue max-w-none space-y-12 text-gray-600 leading-relaxed">
                    
                    <section id="agreement" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">1. Agreement to Terms</h2>
                      <p className="text-lg">
                        By accessing or using Futurexa.ai, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                      </p>
                    </section>

                    <section id="license" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">2. Use License</h2>
                      <p className="text-lg">
                        Permission is granted to temporarily download one copy of the materials (information or software) on Futurexa.ai's website for personal, non-commercial transitory viewing only.
                      </p>
                      <div className="grid sm:grid-cols-1 gap-4 mt-6">
                        {[
                          "Modify or copy the materials for commercial use.",
                          "Attempt to decompile or reverse engineer any software.",
                          "Remove any copyright or other proprietary notations.",
                          "Transfer the materials to another person or 'mirror' the materials."
                        ].map((rule) => (
                          <div key={rule} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100/50">
                            <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                            <span className="font-medium text-gray-700">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section id="disclaimer" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">3. Disclaimer</h2>
                      <p className="text-lg font-medium bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-blue-900 leading-relaxed">
                        The materials on Futurexa.ai's website are provided on an 'as is' basis. Futurexa.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
                      </p>
                    </section>

                    <section id="limitations" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">4. Limitations</h2>
                      <p className="text-lg text-gray-600">
                        In no event shall Futurexa.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Futurexa.ai's website.
                      </p>
                    </section>

                    <section id="revisions" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">5. Revisions</h2>
                      <p className="text-lg">
                        The materials appearing on Futurexa.ai's website could include technical, typographical, or photographic errors. Futurexa.ai does not warrant that any of the materials on its website are accurate, complete, or current.
                      </p>
                    </section>

                    <section id="governing-law" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">6. Governing Law</h2>
                      <p className="text-lg">
                        Any claim relating to Futurexa.ai's website shall be governed by the laws of our operating jurisdiction without regard to its conflict of law provisions.
                      </p>
                    </section>

                    <section id="contact" className="scroll-mt-32 space-y-4">
                      <h2 className="text-3xl font-bold text-gray-900 font-['Outfit']">7. Contact Information</h2>
                      <p className="text-lg">
                        If you have any questions about these Terms, please contact us at:
                      </p>
                      <a href="mailto:legal@futurexa.ai" className="inline-block text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors font-['Outfit']">
                        legal@futurexa.ai
                      </a>
                    </section>

                  </div>
                </motion.div>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
}
