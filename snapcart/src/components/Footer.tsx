"use client"
import React from 'react'
import Link from 'next/link'
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'motion/react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 border-t border-white/20 bg-gradient-to-b from-gray-900/90 to-black text-gray-300">
      {/* ইউনিক টপ কার্ভ এবং গ্লো ইফেক্ট */}
      <div className="absolute top-0 left-1/2 -z-10 h-1 w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent blur-md" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* ব্র্যান্ড সেকশন (Glassmorphism Card Style) */}
          <div className="md:col-span-1 flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white tracking-wide">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-md shadow-amber-500/20">
                <ShoppingBag size={18} />
              </div>
              <span>Swift<span className="text-amber-500">Cart</span></span>
            </Link>
           <p className="text-sm text-gray-400 leading-relaxed">
            We are committed to delivering your daily essentials quickly and safely right to your doorstep.
            </p>
            {/* সোশ্যাল আইকন */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: <Facebook size={16} />, href: "#" },
                { icon: <Twitter size={16} />, href: "#" },
                { icon: <Instagram size={16} />, href: "#" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-colors hover:border-amber-500/50 hover:text-amber-500 backdrop-blur-sm"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* কুইক লিংকস */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Home', href: '/' },
                { name: 'All Products', href: '/products' },
                { name: 'Track Order', href: '/track-order' },
                { name: 'Become a Delivery Boy', href: '/delivery-join' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="transition-colors hover:text-amber-500">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* পলিসি ও লিগ্যাল */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Privacy & Terms</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Return Policy', href: '/returns' },
                { name: 'Support Center', href: '/support' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="transition-colors hover:text-amber-500">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* কন্টাক্ট ইনফো */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-500 shrink-0" />
                <span>Sylhet, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-amber-500 shrink-0" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-amber-500 shrink-0" />
                <span>support@swiftcart.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* বটম বার */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {currentYear} SwiftCart. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with ❤️ for a modern shopping experience.
          </p>
        </div>
      </div>
    </footer>
  )
}