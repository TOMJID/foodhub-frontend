import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> },
) {
  try {
    const { providerId } = await params;

    const response = await fetch(
      `${BACKEND_URL}/api/meals/provider/${providerId}`,
      {
        method: "GET",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get meals by provider API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch meals" },
      { status: 500 },
    );
  }
}
