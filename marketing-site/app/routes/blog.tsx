import type { Route } from "./+types/blog";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Clock, User } from "lucide-react";
import { Navbar, Footer } from "../components/Layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog - Futurexa.ai" },
    { name: "description", content: "Insights and tutorials on the latest tech trends." },
  ];
}

const posts = [
  {
    slug: "building-saas-2025",
    title: "How to Build Scalable SaaS Products in 2025",
    excerpt: "The ultimate guide to modern SaaS architecture, from serverless backends to edge-ready frontends.",
    date: "Mar 10, 2026",
    author: "John Doe",
    readTime: "5 min",
    category: "Development",
    color: "blue",
  },
  {
    slug: "ai-integration-guide",
    title: "Integrating AI Agents into Your Workflow",
    excerpt: "Unlock the power of autonomous AI agents to automate complex business processes.",
    date: "Mar 05, 2026",
    author: "Jane Smith",
    readTime: "8 min",
    category: "AI",
    color: "purple",
  },
  {
    slug: "cloud-infrastructure-trends",
    title: "Top Cloud Infrastructure Trends to Watch",
    excerpt: "From multi-cloud strategies to sovereign clouds, here's what's shaping the future of infrastructure.",
    date: "Feb 28, 2026",
    author: "Mike Johnson",
    readTime: "6 min",
    category: "Cloud",
    color: "indigo",
  },
];

export default function Blog() {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                Insights & <span className="text-blue-600">Ideas</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12">
                Deep dives into technology, design, and the future of work.
              </p>
           </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-[box-shadow,border-color] duration-200 flex flex-col h-full"
                >
                   <div className={`h-48 bg-${post.color}-50 relative overflow-hidden`}>
                      <div className={`absolute inset-0 bg-gradient-to-br from-${post.color}-100/50 to-transparent`} />
                      <div className="absolute top-4 left-4 py-1 px-3 bg-white/90 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                        {post.category}
                      </div>
                   </div>
                   
                   <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium">
                         <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                         <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-500 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mt-auto"
                      >
                        Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                   </div>
                </motion.article>
              ))}
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
