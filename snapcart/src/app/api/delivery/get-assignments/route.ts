import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";

import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectDb()
        const session=await auth()
        const assignments=await DeliveryAssignment.find({
            brodcastedTo:session?.user?.id,
            status:"brodcasted"
        }).populate("order")
        return NextResponse.json(
            assignments,{status:200}
        )
    } catch(error){
        return NextResponse.json(
            {message:`get assignments error ${error}`},{status:200}
        )
    }
}
// import { auth } from "@/auth";
// import connectDb from "@/lib/db";
// import DeliveryAssignment from "@/models/deliveryAssignment.model";
// // ১. Order মডেলটি সরাসরি ইমপোর্ট করুন (এটিই আসল সমাধান)
// import Order from "@/models/order.model"; 
// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         await connectDb();
//         const session = await auth();

//         if (!session?.user?.id) {
//             return NextResponse.json([], { status: 200 });
//         }

//         // ২. Populate করার সময় স্পষ্টভাবে 'model: Order' বলে দিন
//         const assignments = await DeliveryAssignment.find({
//             broadcastedTo: { $in: [session.user.id] }, 
//             status: "broadcasted"
//         }).populate({
//             path: "order",
//             model: Order // মঙ্গুজকে রাস্তা দেখিয়ে দিন
//         });

//         // ৩. কনসোলে চেক করুন ডাটা আসছে কি না
//         console.log("Found assignments with order:", JSON.stringify(assignments, null, 2));

//         return NextResponse.json(assignments || [], { status: 200 });

//     } catch (error) {
//         console.error("Fetch Error:", error);
//         return NextResponse.json([], { status: 200 });
//     }
// }