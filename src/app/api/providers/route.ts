import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/providers`, {
      method: "GET",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get providers API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch providers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { cookies } = await import("next/headers");
  try {
    const body = await request.json();
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await fetch(`${BACKEND_URL}/api/providers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });

    // Forward Set-Cookie header if present to handle session updates
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("Set-Cookie", setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error("Create provider API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create provider" },
      { status: 500 },
    );
  }
}
