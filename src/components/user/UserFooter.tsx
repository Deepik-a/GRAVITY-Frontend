"use client";

import React from "react";
import { motion } from "framer-motion";

export default function UserFooter() {
  return (
    <footer className="bg-gradient-to-br from-[#000E29] to-[#081C45] text-white py-12 sm:py-14 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-[#EEB21B]/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#0F2FA8]/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">

          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <motion.div 
              className="flex items-center gap-3 mb-5"
              whileHover={{ scale: 1.05 }}
            >
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D29804" />
                    <stop offset="100%" stopColor="#EEB21B" />
                  </linearGradient>
                </defs>
                <ellipse cx="8" cy="10" rx="7" ry="7" stroke="url(#logoGrad)" strokeWidth="2.2" fill="none" />
                <ellipse cx="22" cy="10" rx="7" ry="7" stroke="url(#logoGrad)" strokeWidth="2.2" fill="none" />
              </svg>
              <span className="text-white text-xl sm:text-2xl font-extrabold tracking-widest">
                GRA
                <span className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
                  VI
                </span>
                TY
              </span>
            </motion.div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-6 sm:mb-7">
              Revolutionizing the construction industry by connecting homeowners with trusted builders and experts.
              Building dreams, delivering excellence.
            </p>
            <div className="space-y-2 sm:space-y-3">
              {[
                { icon: "📧", text: "contact@gravity.com" },
                { icon: "📞", text: "+1 (555) 123-4567" },
                { icon: "📍", text: "123 Construction Ave, Building City, BC 12345" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <span className="text-base sm:text-lg">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent font-semibold text-sm sm:text-base mb-4 sm:mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {["About GRAVITY", "Our Services", "Find Builders", "Join as Company", "Customer Support"].map((item) => (
                <motion.li 
                  key={item}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="#" className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent font-semibold text-sm sm:text-base mb-4 sm:mb-5">
              Legal
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Support Center", "Careers"].map((item) => (
                <motion.li 
                  key={item}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="#" className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-white/10 my-8 sm:my-10 md:my-12"
        />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h5 className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent font-semibold text-sm sm:text-base mb-1">
              Stay Connected
            </h5>
            <p className="text-gray-400 text-xs sm:text-sm">Follow us for the latest updates and success stories</p>
          </motion.div>

          {/* Social Icons */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
              <motion.a 
                key={social}
                href="#" 
                aria-label={social}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0a1a3a] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#EEB21B]/40 hover:bg-[#0f2350] transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {social === "Facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>}
                  {social === "Twitter" && <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>}
                  {social === "Instagram" && <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></>}
                  {social === "LinkedIn" && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></>}
                </svg>
              </motion.a>
            ))}
          </motion.div>
        </div>
        
        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/5"
        >
          <p className="text-gray-500 text-[10px] sm:text-xs">
            © {new Date().getFullYear()} GRAVITY. All rights reserved. Built with ❤️ for better construction.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
