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
  const hasStartedPlaybackRef = React.useRef(false);

  React.useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Detect mobile at mount time for correct video asset
    const isMobile = window.innerWidth < 768;
    let playRetryId: number | null = null;
    let playAttempts = 0;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.controls = false;
    video.setAttribute("muted", "true");
    video.setAttribute("autoplay", "true");
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.removeAttribute("controls");
    video.src = isMobile
      ? "/assets/Mobileviewvideo.mp4"
      : "/assets/entrydesktopvideo.mp4";
    video.load();

    const tryAutoplay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          if (playAttempts >= 6) {
            handleVideoEnd();
            return;
          }
          playAttempts += 1;
          playRetryId = window.setTimeout(tryAutoplay, 250);
        });
      }
    };

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
        tryAutoplay();
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
    const handleCanStart = () => {
      if (hasStartedPlaybackRef.current) return;
      hasStartedPlaybackRef.current = true;
      // Fill progress bar to 100%
      if (progressRef.current) {
        progressRef.current.style.transform = "scaleX(1)";
      }
      // Small delay so user sees the bar fill, then reveal
      setTimeout(revealAndPlay, 300);
      tryAutoplay();
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
    video.addEventListener("loadeddata", handleCanStart);
    video.addEventListener("canplay", handleCanStart);
    video.addEventListener("canplaythrough", handleCanStart);
    video.addEventListener("ended", handleVideoEnd);
    const forceStartId = window.setTimeout(handleCanStart, 1200);

    // Fallback: if media is already ready before listeners attach.
    if (video.readyState >= 2) {
      handleCanStart();
    }

    return () => {
      window.clearTimeout(forceStartId);
      if (playRetryId !== null) window.clearTimeout(playRetryId);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadeddata", handleCanStart);
      video.removeEventListener("canplay", handleCanStart);
      video.removeEventListener("canplaythrough", handleCanStart);
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
          controls={false}
          disablePictureInPicture
          preload="auto"
          className="hero-entry-video absolute inset-0 w-full h-full object-cover will-change-transform"
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
      <section className="py-12 md:py-20 relative z-10 overflow-hidden reveal-immediate bg-gradient-to-b from-transparent via-blue-50/20 to-transparent" id="trusted">
        <div className="container text-center">
          <div className="mb-10 md:mb-14">
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
                className="glass-morphism-light p-6 md:p-8 rounded-[2rem] flex items-center justify-center group cursor-default transition-all duration-500 ease-out hover:scale-[1.03] hover:border-blue-200/80 hover:bg-white/90 shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:shadow-[0_20px_40px_-15px_rgba(0,100,255,0.15)]"
              >
                <span className="font-['Outfit'] font-bold text-slate-500 group-hover:text-sky-500 transition-colors duration-500 tracking-wider text-sm md:text-base">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Redesigned with Liquid Glass Cards */}
      <section className="py-10 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16">
            <div className="max-w-4xl mx-auto mb-6 md:mb-8">
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] leading-tight">
                Architecting the <span className="text-gradient-ocean">Impossible</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
                We don't just build software. We engineer competitive advantages using the most advanced technological stacks available today.
              </p>
            </div>

            <div>
              <Link to="/services" className="group flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 glass-morphism rounded-full font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 tracking-widest text-sm md:text-base border border-blue-100/50">
                <span className="text-gradient-ocean">View All Capabilities</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300 text-sky-500">→</span>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              {
                title: "Cloud Forge",
                description: "Transcendent infrastructure that scales with human ambition, secured by zero-trust protocols.",
                icon: "☁️",
                topBorder: "from-blue-400 to-sky-400",
                text: "group-hover:text-blue-600",
                bar: "group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-400",
              },
              {
                title: "Cyber Sentinel",
                description: "Proactive, multi-layered defense systems designed to neutralize threats before they materialize.",
                icon: "🛡️",
                topBorder: "from-blue-400 to-sky-400",
                text: "group-hover:text-blue-600",
                bar: "group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-400",
              },
              {
                title: "managed.ai",
                description: "Continuous optimization of your digital ecosystem using autonomous agents and predictive SRE.",
                icon: "⚙️",
                topBorder: "from-blue-400 to-sky-400",
                text: "group-hover:text-blue-600",
                bar: "group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-400",
              },
              {
                title: "Cognitive Data",
                description: "Transforming raw noise into strategic clarity through advanced ML models and neural analytics.",
                icon: "🧠",
                topBorder: "from-blue-400 to-sky-400",
                text: "group-hover:text-blue-600",
                bar: "group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-400",
              },
            ] as const).map((service) => (
              <div
                key={service.title}
                className="glass-morphism-light relative p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] group hover:border-blue-300/60 transition-all duration-500 ease-out flex flex-col h-full overflow-hidden hover:-translate-y-2 shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:shadow-[0_25px_50px_-12px_rgba(0,100,255,0.15)]"
              >
                {/* Colored top border accent */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.topBorder} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110 origin-left">
                  {service.icon}
                </div>
                <h3 className={`text-2xl font-bold text-slate-900 mb-4 ${service.text} transition-colors duration-500`}>
                  {service.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-light mb-8 flex-1">
                  {service.description}
                </p>
                <div className={`w-full h-1 bg-slate-100 ${service.bar} transition-all duration-500 rounded-full group-hover:scale-x-105`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section - Redesigned with Asymmetric Depth */}
      <section className="py-10 md:py-16 relative z-10" id="industries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Header/Text on the Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
              className="order-1 text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-6 font-['Outfit'] leading-tight">
                Specialized in <br className="hidden md:block" /> <span className="text-gradient-ocean">Complexity</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed mb-6">
                We align elite strategy with flawless technical execution to deliver measurable transformation programs in high-stakes environments.
              </p>
              <p className="text-slate-500 font-light leading-relaxed mb-8">
                Our delivery playbooks are tailored to each industry’s risk profile, ensuring compliance is built into the architecture from day zero.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link to="/industries" className="inline-flex items-center gap-2 font-bold text-sky-600 group">
                  <span className="text-gradient-ocean">Explore focus areas</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2 text-sky-500" />
                </Link>
              </div>
            </motion.div>

            {/* Content Card on the Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
              className="order-2 glass-morphism-light p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group shadow-[0_4px_24px_rgba(31,38,135,0.02)]"
            >
              <div className="flex flex-wrap gap-3 mb-8">
                {["Fintech", "Healthcare", "Retail", "Logistics", "SaaS"].map(badge => (
                  <span key={badge} className="px-5 py-2 glass-morphism-light text-sky-600 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>
              <div className="p-6 md:p-8 bg-blue-50/30 rounded-[1.5rem] border-l-4 border-blue-600">
                <p className="italic text-slate-600 font-medium text-lg">
                  "Futurexa didn't just understand our tech; they understood our market's gravitational forces."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section - Redesigned with Depth-of-Field Glass */}
      <section className="py-10 md:py-16 relative z-10" id="portfolio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Content Cards on the Left */}
            <div className="grid gap-6 order-2 lg:order-1">
              {[
                { label: "Incident Volume Reduction", value: "-42%" },
                { label: "Release Velocity Increase", value: "3x" },
                { label: "Global Platform Uptime", value: "99.99%" }
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={inViewViewport}
                  transition={{ ...inViewTransition, delay: i * 0.04 }}
                  className="glass-morphism-light p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between group cursor-default overflow-hidden relative transition-all duration-500 ease-out hover:-translate-y-1 shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:shadow-[0_20px_40px_-15px_rgba(0,100,255,0.15)]"
                >
                  <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-2">
                    <span className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className="text-4xl font-bold font-['Outfit'] text-gradient-ocean">{item.value}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full glass-morphism-light flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 text-sky-500 shadow-sm">
                    ↗
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Header/Text on the Right */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] tracking-tight">
                Case Studies of <span className="text-gradient-ocean">Velocity</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 mb-8 md:mb-10 font-light leading-relaxed">
                We deliver rapid wins and long-term value, pairing elite UX with enterprise-grade engineering. Every project is a testament to precision.
              </p>
              <Link to="/portfolio" className="inline-flex items-center justify-center px-8 py-3 md:px-10 md:py-4 glass-morphism-light rounded-full font-bold text-slate-900 transition-all duration-500 hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-[0_10px_20px_-10px_rgba(15,23,42,0.3)] text-sm md:text-base hover:-translate-y-1">
                View Performance Portfolio
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Redesigned as a Wide Cinematic Panel */}
      <section className="py-10 md:py-16 relative z-10" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inViewViewport}
            transition={inViewTransition}
            className="glass-morphism-light p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] relative overflow-hidden group shadow-[0_4px_24px_rgba(31,38,135,0.02)]"
          >
            <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-4 md:mb-6 font-['Outfit'] tracking-tight">
                  Beyond <span className="text-gradient-ocean">Innovation</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed font-light">
                  Futurexa.ai is a senior collective of strategists, designers, and engineers dedicated to crafting high-impact digital experiences that stand the test of time.
                </p>
                <Link to="/about" className="group flex items-center gap-2 md:gap-3 w-fit px-6 py-3 md:px-10 md:py-4 glass-morphism-light rounded-full font-bold text-slate-900 transition-all duration-500 hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-[0_10px_20px_-10px_rgba(15,23,42,0.3)] text-sm md:text-base hover:-translate-y-1 border border-blue-50">
                  <span className="text-gradient-ocean">Learn Our Story</span>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-2 text-sky-500" />
                </Link>
              </div>
              <div className="p-8 md:p-12 glass-morphism-light bg-blue-50/30 rounded-[2rem] md:rounded-[3rem] border-l-4 border-blue-600">
                <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium italic">
                  "We blend premium design, data intelligence, and technical execution to create unforgettable digital legacies."
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-sky-600 shadow-lg shadow-blue-600/20" />
                  <div>
                    <span className="block font-bold text-slate-900">Elite Standards</span>
                    <span className="block text-sm text-sky-600 tracking-widest uppercase font-bold">The Futurexa Creed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Careers Section - Zigzag Pattern (Text Right) */}
      <section className="py-10 md:py-16 relative z-10 overflow-hidden" id="careers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Graphic on the Left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
              className="order-2 lg:order-1 glass-morphism-light p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group shadow-[0_4px_24px_rgba(31,38,135,0.02)]"
            >
              <div className="h-16 w-16 md:h-20 md:w-20 glass-morphism-light rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-blue-600 mb-8 shadow-sm">
                <Briefcase className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {["Remote-first", "Growth Budgets", "Mission-Led"].map(tag => (
                  <span key={tag} className="px-5 py-2 glass-morphism-light text-sky-600 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 blur-3xl rounded-full" />
            </motion.div>

            {/* Header/Text on the Right */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-6 font-['Outfit'] leading-tight">
                Join the <br className="hidden md:block" /> <span className="text-gradient-ocean">Collective</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 mb-8 leading-relaxed font-light">
                We're looking for ambitious builders who thrive on excellence and want to shape the future of digital transformation.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link to="/careers" className="group inline-flex items-center gap-3 px-8 py-3 glass-morphism-light rounded-full font-bold text-slate-900 transition-all duration-500 hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-[0_10px_20px_-10px_rgba(15,23,42,0.3)] text-sm md:text-base hover:-translate-y-1 border border-blue-50">
                  <span className="text-gradient-ocean">View Open Roles</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2 text-sky-500" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resources Section - Zigzag Pattern (Text Left) */}
      <section className="py-10 md:py-16 relative z-10" id="resources">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Header/Text on the Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
              className="order-1 text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 mb-6 font-['Outfit'] leading-tight">
                Intelligence <br className="hidden md:block" /> <span className="text-gradient-ocean">Hub</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 mb-8 leading-relaxed font-light">
                Executive playbooks, transformation guides, and AI readiness toolkits curated for modern IT leaders.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link to="/resources" className="group inline-flex items-center gap-3 px-8 py-3 glass-morphism-light rounded-full font-bold text-slate-900 transition-all duration-500 hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-[0_10px_20px_-10px_rgba(15,23,42,0.3)] text-sm md:text-base hover:-translate-y-1 border border-blue-50">
                  <span className="text-gradient-ocean">Browse Insights</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2 text-sky-500" />
                </Link>
              </div>
            </motion.div>

            {/* Graphic on the Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={inViewViewport}
              transition={inViewTransition}
              className="order-2 glass-morphism-light p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group shadow-[0_4px_24px_rgba(31,38,135,0.02)]"
            >
              <div className="h-16 w-16 md:h-20 md:w-20 glass-morphism-light rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-blue-600 mb-8 shadow-sm">
                <Library className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {["Cloud Guides", "AI Playbooks", "Market Trends"].map(tag => (
                  <span key={tag} className="px-5 py-2 glass-morphism-light text-blue-600 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-400/5 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section - Zigzag Pattern (Text Right) */}
      <section className="py-10 md:py-20 relative z-10" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inViewViewport}
            transition={inViewTransition}
            className="glass-morphism-light p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden shadow-[0_8px_48px_rgba(31,38,135,0.06)]"
          >
            {/* Subtle Depth Accents - Cleaned up to reduce 'too much coloring' */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-slate-200/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-50/20 blur-[100px] rounded-full" />

            <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
              {/* Visual Element on the Left */}
              <div className="order-2 lg:order-1 hidden lg:block">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full scale-150" />
                  <div className="relative glass-morphism-light p-10 rounded-[3rem] border-l-4 border-sky-500">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-sky-600 shadow-xl shadow-blue-600/20" />
                      <div>
                        <span className="block font-bold text-slate-900 text-xl font-['Outfit'] tracking-tight">Elite Standards</span>
                        <span className="block text-xs text-sky-600 tracking-widest uppercase font-bold">The Futurexa Creed</span>
                      </div>
                    </div>
                    <p className="text-xl text-slate-600 italic leading-relaxed">
                      "Partner with the world's most elite digital squad. Your next breakthrough starts here."
                    </p>
                  </div>
                </div>
              </div>

              {/* Header/CTAs on the Right */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h2 className="text-4xl md:text-7xl font-bold text-slate-900 mb-6 md:mb-8 font-['Outfit'] tracking-tighter leading-[0.95]">
                  Initiate <br className="hidden md:block" /> <span className="text-gradient-ocean">Transformation</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-500 mb-8 md:mb-12 leading-relaxed font-light">
                  Ready to architect the impossible? Let's begin a dialogue about your vision.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6">
                  <Link to="/contact" className="group flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-full font-bold text-sm md:text-lg hover:shadow-[0_20px_40px_-10px_rgba(0,100,255,0.4)] transition-all duration-500 w-full sm:w-auto tracking-widest hover:-translate-y-1">
                    Book Strategy Session
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-2" />
                  </Link>
                  <Link to="/resources" className="px-8 py-4 md:px-10 md:py-5 glass-morphism-light rounded-full font-bold text-sm md:text-lg text-slate-900 transition-all duration-500 hover:bg-slate-900 hover:text-white shadow-sm w-full sm:w-auto tracking-widest hover:-translate-y-1">
                    Explore Guides
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
