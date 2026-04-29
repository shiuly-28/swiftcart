// import { auth } from "@/auth";
// import connectDb from "@/lib/db";
// import DeliveryAssignment from "@/models/deliveryAssignment.model";

// import { NextResponse } from "next/server";

// export async function GET(){
//     try{
//         await connectDb()
//         const session=await auth()
//         const assignments=await DeliveryAssignment.find({
//             brodcastedTo: { $in: ["69ee35f9d89bb354151990fa"] },
//             status:"brodcasted"
//         }).populate("order") 
//         return NextResponse.json(
//             assignments,{status:200}
//         )
//     } catch(error){
//         return NextResponse.json(
//             {message:`get assignments error ${error}`},{status:200}
//         )
//     }
// }

import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
// ১. Order মডেলটি অবশ্যই ইমপোর্ট করতে হবে যেন মঙ্গুজ এটি চিনতে পারে
import Order from "@/models/order.model"; 
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb();
        const session = await auth();

        const currentUserId = session?.user?.id || "69ee35f9d89bb354151990fa";

        const assignments = await DeliveryAssignment.find({
            brodcastedTo: { $in: [currentUserId] },
            status: "brodcasted"
        }).populate({
            path: "order",
            model: Order
        });

        return NextResponse.json(assignments || [], { status: 200 });

    } catch (error) {
        console.error("API Error:", error);
        // ৫. এরর হলেও খালি অ্যারে পাঠান যেন ফ্রন্টএন্ডে .map() না ভেঙে যায়
        return NextResponse.json([], { status: 200 });
    }
}