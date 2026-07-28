"use client"
import { Leaf, ShoppingBag, Smartphone, Truck } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import React, { useEffect, useState } from 'react'
import  {motion} from "motion/react"
import Image from 'next/image'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/redux/store'
// import { getSocket } from '@/lib/socket'


function HeroSection() {
  // const{userData} = useSelector((state:RootState)=>state.user)
  // useEffect(()=>{
  //   const socket=getSocket()
  //   socket.emit("identity", userData?._id)
  //   if(userData){
  //       // const socket=getSocket()
    
  //   }
  
  // },[userData])

   const slides=[
    {
      id:1,
      icon:<Leaf className='w-20 h-20 sm:h-28 text-amber-500 drop-shadow-lg'/>,
      title:"Fresh Organic fruits Groceries", 
      Subtitle:"Farm-fresh fruits , vegetables, and daily essentials deliverd to you.",
      btnText:"Shop Now",
      bg:"https://i.postimg.cc/QNBF2pPy/Highcompressed-313610531-1024x576.jpg"
    },
    {
      id:2,
      icon:<Truck className='w-20 h-20 sm:h-28 text-amber-500 drop-shadow-lg'/>,
      title:"Fresh Organic fruits Groceries", 
      Subtitle:"Farm-fresh fruits , vegetables, and daily essentials deliverd to you.",
      btnText:"Shop Now",
      bg:"https://i.postimg.cc/pTZf9cyg/careem-quik.webp"
    },
    {
      id:3,
      icon:<Smartphone className='w-20 h-20 sm:h-28 text-amber-500 drop-shadow-lg'/>,
      title:"Fresh Organic fruits Groceries  ", 
      Subtitle:"Farm-fresh fruits , vegetables, and daily essentials deliverd to you.",
      btnText:"Shop Now",
      bg:"https://i.postimg.cc/wBBQcvVL/best-grocery-delivery-apps-for-fast-fresh-and-affordable-shopping-4L-1024x771.jpg"
    },
  ]
  const [current, setCurrent]=useState(0)

  useEffect(()=>{
    const timer=setInterval(()=>{
      setCurrent((prev)=>(prev+1) % (slides.length))
    },4000)
    return ()=>clearInterval(timer)
  },[])
  return (
    <div className='relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl'>
     
    
      <Image
      src={slides[current]?.bg}
      fill
      alt='slide'
      priority
      className='object-cover'
      />
    
    
     {/* 📌 কন্টেন্ট ডিভ - justify-end দিয়ে নিচে নামানো হয়েছে এবং pb-20 দিয়ে ডট থেকে একটু ওপরে রাখা হয়েছে */}
<div className='absolute inset-0 flex flex-col justify-end items-center text-center text-white px-6 pb-20 sm:pb-24 z-10 pointer-events-none'>
  
  <div className='flex flex-col items-center gap-4 max-w-3xl pointer-events-auto'>
    
    {/* 🍃 আইকন */}
    <div className='bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-full shadow-lg'>
      <Leaf className='w-12 h-12 sm:w-16 sm:h-16 text-amber-500 drop-shadow-lg' />
    </div>

    {/* 🏷️ টাইটেল ও সাবটাইটেল */}
    <h1 className='text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg'>
      Fresh Organic Fruits & Groceries
    </h1>
    <p className='text-sm sm:text-lg text-gray-200 max-w-2xl'>
      Farm-fresh fruits, vegetables, and daily essentials delivered to you.
    </p>

    {/* 🛍️ বাটন - যা এখন একদম ডট ইন্ডিকেটরের ওপরে পারফেক্ট পজিশনে থাকবে */}
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center px-8 py-3 mt-2 overflow-hidden text-base font-semibold text-amber-500 bg-white rounded-full shadow-lg cursor-pointer group/btn transition-all duration-300 hover:text-white"
    >
      {/* Aurora Hover Fill Layer */}
      <span className="absolute left-0 block w-full h-0 transition-all bg-gradient-to-r from-amber-500 to-amber-600 opacity-100 group-hover/btn:h-full top-1/2 group-hover/btn:top-0 duration-400 ease" />

      {/* Arrow Slide */}
      <span className="absolute right-3 flex items-center justify-center w-8 h-8 duration-300 transform translate-x-full opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 ease">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </span>

      {/* Text & Icon Content */}
      <span className="relative z-10 flex items-center gap-2 group-hover/btn:pr-6 transition-all duration-400">
        <ShoppingBag className="w-5 h-5" />
        {slides[current].btnText}
      </span>
    </motion.button>

  </div>
</div>
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3'>
        {
          slides.map((_, index)=>(
            <button 
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? "bg-white w-6" : "bg-white/50"
            }`}
            ></button>
          ))
        }
      </div>
    </div>
  )
}

export default HeroSection
