import { Navbar, Footer } from "../components/Layout";
import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Library } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type { Route } from "./+types/home";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export function meta({ }: Route.MetaArgs) {
  const title = "Futurexa.ai | Premium Digital Transformation";
  const description = "Experts in transforming businesses through strategic implementation and premium digital experiences.";
  const ogImage = "/assets/seo/og-preview.png";
  const canonical = "https://futurexa.ai/";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },
    { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
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

function FuturexaHeroVideo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const welcomeRef = React.useRef<HTMLDivElement>(null);
  const welcomeTextRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const hasRevealedRef = React.useRef(false);
  const hasScrolledRef = React.useRef(false);

  React.useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Detect mobile at mount time for correct video asset
    const isMobile = window.innerWidth < 768;
    video.src = isMobile
      ? "/assets/mobileentry.mp4"
      : "/assets/entrydesktopvideo.mp4";
    video.load();

    // --- Wait for Outfit font, then fade in the welcome text ---
    document.fonts.ready.then(() => {
      if (welcomeTextRef.current) {
        gsap.to(welcomeTextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    });

    // --- Cinematic reveal: fade out welcome, play video ---
    const revealAndPlay = () => {
      if (hasRevealedRef.current) return;
      hasRevealedRef.current = true;

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      // 1. Fade out welcome overlay
      tl.to(welcomeRef.current, {
        opacity: 0,
        scale: 1.08,
        duration: 1.0,
        ease: "power2.in",
      });

      // 2. Simultaneously fade in video
      tl.fromTo(
        videoRef.current,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
        "-=0.5"
      );

      // 3. Start video playback mid-transition from frame 0
      tl.call(() => {
        video.currentTime = 0;
        video.play().catch((err) => {
          console.warn("Mobile browser blocked autoplay (likely Low Power Mode). Bypassing hero...", err);
          // If iOS blocks video playback (e.g. Low Power Mode), immediately trigger the auto-scroll 
          // so the user isn't stuck on a black screen.
          handleVideoEnd();
        });
      }, [], "-=1.0");
    };

    // --- Track buffering progress for the progress bar ---
    const handleProgress = () => {
      if (!video.buffered.length || !video.duration) return;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const progress = bufferedEnd / video.duration;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(progress, 1)})`;
      }
    };

    // --- Once browser confirms enough data for smooth playback ---
    const handleCanPlayThrough = () => {
      // Fill progress bar to 100%
      if (progressRef.current) {
        progressRef.current.style.transform = "scaleX(1)";
      }
      // Small delay so user sees the bar fill, then reveal
      setTimeout(revealAndPlay, 300);
    };

    // --- When video finishes, wait 1s then auto-scroll past the hero ---
    const handleVideoEnd = () => {
      if (hasScrolledRef.current) return;
      hasScrolledRef.current = true;

      setTimeout(() => {
        const heroBottom = container.offsetTop + container.offsetHeight;
        gsap.to(window, {
          scrollTo: { y: heroBottom, autoKill: false },
          duration: 1.4,
          ease: "power3.inOut",
        });
      }, 1000);
    };

    video.addEventListener("progress", handleProgress);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("ended", handleVideoEnd);

    // Fallback: if canplaythrough already fired before listener attached
    if (video.readyState >= 4) {
      handleCanPlayThrough();
    }

    return () => {
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, []);

  return (
    <div className="hero-video-wrapper w-full relative z-20">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-white z-10"
        style={{
          height: "100lvh",
          minHeight: "100svh",
        }}
      >
        {/* Video — starts invisible, GSAP reveals it after preloading.
            Source is set programmatically in useEffect based on screen width. */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ pointerEvents: "none", opacity: 0 }}
        />

        {/* Premium Welcome Overlay — shows while video buffers */}
        <div
          ref={welcomeRef}
          className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center pointer-events-none will-change-transform"
        >
          {/* Soft radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />

          {/* Typographic Centerpiece — hidden until font loads */}
          <div
            ref={welcomeTextRef}
            className="relative z-10 flex flex-col items-center px-6 text-center will-change-transform"
            style={{ opacity: 0, transform: "translateY(12px)" }}
          >
            <span className="block font-['Outfit'] text-4xl md:text-6xl font-bold tracking-tight text-slate-800 pb-2">
              Welcome to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500">
                Futurexa.ai
              </span>
            </span>

            {/* Buffering progress bar */}
            <div className="mt-8 md:mt-10 w-48 md:w-64 h-[2px] bg-slate-200/60 relative overflow-hidden rounded-full">
              <div
                ref={progressRef}
                className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-600 to-sky-400 origin-left will-change-transform rounded-full"
                style={{ transform: "scaleX(0)", transition: "transform 0.2s ease-out" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {

  const inViewViewport = { once: true, amount: 0.2, margin: "0px 0px -10% 0px" } as const;
  const inViewTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div id="home" className="landing relative bg-[var(--page-background)] selection:bg-blue-100 selection:text-blue-900" style={{ overflowX: 'clip' }}>
      {/* Permanent Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="floating-mesh-orb top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-b from-blue-100/30 to-sky-200/10 opacity-60" />
        <div className="floating-mesh-orb top-[40%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-sky-100/30 to-indigo-50/10 opacity-50" style={{ animationDelay: "-5s", animationDuration: "15s" }} />
        <div className="floating-mesh-orb bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-gradient-to-l from-blue-100/20 to-sky-100/20 opacity-40" style={{ animationDelay: "-10s", animationDuration: "20s" }} />
      </div>

      <FuturexaHeroVideo />

      <Navbar />

      {/* Trusted By - Enhanced with Volumetric Lighting */}
      <section className="py-20 md:py-32 relative z-10 overflow-hidden reveal-immediate bg-gradient-to-b from-transparent via-blue-50/20 to-transparent" id="trusted">
        <div className="container text-center">
          <div className="mb-16 md:mb-24">
            <h2 className="text-4xl md:text-7xl font-bold text-slate-900 mb-6 font-['Outfit'] tracking-tighter">
              Trusted by <span className="text-gradient-ocean">Global Leaders</span>
            </h2>
            <p className="text-lg md:text-2xl text-slate-500/80 max-w-2xl mx-auto font-light leading-relaxed px-4">
              Powering the next generation of enterprise value through elite digital engineering.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {[
              "Gap Inc.", "Continental", "Gojek", "Ubisoft", "Sears", "Dropbox", 
              "Spotify", "Airbnb", "Adobe", "Salesforce", "Samsung", "Nintendo"
            ].map((name) => (
              <div
                key={name}
                className="bg-white/85 border border-slate-200/80 p-6 md:p-8 rounded-[2rem] flex items-center justify-center group cursor-default transition-colors duration-200 hover:border-blue-300/40 hover:bg-blue-50/20"
                style={{ boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)" }}
              >
                <span className="font-['Outfit'] font-bold text-slate-500 group-hover:text-blue-600 transition-colors duration-200 tracking-wider text-sm md:text-base">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Redesigned with Liquid Glass Cards */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-12 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] leading-tight">
                Architecting the <br /> <span className="text-gradient-ocean">Impossible</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed">
                We don't just build software. We engineer competitive advantages using the most advanced technological stacks available today.
              </p>
            </div>

            <div>
              <Link to="/services" className="group flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 glass-morphism rounded-full font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-[background-color,color,box-shadow,transform] duration-500 tracking-widest text-sm md:text-base">
                View All Capabilities
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              {
                title: "Cloud Forge",
                description: "Transcendent infrastructure that scales with human ambition, secured by zero-trust protocols.",
                icon: "☁️",
                accent: "from-blue-500/12 via-sky-400/8 to-transparent",
                border: "hover:border-blue-400/60",
                bar: "group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-400",
                topBorder: "from-blue-400 to-sky-400",
                text: "group-hover:text-blue-600",
              },
              {
                title: "Cyber Sentinel",
                description: "Proactive, multi-layered defense systems designed to neutralize threats before they materialize.",
                icon: "🛡️",
                accent: "from-blue-500/12 via-sky-400/8 to-transparent",
                border: "hover:border-blue-400/60",
                bar: "group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-400",
                topBorder: "from-blue-400 to-sky-400",
                text: "group-hover:text-blue-600",
              },
              {
                title: "managed.ai",
                description: "Continuous optimization of your digital ecosystem using autonomous agents and predictive SRE.",
                icon: "⚙️",
                accent: "from-blue-500/12 via-sky-400/8 to-transparent",
                border: "hover:border-blue-400/60",
                bar: "group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-400",
                topBorder: "from-blue-400 to-sky-400",
                text: "group-hover:text-blue-600",
              },
              {
                title: "Cognitive Data",
                description: "Transforming raw noise into strategic clarity through advanced ML models and neural analytics.",
                icon: "🧠",
                accent: "from-blue-500/12 via-sky-400/8 to-transparent",
                border: "hover:border-blue-400/60",
                bar: "group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-400",
                topBorder: "from-blue-400 to-sky-400",
                text: "group-hover:text-blue-600",
              },
            ] as const).map((service, i) => (
              <div
                key={service.title}
                className={`relative bg-gradient-to-br ${service.accent} border border-white/70 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] group ${service.border} transition-[border-color,background-color] duration-200 flex flex-col h-full overflow-hidden`}
                style={{ boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)" }}
              >
                {/* Colored top border accent */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.topBorder} opacity-60`} />
                <div className="text-4xl mb-6 grayscale">
                  {service.icon}
                </div>
                <h3 className={`text-2xl font-bold text-slate-900 mb-4 ${service.text} transition-colors`}>
                  {service.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-light mb-8 flex-1">
                  {service.description}
                </p>
                <div className={`w-full h-1 bg-slate-100 ${service.bar} transition-colors duration-200 rounded-full`} />
              </div>
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
              viewport={inViewViewport}
              transition={inViewTransition}
              className="lg:col-span-3 bg-white/90 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden group border border-slate-200/70"
              style={{ boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)" }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 md:mb-8 font-['Outfit'] leading-tight">
                Specialized in <span className="text-gradient-ocean">Complexity</span>
              </h2>
              <div className="flex flex-wrap gap-3 mb-10">
                {["Fintech", "Healthcare", "Retail", "Logistics", "SaaS"].map(badge => (
                  <span key={badge} className="px-5 py-2 bg-white border border-slate-200 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase">
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed font-light">
                We align elite strategy with flawless technical execution to deliver measurable transformation programs in high-stakes environments.
              </p>
              <Link to="/industries" className="inline-flex items-center gap-2 font-bold text-blue-600">
                Explore focus areas <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
            >
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] tracking-tight">
                Case Studies <br /> of <span className="text-gradient-ocean">Velocity</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 mb-8 md:mb-10 font-light leading-relaxed">
                We deliver rapid wins and long-term value, pairing elite UX with enterprise-grade engineering. Every project is a testament to precision.
              </p>
              <Link to="/portfolio" className="inline-flex items-center justify-center px-8 py-3 md:px-10 md:py-4 bg-white border border-slate-200 rounded-full font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-[background-color,color,border-color] duration-200 shadow-sm text-sm md:text-base">
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
                  viewport={inViewViewport}
                  transition={{ ...inViewTransition, delay: i * 0.04 }}
                  className="bg-white/90 border border-slate-200/70 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between group cursor-default overflow-hidden relative"
                  style={{ boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)" }}
                >
                  <div className="relative z-10">
                    <span className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className={`text-4xl font-bold text-${item.color}-600 font-['Outfit']`}>{item.value}</span>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-${item.color}-600`}>
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
            viewport={inViewViewport}
            transition={inViewTransition}
            className="bg-white/90 border border-slate-200/70 p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] relative overflow-hidden group"
            style={{ boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)" }}
          >
            <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] tracking-tight">
                  Beyond <span className="text-blue-600">Innovation</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed font-light">
                  Futurexa.ai is a senior collective of strategists, designers, and engineers dedicated to crafting high-impact digital experiences that stand the test of time.
                </p>
                <Link to="/about" className="group flex items-center gap-2 md:gap-3 w-fit px-6 py-3 md:px-10 md:py-4 bg-white border border-slate-200 rounded-full font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-[background-color,color,border-color] duration-200 tracking-widest text-sm md:text-base">
                  Learn Our Story
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </div>
              <div className="p-8 md:p-12 bg-white border border-slate-200 rounded-[2rem] md:rounded-[3rem]">
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
            <div
              className="glass-morphism p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] group border border-white/70 transition-colors duration-200"
              style={{ boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)" }}
            >
              <div className="h-12 w-12 md:h-16 md:w-16 glass-morphism-light rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 mb-6 md:mb-8">
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
                View Open Roles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Resources */}
            <div
              className="glass-morphism p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] group border border-white/70 transition-colors duration-200"
              style={{ boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)" }}
            >
              <div className="h-12 w-12 md:h-16 md:w-16 glass-morphism-light rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 mb-6 md:mb-8">
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
                Browse Insights <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Redesigned as a Cinematic Call to Action */}
      <section className="py-16 md:py-24 relative z-10" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={inViewTransition}
            className="max-w-4xl mx-auto glass-morphism p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] relative overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 via-sky-600 to-sky-400" />
            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-sky-400/10 blur-[80px] rounded-full" />
            
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
