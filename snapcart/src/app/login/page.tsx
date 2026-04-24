"use client"

import { ArrowLeft, EyeIcon, EyeOff, Leaf, Loader2, Lock, LogIn, Mail, User } from 'lucide-react';

import { motion } from "motion/react"
import Image from 'next/image';
import googleImage from "@/assets/google.png"
import axios from 'axios';
import {  FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
const Login = () => {
  
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [showPassword, setShowPassword]=useState(false)
  const [loading, setLoading]=useState(false)
  const router=useRouter()
  const session=useSession()
  console.log(session)

  const handleLogin = async(e:FormEvent)=>{
    e.preventDefault()
    setLoading(true)
    try{
      await signIn("credentials",{
        email,password
      })
      router.push("/")
      setLoading(false)
    }catch(error){
      console.log(error)
      setLoading(false)
    }
  }
 
    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-6 bg-white relative'>
            <div className='absolute top-6 left-6 flex items-center gap-2 text-orange-600 hover:text-orange-800 cursor-pointer'
        
            >
                <ArrowLeft className='w-s h-s'/>
                <span className='font-medium'>Back</span>
            </div>
            <motion.h1 
               initial={{
        opacity:0,
        y:20
      }}
      animate={{
        opacity:1,
        scale:1
      }}
      transition={{
        duration:0.6,
        delay:0.8
      }}
            className='text-4xl font-extrabold text-orange-600 mb-2'>
                Welcome back
            </motion.h1>
            <p className='flex text-gray-500 mt-5 items-center'>Login To Snapcart Today
                 Today <Leaf className='w-5 h-5 text-orange-600'/></p>
                 <motion.form 
                onSubmit={handleLogin}
                  initial={{
        opacity:0,
        y:20
      }}
      animate={{
        opacity:1,
        scale:1
      }}
      transition={{
        duration:0.6,
        delay:0.8
      }}className='flex flex-col gap-5 w-full max-w-sm'>
     
        <div className='relative'>
        <Mail className='absolute left-3 top-3.5 text-gray-400 w-s h-s hover:text-gray-400 '/>
        <input type="text" placeholder='Your Email' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-orange-500 focus:outline-none' 
        onChange={(e)=>setEmail(e.target.value)}
        value={email}
        />
        </div>
        <div className='relative'>
        <Lock className='absolute left-3 top-3.5 text-gray-400 w-s h-s hover:text-gray-400 '/>
        <input type={showPassword?"text":"password"} placeholder='Your password' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-orange-500 focus:outline-none' 
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
        />
        {
          showPassword?<EyeOff className='absolute top-3.5 right-3 flex items-center gap-2 text-orange-600 hover:text-orange-800 cursor-pointer'
           onClick={()=>setShowPassword(false)}/>:<EyeIcon className='absolute top-3.5 right-3 flex items-center gap-2 text-orange-600 hover:text-orange-500 cursor-pointer'
           onClick={()=>setShowPassword(true)}/>
        }
        </div>
      {
          (()=>{
            const formValidation= email!=="" && password!==""
            return<button disabled = {!formValidation || loading}
            className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2{
              formValidation
              ? " bg-orange-600 hover:bg-orange-700 text-white"
              :"bg-gray-300 text-white cursor-not-allowed"
              }`}>
                {loading?<Loader2 className='w-4 h-4 animate-ping'/>:"Login"}
                </button>
          })()
        }

        <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
          <span className='flex-1 h-px bg-gray-200'></span>
          OR
          <span className='flex-1 h-px bg-gray-200'></span>
        </div>

        <div className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200'
        onClick={()=>signIn("google",{callbackUrl:"/"})}>
          <Image src={googleImage} width={20} height={20} alt='google'/>
          Continue width Google
        </div>

      </motion.form>
      <p className='cursor-pointer text-gray-600 mt-6 flex text-sm items-center gap-1' onClick={()=> router.push("/register")}>Want to create an account ? 
        <LogIn className='w-4 h-4'/> <span className='text-orange-600'>Sign Up</span></p>
        </div>
    );
};

export default Login;