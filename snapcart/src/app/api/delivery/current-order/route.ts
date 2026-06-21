import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()
        const deliveryBoyId = session?.user?.id

        const activeAssignment = await DeliveryAssignment.findOne({
            assignedTo: deliveryBoyId,
            status: "assigned"
        }).populate("order").lean()

        // assignment নেই বা order null (ভাঙা assignment) — দুটো ক্ষেত্রেই active false
        if (!activeAssignment || !activeAssignment.order) {
            if (activeAssignment) {
                // ভাঙা assignment auto-completed করো যাতে delivery boy আর "busy" না দেখায়
                await DeliveryAssignment.findByIdAndUpdate(activeAssignment._id, {
                    status: "completed"
                })
            }
            return NextResponse.json({ active: false }, { status: 200 })
        }

        return NextResponse.json(
            { active: true, assignment: activeAssignment },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `current order error ${error}` },
            { status: 500 }
        )
    }
}