import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Create review API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 },
    );
  }
}
