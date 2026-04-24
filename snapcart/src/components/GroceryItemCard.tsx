
"use client"
import mongoose from 'mongoose'
import React from 'react'
import {motion} from 'motion/react'
import Image from 'next/image'
import { Minus, Plus, PlusCircle, ShoppingBag } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice'

interface IGrocery{
    _id?:mongoose.Types.ObjectId,
    name:string,
    category:string,
    price:string,
    unit:string,
    image:string,
    createdAt?:Date,
    updatedAt?:Date
} 
function GroceryItemCard({item}:{item:IGrocery}) {
  const dispatch= useDispatch<AppDispatch>()
  const {cartData}=useSelector((state:RootState)=>state.cart)
  const cartItem=cartData.find(i=>i._id==item._id)
  return (
    <motion.div
     initial={{opacity:0, y:50, scale:0.9}}
    whileInView={{opacity:1, y:0, scale:1}}
    transition={{duration:0.6}}
    viewport={{once:false,amount:0.3 }}
    className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col'
    >
      <div className='relative w-full aspect-4/3 bg-gray-50 overflow-hidden group'>
        <Image src={item.image} fill alt={item.name} sizes='(max-width:768) 100vh, 25vh'
        className='object-contain p-4 transition-transform duration-500 group-hover:scale-105'/>
        <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all
         duration-300'>
        </div>

      </div>
      <div className='p-4 flex flex-col flex-1'>
        <p className='text-xs text-gray-500 font-medium mb-1 text-center'>{item.category}</p>
        <h3>Name: {item.name}</h3>
       <div className='flex items-center justify-between mt-2'>
        <span className='text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full gap-1'>Unit: {item.unit}</span>
        <span className='text-xs font-bold  bg-gray-100 px-2 py-1 rounded-full gap-1 text-amber-500'>৳: {item.price}</span>
       </div>
       {!cartItem?<motion.button className='mt-4 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white 
       p-1 rounded-full py-2'
       whileTap={{scale:0.96}}
       onClick={()=>dispatch(addToCart({...item, quantity:1}))}
       >
        <ShoppingBag className='' size={16}/>Add to Cart
       </motion.button>:
       <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className='mt-4 flex items-center justify-center bg-amber-50 border border-amber-400 rounded-full py-3 px-4 gap-4'
>
  <button 
    className='w-7 h-7 flex items-center justify-center rounded-full bg-amber-300 hover:bg-amber-200 transition-all' 
    onClick={() => cartItem._id && dispatch(decreaseQuantity(cartItem._id!))}
  >
    <Minus size={16} className='text-amber-500'/>
  </button>

  <span className='text-sm font-semibold text-gray-800'>{cartItem.quantity}</span>

  <button 
    className='w-7 h-7 flex items-center justify-center rounded-full bg-amber-300 hover:bg-amber-200 transition-all'
    onClick={() => cartItem._id && dispatch(increaseQuantity(cartItem._id!))}
  >
    <Plus size={16} className='text-amber-500'/>
  </button>
</motion.div>}
       
      </div>
    </motion.div>

  )
}

export default GroceryItemCard
