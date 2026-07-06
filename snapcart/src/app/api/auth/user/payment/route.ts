import connectDb from '@/lib/db';
import Order from '@/models/order.model';
import User from '@/models/user.models';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';


export const dynamic = 'force-dynamic';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecret || '', {
    apiVersion: '2025-05-28.basil' as any, 
});

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { userId, items, paymentMethod, totalAmount, address } = await req.json();
        
        if (!items || !userId || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json(
                { message: "please send all credentials" },
                { status: 400 }
            );
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 400 }
            );
        }

        const newOrder = await Order.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
            cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'SnapShipt Order Payment',
                        },
                        unit_amount: totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: { orderId: newOrder._id.toString() }
        });
        
        return NextResponse.json({ url: session.url }, { status: 200 });

    } catch (error: any) {
        // ক্যাচ ব্লকের মেসেজটি ইন্টারনাল সার্ভার এরর ট্র্যাক করার জন্য পরিবর্তন করা হলো
        return NextResponse.json(
            { message: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}