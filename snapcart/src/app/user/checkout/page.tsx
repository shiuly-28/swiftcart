"use client"
import React, { useEffect, useState } from 'react'
import {motion, number} from "motion/react"
import { ArrowLeft, CreditCard, CreditCardIcon, Home, Loader2, LocateFixed, MapPin, Phone, TruckIcon, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngExpression, LeafletEvent, } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import axios from 'axios'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import { input } from 'motion/react-client'

const markerIcon=new L.Icon({
  iconUrl:"https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize:[40,40],
  iconAnchor:[20,40]
})

function Checkout() {
  const router = useRouter()
  const {userData}=useSelector((state:RootState)=>state.user)
  const {subTotal, deliveryFee,finalTotal, cartData}=useSelector((state:RootState)=>state.cart)
  const [address, setAddress]=useState({
    fullName:"",
    mobile:"",
    city:"",
    state:"",
    pincode:"",
    fullAddress:""

  })
  const [searchLoadng, setSearchLoading] = useState(false)
  const [searchQuery,setSearchQuery]=useState("")
  const [position, setPosition]=useState<[number, number] | null>(null)
  const [paymentMethod, setPaymentMethod]=useState<"cod" | "online">("cod")

  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((pos) =>{
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition((pos)=>{
            const {latitude,longitude}=pos.coords
            setPosition([latitude,longitude])
          },(error)=>{console.log('location error', error)},{enableHighAccuracy:true,maximumAge:0,timeout:10000})
        }
      })
    }
  },[])

  useEffect(()=>{
   if(userData){
     setAddress((prev)=>({...prev,fullName:userData?.name || ""}))
     setAddress((prev)=>({...prev,mobile:userData?.mobile || ""}))
   
   }
  },[userData])

  const DraggableMarker:React.FC=()=>{
    const map=useMap()
    useEffect(()=>{
      map.setView(position as LatLngExpression, 15,{animate:true})
    },[position,map])

    return   <Marker 
   icon={markerIcon}
    position={position as LatLngExpression}
    draggable={true}
    eventHandlers={{
      dragend:(e:LeafletEvent)=>{
        const marker=e.target as L.Marker
        const{lat,lng}=marker.getLatLng()
        setPosition([lat,lng])
      }
    }}
    />
  }

  const handleSearchQuery=async()=>{
    setSearchLoading(true)
    const provider=new OpenStreetMapProvider()
    const results = await provider.search({query:searchQuery});
    if(results){
      setSearchLoading(false)
      setPosition([results[0].y,results[0].x])
    }
  }

  useEffect(()=>{
    const fetchAddress=async ()=>{
      if(!position)return
      try{
        const result=await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
        console.log(result.data)
        setAddress(prev=>({...prev,
          city:result.data.address.city,
          state:result.data.address.state,
        pincode:result.data.address.postcode,
        fullAddress:result.data.display_name
        }))
      }catch(error){
        console.log(error)
      }
    }
    fetchAddress()
  },[position])

  const handleCurrentLocation=()=>{
   if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((pos) =>{
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition((pos)=>{
            const {latitude,longitude}=pos.coords
            setPosition([latitude,longitude])
          },(error)=>{console.log('location error', error)},{enableHighAccuracy:true,maximumAge:0,timeout:10000})
        }
      })
    }
  }

  const handleCod=async ()=>{
    if(!position){
      return null
    }
    try{
      const result=await axios.post("/api/auth/user/order",{
        userId:userData?._id,
        items:cartData.map(item=>(
          {
            grocery:item._id,
            name:item.name,
            price:item.price,
            unit:item.unit,
            quantity:item.quantity,
            image:item.image
          }
        )),
        totalAmount:finalTotal,
        address:{
          fullName:address.fullName,
          mobile:address.mobile,
          city:address.city,
          state:address.state,
          fullAddress:address.fullAddress,
          pincode:address.pincode,
          latitude:position[0],
          longitude:position[1]

        },
        paymentMethod
      })
      router.push("/user/order-success")
    } catch(error){
      console.log(error)
    }
  }

  const handleOnlinePayment=async ()=>{
      if(!position){
      return null
    }
    try{
      const result=await axios.post("/api/auth/user/payment",{
         userId:userData?._id,
        items:cartData.map(item=>(
          {
            grocery:item._id,
            name:item.name,
            price:item.price,
            unit:item.unit,
            quantity:item.quantity,
            image:item.image
          }
        )),
        totalAmount:finalTotal,
        address:{
          fullName:address.fullName,
          mobile:address.mobile,
          city:address.city,
          state:address.state,
          fullAddress:address.fullAddress,
          pincode:address.pincode,
          latitude:position[0],
          longitude:position[1]

        },
        paymentMethod
      })
      window.location.href=result.data.url
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className='w-[90%] md:w-[80%] mx-auto py-10 relative'>
      <motion.button
      whileHover={{scale:1.06}}
      whileTap={{scale:0.97}}
      className='absolute left-0 top-2 flex items-center gap-2 text-amber-500
       hover:text-amber-600 font-semibold'
       onClick={()=>router.push("/user/cart")}
      >
        <ArrowLeft size={16}/>
        <span>Back To Cart</span>
      </motion.button>

      <motion.h1
      initial={{opacity:0, y:10}}
      animate={{opacity:1, y:0}}
      transition={{duration:0.3}}
      className='text-center text-3xl font-medium text-amber-500 mb-10'
      >CheckOut</motion.h1>
      <div className='grid md:grid-cols-2 gap-8'>
        <motion.div
        initial={{opacity:0, x:-20}}
      animate={{opacity:1, x:0}}
      transition={{duration:0.3}}
        className='bg-white rounded-2xl shadow-xl hover:shadow-xl transition-all duration-300
        p-6 border border-gray-100'
        >
          <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <MapPin className='text-amber-500'/>Delivery Address
          </h2>
          <div className='space-y-4'>
            <div className='relative '>
             <User className='absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 ' size={18}/>
              <input type='text' value={address.fullName}
               onChange={(e)=>setAddress((prev)=>({...prev,fullName:e.target.value}))} className='pl-10 w-full p-1
               border rounded-lg text-sm bg-gray-50' placeholder='name'/>
            </div>
            <div className='relative '>
             <Phone className='absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 ' size={18}/>
              <input type='text' value={address.mobile}
              onChange={(e)=>setAddress((prev)=>({...prev,mobile:e.target.value}))} className='pl-10 w-full p-1
               border rounded-lg text-sm bg-gray-50' placeholder='01757321528'/>
            </div>
            <div className='relative '>
             <Home className='absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 ' size={18}/>
              <input type='text' value={address.fullAddress}
              onChange={(e)=>setAddress((prev)=>({...prev,fullAddress:e.target.value}))} className='pl-10 w-full p-1
               border rounded-lg text-sm bg-gray-50' placeholder='full Address'/>
            </div>
            {/* --------------- */}
            <div className='grid grid-cols-3 gap-3'>
               <div className='relative '>
             <Home className='absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 ' size={18}/>
              <input type='text' value={address.city}
              onChange={(e)=>setAddress({...address, city:e.target.value})} className='pl-10 w-full p-1
               border rounded-lg text-sm bg-gray-50' placeholder='city'/>
            </div>
               <div className='relative '>
             <Home className='absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 ' size={18}/>
              <input type='text' value={address.state}
              onChange={(e)=>setAddress({...address, state:e.target.value})} className='pl-10 w-full p-1
               border rounded-lg text-sm bg-gray-50' placeholder='state'/>
            </div>
               <div className='relative '>
             <Home className='absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 ' size={18}/>
              <input type='text' value={address.pincode}
              onChange={(e)=>setAddress({...address, pincode:e.target.value})} className='pl-10 w-full p-1
               border rounded-lg text-sm bg-gray-50' placeholder='pincode'/>
            </div>
            </div>
              <div className='flex gap-2 mt-3'>
                <input type="text" placeholder='Search City or area...' className='flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-500'
                value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
                />
                <button className='bg-amber-500 text-white p-2 rounded-lg font-medium hover:bg-amber-600 transition-all ' onClick={handleSearchQuery}
                >{searchLoadng?<Loader2 size={16} className='animate-spin'/>:"Search"}</button>
              </div>
              <div className='relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-300 shadow-inner'>

                {position && <MapContainer center={position as LatLngExpression} zoom={13} 
     scrollWheelZoom={true} className='w-full h-full'>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <DraggableMarker/>

 
  </MapContainer> }
   
<motion.button
whileTap={{scale:0.93}}
className='absolute bottom-4 right-4 bg-amber-500 text-white shadow-lg rounded-full p-3 
hover:bg-amber-600 transition-all flex items-center justify-center z-999'
onClick={handleCurrentLocation}
>
  <LocateFixed size={22}/>
</motion.button>
              </div>
          </div>
        </motion.div>
        <motion.div
        initial={{opacity:0, x:20}}
        animate={{opacity:1, x:0}}
        transition={{duration:0.3}}
        className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 
        border border-gray-100 h-fit'
        >
          <h2 className='text-xl font-semibold text-amber-500 flex items-center gap-2'><CreditCard/>Payment Method</h2>
          <div className='space-y-4 mb-6'>
            <button
            onClick={()=>setPaymentMethod("online")}
            
            className={`flex items-center gap-3 w-full border rounded-lg p-3 paymentMethod === "online
              ? "border-amber-500 bg-amber-50 shadow-sm"
              :"hover:bg-gray-50"
            }`}>
              <CreditCardIcon/><span className='font-medium text-gray-600'>Pay Online (Stripe)</span>
            </button>

            <button
            onClick={()=>setPaymentMethod("cod")}
            className={`flex items-center gap-3 w-full border rounded-lg p-3 paymentMethod === "cod
              ? "border-amber-500 bg-amber-50 shadow-sm"
              :"hover:bg-gray-50"
            }`}>
              <TruckIcon/><span className='font-medium text-gray-600'>Cash On Delivery</span>
            </button>
          </div>
          <div className=' pt-4 text-gray-700 space-y-2 text-sm sm:text-base border-t'>
            <div className='flex justify-between'>
              <span className=' text-amber-500'>SubTotal</span>
              <span className='font-bold'>৳:{subTotal}</span>
            </div>
            <div className='flex justify-between'>
              <span className=' text-amber-500'>Delivery Fee</span>
              <span className='font-bold'>৳:{deliveryFee}</span>
            </div>
            <div className='flex justify-between text-lg border-t pt-3'>
              <span className='font-semibold text-amber-500 '>Final Total</span>
              <span className='font-bold '>৳:{finalTotal}</span>
            </div>
          </div>
          <motion.button whileTap={{scale:0.93}}
          className='w-full mt-6 bg-amber-500 text-white py-3 rounded-full 
          hover:bg-amber-600 transition-all font-semibold'
          onClick={()=>{
            if(paymentMethod=="cod"){
              handleCod()
            }else{
              handleOnlinePayment()
            }
          }}
          >
            {paymentMethod=="cod"?"Place Order":"pasy & Order"}
          </motion.button>
        </motion.div>
      </div>
      
    </div>
  )
}

export default Checkout
