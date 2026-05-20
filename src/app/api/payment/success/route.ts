import { NextResponse } from "next/server";

import { markSajuResultPaid } from "@/service/saju";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const id = searchParams.get("id");

  if (!paymentKey || !orderId || !amount || !id) {
    return NextResponse.json({ error: "Missing payment parameters" }, { status: 400 });
  }

  const updated = markSajuResultPaid(id);

  if (updated) {
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const origin = `${protocol}://${host}`;
    return NextResponse.redirect(`${origin}/result/${id}`);
  }

  return NextResponse.json({ error: "Transaction record not found" }, { status: 404 });
}
