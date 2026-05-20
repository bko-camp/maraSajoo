import { NextResponse } from "next/server";

import { createSajuAnalysis, getSajuResult } from "@/service/saju";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, gender, birthDate, birthTime, isTimeUnknown } = body;

    if (!name || !birthDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { id } = await createSajuAnalysis({
      name,
      gender,
      birthDate,
      birthTime,
      isTimeUnknown,
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const status = message.includes("GEMINI_API_KEY") ? 500 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const record = getSajuResult(id);
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}
