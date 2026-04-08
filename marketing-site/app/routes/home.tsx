import { Navbar, Footer } from '../components/Layout';
import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Futurexa.ai | Premium Digital Transformation" },
    {
      name: "description",
      content:
        "Experts in transforming businesses through strategic implementation and premium digital experiences.",
    },
  ];
}

function FuturexaHeroAnimation() {
  return (
    <div className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-[#fafcff] pt-20">
      {/* Background orbs natively styled with Tailwind and Framer Motion */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Pure CSS GPU-Accelerated Ripple for Perfect FPS */}
        <style>{`
          .hero-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            border: 2px solid rgba(59, 130, 246, 0.4);
            animation: heroRippleExpand 4s ease-out infinite;
            will-change: width, height, opacity;
            transform: translate(-50%, -50%);
          }

          @keyframes heroRippleExpand {
            0% {
              width: 0;
              height: 0;
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              width: 1200px;
              height: 1200px;
              opacity: 0;
            }
          }

          .hero-ripple:nth-child(2) { animation-delay: 1.3s; }
          .hero-ripple:nth-child(3) { animation-delay: 2.6s; }

          .stat-line-glow {
            position: absolute;
            top: -1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #2563eb, transparent);
            animation: statLinePulse 2s ease-in-out infinite;
          }

          @keyframes statLinePulse {
            0%, 100% { opacity: 0.4; filter: blur(1px); }
            50% { opacity: 1; filter: blur(0px); box-shadow: 0 0 15px rgba(37, 99, 235, 0.6); }
          }
          
          .logo-pulse-glow {
            animation: logoGlowEffect 3s ease-in-out infinite;
          }

          @keyframes logoGlowEffect {
            0%, 100% { text-shadow: 0 0 20px rgba(37,99,235,0.2); }
            50% { text-shadow: 0 0 50px rgba(37,99,235,0.5); }
          }
        `}</style>
        
        <div className="hero-ripple"></div>

        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-indigo-100/40 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, -20, 0], scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-sky-100/40 rounded-full blur-[80px]" 
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: 90, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-['Outfit'] text-[4rem] md:text-[5rem] font-bold text-blue-600 mb-8 logo-pulse-glow"
        >
          Futurexa.ai
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-['Outfit'] text-4xl md:text-6xl font-light text-gray-900 mb-6 tracking-wide"
        >
          Transforming Visions into Reality
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-2xl font-normal max-w-3xl leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 mb-12"
        >
          We specialize in turning complex concepts into practical, profitable solutions
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.2, type: "spring", bounce: 0.5 }}
        >
          <Link to="/services" className="inline-block px-12 py-5 text-lg font-bold text-white bg-gradient-to-br from-blue-600 to-blue-800 rounded-full tracking-widest shadow-[0_15px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_60px_rgba(37,99,235,0.5)] transition-all duration-300">
            EXPLORE SERVICES
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="relative z-10 w-full max-w-6xl px-6 pb-20 mt-16"
      >
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-12 md:gap-24">
          {[
            { value: "14 Years", label: "Building digital futures" },
            { value: "500+", label: "Projects Delivered" },
            { value: "95%", label: "Return Customers" },
            { value: "Fortune 500", label: "Trusted partner" }
          ].map((stat, i) => (
            <div key={i} className="text-center relative">
               <div className="stat-line-glow" />
               <span className="block font-['Outfit'] text-[2.4rem] md:text-[2.8rem] font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-800 to-blue-500 mb-2">{stat.value}</span>
               <span className="block text-sm md:text-[0.95rem] text-gray-600 font-medium tracking-wide uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const defaultVideo =
    "https://cdn.coverr.co/videos/coverr-working-on-code-1873/1080p.mp4";
  const defaultPoster =
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80";
  const [heroVideoUrl, setHeroVideoUrl] = React.useState(defaultVideo);
  const [heroMode, setHeroMode] = React.useState<"video" | "animation">(
    "animation"
  );

  React.useEffect(() => {
    const loadHeroMedia = async () => {
      try {
        const response = await fetch("/api/hero-media");
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as {
          data?: {
            mode?: string;
            videoUrl?: string;
          };
        };
        const data = payload?.data;
        if (!data) return;
        if (data.mode) {
          setHeroMode(data.mode === "animation" ? "animation" : "video");
        }
        if (data.videoUrl !== undefined) {
          setHeroVideoUrl(data.videoUrl || defaultVideo);
        }
      } catch {}
    };
    loadHeroMedia();
  }, []);

  React.useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".entry"));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="home" className="landing relative overflow-x-hidden bg-[#fafcff] selection:bg-blue-100 selection:text-blue-900">
      {/* Permanent Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-b from-blue-100/50 to-indigo-100/30 rounded-full blur-[120px] opacity-80" />
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-sky-100/40 to-blue-50/20 rounded-full blur-[100px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-l from-purple-100/30 to-blue-100/40 rounded-full blur-[120px] opacity-60" />
      </div>

      <Navbar />
      <section className="hero-landing">
        {heroMode === "animation" ? (
          <FuturexaHeroAnimation />
        ) : (
          <>
            <div className="hero-video">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={defaultPoster}
              >
                <source src={heroVideoUrl} type="video/mp4" />
              </video>
            </div>
            <div className="opening-content">
              <div className="logo-reveal">Futurexa.ai</div>
              <h1>Modern IT transformation delivered with precision</h1>
              <p className="tagline">
                Futurexa.ai unifies strategy, engineering, and managed services to
                accelerate secure, measurable outcomes.
              </p>
              <Link to="/services" className="opening-button">
                <span>EXPLORE SERVICES</span>
              </Link>
            </div>
            <div className="opening-stats">
              <div className="stat-item">
                <span className="stat-number">14 Years</span>
                <span className="stat-label">Building digital futures</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Projects Delivered</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Return Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Fortune 500</span>
                <span className="stat-label">Trusted partner</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Logos Section */}
      <section className="py-24 bg-white relative z-10" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-['Outfit']">Trusted by global teams</h2>
            <p className="text-xl text-gray-500 mb-12">Enterprise and growth-stage partners who need secure velocity</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              "Gap Inc.", "Continental", "Gojek", "Ubisoft", "Sears", "Dropbox",
              "Spotify", "Airbnb", "Adobe", "Salesforce", "Samsung", "Nintendo"
            ].map((logo, i) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow duration-300"
              >
                <span className="font-semibold text-gray-700">{logo}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-['Outfit']">Services built for modern IT teams</h2>
            <p className="text-xl text-gray-500">
              Dedicated squads across cloud, security, data, and AI with clear delivery milestones.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Cloud & Infrastructure",
                description: "Migration, modernization, and SRE practices for resilient platforms.",
              },
              {
                title: "Cybersecurity",
                description: "Zero-trust programs, risk reduction, and continuous monitoring.",
              },
              {
                title: "Managed Services",
                description: "24/7 operations, performance optimization, and proactive support.",
              },
              {
                title: "Data & AI",
                description: "Analytics, automation, and AI enablement to accelerate decisions.",
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
             <Link to="/services" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                View all services
             </Link>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 bg-white relative z-10" id="industries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-['Outfit']">Industries we elevate</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Financial services, retail, healthcare, mobility, and enterprise SaaS trust Futurexa.ai to accelerate growth.
              </p>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                We tailor compliance, data, and delivery playbooks to each industry’s risk profile and customer expectations.
              </p>
              <Link to="/industries" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                Explore industries
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-sm"
            >
              <div className="flex flex-wrap gap-3 mb-8">
                {["Fintech", "Healthcare", "Retail", "Logistics", "SaaS"].map(badge => (
                  <span key={badge} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-lg text-gray-500 leading-relaxed">
                We align strategy, product, and engineering to deliver measurable transformation programs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 bg-gray-50/50 relative z-10" id="portfolio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Portfolio highlights</h3>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Measurable outcomes across cloud, security, and digital product modernization.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  "-42% incident volume",
                  "3x release velocity",
                  "99.99% uptime"
                ].map(badge => (
                   <div key={badge} className="flex items-center px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-gray-900 font-semibold">{badge}</span>
                   </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-['Outfit']">Case studies that drive momentum</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We deliver rapid wins and long-term value, pairing elite UX with enterprise-grade engineering.
              </p>
              <Link to="/portfolio" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                View portfolio
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white relative z-10" id="about">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
             >
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-['Outfit']">About Futurexa.ai</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  A senior team of strategists, designers, and engineers crafting high-impact digital experiences.
                </p>
                <Link to="/about" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                  Learn about Futurexa.ai
                </Link>
             </motion.div>
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-sm"
             >
               <p className="text-xl text-gray-700 leading-relaxed font-medium">
                 We blend premium design, data intelligence, and technical
                 execution to create unforgettable experiences.
               </p>
             </motion.div>
           </div>
         </div>
      </section>

      {/* Careers Section */}
      <section className="py-24 bg-gray-50/50 relative z-10" id="careers">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm"
             >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Careers</h3>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                  Join an elite studio shaping the future of digital transformation.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Remote-friendly", "Growth budgets", "Mission teams"].map(badge => (
                    <span key={badge} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                      {badge}
                    </span>
                  ))}
                </div>
             </motion.div>
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
             >
               <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-['Outfit']">Grow with the team</h2>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We&apos;re always looking for ambitious builders who thrive on excellence.
               </p>
               <Link to="/careers" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                 View open roles
               </Link>
             </motion.div>
           </div>
         </div>
      </section>

      {/* Resources Section */}
      <section className="py-24 bg-white relative z-10" id="resources">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
             >
               <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-['Outfit']">Resources</h2>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                 Executive playbooks, transformation guides, and AI readiness toolkits curated for leaders.
               </p>
               <Link to="/resources" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                 Browse resources
               </Link>
             </motion.div>
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-sm"
             >
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Weekly insights, benchmark reports, and incident response checklists for modern IT leaders.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Cloud migration guide", "SOC playbook", "AI readiness"].map(badge => (
                    <span key={badge} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                      {badge}
                    </span>
                  ))}
                </div>
             </motion.div>
           </div>
         </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 bg-gray-50/50 relative z-10" id="contact">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="max-w-3xl mx-auto"
             >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-['Outfit']">Let&apos;s build your next breakthrough</h2>
                <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                  Tell us about your vision and we&apos;ll respond within one business day.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 w-full sm:w-auto">
                    Book a strategy call
                  </Link>
                  <Link to="/resources" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    Explore resources
                  </Link>
                </div>
             </motion.div>
         </div>
      </section>
          <Footer />
    </div>
  );
}
