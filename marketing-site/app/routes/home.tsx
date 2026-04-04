import type { Route } from "./+types/home";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { CheckCircle, Zap, Globe, Shield, Activity, ArrowRight } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";
import { CinematicHero } from "../components/ui/cinematic-landing-hero";

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

      {/* Cinematic Hero — full-viewport GSAP scroll section */}
      <CinematicHero
        brandName="Futurexa"
        tagline1="Build the future,"
        tagline2="without limits."
        cardHeading="Execution, redefined."
        metricValue={500}
        metricLabel="Projects Delivered"
        ctaHeading="Start your project."
        ctaDescription="Join hundreds of companies that trust Futurexa.ai to build, scale, and ship faster."
        ctaPrimaryLabel="Get Started"
        ctaPrimaryHref="/contact"
        ctaSecondaryLabel="View Services"
        ctaSecondaryHref="/services"
      />

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
