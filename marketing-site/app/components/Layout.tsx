import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, Globe, ArrowRight, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [clientPortalBaseUrl, setClientPortalBaseUrl] = useState("https://clientweb.futurexaai1.workers.dev");
  const clientSignInUrl = `${clientPortalBaseUrl}/signin`;
  const clientSignUpUrl = `${clientPortalBaseUrl}/signup`;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Only triggers a re-render if the boolean value actually changes 
    setScrolled(latest > 80);
  });

  useEffect(() => {
    let cancelled = false;

    const loadConfig = async () => {
      try {
        const response = await fetch("/app-config");
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { clientWebUrl?: string };
        const url = payload?.clientWebUrl?.trim() ?? "";
        if (!cancelled && url && !/^https?:\/\/internal(?:\/|$)/i.test(url)) {
          setClientPortalBaseUrl(url.replace(/\/+$/, ""));
        }
      } catch {}
    };

    loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  const navLinks = [
    { name: "Services", path: "/services" },
    { name: "Industries", path: "/industries" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Resources", path: "/resources" },
    { name: "Careers", path: "/careers" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <motion.nav
      initial={false}
      animate={{ 
        y: (isHome && !scrolled) ? -100 : 0,
        opacity: (isHome && !scrolled) ? 0 : 1
      }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      style={{ willChange: 'transform, opacity' }}
      className={clsx(
        "fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)]",
        (isHome && !scrolled) && "pointer-events-none"
      )}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-all duration-300">
            Futurexa.ai
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                clsx(
                  "text-[13px] lg:text-sm font-medium transition-all duration-300 hover:text-blue-600 relative group",
                  isActive ? "text-blue-600" : "text-slate-600/90"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={clientPortalBaseUrl ? clientSignInUrl : "#"}
            className="h-9 px-4 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition-all hover:border-blue-400 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 tracking-widest uppercase"
          >
            Sign In
          </a>
          <Link
            to="/contact"
            className="group relative h-9 px-6 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center overflow-hidden transition-all hover:bg-black hover:shadow-xl hover:shadow-slate-900/20 tracking-widest uppercase"
          >
            <span className="relative z-10 flex items-center gap-2">
              Contact <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white/80 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      "block text-lg font-semibold transition-colors",
                      isActive ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 space-y-3">
                <a
                  href={clientPortalBaseUrl ? clientSignInUrl : "#"}
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 rounded-xl border border-slate-200 text-slate-700 text-center font-bold shadow-sm hover:border-blue-200 hover:text-blue-600"
                >
                  Sign In
                </a>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 rounded-xl bg-blue-600 text-white text-center font-bold shadow-lg shadow-blue-500/30"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export function Footer() {
  return (
    <footer className="glass-morphism-light border-t border-white/20 pt-16 pb-12 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-sky-100/20 rounded-full blur-[120px]" />
       </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                F
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Futurexa.ai
              </span>
            </Link>
            <p className="text-slate-500/90 leading-relaxed font-medium">
              14 years of turning complex concepts into practical, profitable solutions. Partner with Futurexa.ai to build your digital future.
            </p>
            <div className="flex items-center gap-4">
               {[
                 { Icon: Linkedin, href: "https://linkedin.com" },
                 { Icon: Twitter, href: "https://twitter.com" },
                 { Icon: Github, href: "https://github.com" },
                 { Icon: Instagram, href: "https://instagram.com" },
               ].map((social, i) => (
                 <a 
                   key={i} 
                   href={social.href} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer border border-slate-100"
                 >
                    <social.Icon className="h-5 w-5" />
                 </a>
               ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Services</h4>
            <ul className="space-y-4">
              {[
                { name: "Cloud Services", slug: "cloud-services" },
                { name: "Cybersecurity", slug: "cybersecurity" },
                { name: "Managed Services", slug: "managed-services" },
                { name: "AI & ML", slug: "ai-ml-implementation" }
              ].map((item) => (
                <li key={item.slug}>
                  <Link to={`/services/${item.slug}`} className="text-slate-500 hover:text-blue-600 font-medium transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li><Link to="/services" className="text-blue-600 text-sm font-bold">View All Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", path: "/about" },
                { name: "Industries", path: "/industries" },
                { name: "Resources", path: "/resources" },
                { name: "Careers", path: "/careers" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" }
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-slate-500 hover:text-blue-600 font-medium transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Let's Connect</h4>
            <p className="text-slate-500/90 mb-8 text-sm leading-relaxed font-medium">
              Ready to scale your digital infrastructure? Reach out to our team of experts today.
            </p>
            <Link 
              to="/contact" 
              className="group inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 tracking-widest uppercase"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium">
          <p>© 2026 Futurexa.ai Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
