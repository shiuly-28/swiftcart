import connectDb from "@/lib/db";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server"; // 🎯 NextRequest ইম্পোর্ট করা হলো

// 🎯 প্যারামিটার টাইপ NextResponse থেকে পরিবর্তন করে NextRequest করা হলো
export async function POST(req: NextRequest){
    try {
        await connectDb()
        const { userId, socketId } = await req.json()
        
        // 🎯 মঙ্গুজের ডিপিসিয়েটেড ওয়ার্নিং দূর করতে { returnDocument: 'after' } ব্যবহার করা হলো
        const user = await User.findByIdAndUpdate(userId, {
            socketId,
            isOnline: true
        }, { returnDocument: 'after' }) // { new: true } এর আধুনিক রূপ
        
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 400 })
        }
        
        return NextResponse.json({ success: true }, { status: 200 })
    } catch(error) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}