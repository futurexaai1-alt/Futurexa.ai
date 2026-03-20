import { Link, NavLink } from "react-router";
import { Menu, X, Globe, ArrowRight } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const clientPortalBaseUrl = import.meta.env.DEV ? "http://localhost:5174" : "https://client.futurexa.ai";
  const clientSignInUrl = `${clientPortalBaseUrl}/signin`;
  const clientSignUpUrl = `${clientPortalBaseUrl}/signup`;

  const navLinks = [
    { name: "Services", path: "/services" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
            Futurexa.ai
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                clsx(
                  "text-sm font-medium transition-all duration-300 hover:text-blue-600 relative group",
                  isActive ? "text-blue-600" : "text-gray-600"
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

        <div className="hidden md:flex items-center gap-4">
          <a
            href={clientSignInUrl}
            className="h-10 px-6 rounded-full border border-gray-200 text-gray-700 text-sm font-medium flex items-center justify-center transition-all hover:border-blue-200 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-100/40"
          >
            Sign In
          </a>
          <a
            href={clientSignUpUrl}
            className="h-10 px-6 rounded-full border border-blue-200 text-blue-700 text-sm font-medium flex items-center justify-center transition-all hover:border-blue-300 hover:text-blue-800 hover:shadow-lg hover:shadow-blue-100/50"
          >
            Sign Up
          </a>
          <Link
            to="/contact"
            className="group relative h-10 px-6 rounded-full bg-gray-900 text-white text-sm font-medium flex items-center justify-center overflow-hidden transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Book Consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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
            className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      "block text-lg font-medium transition-colors",
                      isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <a
                href={clientSignInUrl}
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-center font-bold shadow-sm hover:border-blue-200 hover:text-blue-600"
              >
                Sign In
              </a>
              <a
                href={clientSignUpUrl}
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 rounded-xl border border-blue-200 text-blue-700 text-center font-bold shadow-sm hover:border-blue-300 hover:text-blue-800"
              >
                Sign Up
              </a>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 rounded-xl bg-blue-600 text-white text-center font-bold shadow-lg shadow-blue-500/30"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[100px]" />
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold shadow-lg shadow-gray-900/20">
                F
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Futurexa.ai
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed">
              14 years of turning complex concepts into practical, profitable solutions. Partner with Futurexa.ai to build your digital future.
            </p>
            <div className="flex items-center gap-4">
               {/* Social Icons Placeholder */}
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer">
                    <Globe className="h-5 w-5" />
                 </div>
               ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Services</h4>
            <ul className="space-y-4">
              {["Cloud Services", "Cybersecurity", "Managed Services", "Data Analytics"].map((item) => (
                <li key={item}>
                  <Link to={`/services`} className="text-gray-500 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(" ", "-")}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Stay Updated</h4>
            <p className="text-gray-500 mb-4 text-sm">
              Subscribe to our newsletter for the latest tech insights.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
              />
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 Futurexa.ai Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
