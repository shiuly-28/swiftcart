import { getSocket } from '@/lib/socket'
import { IMessage } from '@/models/message.model'
import axios from 'axios'
import { Send } from 'lucide-react'
import mongoose from 'mongoose'

import {AnimatePresence, motion} from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
type props={
    orderId:mongoose.Types.ObjectId,
    deliveryBoyId:mongoose.Types.ObjectId
}
function DeliveryChat({orderId,deliveryBoyId}:props) {
    const [newMessage, setNewMessage]=useState("")
    const [message, setMessage]=useState<IMessage[]>()
    const chatBoxRef=useRef<HTMLDivElement>(null)
    const [suggestions, setsuggestions]=useState([
      "hello", "thank you", "hill"
    ])

    useEffect(()=>{
      const socket=getSocket()
      socket.emit("join-room", orderId)
       socket.on("send-message",(message)=>{
        if(message.roomId===orderId){
           setMessage((prev)=>[...prev!,message])
        }
       
      })
    },[])

    const sendMsg=()=>{
      const socket=getSocket()

      const message={
        roomId:orderId,
        text:newMessage,
        senderId:deliveryBoyId,
        time:new Date().toLocaleTimeString([],{
          hour:"2-digit",
          minute:"2-digit"

        })
      }

      socket.emit("send-message", message)
     
      setNewMessage("")
    }

    useEffect(()=>{
      chatBoxRef.current?.scrollTo({
        top:chatBoxRef.current.scrollHeight,
        behavior:"smooth"
      })
    },[message])

    useEffect(()=>{
      const getAllMessages=async ()=>{
        try{
          const result=await axios.post("/api/chat/messages",{roomId:orderId})
          setMessage(result.data)
        }catch(error){
          console.log(error)
        }
      }
      getAllMessages()
    },[])



  return (
    <div className='bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col '>

      <div className='flex justify-between items-center mb-3'>
        <span>AI Suggestions</span>
      </div>
      <div className='flex-1 overflow-x-auto p-2 space-y-3' ref={chatBoxRef}>
        <AnimatePresence>
          {message?.map((msg,index)=>(
            <motion.div
            key={msg._id?.toString() || `msg-${index}`}
            initial={{opacity:0, y: 15}}
            animate={{opacity: 1, y:0}}
            exit={{opacity:0}}
            transition={{duration: 0.2}}
            className={`flex ${msg.senderId==deliveryBoyId?"justify-end":"justify-start"}`}
            >
              <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow
                ${
                  msg.senderId === deliveryBoyId
                  ?"bg-amber-500 text-white rounded-br-none"
                  :"bg-gray-100 text-gray-800 rounded-bl-none"
                }`}>
                  <p>{msg.text}</p>
                  <p className='text-[10px] opacity-70 mt-1 text-right'>{msg.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
   <div className='flex gap-2 mt-3 border-t pt-3 '>
    <input type="text" placeholder='Type a Message...' className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none 
    focus:ring-2 focus:ring-amber-300' value={newMessage} onChange={(e)=>setNewMessage(e.target.value)}/>
    <button className='bg-amber-500 hover:bg-amber-700 p-3 rounded-xl text-white' onClick={sendMsg}><Send size={18}/></button>
   </div>
    </div>
  )
}

export default DeliveryChat;