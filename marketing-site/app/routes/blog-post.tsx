import type { Route } from "./+types/blog-post";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";


export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `${params.slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} - Futurexa.ai Blog` },
    { name: "description", content: "Blog post content" },
  ];
}

export default function BlogPost({ params }: Route.ComponentProps) {
  const title = params.slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
           </Link>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 font-medium uppercase tracking-wider">
                <span className="text-blue-600">Development</span>
                <span>•</span>
                <span>Mar 10, 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
                {title}
              </h1>
              <div className="flex items-center justify-between border-t border-b border-gray-200 py-6">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div>
                       <p className="text-sm font-bold text-gray-900">John Doe</p>
                       <p className="text-xs text-gray-500">Senior Engineer</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-gray-500">
                    <button className="hover:text-blue-600 transition-colors"><Share2 className="h-5 w-5" /></button>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-blue">
           <p className="lead text-xl text-gray-600 mb-8">
             Building scalable SaaS products requires a deep understanding of modern architecture patterns. In this guide, we'll explore the key components of a robust SaaS platform.
           </p>
           
           <h2>1. The Foundation: Cloud-Native Architecture</h2>
           <p>
             Gone are the days of monolithic applications. Today, microservices and serverless functions rule the landscape. By decoupling your services, you gain the ability to scale independently and deploy faster.
           </p>
           
           <h2>2. Database Design for Multi-Tenancy</h2>
           <p>
             Ensuring data isolation is critical. Whether you choose a shared database with row-level security or separate databases per tenant, your choice will impact performance and compliance.
           </p>
           
           <blockquote>
             "The future of SaaS is not just about features, but about the seamless experience of reliability and speed."
           </blockquote>
           
           <h2>3. Frontend Performance</h2>
           <p>
             With frameworks like Remix and React Router, we can deliver edge-rendered experiences that feel instantaneous. Leveraging the edge network is no longer optional; it's a competitive necessity.
           </p>
           
           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 my-8 not-prose">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Key Takeaways</h3>
              <ul className="space-y-2">
                 <li className="flex items-center gap-2 text-gray-600"><div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Adopt serverless for scalability.</li>
                 <li className="flex items-center gap-2 text-gray-600"><div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Prioritize tenant isolation early.</li>
                 <li className="flex items-center gap-2 text-gray-600"><div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Optimize for the edge.</li>
              </ul>
           </div>
        </div>
      </section>


    </div>
  );
}
