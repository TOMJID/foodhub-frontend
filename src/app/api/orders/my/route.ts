import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Get all cookies and format them for the backend
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await fetch(`${BACKEND_URL}/api/orders/my`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get my orders API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
