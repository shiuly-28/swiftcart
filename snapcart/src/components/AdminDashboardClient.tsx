"use client"
import React, { useState } from 'react'
import {motion} from "motion/react"
import { IndianRupee, Package, Truck, Users } from 'lucide-react'

type propType={
  earning:{
    today:number,
    sevenDays:number,
    total:number
  }

  stats: {
    title: string;
    value: number;
}[],

 chartData: {
    day: string;
    orders: number;
}[]
}
function AdminDashboardClient({earning, stats, chartData}:propType) {
  const [filter, setFilter]=useState<"today" | "sevenDays" | "total">();

  const currenEarning=filter==="today"?earning.today
  :filter==="sevenDays"?earning.sevenDays
  :earning.total

  const title=filter==="today"?"Today's Earning"
  :filter==="sevenDays"?"Last 7 Days Earning"
  :"Total Earning"

  return (
    <div className='pt-28 w-[90%] mx-auto'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 text-center sm:text-left'>
        <motion.h1
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className='text-3xl md:text-4xl font-bold text-amber-500'
        >
           🛒 Admin Dashboard
        </motion.h1>
        <select className='border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2
        focus:ring-amber-500 outline-none transition w-full sm:w-auto'
        onChange={(e)=>setFilter(e.target.value as any)}
        value={filter}>
          <option value="total">Total</option>
          <option value="sevenDays">Last 7 Days</option>
          <option value="today">Today</option>
          
        </select>
      </div>

      <motion.div 
       initial={{opacity: 0, y: 15}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        className='bg-amber-50 border border-amber-200 shadow-sm rounded-2xl p-6 text-center mb-10'>
          <h2 className='text-lg font-semibold text-amber-500 mb-2'>{title}</h2>
          <h2 className='text-4xl font-extrabold text-amber-600'>৳:{currenEarning.toLocaleString()}</h2>
      </motion.div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {stats.map((s,i)=>{
          const icons=[
            <Package key="p" className='text-amber-600 w-6 h-6'/>,
            <Users key="u" className='text-amber-600 w-6 h-6'/>,
            <Truck key="t" className='text-amber-600 w-6 h-6'/>,
            <IndianRupee key="r" className='text-amber-600 w-6 h-6'/>,
          ]
          return <motion.div
          key={i}
           initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className='bg-white border border-gray-100 shadow-md rounded-2xl p-5 flex items-center
        gap-4 hover:shadow-lg transition-all'
          >
            <div className='bg-amber-100 p-3 rounded-xl'>
              {icons[i]}
            </div>
            <p className='text-gray-600 text-sm'>{s.title}</p>
            <p>{s.value}</p>
          </motion.div>
        })}
      </div>
    </div>
  )
}

export default AdminDashboardClient
