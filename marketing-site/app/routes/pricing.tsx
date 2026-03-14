import type { Route } from "./+types/pricing";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Check } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pricing - Futurexa.ai" },
    { name: "description", content: "Flexible pricing plans for teams of all sizes." },
  ];
}

const plans = [
  {
    name: "Project Based",
    price: "Custom",
    description: "For defined scopes and fixed timelines.",
    features: [
      "Dedicated Project Manager",
      "Fixed Budget",
      "Clear Deliverables",
      "Milestone Payments",
      "Quality Assurance"
    ],
    cta: "Get a Quote",
    popular: false,
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
  },
  {
    name: "Dedicated Team",
    price: "$5,000",
    period: "/mo per engineer",
    description: "Scale your team instantly with top talent.",
    features: [
      "Full-time Senior Engineers",
      "Direct Communication",
      "Agile Methodology",
      "Scalable Team Size",
      "No Overhead Costs"
    ],
    cta: "Build Your Team",
    popular: true,
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-600",
  },
  {
    name: "Hourly",
    price: "$75",
    period: "/hour",
    description: "Flexible support for maintenance and small tasks.",
    features: [
      "On-demand Expertise",
      "Pay for What You Use",
      "Quick Turnaround",
      "Access to All Skills",
      "Monthly Reporting"
    ],
    cta: "Start Hourly",
    popular: false,
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-600",
  },
];

export default function Pricing() {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/30 to-purple-50/30 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                Simple, Transparent <span className="text-blue-600">Pricing</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12">
                Choose the engagement model that fits your business needs. No hidden fees.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-3 gap-8 items-start">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative bg-white rounded-[2.5rem] p-8 border ${plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 z-10' : 'border-gray-100 shadow-xl shadow-gray-100/50'} flex flex-col h-full`}
                >
                   {plan.popular && (
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                       Most Popular
                     </div>
                   )}
                   
                   <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                         <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                         {plan.period && <span className="text-gray-500 font-medium">{plan.period}</span>}
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {plan.description}
                      </p>
                   </div>
                   
                   <div className="flex-1 mb-8">
                      <ul className="space-y-4">
                         {plan.features.map((feature, idx) => (
                           <li key={idx} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                              <div className={`h-5 w-5 rounded-full ${plan.badgeBg} ${plan.badgeText} flex items-center justify-center shrink-0`}>
                                <Check className="h-3 w-3" />
                              </div>
                              {feature}
                           </li>
                         ))}
                      </ul>
                   </div>
                   
                   <Link 
                     to="/contact"
                     className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                   >
                     {plan.cta}
                   </Link>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
