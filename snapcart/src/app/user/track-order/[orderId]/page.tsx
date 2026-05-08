"use client"
import dynamic from 'next/dynamic';
import { getSocket } from '@/lib/socket';
import { IUser } from '@/models/user.models';
import axios from 'axios';
import { ArrowLeftIcon, Send } from 'lucide-react';
import mongoose from 'mongoose';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IMessage } from '@/models/message.model';

// LiveMap কে Dynamic Import করা হলো SSR এরর বন্ধ করতে
const LiveMap = dynamic(() => import('@/components/LiveMap'), { 
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-3xl flex items-center justify-center">Loading Map...</div>
});

interface IOrder {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    items: any[];
    address: {
        latitude: number;
        longitude: number;
        [key: string]: any;
    };
    assignedDeliveryBoy?: IUser;
    status: string;
}

interface Ilocation {
    latitude: number;
    longitude: number;
}

function TrackerOrder() {
    const { orderId } = useParams();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatBoxRef=useRef<HTMLDivElement>(null)
    const [userData, setUserData] = useState<any>(null); // আপনার Auth Context থেকে এটি সেট করুন
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);

    const [order, setOrder] = useState<IOrder | null>(null);
    const [userLocation, setUserLocation] = useState<Ilocation>({ latitude: 0, longitude: 0 });
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<Ilocation>({ latitude: 0, longitude: 0 });

    // অটো স্ক্রল লজিক
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const getOrder = async () => {
            try {
                const result = await axios.get(`/api/auth/user/get-order/${orderId}`);
                setOrder(result.data);
                setUserLocation({
                    latitude: result.data.address.latitude,
                    longitude: result.data.address.longitude
                });
                if (result.data.assignedDeliveryBoy?.location?.coordinates) {
                    setDeliveryBoyLocation({
                        latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
                        longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
                    });
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        const getAllMessages = async () => {
            try {
                const result = await axios.post("/api/chat/messages", { roomId: orderId });
                if (Array.isArray(result.data)) setMessages(result.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        if (orderId) {
            getOrder();
            getAllMessages();
        }
    }, [orderId]);

    useEffect(() => {
        const socket = getSocket();
        socket.emit("join-room", orderId);

        const handleReceiveMessage = (message: IMessage) => {
            if (message.roomId?.toString() === orderId?.toString()) {
                setMessages((prev) => [...(prev || []), message]);
            }
        };

        const handleLocationUpdate = (data: any) => {
            setDeliveryBoyLocation({
                latitude: data.location?.coordinates?.[1] ?? data.location?.latitude,
                longitude: data.location?.coordinates?.[0] ?? data.location?.longitude
            });
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("updated-deliverryBoy-location", handleLocationUpdate);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("updated-deliverryBoy-location", handleLocationUpdate);
        };
    }, [orderId]);

    const sendMsg = () => {
        if (!newMessage.trim()) return;
        const socket = getSocket();
        const msgPayload = {
            roomId: orderId,
            text: newMessage,
            senderId: userData?._id,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        socket.emit("send-message", msgPayload);
        setNewMessage("");
    };

    
        useEffect(()=>{
          chatBoxRef.current?.scrollTo({
            top:chatBoxRef.current.scrollHeight,
            behavior:"smooth"
          })
        },[messages])

    return (
        <div className='w-full min-h-screen bg-gradient-to-b from-amber-50 to-white'>
            <div className='max-w-2xl mx-auto pb-24'>
                <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999'>
                    <button className='p-2 bg-amber-100 rounded-full text-amber-500' onClick={() => router.back()}>
                        <ArrowLeftIcon />
                    </button>
                    <div>
                        <h2 className='text-xl font-bold'>Track Order</h2>
                        <p className='text-sm text-gray-700 font-semibold'>
                            order# {order?._id?.toString().slice(-6)} 
                            <span className="ml-2 text-amber-600">({order?.status})</span>
                        </p>
                    </div>
                </div>

                <div className='px-4 mt-10 space-y-4'>
                    <div className='rounded-3xl overflow-hidden border shadow mb-6'>
                        <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
                    </div>

                    <div className='bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col'>
                        <div ref={scrollRef} className='flex-1 overflow-y-auto p-2 space-y-3 scroll-smooth' ref={chatBoxRef}>
                            <AnimatePresence>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg._id?.toString() || index}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.senderId === userData?._id ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${
                                            msg.senderId === userData?._id ? "bg-amber-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                                        }`}>
                                            <p>{msg.text}</p>
                                            <p className='text-[10px] opacity-70 mt-1 text-right'>{msg.time}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className='flex gap-2 mt-3 border-t pt-3'>
                            <input
                                type="text"
                                className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-amber-300'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                                placeholder='Type a message...'
                            />
                            <button className='bg-amber-500 p-3 rounded-xl text-white' onClick={sendMsg}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackerOrder;