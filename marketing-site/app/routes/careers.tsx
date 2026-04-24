import type { Route } from "./+types/careers";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Briefcase, MapPin, CheckCircle } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Careers - Futurexa.ai" },
    { name: "description", content: "Join our team and help deliver cloud, security, and managed services for global teams." },
  ];
}

const roles = [
  {
    title: "Senior Cloud Architect",
    location: "Remote · North America",
    focus: "Lead modernization programs and mentor delivery squads.",
  },
  {
    title: "Security Operations Lead",
    location: "Remote · EMEA",
    focus: "Build SOC playbooks, automate response, and harden infrastructure.",
  },
  {
    title: "Platform Reliability Engineer",
    location: "Hybrid · New York",
    focus: "Design observability systems and incident readiness programs.",
  },
  {
    title: "Customer Success Manager",
    location: "Remote · APAC",
    focus: "Guide enterprise clients through onboarding and quarterly planning.",
  },
];

const values = [
  "Client outcomes over deliverables",
  "Automation-first mindset",
  "Transparent collaboration",
  "Continuous learning",
];

export default function Careers() {
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
                Build the <span className="text-blue-600">Future</span> with Us
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-8">
                Join a team of strategists, engineers, and operators delivering meaningful outcomes for global enterprises.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                 {["Remote-friendly", "Growth budgets", "Mission teams"].map(badge => (
                    <span key={badge} className="py-2 px-4 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
                       {badge}
                    </span>
                 ))}
              </div>
           </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Futurexa.ai</h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-500">
                We believe in creating an environment where exceptional talent can do their best work.
              </p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px", amount: 0.2 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1], delay: Math.min(i, 5) * 0.035 }}
                  style={{ willChange: "transform, opacity" }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
                >
                   <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-gray-900">{value}</h3>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Roles</h2>
               <p className="text-lg text-gray-500">
                 New opportunities are added monthly. We respond to every applicant.
               </p>
            </div>
            
            <div className="grid gap-6">
               {roles.map((role, i) => (
                  <motion.div
                    key={role.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -12% 0px", amount: 0.2 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: Math.min(i, 5) * 0.035 }}
                    style={{ willChange: "transform, opacity" }}
                    className="p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition-colors duration-200 group bg-white shadow-sm"
                  >
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                           <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {role.title}
                           </h3>
                           <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                              <span className="flex items-center">
                                 <MapPin className="h-4 w-4 mr-1.5" />
                                 {role.location}
                              </span>
                              <span className="flex items-center">
                                 <Briefcase className="h-4 w-4 mr-1.5" />
                                 Full-time
                              </span>
                           </div>
                           <p className="text-gray-600">
                              {role.focus}
                           </p>
                        </div>
                        <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors shrink-0">
                           Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      <section className="py-24 bg-blue-600 text-white">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to make an impact?</h2>
            <p className="text-xl text-blue-100 mb-10">
               Share your resume and a brief note about the impact you want to make.
            </p>
            <Link to="/contact" className="h-14 px-8 rounded-full bg-white text-blue-600 font-bold text-lg inline-flex items-center hover:bg-gray-50 transition-colors shadow-lg">
               Talk to Recruiting <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
         </div>
      </section>

    </div>
  );
}
