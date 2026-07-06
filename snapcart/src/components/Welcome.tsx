"use client"
import React from 'react'
import { motion } from "framer-motion" // motion/react যদি আপনার স্পেসিফিক সেটআপ হয় তবে সেটাই রাখতে পারেন
import { ArrowRight, Bike, ShoppingBasket } from 'lucide-react'

type propType = {
  nextStep: (s: number) => void
}

function Welcome({ nextStep }: propType) {
  return (
    <div className='relative flex flex-col items-center justify-center min-h-screen p-6 bg-radial from-green-50/60 via-orange-50/30 to-white overflow-hidden'>
      
      {/* Background Decorative Blur Blobs */}
      <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-200/30 rounded-full blur-3xl pointer-events-none' />

      {/* Main Glassmorphism Card */}
      <div className='relative z-10 max-w-2xl w-full backdrop-blur-xl bg-white/40 border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col items-center text-center'>
        
        {/* Logo / Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='flex items-center gap-3 bg-white/80 border border-orange-100 px-6 py-2 rounded-full shadow-xs'
        >
          <h1 className='text-3xl md:text-4xl font-black tracking-tight text-orange-600'>
            SwiftPick
          </h1>
          <ShoppingBasket className='w-8 h-8 text-orange-500' />
        </motion.div>

        {/* Description Section */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mt-6 text-gray-600 text-base md:text-lg leading-relaxed font-medium max-w-md'
        >
          Your one-stop destination for fresh groceries, organic products, and daily essentials delivered right to your doorstep.
        </motion.p>

        {/* Visual / Icons Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='flex items-center justify-center gap-8 my-8 relative w-full'
        >
          <div className='p-5 bg-white/80 border border-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
            <ShoppingBasket className='w-16 h-16 md:w-20 md:h-20 text-orange-500' />
          </div>
          
          {/* Subtle connecting dots line */}
          <div className='hidden sm:block border-t-2 border-dashed border-orange-200 w-12' />

          <div className='p-5 bg-white/80 border border-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
            <Bike className='w-16 h-16 md:w-20 md:h-20 text-green-600' />
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className='group inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold py-3.5 px-10 rounded-2xl shadow-lg shadow-orange-600/20 transition-all duration-200 cursor-pointer'
          onClick={() => nextStep(2)}
        >
          Next
          <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-200' />
        </motion.button>

      </div>
    </div>
  )
}

export default Welcome