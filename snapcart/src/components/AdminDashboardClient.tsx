"use client"
import React, { useState } from 'react'
import {motion} from "motion/react"

type propType={
  earning:{
    today:number,
    sevenDays:number,
    total:number
  }
}
function AdminDashboardClient({earning}:propType) {
  const [filter, setFilter]=useState<"today" | "sevenDays" | "total">()

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
          <h2>{title}</h2>
          <h2>{currenEarning.toLocaleString()}</h2>
      </motion.div>
    </div>
  )
}

export default AdminDashboardClient
