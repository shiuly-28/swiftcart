"use client"
import { Apple, BeanIcon, Box, ChevronLeft, ChevronRight, Cookie, Egg, FlameIcon, FoldVertical, Heart, House, ReceiptCent } from 'lucide-react'

import React, { useEffect, useRef, useState } from 'react'
import {motion} from 'motion/react'

function CategorySlider() {
    const categories=[
            {id:1, name:"Fruits & Vegetable", icon:Apple,color:"bg-red-100"},
            {id:2, name:"Dairy & Eggs", icon:Egg, color:"bg-yellow-100"},
            {id:3, name:"Rice ", icon:ReceiptCent,color:"bg-teal-100"},
            {id:4, name:"Snacks & Biscuits",icon:Cookie, color:"bg-green-100"},
            {id:5, name: "Spices & Masals", icon:FlameIcon, color:"bg-red-50"},
            {id:6, name:"Beverages & Drinks",icon:BeanIcon,color:"bg-purple-100"},
            {id:7, name:"Personal Care",icon:Heart,color:"bg-pink-100"},
            {id:8, name:"Household Essentials",icon:House,color:"bg-lime-100"},
            {id:9, name:"Instant & Packaged Food",icon:FoldVertical,color:"bg-rose-100"},
            {id:10, name:"Baby & Pet Care",icon:Box,color:"bg-amber-100"},
    ]
    const[showLeft, setShowLeft]=useState<boolean>()
    const[showRight, setShowRight]=useState<boolean>()
    const scrollRef=useRef<HTMLDivElement>(null)
    const scroll=(direction:"left" | "right")=>{
      if(!scrollRef.current)return
      const scrollAmount=direction=="left"?-300:300
      scrollRef.current.scrollBy({left:scrollAmount, behavior:"smooth"})
    
    }

    const checkScroll=()=>{
      if(!scrollRef.current)return
     const{scrollLeft,  scrollWidth, clientWidth}=scrollRef.current
     
      setShowLeft(scrollLeft>0)
      setShowRight(scrollLeft+clientWidth<=scrollWidth-5)
      

    }

    useEffect(()=>{
      const autoScroll=setInterval(()=>{
        if(!scrollRef.current)return
        const {scrollLeft, scrollWidth, clientWidth}=scrollRef.current
        if(scrollLeft+clientWidth>=scrollWidth-5){
        scrollRef.current.scrollTo({left:0, behavior:"smooth"})
      }else{
        scrollRef.current.scrollBy({left:0, behavior:"smooth"})
      }
      }, 2000)
      return()=>clearInterval(autoScroll)

    }, [])

    useEffect(()=>{
      scrollRef.current?.addEventListener("scroll", checkScroll)
      checkScroll()
      return()=>removeEventListener("scroll", checkScroll)
    }, [])

  return (
    <motion.div 
    className='w-[90%] md:w-[80%] mx-auto mt-10 relative'
    initial={{opacity:0, y:50}}
    whileInView={{opacity:1, y:0}}
    transition={{duration:0.6}}
    viewport={{once:false,amount:0.5 }}
    >
      <h2 className='text-2xl md:text-3xl text-amber-500 text-center font-bold mb-4'>🍵Shop By Category</h2>
      {showLeft && <button className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-amber-100 rounded-full w-10 flex items-center justify-center 
      ' onClick={()=>scroll("left")}><ChevronLeft className='w-6 h-6 text-amber-500'/></button> }
      
      <div className='flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth' ref={scrollRef}>
      {
        categories.map((cat)=>{
          const Icon=cat.icon
          return<motion.div 
           key={cat.id} 
          className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl 
            ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
          >
            <div className='flex flex-col items-center justify-center p-5'>
            <Icon className="w-10 h-10 text-amber-700 mb-3"/>
            <p className='text-center text-sm md:text-base font-semibold text-gray-600'>{cat.name}</p>
            </div>
          </motion.div>
        })}
      </div>
      {showRight && <button className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-amber-100 rounded-full w-10 flex items-center justify-center 
      'onClick={()=>scroll("right")}><ChevronRight className='w-6 h-6 text-amber-500'/></button> }
     
    </motion.div>
  )
}

export default CategorySlider
