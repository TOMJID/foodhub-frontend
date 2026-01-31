import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const cookieStore = await cookies();

    // Get all cookies and format them for the backend
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await fetch(
      `${BACKEND_URL}/api/orders/status/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Update order status API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
