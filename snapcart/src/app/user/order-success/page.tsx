
"use client"
import React from 'react'
import {motion} from 'motion/react'
import { ArrowRight, CheckCircle, Package, Package2 } from 'lucide-react'
import Link from 'next/link'
function OrderSuccess() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh]
    px-6 text-center bg-linear-to-b from-amber-50 to-white'>
        <motion.div
        initial={{scale:0,rotate:-10}}
        animate={{scale:1, rotate:0}}
        transition={{
            type:"spring",
            damping:10,
            stiffness:100
        }}
        className='relative'
        >
            <CheckCircle className='text-amber-600 w-24 h-24 md:w-28 md:28'/>
            <motion.div 
            className='absolute inset-0'
            initial={{opacity:0,scale:0.6}}
            animate={{opacity:[0.3,0,0.3],scale:[1,0.6]}}
            transition={{
                repeat:Infinity,
                duration:2,
                ease:"easeInOut"
            }}
            >
                <div className='w-full h-full rounded-full bg-amber-800 blur-2xl'/>
            </motion.div>
        </motion.div>
        <motion.h1
        initial={{opacity:0,y:30}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.4, delay:0.3}}
        className='text-3xl md:text-4xl font-bold text-amber-600 mt-6'
        >
            Order Placed Successfully
        </motion.h1>
        <motion.p
        initial={{opacity:0,y:30}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.4, delay:0.6}}
        className='text-gray-700 mt-3 md:text-base max-w-md'
        >
            Thank You for shopping with us! Your order has been placed and is being proxessed.You can track its 
            progress in your <span className='text-amber-600 font-semibold'>My Orders</span> section.
        </motion.p>
      <motion.div 
      initial={{y: 30, opacity: 0}}
      animate={{y: [0, -10, 0], opacity: 1}}
      transition={{delay: 1, duration:2,repeat:Infinity, ease:"easeInOut"}}
      className='mt-10'
      >

        <Package className='w-16 h-16 md:w-20 md:h-20 text-amber-500'/>
      </motion.div>
      <motion.div>
        <Link href={"/user/my-orders"}>
        <motion.div 
        whileHover={{scale:1.04}}
        whileTap={{scale:0.93}}
        className='flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-base
         font-semibold px-8 py-3 rounded-full shadow-lg transition-all'
        >
            Go to My Orders Page <ArrowRight/>
        </motion.div>
        </Link>
      </motion.div>
      <motion.div
      initial={{opacity:0}}
      animate={{opacity: [0.2, 0.6, 0.2]}}
      transition={{
        duration:3,
        repeat:Infinity,
        ease:"easeInOut"
      }}
      >
        <div className='absolute top-20 left-[10%] w-2 h-2 bg-amber-500 rounded-full animate-bounce'/>
        <div className='absolute top-32 left-[30%] w-2 h-2 bg-amber-500 rounded-full animate-pulse'/>
        <div className='absolute top-24 left-[50%] w-2 h-2 bg-amber-500 rounded-full animate-bounce'/>
        <div className='absolute top-16 left-[70%] w-2 h-2 bg-amber-500 rounded-full animate-pulse'/>
       
      </motion.div>
    </div>
  )
}

export default OrderSuccess
