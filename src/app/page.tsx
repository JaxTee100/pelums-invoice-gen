'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react'; // optional: swap with your SVG or emoji/icon

export default function Home() {
  return (
    <div className="relative flex items-center flex-col justify-center min-h-screen px-4 sm:px-8 bg-slate-900 overflow-hidden text-center">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-700/20 via-slate-800 to-slate-900 opacity-80 z-0 pointer-events-none" />

      {/* Brand Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 mb-6 sm:mb-8"
      >
        {/* You can replace this with an image or SVG */}
        <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 text-pink-500 drop-shadow-[0_3px_10px_rgba(236,72,153,0.6)]" />
        {/* or use an emoji: <div className="text-6xl">👨‍🍳</div> */}
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="z-10 text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-widest mb-10 sm:mb-12 drop-shadow-[0_3px_15px_rgba(236,72,153,0.6)]"
      >
        Welcome to Elite Kitchen
      </motion.h1>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="z-10 w-full sm:w-auto"
      >
        <Link href="/invoice/new">
          <button className="w-full sm:w-auto px-6 py-3 rounded-full text-base sm:text-lg font-semibold text-white bg-pink-600 hover:bg-pink-500 shadow-lg shadow-pink-500/30 transition-all duration-300 ease-in-out hover:scale-105">
            Generate Invoice
          </button>
        </Link>
      </motion.div>

      {/* Motto */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="z-10 mt-6 text-sm sm:text-base text-pink-300 italic"
      >
        “Where every recipe begins with excellence.”
      </motion.p>
    </div>
  );
}
