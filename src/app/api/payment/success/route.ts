import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    // Toss Payments query parameters
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    // Our custom ID passed via successUrl
    const id = searchParams.get('id');

    if (!paymentKey || !orderId || !amount || !id) {
        return NextResponse.json({ error: "Missing payment parameters" }, { status: 400 });
    }

    // TODO: In production, verify the payment with Toss Payments API here using Secret Key.
    // Example: 
    // const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', { ... })

    // For this mock demo, we just assume success.
    const record = mockDb.get(id);

    if (record) {
        record.isPaid = true;
        mockDb.set(id, record);

        // Redirect back to the result page, which will now bypass the paywall
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const origin = `${protocol}://${host}`;
        return NextResponse.redirect(`${origin}/result/${id}`);
    } else {
        return NextResponse.json({ error: "Transaction record not found" }, { status: 404 });
    }
}
