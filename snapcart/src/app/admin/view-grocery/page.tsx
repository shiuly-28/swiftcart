'use client'
import axios from 'axios'
import React, { useEffect } from 'react'
import {motion} from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'


function ViewGrocery() {
    const router = useRouter()
    useEffect(()=>{
        const getGroceries=async ()=>{
            try{
                const result=await axios.get("/api/admin/get-groceries")
                console.log(result)
            }catch(error){
                console.log(error)
            }
        }
        getGroceries();
    }, [])
  return (
    <div className='pt-4 w-[905] md:w-[85%] mx-auto pb-20'>
      <motion.div
      initial={{opacity:0, x: -20}} 
      animate={{opacity:1, x: 0}}
      transition={{duration:0.4}}
      
      className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left'
      >
        <button
        onClick={()=>router.push("/")}
        className='flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-600 font-semibold px-4 rounded-full transition w-full sm:w-auto'
        ><ArrowLeft size={18}/><span>Back</span></button>
        <h1>Manage Groceries</h1>
      </motion.div>
    </div>
  )
}

export default ViewGrocery
