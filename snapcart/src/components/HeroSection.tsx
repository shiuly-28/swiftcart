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
      title:"Fresh Organic fruits Gorceries", 
      Subtitle:"Farm-fresh fruits , vegetables, and daily essentials deliverd to you.",
      btnText:"Shop Now",
      bg:"https://i.postimg.cc/QNBF2pPy/Highcompressed-313610531-1024x576.jpg"
    },
    {
      id:2,
      icon:<Truck className='w-20 h-20 sm:h-28 text-amber-500 drop-shadow-lg'/>,
      title:"Fresh Organic fruits Gorceries", 
      Subtitle:"Farm-fresh fruits , vegetables, and daily essentials deliverd to you.",
      btnText:"Shop Now",
      bg:"https://i.postimg.cc/pTZf9cyg/careem-quik.webp"
    },
    {
      id:3,
      icon:<Smartphone className='w-20 h-20 sm:h-28 text-amber-500 drop-shadow-lg'/>,
      title:"Fresh Organic fruits Gorceries  ", 
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
      <AnimatePresence mode='wait'>
    <motion.div
    key={current}
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.8}}
    exit={{opacity:0}}
    className='absolute inset-0 bg-black/50 backdrop-blur-[1px]'
    >
      <Image
      src={slides[current]?.bg}
      fill
      alt='slide'
      priority
      className='object-cover'
      />
    </motion.div>
      </AnimatePresence>
      <div className='absolute inset-0 flex items-center justify-center text-center text-white px-6'>
        <motion.div
        initial={{y:30, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{duration:0.6}}
        className='flex flex-col items-center gap-6 max-w-3xl'
        >
          <div className='bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg'>{slides[current].icon}</div>
          <h1 className='text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg'>{slides[current].title}</h1>
          <p className='text-lg sm:text-xl text-gray-200 max-w-2xl '>{slides[current].Subtitle}</p>
          <motion.button 
          whileHover={{scale:1.09}}
          whileTap={{scale:0.96}}
          transition={{duration:0.2}}
          className='mt-4 bg-white text-amber-500 hover:text-amber-400 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2'
          >
            <ShoppingBag className='w-5 h-5'/>
            {slides[current].btnText}
          </motion.button>
        </motion.div>

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
