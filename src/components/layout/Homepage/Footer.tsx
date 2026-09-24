"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "AI Nutrition Engine", href: "#" },
      { name: "Class Scheduling", href: "#" },
      { name: "Trainer Portal", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Gym Growth Blog", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Community", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact Sales", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  },
];

// const socialLinks = [
//   { name: "Twitter", icon: Twitter, href: "#" },
//   { name: "Instagram", icon: Instagram, href: "#" },
//   { name: "LinkedIn", icon: Linkedin, href: "#" },
  
// ];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter Section (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group inline-block">
              <div className="bg-emerald-600 p-2 rounded-xl group-hover:bg-emerald-500 transition-colors">
                <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Fit<span className="text-emerald-600">Engine</span>
              </span>
            </Link>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              The enterprise operating system for modern fitness facilities. Scale your revenue, streamline operations, and deliver AI-driven results to your members.
            </p>

            {/* Newsletter Capture */}
            <div className="pt-2">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">Subscribe to product updates</p>
              <form className="flex max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-l-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  required
                />
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-r-xl transition-colors flex items-center justify-center border border-emerald-600 hover:border-emerald-500"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Section (Automatically maps through arrays) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-4 lg:pl-12">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Socials, Copyright, and System Status */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-4">
            {/* {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a 
                  key={social.name}
                  href={social.href}
                  className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })} */}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-slate-500 dark:text-slate-400">
            {/* Enterprise Trust Signal: System Status */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-medium tracking-wide">All systems operational</span>
            </div>
            
            <p>© {new Date().getFullYear()} FitEngine Inc. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  );
}