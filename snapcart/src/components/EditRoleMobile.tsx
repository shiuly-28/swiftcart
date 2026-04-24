'use client';
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { ArrowRight, Bike, User, UserCog } from 'lucide-react';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


function EditRoleMobile() {
  const [roles, setRoles]=useState([
    {id:"admin", label:"admin", icon:UserCog},
    {id:"user", label:"User", icon:User},
    {id:"deliveryBoy", label:"Delivery Boy", icon:Bike},
  ])
  const [selectedRole, setSelectedRole]=useState("")
  const [mobile, setMobile] = useState("")
  const {update} = useSession()
  const router = useRouter()
 const handleEdit = async () => {
  try {
    const result = await axios.post("/api/auth/user/edit-role-mobile", {
      role: selectedRole,
      mobile
    });

    if (result.status === 200) {
      console.log("Update success!");
      await update({role:selectedRole})
      router.push("/");
    }
  } catch (error) {
    console.log("Error details:", error);
  }
};

useEffect(()=>{
  const checkForAdmin=async ()=>{
  try{
    const result = await axios.get("/api/check-for-admin")
    if(result.data.adminExist){
      setRoles(prev=>prev.filter(r=>r.id!=="admin"))
    }

  }catch(error){
    console.log(error)
  }
}
checkForAdmin()
},[])

  return (
    <div className='flex flex-col min-h-screen p-6 w-full items-center '>
      <motion.h1
       initial={{
        opacity:0,
        y:-20
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
        duration:2
      }}
      className='text-3xl md:text-4xl font-extrabold text-orange-500 text-center mt-8'
      >Select Your Role</motion.h1>
      <div className='flex flex-col md:flex-row justify-center gap-6 mt-10'>
      {roles.map((role)=>{
        const Icon=role.icon
        const isSelected=selectedRole==role.id
        return(
          <motion.div
          whileTap={{scale:0.96}}
          key={role.id}
          onClick={()=>setSelectedRole(role.id)}
          className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${
            isSelected
            ?"border-orange-600 bg-orange-100 shadow-lg"
            :"border-gray-300 bg-white hover:bg-orange-400"
          }`}
          >
            <Icon></Icon>
            <span>{role.label}</span>
          </motion.div>
        )
      })}
      </div>
      <motion.div
       initial={{
        opacity:0,
       
      }}
      animate={{
        opacity:1,
        
      }}
      transition={{
        delay:0.5,
        duration:0.6
      }}
      className='flex flex-col items-center mt-10'
      >
        <label htmlFor='mobile' className='text-gray-700 font-medium mb-2'>Enter Your Mobile number</label>
        <input type='tel'
         id='mobile'
          className='w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:right-2 focus:ring-orange-400 focus:outline-none text-gray-800'
           placeholder='Eg.00000000000'
           onChange={(e)=>setMobile(e.target.value)}
           />
      </motion.div>
      <motion.button
       initial={{
        opacity:0,
        y:20
      }}
      animate={{
        opacity:1,
        y:0
      }}
      transition={{
       delay:0.7,
      }}
      disabled={mobile.length!==11 || !selectedRole}
      className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 w-[200px] mt-10 ${
        selectedRole && mobile.length === 11
        ?"bg-orange-600 hover:bg-orange-700 text-white"
            :"bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
      onClick={handleEdit}
      >
       Go to Home
        <ArrowRight/>
      </motion.button>
    </div>
  )
}

export default EditRoleMobile
