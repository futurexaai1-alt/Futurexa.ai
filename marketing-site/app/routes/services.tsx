import type { Route } from "./+types/services";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Code, Brain, Cloud, Database, Shield, Globe, Activity, Zap } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Our Services - Futurexa.ai" },
    { name: "description", content: "Explore our futuristic services including Web Development, Mobile Apps, AI Solutions, and Cloud Infrastructure." },
  ];
}

const services = [
  {
    id: "cloud-services",
    title: "Cloud Services & Migration",
    description: "Modernize infrastructure with secure cloud adoption, migration planning, and optimization. SRE practices for resilient platforms.",
    icon: Cloud,
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    orbBg: "bg-blue-50/60",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Compliance",
    description: "Continuous threat monitoring, zero-trust architectures, and compliance-ready governance and risk reduction.",
    icon: Shield,
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    orbBg: "bg-indigo-50/60",
  },
  {
    id: "managed-services",
    title: "Managed Services",
    description: "24/7 monitoring, incident response, and proactive maintenance for critical systems and optimized operations.",
    icon: Activity,
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    orbBg: "bg-purple-50/60",
  },
  {
    id: "data-analytics",
    title: "Data Analytics & BI",
    description: "Unified data pipelines, dashboards, and predictive insights that drive decisions and accelerate outcomes.",
    icon: Database,
    iconBg: "bg-sky-50",
    iconText: "text-sky-600",
    orbBg: "bg-sky-50/60",
  },
  {
    id: "software-development",
    title: "Custom Software Development",
    description: "Product engineering for web, mobile, and enterprise platforms with agile delivery and modern UI/UX.",
    icon: Code,
    iconBg: "bg-teal-50",
    iconText: "text-teal-600",
    orbBg: "bg-teal-50/60",
  },
  {
    id: "devops-automation",
    title: "DevOps & Automation",
    description: "CI/CD enablement, infrastructure as code, and operational automation at scale for secure velocity.",
    icon: Zap,
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    orbBg: "bg-orange-50/60",
  },
  {
    id: "ai-ml-implementation",
    title: "AI/ML Implementation",
    description: "Operationalize AI with secure model deployment, MLOps, and applied intelligence for business transformation.",
    icon: Brain,
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    orbBg: "bg-rose-50/60",
  },
  {
    id: "network-infrastructure",
    title: "Network Infrastructure",
    description: "Resilient network architecture, SD-WAN, and edge optimization for global teams and hybrid environments.",
    icon: Globe,
    iconBg: "bg-green-50",
    iconText: "text-green-600",
    orbBg: "bg-green-50/60",
  },
];

export default function Services() {
  return (
    <div className="app-shell text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">

      <section className="relative pt-16 pb-8 lg:pt-20 lg:pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="floating-mesh-orb top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-50/30 to-indigo-50/30 opacity-50" />
        </div>

        <div className="relative z-10 container">
           <motion.div
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
              <h1 className="font-['Outfit'] text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-4">
                Futuristic <span className="text-gradient-ocean">Services</span>
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-gray-500 mb-8">
                We blend creativity with technology to build digital products that are years ahead of the curve.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-24 relative">
        <div className="container">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => {
                const Icon = service.icon;
                return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px", amount: 0.2 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1], delay: Math.min(i, 5) * 0.035 }}
                  style={{ willChange: "transform, opacity" }}
                  className="group relative bg-white border border-slate-200/80 p-8 rounded-[2rem] shadow-sm transition-[border-color,background-color] duration-200 overflow-hidden"
                >
                   <div className={`absolute top-0 right-0 w-32 h-32 ${service.orbBg} rounded-bl-[100px] -mr-8 -mt-8`} />
                   
                   <div className={`relative h-14 w-14 rounded-2xl ${service.iconBg} ${service.iconText} flex items-center justify-center mb-6`}>
                     <Icon className="h-7 w-7" />
                   </div>
                   
                   <h3 className="relative text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                     {service.title}
                   </h3>
                   <p className="relative text-gray-500 mb-8 leading-relaxed">
                     {service.description}
                   </p>
                   
                   <Link 
                     to={`/services/${service.id}`}
                     className="relative inline-flex items-center text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1 -mx-1"
                   >
                     Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
                   </Link>
                </motion.div>
                );
              })}
           </div>
        </div>
      </section>

    </div>
  );
}
