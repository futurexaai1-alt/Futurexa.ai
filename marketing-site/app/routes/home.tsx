import { Navbar, Footer } from '../components/Layout';
import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Library } from "lucide-react";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  const title = "Futurexa.ai | Premium Digital Transformation";
  const description = "Experts in transforming businesses through strategic implementation and premium digital experiences.";
  const ogImage = "/assets/seo/og-preview.png";

  return [
    { title },
    { name: "description", content: description },
    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://futurexa.ai" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: "https://futurexa.ai" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
}

function FuturexaHeroAnimation() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-start md:justify-center overflow-hidden bg-[var(--page-background)] pt-32 md:pt-12 pb-12">
      {/* Background orbs natively styled with Tailwind and Framer Motion */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Pure CSS GPU-Accelerated Ripple for Perfect FPS */}
        <style>{`
          .hero-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1000px;
            height: 1000px;
            border-radius: 50%;
            border: 1px solid rgba(59, 130, 246, 0.4);
            animation: heroRippleExpand 4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
            will-change: transform, opacity;
            transform: translate(-50%, -50%) scale(0);
          }

          @keyframes heroRippleExpand {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0;
            }
            5% {
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0;
            }
          }

          .hero-ripple:nth-child(2) { animation-delay: 1.3s; }
          .hero-ripple:nth-child(3) { animation-delay: 2.6s; }

          .stat-line-glow {
            position: absolute;
            top: -1.2rem;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #38bdf8, transparent);
            animation: statLinePulse 2.5s ease-in-out infinite;
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
          className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-sky-200/20 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -20, 0], scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-sky-100/40 rounded-full blur-[80px]"
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex-1 flex flex-col justify-start md:justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 45, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
          className="font-['Outfit'] text-5xl md:text-[5rem] font-bold text-gradient-ocean mb-6 md:mb-8 logo-pulse-glow"
        >
          Futurexa.ai
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="font-['Outfit'] text-4xl md:text-6xl font-light text-slate-900 mb-4 md:mb-6 tracking-wide px-2"
        >
          Transforming Visions into Reality
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="text-lg md:text-2xl font-normal max-w-3xl leading-relaxed text-slate-500/90 mb-8 md:mb-12"
        >
          We specialize in turning complex concepts into practical, profitable solutions
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/services" className="inline-block px-8 py-4 md:px-12 md:py-5 text-base md:text-lg font-bold text-white bg-gradient-to-br from-blue-600 to-sky-500 rounded-full tracking-widest shadow-[0_15px_50px_rgba(37,99,235,0.2)] hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_25px_60px_rgba(37,99,235,0.4)] transition-[transform,shadow,background-color] duration-500 ease-out">
            EXPLORE SERVICES
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.8 }}
        className="relative z-10 w-full max-w-6xl px-4 md:px-6 pb-12 mt-12 md:mt-6"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-14 lg:gap-16 justify-items-center items-start">
          {[
            { value: "10+ Years", label: "Building digital futures" },
            { value: "500+", label: "Projects Delivered" },
            { value: "95%", label: "Return Customers" },
            { value: "Global", label: "Presence & Delivery" }
          ].map((stat, i) => (
            <div key={i} className="text-center relative group flex flex-col items-center w-full">
              <div className="stat-line-glow" />
              <span className="block font-['Outfit'] text-3xl md:text-[2.5rem] font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-sky-400 mb-2 group-hover:scale-105 transition-transform duration-500 whitespace-nowrap">
                {stat.value}
              </span>
              <span className="block text-xs md:text-[0.95rem] text-slate-500 font-semibold tracking-widest uppercase max-w-[200px] leading-snug">
                {stat.label}
              </span>
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
      { threshold: 0.05 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="home" className="landing relative overflow-x-hidden bg-[var(--page-background)] selection:bg-blue-100 selection:text-blue-900">
      {/* Permanent Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="floating-mesh-orb top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-b from-blue-100/40 to-sky-200/20 opacity-80 animate-pulse" />
        <div className="floating-mesh-orb top-[40%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-sky-100/40 to-blue-50/10 opacity-70 animate-pulse" style={{ animationDelay: "-5s", animationDuration: "15s" }} />
        <div className="floating-mesh-orb bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-l from-sky-100/30 to-blue-100/30 opacity-60 animate-pulse" style={{ animationDelay: "-10s", animationDuration: "20s" }} />
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
                <span className="stat-number">10+ Years</span>
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
                <span className="stat-number">Global</span>
                <span className="stat-label">Presence & Delivery</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Trusted By - Early Reveal for seamless transition from Hero */}
      <section className="py-16 md:py-24 relative z-10 overflow-hidden reveal-immediate" id="services">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-mesh-orb top-20 right-[20%] w-[300px] h-[300px] bg-blue-400/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] tracking-tight">
              Trusted by <span className="text-blue-600">Global Leaders</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500/80 max-w-2xl mx-auto font-light leading-relaxed px-4">
              Powering the next generation of enterprise value through elite digital engineering.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Gap Inc.", "Continental", "Gojek", "Ubisoft", "Sears", "Dropbox",
              "Spotify", "Airbnb", "Adobe", "Salesforce", "Samsung", "Nintendo"
            ].map((logo, i) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="glass-morphism-light p-6 rounded-[2rem] flex items-center justify-center group cursor-default"
              >
                <span className="font-bold text-slate-400 group-hover:text-blue-600 transition-colors duration-300 tracking-wide text-sm md:text-base">
                  {logo}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Redesigned with Liquid Glass Cards */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-mesh-orb bottom-40 left-[10%] w-[400px] h-[400px] bg-blue-400/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-12 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] leading-tight">
                Architecting the <br /> <span className="text-gradient-ocean">Impossible</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed">
                We don't just build software. We engineer competitive advantages using the most advanced technological stacks available today.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/services" className="group flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 glass-morphism rounded-full font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-[background-color,color,box-shadow,transform] duration-500 tracking-widest text-sm md:text-base">
                View All Capabilities
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Cloud Forge",
                description: "Transcendent infrastructure that scales with human ambition, secured by zero-trust protocols.",
                icon: "☁️"
              },
              {
                title: "Cyber Sentinel",
                description: "Proactive, multi-layered defense systems designed to neutralize threats before they materialize.",
                icon: "🛡️"
              },
              {
                title: "managed.ai",
                description: "Continuous optimization of your digital ecosystem using autonomous agents and predictive SRE.",
                icon: "⚙️"
              },
              {
                title: "Cognitive Data",
                description: "Transforming raw noise into strategic clarity through advanced ML models and neural analytics.",
                icon: "🧠"
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-morphism liquid-shimmer p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] group hover:border-blue-300/50 transition-[border-color,transform,box-shadow] duration-500 flex flex-col h-full"
              >
                <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500 origin-left grayscale group-hover:grayscale-0">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-light mb-8 flex-1">
                  {service.description}
                </p>
                <div className="w-12 h-1 bg-slate-100 group-hover:w-full group-hover:bg-blue-600 transition-[width,background-color] duration-700 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section - Redesigned with Asymmetric Depth */}
      <section className="py-16 md:py-24 relative z-10" id="industries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 glass-morphism p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[60px] -mr-32 -mt-32 group-hover:bg-blue-500/10 transition-colors" />
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 md:mb-8 font-['Outfit'] leading-tight">
                Specialized in <span className="text-blue-600">Complexity</span>
              </h2>
              <div className="flex flex-wrap gap-3 mb-10">
                {["Fintech", "Healthcare", "Retail", "Logistics", "SaaS"].map(badge => (
                  <span key={badge} className="px-5 py-2 glass-morphism-light text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] group-hover:border-blue-300 transition-all duration-300">
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed font-light">
                We align elite strategy with flawless technical execution to deliver measurable transformation programs in high-stakes environments.
              </p>
              <Link to="/industries" className="inline-flex items-center gap-2 font-bold text-blue-600 group/link">
                Explore focus areas <ArrowRight className="h-4 w-4 group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <h3 className="text-3xl font-bold text-slate-900 font-['Outfit']">Regulatory Precision</h3>
              <p className="text-lg text-slate-500 font-light leading-relaxed">
                Our delivery playbooks are tailored to each industry’s risk profile, ensuring compliance is built into the architecture, not added as an afterthought.
              </p>
              <div className="p-8 glass-morphism-light rounded-[2rem] border-l-4 border-blue-600">
                <p className="italic text-slate-600 font-medium">
                  "Futurexa didn't just understand our tech; they understood our market's gravitational forces."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section - Redesigned with Depth-of-Field Glass */}
      <section className="py-16 md:py-24 relative z-10" id="portfolio">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-mesh-orb top-1/2 left-[30%] w-[500px] h-[500px] bg-blue-400/5" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] tracking-tight">
                Case Studies <br /> of <span className="text-gradient-ocean">Velocity</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 mb-8 md:mb-10 font-light leading-relaxed">
                We deliver rapid wins and long-term value, pairing elite UX with enterprise-grade engineering. Every project is a testament to precision.
              </p>
              <Link to="/portfolio" className="inline-flex items-center justify-center px-8 py-3 md:px-10 md:py-4 glass-morphism rounded-full font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-xl shadow-slate-200/20 text-sm md:text-base">
                View Performance Portfolio
              </Link>
            </motion.div>

            <div className="grid gap-6">
              {[
                { label: "Incident Volume Reduction", value: "-42%", color: "blue" },
                { label: "Release Velocity Increase", value: "3x", color: "blue" },
                { label: "Global Platform Uptime", value: "99.99%", color: "sky" }
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-morphism p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between group cursor-default overflow-hidden relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-${item.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <span className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className={`text-4xl font-bold text-${item.color}-600 font-['Outfit']`}>{item.value}</span>
                  </div>
                  <div className={`w-12 h-12 rounded-full glass-morphism-light flex items-center justify-center text-${item.color}-600 group-hover:rotate-45 transition-transform duration-500`}>
                    ↗
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Redesigned as a Wide Cinematic Panel */}
      <section className="py-16 md:py-24 relative z-10" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-morphism p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] relative overflow-hidden group"
          >
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-colors" />
            <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] tracking-tight">
                  Beyond <span className="text-blue-600">Innovation</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed font-light">
                  Futurexa.ai is a senior collective of strategists, designers, and engineers dedicated to crafting high-impact digital experiences that stand the test of time.
                </p>
                <Link to="/about" className="group flex items-center gap-2 md:gap-3 w-fit px-6 py-3 md:px-10 md:py-4 glass-morphism-light rounded-full font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 tracking-widest text-sm md:text-base">
                  Learn Our Story
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              <div className="p-8 md:p-12 glass-morphism-light rounded-[2rem] md:rounded-[3rem]">
                <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium italic">
                  "We blend premium design, data intelligence, and technical execution to create unforgettable digital legacies."
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-sky-600" />
                  <div>
                    <span className="block font-bold text-slate-900">Elite Standards</span>
                    <span className="block text-sm text-slate-500 tracking-widest uppercase font-bold">The Futurexa Creed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Careers & Resources - Redesigned as Alternating Glass Cards */}
      <section className="py-16 md:py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Careers */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="glass-morphism p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              <div className="h-12 w-12 md:h-16 md:w-16 glass-morphism-light rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Briefcase className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit']">Join the Collective</h3>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed font-light">
                We're looking for ambitious builders who thrive on excellence and want to shape the future of digital transformation.
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                {["Remote-first", "Growth Budgets", "Mission-Led"].map(tag => (
                  <span key={tag} className="px-4 py-1 glass-morphism-light text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full">{tag}</span>
                ))}
              </div>
              <Link to="/careers" className="inline-flex items-center gap-2 font-bold text-blue-600 group/btn">
                View Open Roles <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="glass-morphism p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              <div className="h-12 w-12 md:h-16 md:w-16 glass-morphism-light rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 mb-6 md:mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <Library className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit']">Intelligence Hub</h3>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed font-light">
                Executive playbooks, transformation guides, and AI readiness toolkits curated for modern IT leaders.
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                {["Cloud Guides", "AI Playbooks", "Market Trends"].map(tag => (
                  <span key={tag} className="px-4 py-1 glass-morphism-light text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full">{tag}</span>
                ))}
              </div>
              <Link to="/resources" className="inline-flex items-center gap-2 font-bold text-blue-600 group/btn">
                Browse Insights <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section - Redesigned as a Cinematic Call to Action */}
      <section className="py-16 md:py-24 relative z-10" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-morphism p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] relative overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 via-sky-600 to-sky-400" />
            <h2 className="text-4xl md:text-7xl font-bold text-slate-900 mb-6 md:mb-8 font-['Outfit'] tracking-tighter">
              Initiate <br className="hidden md:block" /> <span className="text-gradient-ocean">Transformation</span>
            </h2>
            <p className="text-lg md:text-2xl text-slate-500 mb-8 md:mb-12 leading-relaxed font-light max-w-2xl mx-auto px-2">
              Partner with the world's most elite digital squad. Your next breakthrough starts with a single dialogue.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Link to="/contact" className="group flex items-center justify-center gap-2 md:gap-3 px-8 py-4 md:px-10 md:py-5 bg-blue-600 text-white rounded-full font-bold text-sm md:text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 w-full sm:w-auto tracking-widest">
                Book Strategy Session
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/resources" className="px-8 py-4 md:px-12 md:py-5 glass-morphism rounded-full font-bold text-sm md:text-lg text-slate-900 hover:bg-slate-900 hover:text-white transition-all w-full sm:w-auto tracking-widest">
                Explore Guides
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
