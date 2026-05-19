import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";  // ← এই line যোগ করো
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

        if (!activeAssignment) {
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